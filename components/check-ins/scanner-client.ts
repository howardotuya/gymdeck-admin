import type {
  CameraDevice,
  Html5Qrcode as Html5QrcodeInstance,
  Html5QrcodeCameraScanConfig,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";

type Html5QrcodeModule = typeof import("html5-qrcode");

let scannerModulePromise: Promise<Html5QrcodeModule> | null = null;

async function loadScannerModule() {
  if (!scannerModulePromise) {
    scannerModulePromise = import("html5-qrcode");
  }

  return scannerModulePromise;
}

export type ScannerCameraDevice = CameraDevice;
export type QrScannerInstance = Html5QrcodeInstance;
export type QrScannerConfig = Html5QrcodeCameraScanConfig;
export type QrScannerSuccessCallback = QrcodeSuccessCallback;
export type QrScannerErrorCallback = QrcodeErrorCallback;

export async function listScannerCameras() {
  const { Html5Qrcode } = await loadScannerModule();
  return Html5Qrcode.getCameras();
}

export async function createQrScanner(elementId: string) {
  const { Html5Qrcode, Html5QrcodeSupportedFormats } = await loadScannerModule();

  return new Html5Qrcode(elementId, {
    verbose: false,
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    useBarCodeDetectorIfSupported: false,
  });
}

export function getPreferredCamera(
  cameras: ScannerCameraDevice[],
  selectedCameraId?: string,
) {
  if (selectedCameraId) {
    const selectedCamera = cameras.find((camera) => camera.id === selectedCameraId);
    if (selectedCamera) {
      return selectedCamera;
    }
  }

  return (
    cameras.find((camera) => /(back|rear|environment)/i.test(camera.label)) ??
    cameras[0] ??
    null
  );
}

export const defaultScannerConfig: QrScannerConfig = {
  fps: 8,
  qrbox: { width: 240, height: 240 },
  aspectRatio: 1,
};
