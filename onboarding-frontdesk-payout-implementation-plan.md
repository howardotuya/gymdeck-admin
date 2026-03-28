# Auth, Check-Ins, And Payout Implementation Plan

This document captures the implementation plan for four related changes in the GymDeck admin app:

1. auth flow
2. removal of the `Add member` CTA from the members list
3. front-desk booking plus check-in and QR validation under a single `Check-ins` module
4. payout tracking under the existing finance surface

The goal is to tighten the product structure so that:

- auth becomes a real route family instead of a missing prerequisite
- members stays a roster and detail workspace
- check-ins becomes the front-desk operations hub
- payouts lives with finance instead of becoming a separate wallet abstraction

---

## Objective

Move from:

- no active auth route family in the current app
- a members page that implies creation from the roster header
- a placeholder bookings route
- no dedicated check-in or QR validation surface
- an existing transactions page that does not yet model outgoing payouts

to:

- a dedicated `/auth` flow built from the legacy auth implementation
- a members roster without a misleading create CTA
- a real `/check-ins` front-desk surface that covers bookings and validation
- a finance area that includes both transactions and payouts

---

## Scope

This plan covers:

1. `Auth flow`
   - login
   - register
   - check-email verification
   - auth layout and mock gating behavior

2. `Members cleanup`
   - remove the dead `Add member` button from the members list
   - keep members focused on search, filter, review, and status actions

3. `Check-ins`
   - booking list and detail actions
   - manual booking flow
   - check-in and QR validation surface
   - front-desk result states and operator actions

4. `Payouts`
   - outgoing settlement tracking
   - payout status visibility
   - beneficiary and reference detail
   - placement inside the current transactions area

This plan does not yet cover:

- payment gateway integration
- camera hardware integration for QR scanning
- real backend APIs
- production auth providers
- accounting exports beyond the current mocked UI level

---

## Current Codebase Read

### The current app has no real auth route family

Relevant files:

- [stores/useFakeAuth.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/stores/useFakeAuth.ts)

Current behavior:

- the app has a fake auth store only
- `isSignedIn` defaults to `true`
- there are no active `app/auth/*` routes in the current app

Implication:

- auth is currently bypassed, not implemented
- route-level auth needs to be added before the app can feel complete

### Legacy auth already exists and should be reused

Relevant legacy route files:

- [old-app/auth/layout.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-app/auth/layout.tsx)
- [old-app/auth/login/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-app/auth/login/page.tsx)
- [old-app/auth/register/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-app/auth/register/page.tsx)
- [old-app/auth/check-email/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-app/auth/check-email/page.tsx)

Relevant legacy UI files:

- [old-components/auth/loginPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/loginPage.tsx)
- [old-components/auth/registerPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/registerPage.tsx)
- [old-components/auth/checkEmailPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/checkEmailPage.tsx)
- [old-components/auth/index.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/index.ts)

Current behavior:

- the legacy app already has a complete auth shape
- it includes:
  - login
  - register
  - check-email verification
  - dedicated auth layout
- the visual and interaction patterns are already compatible with the broader brand language

Implication:

- we should adapt the legacy auth flow instead of inventing a new one
- the auth work is mostly migration and cleanup, not product discovery

### Members currently mixes roster behavior with intake intent

Relevant files:

- [app/members/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/members/page.tsx)
- [components/members/membersPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/members/membersPage.tsx)
- [components/members/organisms/memberListTable.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/members/organisms/memberListTable.tsx)
- [components/members/data.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/members/data.ts)

Current behavior:

- members is a roster-first page
- row actions are detail and deactivation oriented
- the header still contains an `Add member` button
- the `Add member` CTA has no navigation or behavior attached

Implication:

- member creation should not continue to be implied from the roster
- members should remain a directory and profile surface

### Bookings exists only as a placeholder, but we want the module to be called Check-ins

Relevant files:

- [app/bookings/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/bookings/page.tsx)
- [components/placeholder/placeholderPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/placeholder/placeholderPage.tsx)
- [components/dashboard/dashboardPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/dashboard/dashboardPage.tsx)
- [agent.md](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/agent.md)

