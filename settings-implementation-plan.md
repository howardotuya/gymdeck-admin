# Settings Implementation Plan

This document captures the current codebase read, the proposed settings refactor, and the implementation sequence for reducing GymDeck settings to three focused surfaces:

- User profile
- Company profile
- Audit logs

The goal is to replace the current settings hub model with a direct settings workspace that matches the product scope we actually want to ship.

---

## Objective

Move from:

- a broad settings landing page with many secondary modules
- placeholder routes for several settings destinations
- no dedicated company settings model

to:

- one focused `/settings` workspace
- three clear tabs with direct content
- minimal form-first scaffolding that can later be wired to real auth and settings APIs

---

## Scope

The new settings area should support only:

1. User profile
   - personal details
   - contact details
   - address
   - password update

2. Company profile
   - business identity
   - public/support contact info
   - address
   - basic branding or profile controls

3. Audit logs
   - searchable internal audit trail
   - one-page list flow
   - event detail drill-in

Anything outside these three areas should be removed from the primary settings IA.

---

## Current Codebase Read

### Active settings implementation

The current settings route is a card-based hub, not a direct settings workspace.

Relevant files:

- [`app/settings/page.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/settings/page.tsx)
- [`components/settings/settingsPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/settingsPage.tsx)
- [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/data.ts)

Current behavior:

- `SettingsPage` reads a tab query param and renders a tab bar plus card grid.
- The tabs are currently:
  - `Main`
  - `Teams`
  - `Gym Setup`
- The cards point to broader modules such as:
  - branches
  - staff roles
  - notifications
  - gallery
  - reviews
  - amenities
  - support
  - activity log

This is broader than the settings surface we actually want.

### Placeholder routing

Several settings-linked destinations still resolve to generic placeholders.

Relevant files:

- [`app/[section]/page.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/[section]/page.tsx)
- [`components/placeholder/placeholderPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/placeholder/placeholderPage.tsx)
- [`components/app-shell/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/app-shell/data.ts)

Important notes:

- `/activity-log` is described in app shell metadata but does not have a real dedicated page implementation.
- `/gym-profile`, `/gallery`, `/amenities-rules`, `/reviews`, `/notifications`, and `/support` are still treated as top-level settings-adjacent destinations in navigation metadata.

### Older implementation that is closer to target

There is an older settings implementation that already used a more focused account pattern.

Relevant files:

- [`old-components/settings/settingsPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/settings/settingsPage.tsx)
- [`old-components/settings/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/settings/data.ts)
- [`old-components/settings/organisms/profileSettingsPanel.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/settings/organisms/profileSettingsPanel.tsx)
- [`old-components/settings/organisms/passwordSettingsPanel.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/settings/organisms/passwordSettingsPanel.tsx)

That older flow had:

- `Profile`
- `Password`
- `Notifications`

This means the refactor direction is simplification, not invention.

### Reusable UI patterns already in the repo

We do not need new primitives for this work.

Relevant files:

- [`components/ui/navTabs.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/navTabs.tsx)
- [`components/ui/formSectionCard.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/formSectionCard.tsx)
- [`components/ui/custom-table/organisms/customTable.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/custom-table/organisms/customTable.tsx)
- [`components/staff-roles/employeeFormPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/staff-roles/employeeFormPage.tsx)
- [`components/branches/branch-form-steps/branchProfileSetupStep.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/branches/branch-form-steps/branchProfileSetupStep.tsx)

Useful existing patterns:

- `NavTabs` for the 3 settings sections
- `FormSectionCard` for grouped settings forms
- `PhoneField` and existing input styling for contact forms
- `CustomTable` for audit log listing, search, sort, and pagination

### Missing domain model

I did not find an existing top-level company settings model in the current codebase.

Implication:

- user profile, company profile, and audit logs should be introduced as a dedicated settings data slice
- company profile should not be forced into branch data structures

---

## Standards And Product Alignment

### Settings IA

A focused split between personal settings and account or business settings is aligned with current dashboard patterns.

Reference:

- [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)

Relevant guidance:

- Stripe separates settings into `Personal`, `Account`, and `Product`.
- This supports keeping user profile distinct from company or account profile.

### Password and sensitive account changes

Password and identity changes should follow current security guidance.

References:

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST SP 800-63B](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b-4.pdf)

Key guidance to apply:

- require current-password re-authentication for password change
- treat email changes as sensitive changes, not casual inline edits
- allow long passwords
- do not silently truncate passwords
- avoid composition-rule-heavy password UX

Working product implication:

- password update should be a dedicated card or section inside user profile
- email change should be shown as identity-sensitive if we support it in the same screen

### Audit logs

Audit logs should be modeled as an audit trail, not as generic app activity noise.

References:

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [GitHub enterprise audit log](https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/security-and-compliance/audit-log-for-an-enterprise)

Key guidance to apply:

