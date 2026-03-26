# Branch Content Implementation Plan

This plan translates [`branch-content-structure.md`](/Users/howard/Desktop/Projects/gympass-fe/branch-content-structure.md) into an execution sequence for the current GymDeck repo.

The focus is to move from:

- operational-only branch setup
- mocked public branch content

to:

- one branch model powering admin and member-facing surfaces
- a lightweight setup wizard plus a richer post-creation branch workspace

---

## Implementation Principles

1. Do not break the current branch creation wizard.
2. Add public-content capabilities incrementally after branch creation.
3. Replace mocked user-facing content only after branch selectors exist.
4. Prefer typed, structured fields over large freeform blobs.
5. Keep branch operational data and branch public content in the same domain module, but not in the same screen.

---

## Current Starting Point

Relevant files in the current codebase:

- [`components/branches/types.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/types.ts)
- [`components/branches/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/data.ts)
- [`components/branches/branchFormPage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branchFormPage.tsx)
- [`components/branches/branchDetailPage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branchDetailPage.tsx)
- [`app/branches/[branchId]/page.tsx`](/Users/howard/Desktop/Projects/gympass-fe/app/branches/[branchId]/page.tsx)
- [`app/branches/[branchId]/edit/page.tsx`](/Users/howard/Desktop/Projects/gympass-fe/app/branches/[branchId]/edit/page.tsx)
- [`old-components/home/homePage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/homePage.tsx)
- [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts)
- [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/settings/data.ts)

---

## Phase 1: Establish The New Branch Content Model

### Goal

Introduce the new branch shape in types and mock data without changing the current branch wizard UX.

### Deliverables

- new branch public content types
- new branch content mock data
- mapping helpers / selectors
- backward-compatible branch detail typing

### Work

1. Extend [`components/branches/types.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/types.ts)
   Add nested types for:
   - `BranchIdentity`
   - `BranchOperations`
   - `BranchPublicProfile`
   - `BranchGallery`
   - `BranchSocialLinks`
   - `BranchCommerce`
   - `BranchProgramming`
   - `BranchReputation`
   - `BranchPublishing`

2. Refactor `BranchDetail`
   Keep existing fields temporarily for compatibility, but add the new grouped modules.

3. Extend [`components/branches/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/data.ts)
   Add mock seed data for:
   - overview copy
   - amenities
   - rules
   - gallery media
   - social links
   - review summary
   - publishing completeness

4. Add selectors in [`components/branches/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/data.ts)
   Examples:
   - `getBranchPublicProfile`
   - `getBranchGallery`
   - `getBranchReviewsSummary`
   - `getBranchPublishingState`
   - `getBranchPublicListingViewModel`

### Acceptance Criteria

- existing branch routes still render
- existing branch wizard still works
- branch data now contains both operational and public content modules

### Notes

This phase is mostly data modeling and should be low-risk.

---

## Phase 2: Create A Branch Workspace After Creation

### Goal

Keep the setup wizard simple, then add a post-creation branch workspace for richer content management.

### Deliverables

- branch-level tab navigation
- branch workspace layout
- overview tab with operational + publishing summary

### Work

1. Add branch workspace navigation
   Create a new branch-level tab pattern in a new component, likely under:
   - `components/branches/branchWorkspacePage.tsx`
   - `components/branches/branchWorkspaceTabs.tsx`

2. Expand route structure
   Add routes such as:
   - `app/branches/[branchId]/profile/page.tsx`
   - `app/branches/[branchId]/gallery/page.tsx`
   - `app/branches/[branchId]/reviews/page.tsx`
   - `app/branches/[branchId]/socials/page.tsx`
   - `app/branches/[branchId]/pricing/page.tsx`
   - `app/branches/[branchId]/schedule/page.tsx`
   - `app/branches/[branchId]/publishing/page.tsx`

3. Keep [`app/branches/[branchId]/page.tsx`](/Users/howard/Desktop/Projects/gympass-fe/app/branches/[branchId]/page.tsx) as the default overview entry point.

