"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Modal } from "@/components/modals/modal";
import { Select } from "@/components/ui";
import {
  createQrScanner,
  defaultScannerConfig,
  getPreferredCamera,
  listScannerCameras,
  type QrScannerInstance,
  type ScannerCameraDevice,
} from "../scanner-client";
import { ManualCodeEntry } from "./manualCodeEntry";

type CameraState = "idle" | "requesting-permission" | "ready" | "paused" | "error";
type ScanPhase = "scanning" | "loading" | "success";

type ScanQrModalProps = {
  onClose: () => void;
};

function formatCameraErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/permission|notallowed/i.test(message)) {
    return "Camera access was denied.";
  }

  if (/notfound|no camera/i.test(message)) {
    return "No camera found.";
  }

  if (/notreadable|trackstart|device in use/i.test(message)) {
    return "Camera is already in use.";
  }

  return message || "Camera unavailable.";
}

async function teardownScanner(scanner: QrScannerInstance | null) {
  if (!scanner) {
    return;
  }

  try {
    await scanner.stop();
  } catch {
    // Ignore stop errors when the scanner is not actively running.
  }

  try {
    scanner.clear();
  } catch {
    // Ignore clear errors when the scanner never finished mounting.
  }
}

export function ScanQrModal({ onClose }: ScanQrModalProps) {
  const scannerRegionId = useId().replace(/:/g, "");
  const scannerRef = useRef<QrScannerInstance | null>(null);
  const cameraStateRef = useRef<CameraState>("idle");
  const scanPhaseRef = useRef<ScanPhase>("scanning");
  const decodeGuardRef = useRef<{ code: string; timestamp: number } | null>(null);
  const startRequestIdRef = useRef(0);
  const loadingTimerRef = useRef<number | null>(null);
  const [cameraDevices, setCameraDevices] = useState<ScannerCameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [scanPhase, setScanPhase] = useState<ScanPhase>("scanning");
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isSubmittingManualCode, setIsSubmittingManualCode] = useState(false);

  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  useEffect(() => {
    scanPhaseRef.current = scanPhase;
  }, [scanPhase]);

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const disposeScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    await teardownScanner(scanner);
  }, []);

  const handleMockScanSuccess = useCallback(
    (code: string) => {
      clearLoadingTimer();
      setLastScannedCode(code);
      setScanPhase("loading");

      loadingTimerRef.current = window.setTimeout(() => {
        setScanPhase("success");
      }, 900);
    },
    [clearLoadingTimer],
  );

  const initializeScanner = useCallback(
    async (preferredCameraId?: string) => {
      const requestId = ++startRequestIdRef.current;
      setCameraError(null);
      setCameraState("requesting-permission");
      await disposeScanner();

      try {
        const availableCameras = await listScannerCameras();
        if (startRequestIdRef.current !== requestId) {
          return;
        }

        if (availableCameras.length === 0) {
          throw new Error("No camera found.");
        }

        setCameraDevices(availableCameras);
        const preferredCamera = getPreferredCamera(availableCameras, preferredCameraId);

        if (!preferredCamera) {
          throw new Error("No camera found.");
        }

        setSelectedCameraId(preferredCamera.id);

        const nextScanner = await createQrScanner(scannerRegionId);
        if (startRequestIdRef.current !== requestId) {
          await teardownScanner(nextScanner);
          return;
        }

        scannerRef.current = nextScanner;

        await nextScanner.start(
          preferredCamera.id,
          defaultScannerConfig,
          (decodedText) => {
            if (scanPhaseRef.current !== "scanning") {
              return;
            }

            const now = Date.now();
            const lastDecode = decodeGuardRef.current;
            if (
              lastDecode &&
              lastDecode.code === decodedText &&
              now - lastDecode.timestamp < 1200
            ) {
              return;
            }

            decodeGuardRef.current = { code: decodedText, timestamp: now };
            handleMockScanSuccess(decodedText);
          },
          () => {
            // Scanner noise is expected while frames are being sampled.
          },
        );

        if (startRequestIdRef.current !== requestId) {
          await disposeScanner();
          return;
        }

        setCameraState("ready");
      } catch (error) {
        if (startRequestIdRef.current !== requestId) {
          return;
        }

        setCameraState("error");
        setCameraError(formatCameraErrorMessage(error));
      }
    },
    [disposeScanner, handleMockScanSuccess, scannerRegionId],
  );

  useEffect(() => {
    void initializeScanner();

    return () => {
      startRequestIdRef.current += 1;
      clearLoadingTimer();
      void disposeScanner();
    };
  }, [clearLoadingTimer, disposeScanner, initializeScanner]);

  const handleScanAnother = async () => {
    setManualCode("");
    setLastScannedCode(null);
    setScanPhase("scanning");
    decodeGuardRef.current = null;

    if (cameraState === "ready") {
      return;
    }

    await initializeScanner(selectedCameraId);
  };

  const handleManualValidation = async () => {
    const normalizedCode = manualCode.trim();
    if (!normalizedCode) {
      return;
    }

    clearLoadingTimer();
    setIsSubmittingManualCode(true);
    handleMockScanSuccess(normalizedCode);
    setIsSubmittingManualCode(false);
  };

  const showCameraOverlay = scanPhase !== "scanning" || cameraState !== "ready";

  return (
    <Modal
      title="Scan QR code"
      onClose={onClose}
      panelClassName="max-w-[680px] !p-5 md:!p-6"
      bodyClassName="mt-4 space-y-4"
    >
      <section className="rounded-[18px] bg-bg-surface">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {cameraDevices.length > 1 ? (
            <label className="block min-w-[200px]">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                Camera
              </span>
              <Select
                id="scan-qr-camera"
                options={cameraDevices.map((camera) => ({
                  value: camera.id,
                  label: camera.label || `Camera ${camera.id}`,
                }))}
                value={selectedCameraId}
                onChange={(value) => {
                  const nextCameraId = value as string;
                  setSelectedCameraId(nextCameraId);
                  void initializeScanner(nextCameraId);
                }}
              />
            </label>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-3">
          <div className="relative overflow-hidden rounded-[16px] border border-border-soft bg-bg-surface">
            <div
              id={scannerRegionId}
              className="min-h-[240px] [&_canvas]:hidden [&_video]:min-h-[240px] [&_video]:w-full [&_video]:object-cover"
            />

            {showCameraOverlay ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-surface px-5 text-center">
                {scanPhase === "loading" ? (
                  <>
                    <div className="size-10 animate-spin rounded-full border-2 border-border-soft border-t-text-primary" />
                    <p className="text-[16px] font-semibold text-text-primary">Checking pass...</p>
                  </>
                ) : null}

                {scanPhase === "success" ? (
                  <>
                    <p className="text-[20px] font-semibold text-text-primary">Scan successful</p>
                    {lastScannedCode ? (
                      <p className="text-[14px] text-text-secondary">{lastScannedCode}</p>
                    ) : null}
                    <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          void handleScanAnother();
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-brand-primary px-4 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
                      >
                        Scan another
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-bg-action-soft px-4 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-action-soft-hover"
                      >
                        Done
                      </button>
                    </div>
                  </>
                ) : null}

                {scanPhase === "scanning" && cameraState !== "ready" ? (
                  <>
                    <p className="text-[16px] font-semibold text-text-primary">
                      {cameraState === "requesting-permission"
                        ? "Starting camera..."
                        : "Camera unavailable"}
                    </p>
                    <p className="text-[14px] text-text-secondary">
                      {cameraError ?? "Point the camera at a QR code."}
                    </p>
                    {cameraState === "error" ? (
                      <button
                        type="button"
                        onClick={() => {
                          void initializeScanner(selectedCameraId);
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-brand-primary px-4 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
                      >
                        Retry camera
                      </button>
                    ) : null}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {scanPhase === "scanning" ? (
        <ManualCodeEntry
          code={manualCode}
          onCodeChange={setManualCode}
          onSubmit={() => {
            void handleManualValidation();
          }}
          isSubmitting={isSubmittingManualCode}
        />
      ) : null}
    </Modal>
  );
}
