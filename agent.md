# GymDeck Admin

## Branch Context

- Current branch: `feat/admin`
- This branch is being repurposed to become the GymDeck management, staff, and admin application.
- The current repo is a temporary home; the admin surface may later be moved into its own repository.
- Until then, treat this branch as the source of truth for GymDeck's internal operations UI.
- The live `app`, `components`, and `app/globals.css` files are the source of truth for structure and styling.
- New UI work should extend the current admin visual language for controls, menus, table tools, buttons, spacing, radii, text color, and hover states unless a newer pattern is explicitly requested.
- When in doubt, prefer consistency with the current branch styling and keep all implementation inside the active app code.
- Component architecture should follow the current build structure in `components` and `app`.
- Prefer the same atomic breakdown used there: `atoms`, `molecules`, and `organisms`, with feature-level `data`, `types`, and `index` files where useful.
- Keep `app` routes thin and use them mainly to compose or mount feature organisms from `components`.
- Do not invent a different component organization unless a page genuinely needs a new pattern.

## Product Goal

Build a clean, modern, operational admin dashboard for GymDeck that helps:

- gym owners
- managers
- front desk staff
- operations and admin staff

The admin app should manage all public and operational gym workflows:

- gym profile
- gallery
- pricing
- class schedule
- members
- bookings
- passes
- payments
- reviews
- notifications
- staff roles

## Product Tone

The UI should feel:

- clean
- spacious
- premium but simple
- operational, not flashy
- fast to scan

Reference direction:

- Stripe Dashboard for cleanliness
- Notion and Linear for spacing and hierarchy
- Shopify Admin for operational practicality

This should feel like a real SaaS operations product, not a settings panel.

## Visual System

### Core Style

- white and very light gray surfaces
- soft borders
- subtle shadows only where needed
- rounded cards
- dark primary text
- muted secondary text
- clear section hierarchy
- strong spacing throughout
- blue or blue-violet accent aligned with GymDeck branding

### Design Tokens

- card radius: `16px`
- input radius: `12px`
- button radius: `12px`
- modal radius: `20px`
- desktop page padding: `24px`
- card padding: `20px`
- section gap: `24px`
- grid gap: `16px`
- page title: `28/32 semibold`
- section title: `18/24 semibold`
- body text: `14/20 regular`
- helper text: `12/16 regular`
- KPI number: `28px` to `36px` bold
- border: `1px` subtle neutral
- shadow: very soft elevation only

## UX Principles

- important actions must always be visible
- tables must be easy to scan
- filters should sit near the content they affect
- quick actions should use drawers or modals
- heavy forms should use full pages
- tablet and mobile layouts must preserve staff workflows
- dashboards should feel like control centers, not analytics overload
- empty states should guide the next action clearly

## App Shell

### Desktop

- fixed left sidebar for navigation
- sidebar should stay lean and focus on live operations first
- sticky topbar for search, notifications, and account actions
- main content area for each page
- optional right contextual panel on operational pages

### Tablet

- collapsible sidebar
- persistent topbar
- tighter card stacking

### Mobile

- sidebar becomes drawer
- simplified topbar
- tables collapse into stacked cards where necessary
- floating quick actions can be used for high-frequency tasks

### Sidebar Refinement

- keep only two top-level sidebar areas: `Main` and `Settings`
- keep operational pages in `Main`
- move deep configuration out of the sidebar and into the settings workspace
- keep help and settings utilities near the bottom
- use a MOS-style company card at the bottom of the sidebar
- branch switching should open from that bottom company card as a dropdown
- keep the brand logo at the top and the main navigation readable in the center

## Navigation

### Main

- Dashboard
- Branches when multi-branch is enabled
- Members
- Bookings
- Classes
- Passes / Plans
- Payments

### Settings

- Settings should be a single sidebar destination
- `Settings` contains internal tab menus instead of a long sidebar list
- primary settings tabs:
  - Main
  - Teams
  - Gym Setup

### Settings Tab: Teams

- Staff & Roles
- Activity Log
- future team-related admin modules can be housed here
- use MOS-style cards with `View details` actions

### Settings Tab: Gym Setup

- Gym Profile
- Gallery
- Amenities & Rules
- Reviews
- Notifications
- use MOS-style cards with `View details` actions

### Navigation Priority

1. Dashboard
2. Members
3. Bookings
4. Classes
5. Passes / Plans
6. Payments
7. Gym Setup
8. Staff & Roles
9. Settings

## Topbar

### Left

- page title
- breadcrumbs on deeper pages

### Center

- global search for members, bookings, classes, and payments

### Right

- notification bell
- settings or help utility icon
- user avatar menu

### Avatar Menu

- My account
- Switch gym
- Settings
- Logout

