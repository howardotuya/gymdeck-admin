import type { StatusTone } from "@/components/ui";

export type CheckInRecordType = "gym-access" | "class-booking";

export type CheckInHistoryEvent = {
  label: string;
  time: string;
  detail: string;
};

export type CheckInRecord = {
  id: string;
  member: string;
  initials: string;
  memberId: string;
  recordType: CheckInRecordType;
  typeLabel: string;
  branch: string;
  itemName: string;
  date: string;
  time: string;
  status: string;
  statusTone: StatusTone;
  qrState: string;
  qrTone: StatusTone;
  paymentStatus: string;
  paymentTone: StatusTone;
  code: string;
  operatorNote: string;
  memberEmail: string;
  memberPhone: string;
  accessPlan: string;
  history: CheckInHistoryEvent[];
};

export type ValidationRecord = {
  id: string;
  code: string;
  member: string;
  initials: string;
  passLabel: string;
  branch: string;
  reference: string;
  scannedAt: string;
  state: string;
  stateTone: StatusTone;
  validityNote: string;
  relatedBookingId?: string;
  canConfirmEntry: boolean;
};

export type ValidationSource = "camera" | "manual";

export const initialCheckInRecords: CheckInRecord[] = [
  {
    id: "BK-2041",
    member: "Howard Otuya",
    initials: "HO",
    memberId: "MBR-2041",
    recordType: "gym-access",
    typeLabel: "Gym Access",
    branch: "Victoria Island",
    itemName: "Premium floor access",
    date: "Mar 27, 2026",
    time: "6:15 AM",
    status: "Successful",
    statusTone: "success",
    qrState: "Ready",
    qrTone: "success",
    paymentStatus: "Paid",
    paymentTone: "success",
    code: "VI-HOWARD-615",
    operatorNote: "Usually checks in before the first coached lift session and exits through recovery by 8:30 AM.",
    memberEmail: "howard.otuya@gymdeck.africa",
    memberPhone: "+234 803 100 2401",
    accessPlan: "Monthly Premium",
    history: [
      {
        label: "Booking confirmed",
        time: "5:42 AM",
        detail: "Member confirmed via mobile app and QR pass was issued instantly.",
      },
      {
        label: "Payment settled",
        time: "5:43 AM",
        detail: "Auto-renew charge cleared before arrival window opened.",
      },
    ],
  },
  {
    id: "BK-2037",
    member: "Amaka Nnaji",
    initials: "AN",
    memberId: "MBR-1988",
    recordType: "class-booking",
    typeLabel: "Class Booking",
    branch: "Yaba Studio",
    itemName: "Power Pilates with Ada",
    date: "Mar 27, 2026",
    time: "7:00 AM",
    status: "Successful",
    statusTone: "success",
    qrState: "Ready",
    qrTone: "success",
    paymentStatus: "Pack applied",
    paymentTone: "brand",
    code: "YB-AMAKA-700",
    operatorNote: "Session pack holder. Front desk usually validates pack balance before class opens.",
    memberEmail: "amaka.nnaji@gymdeck.africa",
    memberPhone: "+234 809 441 1902",
    accessPlan: "6 Session Pack",
    history: [
      {
        label: "Class reserved",
        time: "6:11 AM",
        detail: "Booked from the member app and one pack credit was reserved.",
      },
      {
        label: "Reminder sent",
        time: "6:30 AM",
        detail: "Automated reminder was delivered with QR and studio arrival instructions.",
      },
    ],
  },
  {
    id: "BK-2032",
    member: "David Okoro",
    initials: "DO",
    memberId: "MBR-1774",
    recordType: "gym-access",
    typeLabel: "Gym Access",
    branch: "Lekki Phase 1",
    itemName: "Standard floor access",
    date: "Mar 27, 2026",
    time: "8:10 AM",
    status: "Failed",
    statusTone: "danger",
    qrState: "Hold",
    qrTone: "warning",
    paymentStatus: "Retry queued",
    paymentTone: "warning",
    code: "LK-DAVID-810",
    operatorNote: "Access stays on hold until the renewal retry clears or finance approves a manual override.",
    memberEmail: "david.okoro@gymdeck.africa",
    memberPhone: "+234 816 220 0804",
    accessPlan: "Monthly Standard",
    history: [
      {
        label: "Renewal failed",
        time: "7:48 AM",
        detail: "Issuer declined the first auto-renewal attempt for the access window.",
      },
      {
        label: "Queue flagged",
        time: "7:49 AM",
        detail: "Front desk was asked to verify payment before granting entry.",
      },
    ],
  },
  {
    id: "BK-2029",
    member: "Musa Ibrahim",
    initials: "MI",
    memberId: "GST-4408",
    recordType: "gym-access",
    typeLabel: "Gym Access",
    branch: "Ikeja Central",
    itemName: "Single visit",
    date: "Mar 27, 2026",
    time: "9:30 AM",
    status: "Successful",
    statusTone: "success",
    qrState: "Used",
    qrTone: "neutral",
    paymentStatus: "Paid",
    paymentTone: "success",
    code: "IK-MUSA-930",
    operatorNote: "Walk-in guest converted at the desk and used a printed confirmation slip.",
    memberEmail: "musa.ibrahim@gymdeck.africa",
    memberPhone: "+234 812 600 7781",
    accessPlan: "Single Visit",
    history: [
      {
        label: "POS paid",
        time: "9:18 AM",
        detail: "Onsite payment completed and guest profile was created automatically.",
      },
      {
        label: "Entry confirmed",
        time: "9:31 AM",
        detail: "Front desk validated the printed code and granted floor access.",
      },
    ],
  },
  {
    id: "BK-2021",
    member: "Tobi Akin",
    initials: "TA",
    memberId: "MBR-1660",
    recordType: "class-booking",
    typeLabel: "Class Booking",
    branch: "Victoria Island",
    itemName: "Recovery Stretch with Bisi",
    date: "Mar 27, 2026",
    time: "6:30 PM",
    status: "Failed",
    statusTone: "danger",
    qrState: "Revoked",
    qrTone: "danger",
    paymentStatus: "Refunded",
    paymentTone: "danger",
    code: "VI-TOBI-630",
    operatorNote: "Booking was cancelled after a support refund tied to a duplicate renewal issue.",
    memberEmail: "tobi.akin@gymdeck.africa",
    memberPhone: "+234 805 870 4413",
    accessPlan: "Monthly Premium",
    history: [
      {
        label: "Refund completed",
        time: "2:15 PM",
        detail: "Finance reversed the payment and the booking was closed automatically.",
      },
      {
        label: "Member notified",
        time: "2:18 PM",
        detail: "Cancellation notice was sent with support follow-up details.",
      },
    ],
  },
];