4. Update [`components/branches/branchDetailPage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branchDetailPage.tsx)
   Turn it into the branch workspace overview screen rather than only an operational profile screen.

### Acceptance Criteria

- every branch has a stable workspace after creation
- users can move between operational and public-content tabs without reopening the wizard
- overview page shows publishing health, not just internal metrics

### Dependency

Requires Phase 1 types/selectors to exist first.

---

## Phase 3: Build The Public Profile Editor

### Goal

Give admins a dedicated place to manage overview content, amenities, rules, and branch-facing identity.

### Deliverables

- public profile edit page
- structured amenities and rules editor
- overview copy fields

### Work

1. Create a new editor page/component, likely:
   - `components/branches/branchPublicProfilePage.tsx`

2. Add fields for:
   - headline
   - short summary
   - long overview
   - amenities
   - rules / etiquette
   - audience tags / vibe tags

3. Reuse existing UI patterns where possible:
   - [`components/ui/formSectionCard.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/ui/formSectionCard.tsx)
   - [`components/ui/panel.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/ui/panel.tsx)

4. Define structured enums/constants for amenities and tags in a new branch constants file.

### Acceptance Criteria

- branch overview content no longer depends on [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts)
- amenities and rules are structured and editable per branch

---

## Phase 4: Build Gallery Management

### Goal

Move gallery ownership into the branch workspace.

### Deliverables

- branch gallery manager
- hero / featured media selection
- ordered media list

### Work

1. Create:
   - `components/branches/branchGalleryPage.tsx`

2. Reuse or adapt image upload patterns from:
   - [`components/ui/imageUploadField.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/ui/imageUploadField.tsx)

3. Define media metadata:
   - file URL
   - alt text
   - category
   - sort order
   - featured flag
   - hero flag

4. Replace the static gallery assumptions in:
   - [`old-components/home/homePage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/homePage.tsx)
   - [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts)

### Acceptance Criteria

- a branch can manage its own featured gallery
- the public hero mosaic can be driven by branch media selectors

### Dependency

Requires Phase 1 branch gallery model.

---

## Phase 5: Build Social Links Management

### Goal

Add validated branch-level outbound links for trust, discovery, and conversion.

### Deliverables

- social links editor
- URL validation
- optional link previews/icons

### Work

1. Create:
   - `components/branches/branchSocialLinksPage.tsx`

2. Add fields for:
   - Instagram
   - TikTok
   - Facebook
   - YouTube
   - Website
   - WhatsApp

3. Validate:
   - URL format
   - duplicate platform entry
   - platform/domain consistency where practical

4. Surface these links in the future public branch page and share surfaces.

### Acceptance Criteria

- each branch can own its public social footprint
- invalid links are blocked before save

---

## Phase 6: Build Reviews Summary And Moderation State

### Goal

Treat reviews as a managed branch module rather than static display text.

### Deliverables

- branch reviews page
- review summary cards
- moderation state
- featured review support

### Work

1. Create:
   - `components/branches/branchReviewsPage.tsx`

2. Define review model support in types/data:
   - review source
   - rating
   - author
   - postedAt
   - status
   - featured
   - flagged reason
   - reply status

3. Support summary and moderation states first.
   Do not block this phase on full external ingestion.

4. Add unresolved review counts to:
   - branch workspace overview
   - publishing checks

### Acceptance Criteria

- branches show a real review summary from branch-owned data
- admin can distinguish visible, flagged, and featured reviews

---

## Phase 7: Upgrade Pricing And Schedule From “Available” To “Publicly Renderable”

### Goal

Make plans and classes public-ready, not only operational selections.

### Deliverables

- branch pricing page with featured plan support
- branch schedule page with renderable timetable data
- public selectors for pricing and classes tabs

### Work

1. Extend current plan assignments in [`components/branches/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/data.ts)
   Add:
   - visibility flag
   - featured flag
   - display order
   - branch-specific description override
   - branch-specific price override if needed

2. Extend class assignments similarly
   Add:
   - category
   - public label
   - trainer display behavior
   - schedule source

3. Introduce scheduled-session mock data for the public schedule surface.

4. Build selectors to feed the current public tabs.

### Acceptance Criteria

- pricing tab can be generated from branch data
- schedule tab can be generated from branch data
- no hard dependency remains on `DESKTOP_PLANS`, `MOBILE_PLANS`, or static class session arrays in the old home mock

---

## Phase 8: Replace Mocked Public Branch Content With Branch Selectors