- keep audit trails separate from general security or operational logging
- capture actor, action, target, location/context, outcome, and timestamp
- support search and filtering
- do not expose secrets, passwords, tokens, or sensitive raw PII in the log payload

GitHub is a good benchmark for page shape:

- searchable event list
- actor and affected user
- resource or target
- action
- country or source context
- date and time
- optional auth method and IP

---

## Recommended Information Architecture

Reduce `/settings` to exactly three tabs:

1. `User profile`
2. `Company profile`
3. `Audit logs`

Recommended URL behavior:

- `/settings` -> default to `user-profile`
- `/settings?tab=company-profile`
- `/settings?tab=audit-logs`

Recommended behavior changes:

- do not keep `Main`, `Teams`, and `Gym Setup`
- do not render settings as a card index
- do not use settings as a launch point for unrelated product modules

### UI Direction

The settings workspace should feel like a real form surface, not a read-only summary page.

Working UI rules:

- render actual form controls for editable settings fields
- give each section a direct CTA such as `Save changes`, `Save address`, `Update password`, or `Export CSV`
- keep section titles short
- avoid large intro panels, stat tiles, and excess descriptions
- use real search and filter controls in audit logs, not placeholder chips or summary badges

---

## Target Screen Structure

### 1. User Profile

This should be a one-page settings flow with grouped sections.

Recommended sections:

#### Personal details

Fields:

- first name
- last name
- display or role label if needed
- email address
- phone number

Notes:

- if email is editable, it should be treated as a sensitive identity change
- if email remains read-only for MVP, show it clearly but separate it from lightweight fields

#### Address and contact

Fields:

- country
- state
- city
- postal code
- address line 1
- address line 2

Notes:

- reuse branch-form address patterns and existing `PhoneField`
- this section should not depend on branch scope

#### Password and security

Fields:

- current password
- new password
- confirm new password

Behavior:

- require current password before update
- include concise helper text for password expectations
- use standard password fields and browser autocomplete attributes

Optional MVP additions:

- session management summary
- last password updated
- active sessions count

### 2. Company Profile

This should be a one-page business settings flow, not a branch settings page.

Recommended sections:

#### Business identity

Fields:

- company name
- public display name
- company handle or slug if needed
- legal entity name
- tax or registration label if needed later

#### Public and support contact

Fields:

- support email
- support phone
- website
- company WhatsApp
- contact person or operations owner

#### Company address

Fields:

- country
- state
- city
- postal code
- address line 1
- address line 2

#### Logo asset

Fields or controls:

- logo upload or asset URL

Notes:

- keep this under business identity for MVP
- do not add a separate branding section
- do not mix branch-level copy, reviews, gallery, or publishing into company settings

### 3. Audit Logs

This should be a one-page searchable audit flow.

Recommended page shape:

#### Filters row

Controls:

- keyword search
- actor filter
- action or category filter
- branch filter if relevant
- date range
- outcome filter

#### Audit table

Recommended columns:

- timestamp
- actor
- action
- target
- branch
- outcome
- source

Optional columns:

- country
- auth method

#### Event detail drill-in

Open from row click or row action.

Detail payload should show:

- event id
- exact timestamp
- actor
- target
- action
- changed fields summary
- source context
- branch scope

#### Export-ready behavior

MVP:

- render export button state in UI
- wire to mock action or toast

Future:

- CSV export
- retention window
- stream or API integration

---

## Recommended Data Model

Introduce a dedicated settings data module under `components/settings`.

Suggested front-end state shape:

```ts
type SettingsTabId = "user-profile" | "company-profile" | "audit-logs";

type UserProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type CompanyProfileFormState = {
  companyName: string;
  displayName: string;
  legalName: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  whatsapp: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  logoUrl?: string;
};

type AuditLogEvent = {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail?: string;
  action: string;
  category: string;
  targetLabel: string;
  branchLabel?: string;
  outcome: "success" | "warning" | "failed";
  source: "web" | "api" | "system";
  country?: string;
  authMethod?: string;
  ipAddress?: string;
  changedFields?: string[];
  summary: string;
};
```

---

## File-Level Implementation Plan

### Files to replace or refactor

1. [`components/settings/settingsPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/settingsPage.tsx)
   - replace card-grid hub with direct tabbed workspace
   - render content panels instead of settings cards

2. [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/data.ts)
   - replace current card metadata with:
     - tabs
     - user profile defaults
     - company profile defaults
     - audit log mock data
     - helpers for tab parsing

3. [`components/app-shell/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/app-shell/data.ts)
   - reduce settings metadata to align with the new IA
   - decide how legacy settings-adjacent sections should be represented

### Files likely to add

Recommended new files:

- `components/settings/types.ts`
- `components/settings/userProfilePanel.tsx`
- `components/settings/companyProfilePanel.tsx`
- `components/settings/auditLogsPanel.tsx`
- `components/settings/auditLogDetailPanel.tsx` or inline detail component

Optional helper files:

- `components/settings/shared.tsx`

### Reusable imports we should lean on

- [`components/ui/navTabs.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/navTabs.tsx)
- [`components/ui/formSectionCard.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/formSectionCard.tsx)
- [`components/ui/phoneField.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/phoneField.tsx)
- [`components/ui/custom-table/organisms/customTable.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/custom-table/organisms/customTable.tsx)

### Existing patterns to copy

- address and country-state-city layout from [`components/branches/branch-form-steps/branchProfileSetupStep.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/branches/branch-form-steps/branchProfileSetupStep.tsx)
- form grouping and save flow from [`components/staff-roles/employeeFormPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/staff-roles/employeeFormPage.tsx)

---

## Navigation Cleanup

The current settings hub path list is too broad for the intended product shape.

Relevant file:

- [`components/app-shell/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/app-shell/data.ts)

Recommended changes:

1. Keep `Settings` in the sidebar as the single entry point.
2. Remove broad settings-hub coupling for:
   - `/gym-profile`
   - `/gallery`
   - `/amenities-rules`
   - `/reviews`
   - `/notifications`
   - `/support`
3. Decide whether `/activity-log` should:
   - redirect to `/settings?tab=audit-logs`, or
   - be removed as a separate top-level concept

Preferred outcome:

- `/settings` is the canonical entry point for all three settings surfaces

---

## Phased Execution

## Phase 1: Replace The Settings Hub Shell

### Goal

Turn `/settings` from a card grid into a direct tabbed settings workspace.

### Work

1. Replace the current settings tab model in [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/data.ts)
2. Update [`components/settings/settingsPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/settingsPage.tsx) to render:
   - user profile
   - company profile
   - audit logs
3. Keep query-param tabs for deep-linking
4. Use real form controls and section-level CTAs instead of preview cards or stat tiles
5. Keep the layout visually minimal and avoid excess descriptive copy

### Acceptance Criteria

- `/settings` opens a real settings workspace
- no card-grid landing page remains
- tabs are limited to the 3 intended surfaces
- editable tabs render as actual form fields
- audit logs render real filter controls and action buttons

---

## Phase 2: Build User Profile

### Goal

Ship a complete front-end user profile flow.

### Work

1. Add typed user and password form state
2. Build personal details section
3. Build address/contact section
4. Build password update section
5. Add local validation and save toasts

### Acceptance Criteria

- logged-in user can edit their personal and address details in one screen
- password update is visually separate and re-auth oriented

---

## Phase 3: Build Company Profile

### Goal

Ship a complete front-end company profile page.

### Work

1. Add dedicated company profile form state
2. Build business identity section
3. Build support and public contact section
4. Build company address section
5. Add lightweight branding controls

### Acceptance Criteria

- company information is editable in one page
- company settings are not mixed with branch management

---

## Phase 4: Build Audit Logs

### Goal

Ship a credible one-page audit log flow using mock data and the existing table system.

### Work

1. Add audit log mock records and types
2. Build filter/search controls
3. Build audit log table using `CustomTable`
4. Add row detail interaction
5. Add export action shell

### Acceptance Criteria

- users can scan and search audit events
- users can inspect event details
- audit data is structured around actor, action, target, and time

---

## Phase 5: Cleanup And Alignment

### Goal

Remove the old settings IA and align shell metadata.

### Work

1. Update settings-related metadata in [`components/app-shell/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/app-shell/data.ts)
2. Decide whether old settings-adjacent routes should remain visible elsewhere
3. Remove now-unused settings card concepts and icon mappings

### Acceptance Criteria

- the app shell matches the new settings scope
- there is no duplicate or conflicting settings entry model

---

## Acceptance Criteria For The Full Refactor

- `/settings` contains only `User profile`, `Company profile`, and `Audit logs`
- user profile supports personal details, address/contact, and password update
- company profile supports business identity, public/support contact, and address
- audit logs support search, filtering, list display, and detail drill-in
- the implementation reuses the app’s current UI primitives
- the settings IA no longer routes users through unrelated cards and placeholder modules

---

## Risks And Notes

1. There is no confirmed backend contract yet for user settings, company settings, or audit events.
   Front-end implementation should start with local typed mock state.

2. Email-change behavior may need a separate backend-aware flow later.
   For MVP, we should either:
   - keep email editable but clearly sensitive, or
   - keep email read-only until the backend flow exists

3. Audit logs need discipline around payload content.
   We should not model logs as raw diffs containing secrets or unrestricted PII.

4. Existing placeholder routes may still matter for later roadmap items.
   Removing them from settings IA does not necessarily mean deleting the routes immediately.

---

## Recommended Next Step

Implement Phase 1 first:

- rewrite [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/data.ts)
- rewrite [`components/settings/settingsPage.tsx`](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/settings/settingsPage.tsx)
- add typed settings panels for the 3 target tabs

That creates the right shell before we fill in the individual pages.