Current behavior:

- `/bookings` renders a staged placeholder page
- the dashboard links to bookings as if it is a real module
- the product notes define both booking operations and check-in or QR validation as major front-desk workflows

Implication:

- the unfinished operational module should be renamed and implemented as `Check-ins`
- booking management should become part of the check-ins module rather than a separate top-level concept

### Payments already exists, but payouts does not

Relevant files:

- [app/transactions/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/transactions/page.tsx)
- [app/payments/page.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/app/payments/page.tsx)
- [components/payments/paymentsPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/payments/paymentsPage.tsx)
- [components/payments/data.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/payments/data.ts)

Current behavior:

- the app already has a transactions surface
- `/payments` redirects to `/transactions`
- current finance data models incoming transactions only
- there is no payout model or payout tab

Implication:

- payout should extend the finance module
- a separate `Wallet` area would add new IA complexity without product benefit

### Useful existing patterns already in the repo

Relevant files:

- [components/ui/navTabs.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/navTabs.tsx)
- [components/ui/formSectionCard.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/formSectionCard.tsx)
- [components/ui/custom-table/organisms/customTable.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/ui/custom-table/organisms/customTable.tsx)
- [components/staff-roles/data.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/staff-roles/data.ts)
- [components/logo/logo.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/logo/logo.tsx)

Useful patterns:

- `NavTabs` for check-ins and finance tabs
- `FormSectionCard` for auth and payout detail sections when needed
- `CustomTable` for bookings, validations, and payouts
- existing staff permission language for bookings and front-desk actions
- shared brand assets already used by legacy auth

---

## Recommended Information Architecture

### 1. Auth

Add a dedicated auth route family:

- `/auth/login`
- `/auth/register`
- `/auth/check-email`

Recommended structure:

- `app/auth/layout.tsx`
- `app/auth/login/page.tsx`
- `app/auth/register/page.tsx`
- `app/auth/check-email/page.tsx`

Recommended rule:

- adapt the legacy flow instead of redesigning auth from scratch
- keep provider buttons and OTP verification as mocked UI unless integration is explicitly in scope

### 2. Members

Keep:

- search
- filters
- list
- view details
- deactivate or reactivate actions

Remove:

- `Add member` CTA from the members roster header

Recommended rule:

- members is not the create surface
- auth is user access
- members is member management

### 3. Check-ins

Use `/check-ins` as the front-desk operations hub.

Recommended tab structure:

1. `All`
2. `Gym Access`
3. `Class Bookings`
4. `QR Validation`

Recommended rule:

- booking management and validation should live in the same operational module
- `Check-ins` is the top-level name, but booking records remain a core part of the module

Recommended transition behavior:

- during rollout, `/bookings` can redirect to `/check-ins`

### 4. Finance and Payouts

Keep the current route family centered on transactions.

Recommended finance tabs:

1. `Transactions`
2. `Payouts`

Recommended rule:

- do not introduce `Wallet` as a separate module label
- use `Payouts` as the explicit operational and finance term

---

## Target Screen Structure

### Auth Flow

Recommended screens:

1. `Login`
   - email input
   - continue CTA
   - phone, Google, and Facebook placeholders
   - link to register

2. `Register`
   - email input
   - continue CTA
   - provider placeholders
   - link to login

3. `Check Email`
   - six-digit OTP inputs
   - resend action
   - back to login

Recommended layout behavior:

- preserve the dedicated auth layout from the legacy app
- reuse the background image and centered auth card pattern
- keep auth outside the main app shell

Recommended implementation direction:

- migrate the legacy auth pages into a new `components/auth` area
- adapt imports from `old-components` to the current component structure
- use `useFakeAuth` for temporary route gating until real auth exists

### Members

Recommended page behavior:

- keep KPI cards
- keep roster and filters
- keep member detail modal or evolve to a page later
- remove intake cues from the header

### Check-ins

Recommended top controls:

- tabs for check-in scope
- date selector
- status filter
- branch filter
- member search
- `Manual booking` CTA

