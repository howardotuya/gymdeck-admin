# GymDeck Backend Planning Agent

This document houses the backend planning foundation for **GymDeck**.

## 1. Goal

Build a backend that supports:

- multi-tenant gyms
- gym branches
- admin/staff management
- members
- memberships and plans
- classes and bookings
- gallery and gym content
- reviews and ratings
- payments
- notifications
- analytics/reporting

The backend should be easy to ship first, then scale safely.

---

## 2. Backend Direction

### Recommended stack

- **Framework:** NestJS
- **Database:** MySQL
- **ORM:** TypeORM
- **Cache / queues:** Redis
- **File storage:** S3-compatible storage
- **Payments:** Paystack
- **Auth:** JWT with refresh token flow

### Why this direction

- NestJS gives structure for a growing codebase
- MySQL is familiar and good enough for the first GymDeck version
- TypeORM fits well with NestJS and keeps you inside tools you can work with now
- Redis helps later with caching, queues, OTPs, rate limits, and jobs

---

## 3. Multi-Tenant Model

### Recommended tenancy model

Start with:

- **single database**
- **shared schema**
- **tenant_id on tenant-owned records**

### Why

This is the best early-stage tradeoff:

- cheaper to run
- simpler to maintain
- easier analytics across gyms
- faster MVP delivery

### Rule

Every tenant-owned table must be scoped by `tenant_id`.

Some records may also need `branch_id`.

---

## 4. Core Product Areas

The backend should be planned around these product areas:

1. **Auth & Identity**
2. **Tenants / Gyms**
3. **Branches**
4. **Staff / Roles / Permissions**
5. **Members**
6. **Membership Plans & Subscriptions**
7. **Classes & Schedules**
8. **Bookings / Attendance / Check-ins**
9. **Reviews & Ratings**
10. **Gallery / Media**
11. **Payments & Billing**
12. **Notifications**
13. **Reports / Analytics**
14. **Audit / Activity Logs**

---

## 5. Recommended NestJS Modules

### Foundation modules

- `auth`
- `users`
- `tenants`
- `branches`
- `roles`
- `permissions`

### Business modules

- `members`
- `membership-plans`
- `subscriptions`
- `classes`
- `bookings`
- `checkins`
- `reviews`
- `gallery`
- `payments`
- `notifications`
- `reports`

### Platform modules

- `storage`
- `audit-logs`
- `health`
- `config`
- `jobs`

---

## 6. User Types

The system should support these user types:

- **Super Admin** – GymDeck internal team
- **Gym Owner** – owns a gym tenant
- **Branch Manager** – manages one or more branches
- **Staff** – reception, trainer, operations, etc.
- **Member** – gym customer

### Important note

A person may belong to:

- one tenant
- multiple branches
- one or more roles depending on access model

---

## 7. Access Control Model

### Recommended model

Use **RBAC with permission mapping**.

That means:

- users get roles
- roles carry permissions
- permissions determine actions

### Example permissions

- `gym.read`
- `gym.update`
- `branch.create`
- `branch.update`
- `member.read`
- `member.create`
- `member.update`
- `class.create`
- `class.update`
- `booking.read`
- `payment.read`
- `review.moderate`

### Important access checks on every request

Every protected request should answer:

1. Who is the user?
2. What tenant do they belong to?
3. What branch can they access?
4. What role/permissions do they have?
5. Are they allowed to touch this resource?

---

## 8. Tenant Isolation Rules

This is one of the most important backend rules.

### Required rules

- A gym must not see another gym’s data
- Branch data must only be accessible to allowed staff
- File uploads must be tenant-owned
- Analytics must be scoped by tenant unless super admin access is used
- Payment records must be mapped to the correct tenant and member

### Suggested implementation

- extract tenant context from auth/session/subdomain/custom domain mapping
- inject tenant context into request lifecycle
- enforce tenant filters in service/repository layer
- never trust client-sent `tenant_id` blindly

---

## 9. Main Entities

These are the likely first entities for the MVP.

### Platform / identity

- `users`
- `tenants`
- `branches`
- `roles`
- `permissions`
- `user_tenant_roles`
- `user_branch_access`

### Member domain

- `members`
- `member_profiles`
- `membership_plans`
- `subscriptions`
- `checkins`

### Classes domain

- `class_types`
- `class_schedules`
- `class_bookings`
- `trainers`

### Content domain