## Dashboard

### Purpose

Provide an instant operational view of the gym.

### Layout

Use a 12-column grid.

### Row 1: KPI Cards

Show four to six KPI cards:

- total active members
- today's check-ins
- today's class bookings
- monthly revenue
- expiring passes
- pending issues

Each card should include:

- label
- large headline number
- small trend or status text
- optional future sparkline area

### Row 2

Left large card:

- check-ins and bookings overview
- tabs: Today, 7 days, 30 days

Right stacked cards:

- upcoming classes
- low-capacity or full classes
- quick staff notes or alerts

### Row 3

- recent payments table
- recent bookings table
- quick actions card

Quick actions:

- Add class
- Create plan
- Add staff
- Upload photos
- Check in member

### Row 4

- reviews summary
- membership expiry summary
- top performing plans

### Dashboard Rule

This page must feel like a control center, not an analytics wall.

## Members

### Purpose

Manage members and memberships.

### Top Controls

- page title
- search members
- filter by membership status
- filter by plan type
- filter by branch
- filter by joined date
- add member CTA

### Table Columns

- Name
- Contact
- Membership plan
- Status
- Classes booked
- Last visit
- Expiry date
- Actions

### Row Actions

- View profile
- Assign plan
- Extend membership
- View payments
- Suspend access

### Member Detail

Use a drawer for quick viewing or a full page for deeper workflows.

Sections:

- basic info
- current membership
- booking history
- check-in history
- payment history
- notes

## Bookings

### Purpose

Manage all bookings across gym access and classes.

### Top Controls

- tabs: All, Gym Access, Class Bookings
- date selector
- status filter
- member search
- manual booking CTA

### Table Columns

- Booking ID
- Member
- Type
- Class or gym access
- Date
- Time
- Status
- QR or check-in state
- Actions

### Actions

- View booking
- Mark as used
- Cancel
- Resend confirmation

### Summary Panel

- today's bookings
- no-shows
- used passes

## Classes

### Purpose

Create and manage class offerings and schedules.

### Top Controls

- title
- search
- filter by instructor
- filter by status
- filter by branch
- create class CTA

### View Modes

- table
- calendar
- cards

### Recommended Default

Use a split layout:

- left side for class list and filters
- right side for schedule calendar or class detail

### Class Fields

- class name
- instructor
- duration
- capacity
- active schedule count
- booked seats
- status

### Class Detail Sections

- overview
- schedule slots
- capacity rules
- waitlist rules
- attendees
- recent sessions

## Weekly Schedule

This is a priority surface because it maps directly to the user-facing schedule.

### Layout

Primary layout:

- days across the top
- time slots vertically
- class blocks inside the grid

Mobile fallback:

- day tabs
- stacked class cards

### Controls

- Today
- week switcher
- instructor filter
- branch filter
- Add slot

### Class Slot Block

Each slot should show:

- class name
- instructor
- start and end time
- booked versus capacity
- status color or badge

On click:

- open schedule detail drawer

## Passes And Plans

### Purpose

Manage pricing that members can purchase.

### Top Controls

- title
- filter by status
- filter by type
- create plan CTA

### Plan Card

Use admin-friendly pricing cards that emphasize operations, not marketing.

Each card should show:

- plan name
- type badge
- price
- duration or sessions
- included features
- active or inactive badge
- actions

### Actions

- Edit
- Duplicate
- Disable
- Archive
- View subscribers

### Supported Plan Types

- monthly subscription
- session pack
- single visit
- promo pass in the future

## Create Or Edit Plan

Use a full page or wide modal.

### Sections

- basic info
- pricing
- validity period
- session rules
- access rules
- amenities included
- terms and cancellation
- visibility

### Important Fields

- plan name
- plan type
- price
- currency
- number of sessions
- validity days
- access times
- branch restrictions
- features list
- terms text
- active toggle

## Payments

### Purpose

Track transactions and revenue.

### Top Controls

- date range
- payment status filter
- plan filter
- export button

### KPI Row

- total revenue
- successful payments
- failed payments
- refund count

### Table Columns

- Transaction ID
- Member
- Plan
- Amount
- Method
- Status
- Date
- Actions

### Actions

- View receipt
- Refund, role restricted
- Download invoice

### Lower Section Or Side Panel

- revenue by plan
- revenue by day, week, or month

## Reviews

### Purpose

Manage public reputation and responses.

### Top Controls

- average rating
- rating distribution
- stars filter
- search review text

### Review Card

- member name
- star rating
- date
- review text
- status
- response action

### Actions

- Reply
- Hide or flag
- Mark as resolved

## Gym Profile

### Purpose

Control the public-facing gym information.

### Layout

Use a structured settings page.

Left side:

- sticky section navigation