export const initialValidationRecords: ValidationRecord[] = [
  {
    id: "VAL-101",
    code: "VI-HOWARD-615",
    member: "Howard Otuya",
    initials: "HO",
    passLabel: "Premium floor access",
    branch: "Victoria Island",
    reference: "BK-2041",
    scannedAt: "6:12 AM",
    state: "Valid pass",
    stateTone: "success",
    validityNote: "Access is paid, branch matches, and the pass has not been used yet.",
    relatedBookingId: "BK-2041",
    canConfirmEntry: true,
  },
  {
    id: "VAL-102",
    code: "IK-MUSA-930",
    member: "Musa Ibrahim",
    initials: "MI",
    passLabel: "Single visit",
    branch: "Ikeja Central",
    reference: "BK-2029",
    scannedAt: "9:32 AM",
    state: "Already used",
    stateTone: "warning",
    validityNote: "This QR was already consumed for entry this morning.",
    relatedBookingId: "BK-2029",
    canConfirmEntry: false,
  },
  {
    id: "VAL-103",
    code: "LK-DAVID-810",
    member: "David Okoro",
    initials: "DO",
    passLabel: "Standard floor access",
    branch: "Lekki Phase 1",
    reference: "BK-2032",
    scannedAt: "8:08 AM",
    state: "Expired",
    stateTone: "danger",
    validityNote: "Payment retry is still pending, so the access window is blocked.",
    relatedBookingId: "BK-2032",
    canConfirmEntry: false,
  },
  {
    id: "VAL-104",
    code: "YB-AMAKA-700",
    member: "Amaka Nnaji",
    initials: "AN",
    passLabel: "Power Pilates with Ada",
    branch: "Lekki Phase 1",
    reference: "BK-2037",
    scannedAt: "6:58 AM",
    state: "Wrong branch",
    stateTone: "warning",
    validityNote: "The booking belongs to Yaba Studio and needs an operator override to admit here.",
    relatedBookingId: "BK-2037",
    canConfirmEntry: false,
  },
];

