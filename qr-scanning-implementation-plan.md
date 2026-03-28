# QR Scanning Implementation Plan

## Goal

Implement a production-ready QR scanning flow for GymDeck front-desk operations that supports:

- gym access validation
- class attendance validation
- manual fallback when camera scan fails
- clear exception handling for invalid, expired, used, or wrong-branch passes

This should turn `/check-ins` into the front-desk validation surface rather than leaving QR scanning as a placeholder.

## Current Repo State

The current check-ins page has a scan CTA, but it still triggers a toast placeholder.

Relevant files:

- [components/check-ins/checkInsPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/check-ins/checkInsPage.tsx)
- [components/check-ins/data.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/check-ins/data.ts)
- [components/classes/classDetailPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/classes/classDetailPage.tsx)
- [components/classes/data.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/classes/data.ts)
- [old-components/modals/bookingPassModal.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/modals/bookingPassModal.tsx)
- [old-components/modals/manageMembershipModal.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/modals/manageMembershipModal.tsx)

The repo already models the right validation outcomes:

- valid pass
- already used
- expired
- wrong branch
- invalid QR

The repo also already distinguishes two operational record types:

- `gym-access`
- `class-booking`

That distinction should drive backend validation and write behavior.

## Product Recommendation

Build QR scanning as a validation workflow, not just a camera feature.

The browser should do only two things:

1. access the camera and decode the QR string
2. send the decoded token to a server-side validator

The server should do all trust-sensitive work:

- resolve the pass
- verify branch and time window
- verify payment or entitlement state
- verify whether the pass was already consumed
- decide whether the scan should create a gym-access check-in, class attendance, or both

## Scanner Technology Recommendation

### Recommended

Use `html5-qrcode` in low-level mode with a custom UI inside a client-only modal.

Why:

- supports direct camera scanning in the browser
- supports custom UI instead of forcing a stock scanner interface
- supports stopping the camera cleanly
- supports camera selection and manual fallback patterns
- works well for a Next.js client component approach

### Not Recommended As Primary

Do not rely on the browser `BarcodeDetector` API as the main solution.

Reason:

- it is still marked as limited-availability
- support is not consistent enough for a front-desk workflow
- it still requires secure context

### Production Requirement

Camera-based scanning must run in a secure context:

- `localhost` is acceptable for local development
- production must be served over HTTPS

## QR Payload Recommendation

### Do Not Encode

Do not encode raw identifiers directly in the QR code, such as:

- `bookingId`
- `membershipId`
- member email
- plan ID

The old modal implementations currently use raw IDs for QR generation. That is acceptable for mock UI work but should not ship for production access control.

### Encode Instead

Encode a short opaque token or signed pass token.

Recommended shape:

```text
gymdeck:pass:<opaque-token>
```

or a signed payload:

```json
{
  "typ": "gymdeck-pass",
  "token": "opaque_or_signed_token"
}
```

### Token Requirements

The token should resolve server-side to a pass or booking record with enough information to validate:

- pass type
- member
- branch
- validity window
- usage policy
- revocation state
- related class occurrence if applicable

## Validation Model

Use one validation endpoint for both gym access and class attendance.

Example:

```http
POST /api/check-ins/validate
```

Request:

```json
{
  "token": "decoded-qr-token",
  "branchId": "current-front-desk-branch-id",
  "operatorId": "staff-user-id",
  "source": "camera"
}
```

Response:

```json
{
  "state": "valid_pass",
  "recordType": "gym-access",
  "member": {
    "id": "MBR-2041",
    "name": "Howard Otuya"
  },
  "branch": {
    "id": "vi-01",
    "name": "Victoria Island"
  },
  "reference": "BK-2041",
  "passLabel": "Premium floor access",
  "validityNote": "Access is paid, branch matches, and the pass has not been used yet.",
  "canConfirmEntry": true,
  "requiresOverride": false
}
```

## Validation Rules

### Gym Access

Validate:

- membership or single-visit pass exists
- pass is active
- payment or access entitlement is valid
- branch is allowed
- time window is valid
- pass is not revoked
- pass has not already been consumed for the same entry window

Possible outcomes:

- `valid_pass`
- `already_used`
- `expired`
- `wrong_branch`
- `invalid_qr`

Additional internal outcomes that can be mapped to UI states:

- `payment_hold`
- `revoked`
- `suspended_member`

### Class Booking

Validate:

- class booking exists
- booking is tied to the correct class occurrence
- branch matches
- booking was not canceled or refunded
- credit, pack, or payment is still valid
- scan is within allowed pre-start and post-start attendance windows
- attendance has not already been recorded

Possible outcomes:

- `valid_pass`
- `already_used`
- `expired`
- `wrong_branch`
- `invalid_qr`

Additional internal outcomes:

- `too_early`
- `too_late`
- `booking_canceled`
- `refund_completed`
- `occurrence_mismatch`

## Unified Front-Desk Write Behavior

A successful scan should not stop at validation. It should allow a confirm step that writes the operational outcome.

### Gym Access Confirm

Example:

```http
POST /api/check-ins/confirm
```

Effects:

- create access log
- mark pass as used if single-use
- update check-in queue state
- store operator and timestamp

### Class Attendance Confirm

Effects:

- mark the specific class occurrence attendee as attended
- update roster status
- update `checkedInAt` or equivalent attendance note
- optionally decrement or settle any reserved session credit if business rules require it at check-in time

### Combined Behavior

If a member has gym access and an ongoing booked class in the same valid window, define an explicit rule:

- either mark gym access only
- or mark gym access and the class automatically
- or prompt the operator to choose

Recommended first release:

- validate the scanned pass
- show any currently relevant class booking
- let operator confirm either `Gym access`, `Class attendance`, or both when both are valid

This avoids hidden business logic and keeps first release predictable.

## Front-End UX Plan

Implement a `ScanQrModal` inside the check-ins module.

Recommended layout:

- live camera preview
- branch badge or current front-desk scope
- scan status banner
- manual code input
- recent validations list
- result card with confirm CTA

### Required States

- requesting camera permission
- camera ready
- scan success
- scan error
- permission denied
- device not found
- manual input fallback

### Result Card

Show:

- member avatar or initials
- member name
- pass type or class name
- branch
- reference
- validity note
- state badge
- confirm entry CTA
- secondary actions such as retry, open member, open booking

### UX Safeguards

- debounce duplicate scans from the same frame stream
- lock the scanner briefly after a successful decode
- play different sounds for success vs failure
- make manual entry available without leaving the modal
- always provide a close and retry path

## Proposed Component Additions

Create under `components/check-ins/organisms`:

- `scanQrModal.tsx`
- `scanValidationResultCard.tsx`
- `recentValidationsPanel.tsx`
- `manualCodeEntry.tsx`

Add shared logic under `components/check-ins`:

- `scanner.ts` or `scanner-client.ts`
- `validation.ts`

## Proposed State Shape

Example client state:

```ts
type ScanStatus =
  | "idle"
  | "requesting-permission"
  | "ready"
  | "processing"
  | "success"
  | "error";

type ScanSource = "camera" | "manual";

type ScanResult = {
  token: string;
  source: ScanSource;
  state: "valid_pass" | "already_used" | "expired" | "wrong_branch" | "invalid_qr";
  recordType?: "gym-access" | "class-booking";
  memberName?: string;
  reference?: string;
  passLabel?: string;
  validityNote: string;
  canConfirmEntry: boolean;
};
```

## API Contract Recommendation

### Validate

```http
POST /api/check-ins/validate
```

Responsibilities:

- resolve QR token
- validate business rules
- return structured result for UI

### Confirm

```http
POST /api/check-ins/confirm
```

Responsibilities:

- persist access or attendance result
- mark pass usage
- return updated operational record

### Optional Override

```http
POST /api/check-ins/override
```

Responsibilities:

- allow authorized staff to admit despite warning conditions
- require operator note and role check

## Rollout Plan

### Phase 1: UI and Mock Validation

Build the full front-end flow against mock data already in the repo.

Deliverables:

- scan modal
- camera access
- manual fallback input
- validation states driven by mock records
- result card
- recent validations panel

Use the existing mock helper pattern in `components/check-ins/data.ts` to simulate validation.

### Phase 2: Server Validation

Replace mock validation with real API calls.

Deliverables:

- validation endpoint
- confirm endpoint
- token resolution
- branch-aware and type-aware validation logic

### Phase 3: Pass Generation Hardening

Replace raw ID QR payloads with opaque or signed tokens.

Deliverables:

- pass token generation
- token expiration or revocation rules
- updated member and booking pass generation flow

### Phase 4: Attendance and Access Persistence

Connect successful scans to operational records.

Deliverables:

- real access logs
- real class attendance updates
- operator attribution
- audit trail

### Phase 5: Overrides and Analytics

Deliverables:

- manual override flow
- reason capture
- scan success and failure reporting
- front-desk operational metrics

## Testing Plan

### Unit Tests

Cover:

- token parsing
- validation state mapping
- duplicate scan suppression
- branch mismatch rules
- gym access vs class booking branching

### Integration Tests

Cover:

- camera scanner success path
- manual entry success path
- invalid token path
- already-used path
- class booking confirmation path
- wrong-branch handling

### Manual QA

Verify on:

- desktop Chrome
- desktop Safari
- Android Chrome
- iPhone Safari

Verify:

- camera permissions
- secure-context behavior
- front and rear camera selection
- scan speed in low light
- retry flow
- manual fallback flow

## Security Notes

- never treat QR content as trusted on the client
- never expose raw booking or membership identifiers as the long-term production QR payload
- ensure confirm endpoints are authenticated and branch-scoped
- log operator identity for confirm and override actions
- rate-limit validate and confirm endpoints if this is exposed beyond internal staff tooling

## Success Criteria

This implementation is successful when:

- front desk can scan a member pass without leaving `/check-ins`
- both gym access and class attendance can be validated from the same flow
- invalid and exception states are explicit and actionable
- manual input is available when camera scanning fails
- the scanner updates real operational records rather than only showing UI feedback

## Research Notes

Primary references used for this plan:

- MDN `MediaDevices.getUserMedia()`: [developer.mozilla.org](https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia)
- MDN `BarcodeDetector`: [developer.mozilla.org](https://developer.mozilla.org/zh-CN/docs/Web/API/BarcodeDetector)
- Html5Qrcode docs: [scanapp.org/html5-qrcode-docs](https://scanapp.org/html5-qrcode-docs/docs/intro)
- Zenoti QR scanning setup: [help.zenoti.com](https://help.zenoti.com/en/integrations/set-up-qr-code-scanners.html)
- Zenoti self check-in flow: [help.zenoti.com](https://help.zenoti.com/en/fitness/fitness-kiosk/member-or-guest-self-check-in.html)
- Glofox visit logic and class linkage: [support.glofox.com](https://support.glofox.com/hc/en-us/articles/15354407264273-Understanding-the-Visits-Report)