Right side:

- form sections in cards

### Sections

- gym identity
- description
- contact info
- address and location
- amenities
- rules and etiquette
- social links
- visibility settings

### Important Fields

- gym name
- slug or public URL
- short description
- full overview
- address
- map pin
- phone
- email
- opening hours
- amenities tags
- rules list

## Gallery

### Purpose

Manage hero and gallery media.

### Top Controls

- upload media
- reorder mode
- filter by type

### Main Layout

- image grid with drag and drop support

Each image card should support:

- preview
- hero or cover badge
- order number
- actions menu

### Actions

- Set as cover
- Reorder
- Replace
- Delete
- Add alt text or caption

### Guidance

Show practical upload notes:

- recommended dimensions
- max file size
- cover image tips

## Amenities And Rules

This can be merged into Gym Profile later, but keeping it separate in v1 is acceptable.

### Layout

Two-column page:

- left for amenities list builder
- right for rules and etiquette list builder

Each builder should support:

- add item
- reorder item
- enable or disable item
- future icon selection

## Notifications

### Purpose

Control operational messaging.

### Sections

- email notifications
- push notifications
- SMS or WhatsApp later

### Toggles

- booking confirmations
- class reminders
- membership expiry reminders
- promotions
- payment receipts

### Advanced

- sender name
- template preview
- test notification

## Staff And Roles

### Purpose

Manage employee records, operational access, and branch-scoped permissions from one shared area.

### Information Architecture

Use a shared `Staff` area with three tabs:

- Employees
- Roles
- Performance Tracking later

Employees and Roles should feel operational first. Performance Tracking can remain lighter until the workflow is ready.

### Employees List View

#### Purpose

Help admins quickly find, review, and manage employees.

#### Summary Cards

- Active employees
- Inactive employees
- Invited employees
- Deactivated employees

#### Top Controls

- primary CTA: Add employee
- search by name, phone, email, or employee code
- filters for status, branch, role, and team if needed
- export

#### Table Columns

- Name
- Employee code
- Role
- Team or department when available
- Branch
- Email
- Phone number
- Status
- Actions

Do not over-index on employee analytics in this table. It should behave like a fast operational directory.

#### Row Actions

- View employee
- Edit employee
- Deactivate employee
- Reactivate employee
- Resend invite when relevant

### Create Employee Page

#### Pattern

Use a dedicated create page with a single-step form.

This flow should be straightforward and administrative, not wizard-heavy.

#### Fields

- First name
- Last name
- Employee code
- Team or department if your data model still requires it
- Role
- Email address
- Phone number
- Alternate phone number optional
- Primary branch or office address

#### Notes

- Remove `Map user to locations`
- Remove `Activate BVN Capturing? (If you need a wallet for your Employees)`
- Keep branch selection simple at creation time
- Do not ask for permission configuration inside employee creation
- If multi-branch access is needed later, it should come from the assigned role or from employee edit, not from the initial create form

### Roles List View

#### Purpose

Help admins define permission bundles and understand where each role is used.

#### Summary Cards

- Active roles
- Inactive roles

#### Top Controls

- primary CTA: Add new role
- search by role name
- filter by status, branch scope, and team if useful

#### Table Columns

- Role name
- Assigned team if applicable
- Branch scope
- Number of employees
- Date created
- Status
- Actions

#### Row Actions

- View role
- Edit role
- Duplicate role
- Deactivate role

### Create Role Page

#### Pattern

Use a dedicated create page with a two-step flow.

This should reduce cognitive load because role definition and permission assignment are different tasks.

#### Step 1: Role Setup

Collect the structural details for the role.

Fields:

- Role name
- Role description
- Team or department when applicable
- Reports to optional
- Branch assignment or branch scope

Branch setup should be explicit here. For example:

- assign to all branches
- assign to selected branches
- assign to one primary branch

This is the correct place for branch access because it belongs to the role model, not the employee create form.

#### Step 2: Permissions Setup

Configure what the role can do across the product.

Patterns:

- group permissions by module
- module-level summary first, granular actions below
- support `select all` per module
- expose only meaningful actions such as view, create, edit, delete, approve, refund, export
- show a concise summary before final save

Permission groups should eventually align with GymDeck modules such as:

- Dashboard
- Members
- Bookings
- Classes
- Passes and plans
- Payments
- Reviews
- Notifications
- Branches
- Staff
- Settings

#### Step Footer Behavior

- Back moves to the previous step without data loss
- Continue validates only the current step
- Create role is shown only on the final step

### Core Role Principles

- roles should be branch-aware
- employees inherit most access from roles
- avoid mixing employee profile fields with permission setup
- allow one role to be reused across many employees
- keep restricted actions explicit and auditable