### Goal

Switch the consumer-facing branch experience to branch-backed data.

### Deliverables

- branch-to-public-page mapping layer
- removal or deprecation of old hardcoded branch listing data

### Work

1. Add an adapter or selector layer for the old public page:
   - `components/branches/publicBranchSelectors.ts`

2. Replace direct imports from [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts) in:
   - [`old-components/home/homePage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/homePage.tsx)

3. Feed:
   - gallery
   - overview
   - schedule
   - pricing
   - reviews

from a selected branch object instead.

4. If needed, add a branch param / slug route for the public page before retiring the old global mock route.

### Acceptance Criteria

- one branch object can fully power the public listing
- hardcoded gym content is no longer the source of truth

### Dependency

Requires Phases 1 through 7.

---

## Phase 9: Add Publishing Checks And Completeness Scoring

### Goal

Prevent low-quality or incomplete branch profiles from going public.

### Deliverables

- completeness score
- publishing checklist
- visibility toggle

### Work

1. Define publish checks in branch selectors/data:
   - address exists
   - hours complete
   - at least one visible plan
   - overview copy present
   - amenities present
   - hero image set
   - minimum gallery count
   - social links valid

2. Create:
   - `components/branches/branchPublishingPage.tsx`

3. Surface publishing state in:
   - branch overview
   - branch list table
   - branch detail header

4. Block `isDiscoverable` from turning on until mandatory checks pass.

### Acceptance Criteria

- branch pages have a measurable readiness state
- incomplete branches cannot be marked discoverable accidentally

---

## Phase 10: Clean-Up And Consolidation

### Goal

Remove duplicated models and reduce drift.

### Deliverables

- deprecated mock content removed
- branch selectors become the default data access path
- stable internal API shape for future backend integration

### Work

1. Remove no-longer-needed constants from:
   - [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts)

2. Consolidate branch-related exports through:
   - [`components/branches/index.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/index.ts)

3. Split large branch data and type files if they become unwieldy:
   - `components/branches/types.ts`
   - `components/branches/data.ts`

4. Add tests once branch selectors and publishing checks stabilize.

### Acceptance Criteria

- there is one clear branch source of truth
- public and admin surfaces both depend on the same branch domain model

---

## Recommended Execution Order

Use this sequence:

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7
8. Phase 8
9. Phase 9
10. Phase 10

This keeps the work progressive and avoids rebuilding the public page before the branch model is ready.

---

## Suggested PR Breakdown

### PR 1: Branch domain model foundation

- type extensions
- mock data extensions
- selectors

### PR 2: Branch workspace shell

- branch tabs
- overview page refactor
- route additions

### PR 3: Public profile + social links

- public profile editor
- social links editor

### PR 4: Gallery

- media model
- gallery management
- featured media selection

### PR 5: Reviews

- review summary model
- reviews workspace page
- moderation state

### PR 6: Pricing + schedule alignment

- plan assignment upgrades
- schedule/session support
- public selectors

### PR 7: Public page migration

- old public mocks replaced with branch-backed selectors

### PR 8: Publishing controls + cleanup

- completeness score
- publish checklist
- remove obsolete mocks

---

## Risks

### 1. Type bloat in `components/branches/types.ts`

Mitigation:

- split branch types by module once Phase 1 lands

### 2. Too much in the setup wizard

Mitigation:

- keep the wizard operational-only
- move rich content editing to branch workspace tabs

### 3. Public page migration becomes a rewrite

Mitigation:

- add selectors first
- adapt existing old components gradually

### 4. Reviews scope expands too fast

Mitigation:

- ship summary + moderation state first
- defer ingestion and external sync complexity

---

## Definition Of Done

This initiative is done when:

- a branch can be created with the current operational wizard
- a branch can then be enriched through workspace tabs
- gallery, reviews, social links, and overview content are branch-owned
- pricing and schedule render from branch data
- the public branch detail page is no longer powered by static mock constants
- publishing checks prevent incomplete public listings

---

## Recommended Immediate Next Step

Start with Phase 1 and Phase 2 only.

That gives GymDeck the correct foundation:

- stable branch domain model
- branch workspace shell

Without that, every gallery/reviews/social implementation will remain fragmented.