- `gallery_assets`
- `reviews`
- `amenities`
- `gym_rules`
- `overview_sections`

### Finance domain

- `payment_transactions`
- `invoices`
- `billing_accounts`
- `tenant_billing_plans`

### Operational domain

- `notifications`
- `audit_logs`
- `activity_events`

---

## 10. Suggested Table Thinking

### `tenants`

Represents a gym business.

Possible fields:

- `id`
- `name`
- `slug`
- `primary_domain`
- `status`
- `created_at`
- `updated_at`

### `branches`

Represents physical locations under a tenant.

Possible fields:

- `id`
- `tenant_id`
- `name`
- `slug`
- `address`
- `city`
- `state`
- `country`
- `latitude`
- `longitude`
- `phone`
- `email`
- `status`
- `created_at`
- `updated_at`

### `users`

Represents authenticated people in the system.

Possible fields:

- `id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `password_hash`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

### `user_tenant_roles`

Maps users to tenants and roles.

Possible fields:

- `id`
- `user_id`
- `tenant_id`
- `role_id`
- `created_at`

### `members`

Represents a gym member/customer.

Possible fields:

- `id`
- `tenant_id`
- `branch_id`
- `user_id` (nullable if member account is not yet activated)
- `first_name`
- `last_name`
- `email`
- `phone`
- `membership_status`
- `joined_at`
- `created_at`
- `updated_at`

### `membership_plans`

Represents pricing plans.

Possible fields:

- `id`
- `tenant_id`
- `branch_id` (nullable if tenant-wide)
- `name`
- `plan_type` (monthly, package, single_visit)
- `price`
- `session_count` (nullable)
- `duration_days` (nullable)
- `is_active`
- `created_at`
- `updated_at`

### `class_schedules`

Represents classes and timing.

Possible fields:

- `id`
- `tenant_id`
- `branch_id`
- `title`
- `description`
- `trainer_id`
- `capacity`
- `starts_at`
- `ends_at`
- `recurrence_rule` (nullable)
- `status`
- `created_at`
- `updated_at`

### `class_bookings`

Represents member bookings.

Possible fields:

- `id`
- `tenant_id`
- `class_schedule_id`
- `member_id`
- `booking_status`
- `booked_at`
- `checked_in_at` (nullable)

### `reviews`

Represents member/user reviews for a gym.

Possible fields:

- `id`
- `tenant_id`
- `branch_id` (nullable)
- `member_id`
- `rating`
- `comment`
- `status`
- `created_at`

### `gallery_assets`

Represents media uploads.

Possible fields:

- `id`
- `tenant_id`
- `branch_id` (nullable)
- `asset_type`
- `file_url`
- `file_key`
- `caption`
- `sort_order`
- `created_by`
- `created_at`

### `payment_transactions`

Represents member payments.

Possible fields:

- `id`
- `tenant_id`
- `branch_id`
- `member_id`
- `subscription_id` (nullable)
- `amount`
- `currency`
- `provider`
- `provider_reference`
- `status`
- `paid_at`
- `created_at`

---

## 11. API Style

### Recommendation

Start with **REST**.

### Why

- faster for admin/dashboard work
- easier auth and permission handling
- easier for team onboarding
- easier API versioning early on

### Suggested route grouping

- `/auth/*`
- `/tenants/*`
- `/branches/*`
- `/members/*`
- `/membership-plans/*`
- `/subscriptions/*`
- `/classes/*`
- `/bookings/*`
- `/reviews/*`
- `/gallery/*`
- `/payments/*`
- `/reports/*`

---

## 12. Auth Flow

### Recommended first version

- email/password login for staff/admin
- optional member login flow
- JWT access token
- refresh token rotation
- password reset flow
- email verification later if needed

### Things to support later

- OTP login
- social login
- magic links
- SSO for large enterprise gyms

---

## 13. Custom Domain / Subdomain Thinking

GymDeck may support:

- `gym1.gymdeck.com`
- custom domains like `www.gym1.com`

### Backend implication

You need a way to resolve incoming hostnames to a tenant.

Suggested approach:

- store allowed domains on tenant/domain table
- resolve host -> tenant before protected business logic runs
- attach tenant context to request

Possible table:

- `tenant_domains`
  - `id`
  - `tenant_id`
  - `domain`
  - `is_primary`
  - `is_verified`

---

## 14. File / Media Handling

### Rules

- never store raw files in the database
- store URLs, keys, metadata, ownership
- all assets should be tenant-owned

### Upload types

- gym logo
- cover image
- gallery images
- trainer images
- class images

### Metadata to store

- tenant owner
- branch owner if applicable
- file size
- mime type
- uploader
- created time

---

## 15. Payments Model

There are **two separate money flows**.

### A. Member pays gym

Examples:

- monthly membership
- class package
- single visit

### B. Gym pays GymDeck

Examples:

- SaaS subscription
- branch pricing
- member-volume pricing
- add-ons

These should not be mixed in the same business logic.

### Recommendation

Plan two billing layers:

1. **Gym operating payments**
2. **GymDeck SaaS billing**

---

## 16. Notifications

The backend should eventually support:

- email notifications
- SMS notifications
- push notifications
- in-app notifications

### Early practical cases

- new member welcome
- class booking confirmation
- payment success/failure
- membership expiry reminder
- staff invite

---

## 17. Audit Logs

This matters a lot for admin/staff systems.

### Track actions like

- member created
- plan updated
- payment status changed
- class cancelled
- branch settings changed
- staff invited/removed

### Suggested fields

- actor user
- tenant
- branch if any
- action name
- entity type
- entity id
- before snapshot (optional)
- after snapshot (optional)
- created_at

---

## 18. Reporting / Analytics

### MVP analytics examples

- total members
- active memberships
- expiring memberships
- bookings per class
- check-ins per day/week/month
- branch performance
- revenue summary
- average review rating

### Rule

All analytics must be tenant-scoped by default.

---

## 19. Environment Setup Planning

### Environments

- local
- staging
- production

### Must-have setup items

- environment variable strategy
- migration strategy
- seed scripts
- logging
- monitoring
- backups
- rate limiting
- CORS policy
- validation layer

### Recommended support tools

- Docker for local services
- TypeORM migrations
- Swagger/OpenAPI
- class-validator / zod-style validation strategy
- structured logging

---

## 20. Suggested Folder Direction

Example high-level structure for NestJS:

```text
src/
  common/
  config/
  modules/
    auth/
    users/
    tenants/
    branches/
    roles/
    members/
    membership-plans/
    subscriptions/
    classes/
    bookings/
    reviews/
    gallery/
    payments/
    notifications/
    reports/
    audit-logs/
  database/
  main.ts
```

---

## 21. Backend MVP Scope

For first shipping version, focus on:

### Must-have

- auth
- tenants
- branches
- staff roles/permissions
- members
- membership plans
- classes/schedules
- bookings
- gallery
- reviews
- payment records

### Nice-to-have later

- deep analytics
- advanced automation
- referral systems
- loyalty systems
- AI recommendations
- webhook ecosystems
- full notification engine

---

## 22. Recommended Build Order

### Phase 1 – foundation

1. Project bootstrap
2. Config management
3. Database setup
4. TypeORM entity design
5. Auth module
6. Tenant resolution strategy
7. Roles and permissions

### Phase 2 – business core

8. Branches
9. Members
10. Membership plans
11. Classes and schedules
12. Bookings

### Phase 3 – product polish

13. Gallery
14. Reviews
15. Payments
16. Notifications
17. Reports
18. Audit logs

---

## 23. Non-Negotiable Backend Rules

1. Every tenant-owned record must be scoped properly
2. Never trust client-submitted tenant ownership directly
3. Role and permission checks must be centralised
4. Audit important admin actions
5. File ownership must always be traceable
6. Payment flows must be idempotent
7. API input validation must be strict
8. Keep the first version simple enough to ship

---

## 24. Immediate Next Planning Step

The next best move is:

### Define the backend MVP in detail under these headings:

- modules
- entities/tables
- relationships
- auth flow
- tenant resolution flow
- roles/permissions matrix
- core API endpoints

---

## 25. Working Decision for GymDeck

Unless changed later, the planning assumptions are:

- NestJS backend
- MySQL database
- TypeORM ORM
- shared-schema multi-tenancy
- REST API first
- JWT auth with refresh tokens
- RBAC + permissions
- S3-compatible media storage
- Paystack payment integration

---

## 26. Notes for Future Iterations

This file is the base planning document.

Later versions should add:

- exact ERD
- TypeORM entity draft
- endpoint list by module
- role-permission table
- tenant resolution middleware design
- deployment checklist
- billing architecture