export function getCheckInOverview(
  records: CheckInRecord[],
  validations: ValidationRecord[],
) {
  const gymAccessCount = records.filter((record) => record.recordType === "gym-access").length;
  const classBookingCount = records.filter(
    (record) => record.recordType === "class-booking",
  ).length;
  const checkedInCount = records.filter((record) => record.status === "Checked in").length;
  const flaggedValidationCount = validations.filter(
    (validation) => validation.state !== "Valid pass",
  ).length;

  return [
    {
      label: "Active queue",
      value: records.length.toString(),
      detail: "Bookings and access requests currently visible to front desk operations.",
    },
    {
      label: "Gym access",
      value: gymAccessCount.toString(),
      detail: "Floor-entry passes scheduled across the selected operational window.",
    },
    {
      label: "Class bookings",
      value: classBookingCount.toString(),
      detail: "Instructor-led reservations still awaiting attendance validation.",
    },
    {
      label: "Exceptions",
      value: `${flaggedValidationCount + Math.max(records.length - checkedInCount - 2, 0)}`,
      detail: "Queue items that need payment review, branch correction, or manual follow-up.",
    },
  ];
}

export function findValidationByCode(records: ValidationRecord[], code: string) {
  const normalizedCode = code.trim().toLowerCase();
  const matchedRecord = records.find(
    (record) => record.code.trim().toLowerCase() === normalizedCode,
  );

  if (matchedRecord) {
    return matchedRecord;
  }

  return {
    id: `VAL-${normalizedCode || "invalid"}`,
    code: code.trim().toUpperCase() || "UNKNOWN",
    member: "Unknown visitor",
    initials: "??",
    passLabel: "No active pass",
    branch: "Unassigned",
    reference: "No booking match",
    scannedAt: "Just now",
    state: "Invalid QR",
    stateTone: "danger" as const,
    validityNote: "No active booking or access record matches this code.",
    canConfirmEntry: false,
  };
}