Recommended table columns:

- booking ID
- member
- type
- branch
- class or access item
- date
- time
- status
- QR or check-in state
- actions

Recommended row actions:

- view booking
- mark as used
- cancel
- resend confirmation

Recommended side panel or detail view:

- member summary
- access or class summary
- payment status
- operator notes
- booking history

### QR Validation

Recommended primary layout:

- scan area
- manual code input
- recent validations panel

Recommended validation states:

- valid pass
- already used
- expired
- wrong branch
- invalid QR

Recommended result card:

- member name
- member avatar or initials
- pass or plan
- branch
- booking or class reference
- validity note
- confirm entry CTA

Recommended secondary actions:

- open member
- open booking
- retry validation
- escalate to manual override

### Payouts

Recommended top controls:

- date range
- payout status filter
- beneficiary filter
- export CTA

Recommended KPI row:

- total payouts
- pending payouts
- completed payouts
- failed payouts

Recommended table columns:

- payout ID
- beneficiary
- source period
- gross amount
- fee
- net amount
- status
- initiated date
- settled date
- actions

Recommended payout detail:

- payout reference
- settlement provider
- bank or beneficiary info
- source transactions summary
- failure reason where relevant
- operator notes

---

## Phased Implementation Plan

### Phase 1: Members Cleanup

### Goal

Remove the misleading intake affordance from members before new workflows are added.

### Deliverables

- remove the `Add member` button from the members roster
- review empty-state and supporting copy for consistency

### Work

1. Update [components/members/organisms/memberListTable.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/members/organisms/memberListTable.tsx)
   - remove `headerAction`
   - keep the roster focused on directory operations

2. Review members page copy
   - ensure no text implies that member creation still happens here

### Acceptance Criteria

- members page has no dead create CTA
- members remains a clean directory and status management surface

---

### Phase 2: Auth Foundations From Legacy Flow

### Goal

Bring the legacy auth implementation into the current app structure.

### Deliverables

- new `app/auth` route family
- new `components/auth` area
- shared auth layout
- temporary gating logic using the existing fake auth store

### Work

1. Create routes:
   - `app/auth/layout.tsx`
   - `app/auth/login/page.tsx`
   - `app/auth/register/page.tsx`
   - `app/auth/check-email/page.tsx`

2. Adapt legacy auth UI from:
   - [old-components/auth/loginPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/loginPage.tsx)
   - [old-components/auth/registerPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/registerPage.tsx)
   - [old-components/auth/checkEmailPage.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-components/auth/checkEmailPage.tsx)

3. Adapt legacy auth layout from:
   - [old-app/auth/layout.tsx](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/old-app/auth/layout.tsx)

4. Connect temporary auth gating through:
   - [stores/useFakeAuth.ts](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/stores/useFakeAuth.ts)

### Acceptance Criteria

- auth routes exist in the current app
- auth pages render outside the main admin shell
- the app has a realistic mocked auth entry point

---

### Phase 3: Auth UI Cleanup And Integration

### Goal

Make the migrated auth flow feel native to the current app instead of like a pasted legacy artifact.

### Deliverables

- cleaned imports
- current component aliases
- route-consistent links
- sign-in and sign-out transitions through fake auth state

### Work

1. Move or recreate exports under:
   - `components/auth/index.ts`

2. Update internal auth links:
   - login to register
   - register to login
   - check-email back to login

3. Decide current mock flow behavior:
   - login and register proceed to check-email or dashboard
   - logout returns to login

4. Keep provider actions clearly mocked until real auth integration exists

### Acceptance Criteria

- auth flow looks intentional in the current app
- auth links and transitions are internally consistent
- fake auth state supports demoing the flow end to end

---

### Phase 4: Check-ins Route And Data Foundations

### Goal

Create the route and data foundations for the renamed front-desk module.

### Deliverables

- `/check-ins` route shell
- optional `/bookings` redirect to `/check-ins`
- mock data structures for booking records and validation records

### Work

1. Add route:
   - `app/check-ins/page.tsx`