### Recommended Gym Roles

- Owner
- General Manager
- Branch Manager
- Front Desk
- Coach
- Instructor
- Finance or Admin

## Activity Log

### Purpose

Track who changed what.

### Columns

- Staff member
- Action
- Module
- Entity affected
- Timestamp
- Branch

This is especially useful for:

- pricing changes
- booking edits
- staff permission changes

## Check-In And QR Validation

This is a major operational workflow and should be optimized for front desk speed.

### Primary Layout

- centered camera or scan area
- manual code input
- recent validations panel

### Validation States

- valid pass
- already used
- expired
- wrong branch
- invalid QR

### Result Card

- member photo or avatar
- name
- pass type
- validity
- booking or class reference when relevant
- confirm entry CTA

## Branches

Multi-branch support is future-facing but should be designed cleanly.

### Branch List

- branch name
- address
- members
- active plans
- staff count
- status

### Branch Detail

- profile
- opening hours
- assigned staff
- plans available
- classes available

## Settings

### Role

Settings is now a workspace, not a long sidebar category list.

### Layout

- left side vertical tab menu inspired by MOS
- right side grid of detail cards
- cards should end with a `View details` style action
- keep the page clean, spacious, and easy to scan

### Primary Tabs

- Main
- Teams
- Gym Setup

### Main Tab

- workspace defaults
- notification center
- access overview
- help and support

### Teams Tab

- Staff & Roles
- Activity Log
- branch access and invite workflows can live here later

### Gym Setup Tab

- Gym Profile
- Gallery
- Amenities & Rules
- Reviews
- Notifications

## Reusable Component System

The admin UI should be built from a consistent internal component set.

### Build Structure

- Follow the current `components` and `app` structure as the default implementation pattern.
- Build UI from small reusable `atoms`, compose them into `molecules`, and assemble page sections and full feature surfaces in `organisms`.
- Keep styling decisions aligned with `app/globals.css` while implementing everything inside the live codebase.
- Prefer feature folders that expose a clean `index` file and keep related `data`, `types`, and component layers together.

### Core Components

- `AppShell`
- `SidebarNav`
- `Topbar`
- `PageHeader`
- `KPIStatCard`
- `DataTable`
- `FilterBar`
- `EmptyState`
- `DrawerPanel`
- `Modal`
- `FormSectionCard`
- `StatusBadge`
- `ActionMenu`
- `Tabs`
- `CalendarGrid`
- `ImageUploader`
- `PlanCard`
- `ReviewCard`

## Empty States

Every empty state should feel helpful and actionable.

Each one should include:

- icon or illustration
- one-line explanation
- primary CTA

Examples:

- no classes yet -> Create your first class
- no gallery images -> Upload photos to improve your public listing
- no plans -> Add a plan so users can book your gym
- no staff -> Invite your front desk or managers

## Role Priorities

### Owner

Primary concerns:

- revenue
- member growth
- pricing
- reviews
- staff control

### Front Desk

Primary concerns:

- check-ins
- booking lookup
- pass validation
- quick member search

### Manager

Primary concerns:

- class scheduling
- occupancy
- member issues
- staff monitoring

The system should support role-based landing views later.

## Form Patterns

### Settings-Heavy Pages

- autosave small low-risk fields where safe
- explicit Save Changes for critical forms
- sticky action bar for long forms

### Quick Operational Actions

- use modals or drawers

### Complex Entity Management

- use dedicated create or edit pages

## Responsive Rules

### Desktop

- keep the sidebar visible
- keep topbar sticky
- support dense but readable tables

### Tablet

- collapse secondary chrome first
- reduce column counts when useful
- preserve key actions in visible toolbars

### Mobile

- prioritize search, check-ins, bookings, and quick actions
- convert tables to cards
- use bottom sheets for row actions
- allow horizontal swipe for KPI cards when needed

## First Build Order

1. App shell
2. Dashboard
3. Members
4. Bookings
5. Classes and weekly schedule
6. Pricing and plans
7. Gym profile
8. Gallery
9. Transactions
10. Staff and roles

## Implementation Notes For This Repo

- stack: Next.js App Router, React 19, Tailwind CSS 4, Zustand
- keep the admin interface modular so it can later be moved to a separate repo with minimal rewriting
- prefer reusable layout primitives and shared surface patterns before building page-specific variants
- v1 can use static or mocked data where needed, but the information architecture should already reflect real gym workflows
- use the archived `old-*` files as a visual and structural reference bank only
- keep all live admin code inside the new `app` and `components` trees

## Success Criteria

The GymDeck admin should make staff feel:

- confident
- fast
- in control
- not overwhelmed

If a screen starts to feel decorative, noisy, or analytics-heavy, simplify it until it feels operational again.