function formatScanTime(timestamp: Date) {
  return timestamp.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildValidationId(timestamp: Date) {
  return `VAL-${timestamp.getTime()}`;
}

function buildInitials(memberName: string) {
  return memberName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function buildValidPass(record: CheckInRecord, scannedAt: string): ValidationRecord {
  return {
    id: buildValidationId(new Date()),
    code: record.code,
    member: record.member,
    initials: buildInitials(record.member),
    passLabel: record.itemName,
    branch: record.branch,
    reference: record.id,
    scannedAt,
    state: "Valid pass",
    stateTone: "success",
    validityNote:
      record.recordType === "class-booking"
        ? "Booking is active and can be confirmed for attendance."
        : "Pass is active, branch matches, and entry can be confirmed.",
    relatedBookingId: record.id,
    canConfirmEntry: true,
  };
}

function buildUsedPass(record: CheckInRecord, scannedAt: string): ValidationRecord {
  return {
    id: buildValidationId(new Date()),
    code: record.code,
    member: record.member,
    initials: buildInitials(record.member),
    passLabel: record.itemName,
    branch: record.branch,
    reference: record.id,
    scannedAt,
    state: "Already used",
    stateTone: "warning",
    validityNote:
      record.recordType === "class-booking"
        ? "Attendance has already been confirmed for this booking."
        : "This pass has already been consumed for entry.",
    relatedBookingId: record.id,
    canConfirmEntry: false,
  };
}

function buildHoldPass(record: CheckInRecord, scannedAt: string): ValidationRecord {
  return {
    id: buildValidationId(new Date()),
    code: record.code,
    member: record.member,
    initials: buildInitials(record.member),
    passLabel: record.itemName,
    branch: record.branch,
    reference: record.id,
    scannedAt,
    state: "Expired",
    stateTone: "danger",
    validityNote:
      "Access is currently blocked and needs front desk review before entry can be granted.",
    relatedBookingId: record.id,
    canConfirmEntry: false,
  };
}

function buildRevokedPass(record: CheckInRecord, scannedAt: string): ValidationRecord {
  return {
    id: buildValidationId(new Date()),
    code: record.code,
    member: record.member,
    initials: buildInitials(record.member),
    passLabel: record.itemName,
    branch: record.branch,
    reference: record.id,
    scannedAt,
    state: "Invalid QR",
    stateTone: "danger",
    validityNote:
      "This pass is no longer active and must be reviewed by front desk staff.",
    relatedBookingId: record.id,
    canConfirmEntry: false,
  };
}

function buildWrongBranchPass(
  record: CheckInRecord,
  scannedAt: string,
  expectedBranch: string,
): ValidationRecord {
  return {
    id: buildValidationId(new Date()),
    code: record.code,
    member: record.member,
    initials: buildInitials(record.member),
    passLabel: record.itemName,
    branch: record.branch,
    reference: record.id,
    scannedAt,
    state: "Wrong branch",
    stateTone: "warning",
    validityNote: `This pass belongs to ${record.branch} and needs an operator override to admit at ${expectedBranch}.`,
    relatedBookingId: record.id,
    canConfirmEntry: false,
  };
}

function cloneValidationTemplate(record: ValidationRecord, scannedAt: string): ValidationRecord {
  return {
    ...record,
    id: buildValidationId(new Date()),
    scannedAt,
  };
}

export function resolveValidationAttempt(
  checkInRecords: CheckInRecord[],
  code: string,
  expectedBranch?: string | null,
  scannedAt = new Date(),
) {
  const normalizedCode = code.trim().toLowerCase();
  const scannedAtLabel = formatScanTime(scannedAt);
  const matchedCheckInRecord = checkInRecords.find(
    (record) => record.code.trim().toLowerCase() === normalizedCode,
  );

  if (matchedCheckInRecord?.qrState === "Used" || matchedCheckInRecord?.status === "Checked in") {
    return buildUsedPass(matchedCheckInRecord, scannedAtLabel);
  }

  if (matchedCheckInRecord?.qrState === "Hold") {
    return buildHoldPass(matchedCheckInRecord, scannedAtLabel);
  }

  if (matchedCheckInRecord?.qrState === "Revoked") {
    return buildRevokedPass(matchedCheckInRecord, scannedAtLabel);
  }

  if (
    matchedCheckInRecord &&
    expectedBranch &&
    matchedCheckInRecord.branch !== expectedBranch
  ) {
    return buildWrongBranchPass(matchedCheckInRecord, scannedAtLabel, expectedBranch);
  }

  const templateValidation = initialValidationRecords.find(
    (record) => record.code.trim().toLowerCase() === normalizedCode,
  );

  if (templateValidation && templateValidation.state !== "Valid pass") {
    return cloneValidationTemplate(templateValidation, scannedAtLabel);
  }

  if (matchedCheckInRecord) {
    return buildValidPass(matchedCheckInRecord, scannedAtLabel);
  }

  return {
    ...findValidationByCode([], code),
    id: buildValidationId(scannedAt),
    scannedAt: scannedAtLabel,
  };
}

export function confirmValidationEntry(
  checkInRecords: CheckInRecord[],
  validation: ValidationRecord,
  confirmedAt = new Date(),
) {
  const confirmationTime = formatScanTime(confirmedAt);

  return checkInRecords.map((record) => {
    if (record.id !== validation.relatedBookingId) {
      return record;
    }

    const confirmationLabel =
      record.recordType === "class-booking" ? "Attendance confirmed" : "Entry confirmed";
    const confirmationDetail =
      record.recordType === "class-booking"
        ? "Front desk confirmed this booking from the QR validation flow."
        : "Front desk confirmed access from the QR validation flow.";

    return {
      ...record,
      status: "Checked in",
      statusTone: "success" as const,
      qrState: "Used",
      qrTone: "neutral" as const,
      history: [
        {
          label: confirmationLabel,
          time: confirmationTime,
          detail: confirmationDetail,
        },
        ...record.history,
      ],
    };
  });
}

export function buildConfirmedValidationRecord(
  checkInRecords: CheckInRecord[],
  validation: ValidationRecord,
  confirmedAt = new Date(),
) {
  const matchedRecord = checkInRecords.find((record) => record.id === validation.relatedBookingId);
  const confirmedAtLabel = formatScanTime(confirmedAt);

  if (!matchedRecord) {
    return {
      ...validation,
      id: buildValidationId(confirmedAt),
      scannedAt: confirmedAtLabel,
      state: "Entry confirmed",
      stateTone: "success" as const,
      validityNote: "Entry was confirmed from the QR validation flow.",
      canConfirmEntry: false,
    };
  }

  return {
    ...validation,
    id: buildValidationId(confirmedAt),
    scannedAt: confirmedAtLabel,
    state:
      matchedRecord.recordType === "class-booking"
        ? "Attendance confirmed"
        : "Entry confirmed",
    stateTone: "success" as const,
    validityNote:
      matchedRecord.recordType === "class-booking"
        ? "Attendance was confirmed and the booking has been marked as used."
        : "Entry was confirmed and the pass has been marked as used.",
    canConfirmEntry: false,
  };
}

export function upsertRecentValidation(
  validations: ValidationRecord[],
  validation: ValidationRecord,
  limit = 6,
) {
  return [validation, ...validations.filter((item) => item.code !== validation.code)].slice(
    0,
    limit,
  );
}