2. Decide transition strategy for:
   - `app/bookings/page.tsx`

3. Add mock data modules for:
   - booking records
   - validation records
   - filters and summary cards

4. Update any primary app entry points that still point at bookings

### Acceptance Criteria

- target route exists
- route naming reflects `Check-ins`
- data model can support both booking operations and QR validation

---

### Phase 5: Check-ins Operations Surface

### Goal

Replace the placeholder booking concept with a real front-desk check-ins module.

### Deliverables

- check-ins page with tabs
- booking table
- manual booking CTA
- booking detail view or side panel

### Work

1. Create components under a new area such as:
   - `components/check-ins`

2. Add tabs:
   - all
   - gym access
   - class bookings
   - QR validation

3. Build table and row actions using:
   - `CustomTable`

4. Add booking detail behavior:
   - panel, drawer, or dedicated detail view depending on fit

### Acceptance Criteria

- `/check-ins` is no longer a placeholder concept
- front desk staff can review and operate on bookings from one page
- navigation and dashboard entry points resolve to a real workflow

---

### Phase 6: QR Validation

### Goal

Add the fast validation workflow for front-desk entry.

### Deliverables

- QR validation tab or panel inside check-ins
- manual code entry
- mocked scanner UI state
- validation result card
- recent validations list

### Work

1. Build validation data model
   - QR code
   - reference type
   - branch
   - validity state
   - last used state

2. Add validation states and UI treatments
   - valid
   - already used
   - expired
   - wrong branch
   - invalid

3. Add operator actions
   - confirm entry
   - open member
   - open booking
   - escalate override

### Acceptance Criteria

- validation can be demonstrated end to end with mocked data
- result states are operationally clear
- the UI is optimized for speed and legibility

---

### Phase 7: Payouts Inside Finance

### Goal

Extend the current transactions area to cover outgoing payouts.

### Deliverables

- finance tab model with transactions and payouts
- payout KPI row
- payout table
- payout detail view

### Work

1. Extend [components/payments](/Users/howard/Desktop/Projects/gymdeck/gymdeck-admin/components/payments)
   - add payout types and mock data
   - add finance tabs

2. Keep routing centered on:
   - `/transactions`

3. Preserve current behavior:
   - `/payments` can continue to redirect to `/transactions`

4. Add payout-specific detail structures:
   - beneficiary
   - source period
   - settlement reference
   - failure reason
   - net amount

### Acceptance Criteria

- finance now covers both inbound and outbound money flows
- payout does not require a new top-level navigation item
- the naming is explicit and operationally correct

---

## Recommended Delivery Sequence

Implement in this order:

1. remove `Add member` CTA
2. migrate the legacy auth flow into the current app
3. wire temporary auth gating through `useFakeAuth`
4. create the `Check-ins` route and data foundations
5. build the check-ins operations surface
6. add QR validation inside check-ins
7. extend transactions into transactions plus payouts

Reasoning:

- removing the dead CTA reduces confusion immediately
- auth already has strong legacy material and should be harvested early
- check-ins and validation are tightly coupled and should be designed together
- payouts builds cleanly on the already existing transactions surface

---

## Open Product Decisions

These should be resolved before implementation goes too far:

1. Should login and register both lead into the same check-email step?
2. Should social and phone auth remain visible as placeholders in the first version?
3. Should `/bookings` redirect permanently to `/check-ins`, or should it disappear entirely?
4. Should check-ins support both gym floor access and class attendance in the first version?
5. Should manual booking be available for inactive members, or require reactivation first?
6. Should payouts represent branch-level settlements, partner settlements, coach settlements, or all three?

---

## Summary

The cleanest product structure is:

- `Auth` for login, register, and check-email
- `Members` for directory and profile management
- `Check-ins` for front-desk booking and validation operations
- `QR Validation` inside check-ins for rapid entry checks
- `Payouts` inside finance, not as a standalone wallet module

This preserves the current admin shell, reuses the legacy auth implementation, fills the clearest workflow gaps, and avoids adding overlapping modules.
