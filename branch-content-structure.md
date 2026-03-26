# Branch Content Structure Proposal

## Objective

Extend GymDeck branches beyond internal operations so each branch can power a complete public listing:

- gallery
- reviews
- social links
- overview content
- amenities / rules
- pricing / plans
- schedule / classes

The goal is to keep one branch record as the source of truth, while separating:

1. operational data used by staff
2. public content used by members
3. commercial data used for conversion and booking

---

## Current Codebase Read

### Admin branch flow today

The current admin branch flow is operational-first.

- [`components/branches/types.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/types.ts) defines `Branch`, `BranchDetail`, and `BranchFormState`.
- [`components/branches/branch-form-steps/branchProfileStep.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branch-form-steps/branchProfileStep.tsx) captures only:
  - name
  - status
  - manager
  - phone
  - email
  - tags
  - address
  - operational note
- [`components/branches/branchFormPage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branchFormPage.tsx) focuses on:
  - branch profile
  - opening hours
  - assigned staff
  - plans available
  - classes available
  - preview
- [`components/branches/branchDetailPage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/components/branches/branchDetailPage.tsx) renders the same operational view: profile, hours, staff, plans, classes.

### User-facing branch detail today

The public experience is modeled separately and is mostly mock content.

- [`old-components/home/homePage.tsx`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/homePage.tsx) renders tabs for:
  - overview
  - schedule
  - pricing
  - reviews
- [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts) stores:
  - gallery images
  - overview copy
  - amenities
  - rules
  - plans
  - reviews
  - rating distribution

### Product direction already implied in the repo

The settings area already hints at the right shape:

- [`components/settings/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/components/settings/data.ts) has separate setup cards for:
  - Gym Profile
  - Gallery
  - Amenities & Rules
  - Reviews
  - Notifications

That means the product direction is already clear: public branch content should be managed, not hardcoded.

---

## Main Structural Problem

Right now GymDeck has two disconnected models:

- an admin branch operations model
- a user listing content model

That split will create drift quickly:

- the admin can update hours or plans without the public page reflecting them correctly
- public reviews and media have no branch-level ownership in the admin flow
- there is no clear place for social links, brand story, amenities, or moderation rules

The fix is not to keep bolting fields onto the current setup wizard. The fix is to define a proper branch domain model with modules.

---

## Recommended Branch Domain Model

Use one `Branch` aggregate with grouped modules.

```ts
type Branch = {
  id: string;
  slug: string;
  status: "draft" | "live" | "watch" | "inactive";

  identity: {
    name: string;
    shortName?: string;
    address: string;
    coordinates?: { lat: number; lng: number };
    phone?: string;
    email?: string;
    managerName?: string;
    timezone: string;
  };

  operations: {
    openingHours: OpeningHour[];
    staffAssignments: StaffAssignment[];
    operationalNote?: string;
    tags: string[];
  };

  publicProfile: {
    headline?: string;
    overviewShort?: string;
    overviewLong?: string;
    amenities: Amenity[];
    rules: RuleItem[];
    audienceTags: string[];
    heroMediaId?: string;
    coverMediaId?: string;
  };

  gallery: {
    media: BranchMedia[];
    featuredMediaIds: string[];
  };

  socialLinks: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    x?: string;
    website?: string;
    whatsapp?: string;
  };

  commerce: {
    plans: BranchPlanAssignment[];
    dropInEnabled: boolean;
    trialEnabled: boolean;
    preferredPlanId?: string;
  };

  programming: {
    classTypes: BranchClassAssignment[];
    scheduleSource: "local" | "central";
  };

  reputation: {
    ratingAverage?: number;
    reviewCount?: number;
    reviewSummary?: RatingDistribution[];
    externalReviewLinks?: ExternalReviewLink[];
    moderationState: "open" | "needs_review";
  };

  publishing: {
    isDiscoverable: boolean;
    completenessScore: number;
    lastPublishedAt?: string;
  };
};
```

### Why this shape works

- `operations` supports internal admin workflows.
- `publicProfile`, `gallery`, `socialLinks`, and `reputation` support the consumer page.
- `commerce` and `programming` support conversion and booking.
- `publishing` lets you control quality before a branch goes live.

---

## Recommended Admin Information Architecture

Do not force all of this into the current 6-step wizard.

Use a 2-layer structure:

### Layer 1: Branch setup wizard

Keep the current wizard for launch-critical configuration only:

1. Branch profile
2. Opening hours
3. Assigned staff
4. Plans available
5. Classes available
6. Launch preview

This gets the location operational.

### Layer 2: Branch workspace tabs

Once a branch exists, add branch-level tabs:

1. Overview
2. Public profile
3. Gallery
4. Reviews
5. Social links
6. Pricing
7. Schedule
8. Publishing

This avoids making setup too heavy while still giving each branch a proper content CMS.

---

## Recommended Screen-Level Structure

### 1. Branch Overview

Purpose: operational summary + publishing health

Show:

- branch status
- live / draft state
- completeness score
- primary CTA plan
- total media count
- review score and unresolved review count
- schedule sync status
- latest content update

### 2. Public Profile

Fields:

- branch headline
- short description for cards/search
- long overview copy for detail page
- amenities
- rules / etiquette
- vibe tags such as `Strength`, `Recovery`, `Women-friendly`, `Beginner-friendly`
- primary facilities summary

This is where the current `overview` content should move.

### 3. Gallery

Fields:

- hero image
- featured images for detail page mosaic
- full gallery
- media type
  - interior
  - exterior
  - class
  - equipment
  - amenities
  - team
- alt text
- sort order
- approval status

### 4. Reviews

Fields:

- rating average
- review count
- star distribution
- featured reviews
- hidden / flagged reviews
- response status
- external source markers if reviews are syndicated

### 5. Social Links

Fields:

- Instagram
- TikTok
- Facebook
- YouTube
- Website
- WhatsApp

Rules:

- validate URLs
- one link per platform
- preview icon and link health

### 6. Pricing

This should not be freeform content only.

Use assigned plans plus branch overrides:

- plan visibility
- branch-specific prices if allowed
- featured plan
- trial / drop-in visibility
- checkout CTA label
- policy snippets

### 7. Schedule

Use actual scheduled sessions, not only reusable class types.

Split:

- class catalog
- live timetable
- filters by category
- waitlist enabled
- trainer display

### 8. Publishing

Add guardrails before a branch becomes public.

Checks:

- address present
- hours complete
- at least 5 gallery images
- at least 1 featured plan
- overview copy filled
- amenities selected
- social links validated
- moderation issues cleared

---

## Public App Mapping

Map each public tab to the new branch modules:

### Overview tab

Use:

- `publicProfile.overviewShort`
- `publicProfile.overviewLong`
- `publicProfile.amenities`
- `publicProfile.rules`
- selected facility tags

### Schedule & Classes tab

Use:

- `programming.classTypes`
- scheduled sessions
- trainer info
- waitlist state

### Pricing tab

Use:

- `commerce.plans`
- branch-specific featured plan
- policy summaries

### Reviews tab

Use:

- `reputation.ratingAverage`
- `reputation.reviewCount`
- `reputation.reviewSummary`
- normalized review items

### Gallery header / hero section

Use:

- `gallery.featuredMediaIds`
- `publicProfile.heroMediaId`

### Sticky side card

Use:

- lowest visible starting price or preferred plan
- address / map / direction links
- optionally social proof like review score

---

## Established Gym Software Practices To Mirror

Below are the patterns I would bring into GymDeck after reviewing established platform guidance and vendor positioning.

### 1. Treat the branch profile as a local business profile, not just an internal record

Google Business Profile emphasizes complete business information, hours, photos, attributes, links, and review handling because that improves discoverability and conversion. That maps directly to GymDeck branches.

Apply this by making each branch publishable with:

- accurate hours
- rich media
- amenities / attributes
- social links
- direct booking or pricing links
- visible review health

### 2. Centralize multi-location control, but allow local overrides

Mindbody and Glofox both position multi-location management around centralized standards with location-level flexibility. That is the right model here.

Apply this by splitting data into:

- org defaults
- branch overrides

Examples:

- central plan templates, branch visibility overrides
- central class templates, branch schedules
- central brand rules, branch-specific gallery and social links

### 3. Keep booking surfaces synchronized across channels

Mindbody stresses that schedule updates should propagate across web, app, and booking surfaces. The same should hold for GymDeck.

Apply this by making branch schedule and plan data the same source for:

- admin
- member app
- public listing
- check-in or booking flows

### 4. Support branded discovery, not just back-office management

Mindbody and Glofox both emphasize branded member-facing surfaces. Your branch detail page should feel like a conversion page, not a database record.

Apply this by promoting:

- hero media
- featured plan
- branch identity copy
- social proof
- clear CTA hierarchy

### 5. Build review workflows, not only review display

Google’s review guidance makes two things clear:

- businesses should reply
- moderation is a workflow, not a static list

Apply this by storing:

- review source
- moderation state
- reply status
- flagged reason
- featured status

### 6. Use structured attributes instead of freeform copy wherever possible

Google attributes are useful because they improve filtering and search. GymDeck should model branch amenities similarly.

Prefer structured fields for:

- locker room
- showers
- parking
- women-only area
- yoga studio
- recovery zone
- wheelchair access
- Wi-Fi
- childcare

This will scale much better than paragraph-only descriptions.

### 7. Add publishing quality controls

Established platforms treat content completeness as operationally important. A branch should not go public with one blurry image and no overview copy.

Add:

- completeness score
- missing content warnings
- publish checklist
- draft vs live mode

---

## Practical Recommendation For GymDeck

### Short-term

Do this first:

1. Extend `BranchDetail` and `BranchFormState` with a new public-content module, but do not overload the create wizard yet.
2. Keep the current wizard operational-only.
3. Add branch edit sub-pages or tabs for:
   - public profile
   - gallery
   - reviews
   - social links
4. Replace the mock data in [`old-components/home/data.ts`](/Users/howard/Desktop/Projects/gympass-fe/old-components/home/data.ts) with branch-driven selectors.

### Medium-term

Add:

- normalized review model
- normalized media model
- branch publishing status
- organization templates with branch overrides

### Long-term

Unify:

- branch public page
- booking engine
- branch settings
- discovery filters

around one branch content API.

---

## Suggested Data Tables / Collections

If you move beyond local mocks, this is the likely split:

- `branches`
- `branch_opening_hours`
- `branch_staff_assignments`
- `branch_media`
- `branch_social_links`
- `branch_amenities`
- `branch_rules`
- `branch_plan_assignments`
- `branch_class_assignments`
- `branch_reviews`
- `branch_review_replies`
- `branch_publish_checks`

This is better than storing everything in one giant branch blob once reviews and gallery start growing.

---

## Suggested Rollout Order

1. Branch public profile model
2. Gallery management
3. Social links
4. Review ingestion + moderation state
5. Replace mocked public detail data with branch-backed selectors
6. Add publishing checklist and completeness score

This order gives you fast visible value without blocking on full review infrastructure first.

---

## Final Recommendation

GymDeck should structure branches as a hybrid of:

- operations hub
- storefront page
- booking node

Do not treat gallery, reviews, social links, and overview as miscellaneous extras. They are first-class branch modules.

The right product structure is:

- lightweight operational setup wizard
- richer branch content workspace after creation
- centralized templates with branch overrides
- one branch domain model feeding both admin and member surfaces

That approach matches how established gym platforms handle multi-location operations while still supporting a polished, conversion-oriented member experience.

---

## Sources

These sources informed the recommendations above:

- Google Business Profile, "Manage photos & videos for your Business Profile"  
  [https://support.google.com/business/answer/6103862?hl=en](https://support.google.com/business/answer/6103862?hl=en)
- Google Business Profile, "Tips for business-specific photos on your Business Profile"  
  [https://support.google.com/business/answer/6123536](https://support.google.com/business/answer/6123536)
- Google Business Profile, "Manage your business attributes"  
  [https://support.google.com/business/answer/9049526?hl=en](https://support.google.com/business/answer/9049526?hl=en)
- Google Business Profile, "Manage customer reviews"  
  [https://support.google.com/business/answer/3474050?hl=en](https://support.google.com/business/answer/3474050?hl=en)
- Google Business Profile, "Report inappropriate reviews on your Business Profile"  
  [https://support.google.com/business/answer/4596773?hl=en](https://support.google.com/business/answer/4596773?hl=en)
- Google Business Profile, "Manage your social media links"  
  [https://support.google.com/business/answer/13580646?hl=en](https://support.google.com/business/answer/13580646?hl=en)
- Google Business Profile, "Manage your local business links"  
  [https://support.google.com/business/answer/6218037?hl=en](https://support.google.com/business/answer/6218037?hl=en)
- Mindbody, "Gym Management Software"  
  [https://www.mindbodyonline.com/business/fitness/gym-software](https://www.mindbodyonline.com/business/fitness/gym-software)
- Mindbody, "Client Experience"  
  [https://www.mindbodyonline.com/index.php/business/client-experience](https://www.mindbodyonline.com/index.php/business/client-experience)
- Mindbody, "Scheduling"  
  [https://www.mindbodyonline.com/business/scheduling](https://www.mindbodyonline.com/business/scheduling)
- Mindbody, "Multi-location Management"  
  [https://www.mindbodyonline.com/business/multi-location-management](https://www.mindbodyonline.com/business/multi-location-management)
- ABC Glofox, "An Overview of the Member App and Standalone App"  
  [https://support.glofox.com/hc/en-us/articles/360004974918-An-Overview-of-the-Member-App-and-Standalone-App](https://support.glofox.com/hc/en-us/articles/360004974918-An-Overview-of-the-Member-App-and-Standalone-App)
- ABC Glofox, "Multi-Location Management Software"  
  [https://www.glofox.com/multi-location/](https://www.glofox.com/multi-location/)
- ABC Fitness, "ABC Advantage"  
  [https://abcfitness.com/abc-advantage/](https://abcfitness.com/abc-advantage/)

## Notes On Interpretation

Some recommendations above are direct product inferences from those sources rather than explicit instructions from any one vendor. The main inferred pattern is this:

- mature gym software separates centralized operational control from branch-level member-facing presentation
- member-facing content is structured, bookable, and brand-consistent
- reviews, media, and links are treated as managed business assets, not ad hoc text fields
