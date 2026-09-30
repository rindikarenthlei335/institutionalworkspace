# MASTER BRIEF: Multi-Tenant School / Institution Web + App Platform

You are a senior full-stack engineer and technical architect. Build a complete, production-grade, multi-tenant SaaS for schools and institutions, using the Figma export in this workspace as the visual source of truth.

**FIRST ACTION:** Save this entire brief as `docs/PROJECT_SPEC.md`. It is the permanent source of truth. I (the product owner) will later ask for edits and new features by referring to it, so every feature you build must be easy to locate, edit and extend (see section 3).

---

## 0. How to work

1. **Audit first (Milestone 0).** Before writing app code, inspect the Figma export folder. Identify: framework (React/Vite/Next/HTML/Tailwind/etc.), every screen and component, design tokens (colors, fonts, spacing, radii, shadows), assets, and any mock data. Write `docs/AUDIT.md` with: screen list, mapping of each screen to a route/module in this brief, missing screens (required by this brief but absent in the design), and risks.
2. **Never redesign.** Keep the Figma design pixel-close. Do not restyle it to your taste. Move the original export to `/design-export` (read-only reference) and rebuild it as clean components in the real app.
3. **Missing screens:** if this brief needs a screen the design does not have, build it using the same tokens and components, mark it `// TODO(design)`, and list it in `docs/DESIGN_GAPS.md`.
4. **Work in milestones** (section 12). After each milestone: run typecheck, lint and build; fix all errors; update docs; make a git commit. Continue automatically to the next milestone. Stop and ask me only when a secret, key or decision that only I can provide is missing.
5. **No fake completeness.** Every feature must work end to end (UI → validation → database → permissions → success/error states). No dead buttons, no hard-coded demo data in production code paths. Use `supabase/seed.sql` for demo data only.
6. **When something is ambiguous,** choose the most sensible default, continue, and record it in `docs/DECISIONS.md`.
7. **End of each milestone report (short):** what was built, how to test it, what I must provide.

---

## 1. Product overview

A SaaS platform sold to schools and institutions on 3 monthly plans. **One codebase, one backend, one database, many schools (multi-tenant).** Each school gets its own website, admin panel, and (on higher plans) app features.

### Plans (feature-flag driven, never hard-coded)

| | Basic ₹1499/mo | Essential ₹3999/mo | Pro ₹8000/mo |
|---|---|---|---|
| Public website (6 modules) | Yes | Yes | Yes |
| Logo upload, theme select | Yes | Yes | Yes |
| Admin panel to edit all content and images | Yes (single admin) | Yes | Yes |
| Roles: Super Admin, Admin, Data Entry Operator, Accountant | No | Yes | Yes |
| Student management | No | Yes | Yes |
| Fee payment (Day and Hosteller separate), receipts | No | Yes | Yes |
| Online admission + admission fee payment | No | Yes | Yes |
| Mobile app / PWA (parent + student portal) | PWA site only | Yes | Yes |
| Website analytics | No | No | Yes |
| Principal dashboard (student stats, fee stats: monthly / yearly / due) | No | No | Yes |
| UI level | Basic | Level 1 | Level 2 |
| Storage limit | 2 GB | 5 GB | 20 GB |

Plans, features, limits and add-ons live in the database (`plans`, `plan_features`, `addons`, `tenant_feature_overrides`). Gating happens in **three places**: UI (hide/lock with upgrade prompt), API/server (reject), and RLS/RPC where relevant. I must be able to change any plan's features without a code deploy.

### Free / paid extras (build the tracking and workflow, not external integrations)
- **Subdomain** `school.ROOT_DOMAIN`: free for every tenant, automatic.
- **Own domain connect** (e.g. `www.mtcarmelschool.com`): free, all plans, via Cloudflare for SaaS custom hostnames.
- **Domain register service:** school requests a domain; we register manually. Workflow, documents, status, renewal tracking (section 8.5).
- **SEO:** Basic SEO automatic for all. Paid manual services tracked as service requests: *Google Submit* (Search Console + sitemap, ₹1000, free on Pro) and *Google Maps register/claim* (₹500, free on Pro), bundle ₹1200.
- **White-label app:** tracked as a service request (later).
- **Add-on placeholders (feature-flagged "Coming soon", nav entry only):** SMS/WhatsApp reminders, attendance, exam results/report card, transport and hostel management, certificates/ID card, extra storage.

---

## 2. Technology (fixed, do not substitute without recording in DECISIONS.md)

- **Monorepo** (pnpm workspaces):
  - `apps/web`: **Next.js (App Router) + TypeScript (strict) + Tailwind**. Contains public school website, school admin panel, parent/student portal, and platform-owner panel. Public pages must be **SSR/SSG for SEO**.
  - `apps/api`: **Cloudflare Worker with Hono** for privileged/server-only work: payment webhooks, R2 upload signing, Cloudflare for SaaS API, tracking endpoint, cron jobs, PDF receipts, email.
  - `packages/shared`: shared types, zod schemas, constants (feature keys, roles, plan defaults).
  - `apps/mobile`: **reserved only** (Expo/React Native later). Do not build now, but keep shared logic in `packages/shared` and use Supabase directly where possible so it can be reused.
  - `supabase/`: migrations, seed, RLS tests, config.
- **Database / Auth:** **Supabase (Postgres + Auth + RLS)**. Use `@supabase/ssr` in Next.js. Migrations via Supabase CLI (`supabase/migrations/*.sql`). If you cannot run migrations yourself, give me the exact commands.
- **Hosting:** Cloudflare (Workers/Pages) using the current recommended Next.js adapter (`@opennextjs/cloudflare`; verify against current Cloudflare docs, and record any fallback). Cloudflare DNS wildcard `*.ROOT_DOMAIN`.
- **File storage:** **Cloudflare R2** (public images via CDN/custom bucket domain; private bucket for documents/receipts using signed URLs). R2 is not connected yet: build behind a `StorageProvider` interface and run in mock/local mode until keys exist.
- **Payments:** Razorpay behind a `PaymentProvider` interface (Cashfree/PayU replaceable). Use **Razorpay Route / split settlement** so fee money goes to the school's linked account. Run in mock/test mode until keys exist.
- **Email:** `Mailer` interface (Resend recommended), mock until key exists.
- **Bot protection:** Cloudflare Turnstile on public forms (admission, contact).
- **Cron:** Cloudflare Cron Triggers (domain expiry reminders, fee due reminders stubs, storage usage recalculation).
- **PDF (receipts, admission acknowledgement):** a Workers-compatible approach (e.g. `pdf-lib`). Verify it runs on Workers.
- **i18n:** English default plus Mizo, Hindi, Bengali structure. All UI strings come from dictionaries, never hard-coded. Ship English and a Mizo skeleton.
- **Locale defaults:** currency INR (₹), timezone Asia/Kolkata, dates DD/MM/YYYY, academic year April to March.

### Supabase connection (already created, use immediately)

```env
# apps/web/.env.local  (and Worker vars where needed)
NEXT_PUBLIC_SUPABASE_URL=https://wxspzgzrzichefggbbic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c3B6Z3pyemljaGVmZ2diYmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc5MjQsImV4cCI6MjEwNjM1MzkyNH0.ur2rmSNqv_qQgcSTsDbWyrODuJp9fnDz-05eQgcoLKg
NEXT_PUBLIC_APP_NAME=EduPortal          # placeholder, configurable
NEXT_PUBLIC_ROOT_DOMAIN=eduportal.com    # placeholder, configurable
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Server-only secrets (placeholders in `.env.example`, **never committed, never in client bundles**): `SUPABASE_SERVICE_ROLE_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_PUBLIC`, `R2_BUCKET_PRIVATE`, `R2_PUBLIC_BASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`. Do not ask me to paste any of these in chat. Document in `docs/ENV.md` where each goes (`.env.local` vs `wrangler secret put`). The anon key is public by design and safe **only because RLS is enforced everywhere**.

---

## 3. Architecture rules: make editing and adding features easy

I will edit and add features later, so structure for it:

1. **Feature folders:** `apps/web/src/features/<feature>/` each with `components/`, `actions/` (server actions), `queries/`, `schema.ts` (zod), `types.ts`, and a 5-line `README.md` (what it does, routes, tables, permissions, how to extend). Routes in `app/` stay thin and only compose feature components.
2. **Registries (config-driven):**
   - `src/config/features.ts`: every feature key, label, description, default plan availability.
   - `src/config/plans.ts`: plan defaults mirrored from DB seed.
   - `src/config/nav.ts`: navigation for public site, admin, portal, platform; each item declares required feature flag and role. Adding a module = adding one entry plus one feature folder.
   - `src/config/roles.ts`: role/permission matrix.
   - `src/config/theme.ts`: theme presets.
3. **Edit markers:** put `// [EDIT-HERE: <topic>]` comments at the natural extension points (new module registration, new dashboard widget, new fee head type, new form field, new theme).
4. **Living docs (keep updated every milestone):**
   - `docs/FEATURES.md`: table of every feature: status (Done / Partial / Stub), plan, roles, routes, tables, file paths.
   - `docs/EDIT_GUIDE.md`: "If you want to change X, edit these files" for common changes (change a page layout, add a field to admission form, add a dashboard widget, add a fee head, change a plan's features, add a theme, add a language, add a new module, change email/receipt template).
   - `docs/ARCHITECTURE.md`, `docs/DATABASE.md` (tables, relations, RLS summary), `docs/ENV.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`, `docs/AUDIT.md`, `docs/DESIGN_GAPS.md`.
5. **No duplication:** shared UI in `src/components/ui`; data access only in `queries/` and `actions/`; no Supabase calls inside presentational components.
6. **TypeScript strict, zod validation on every input (client and server), generated Supabase types** (`supabase gen types`), ESLint + Prettier, absolute imports.

---

## 4. Multi-tenancy, auth and security

### 4.1 Tenant resolution
- Every request resolves tenant from the **Host header** in Next.js middleware: `school.ROOT_DOMAIN` → `tenant_domains` (type `subdomain`) ; custom hostname → `tenant_domains` (type `custom`, status `active`). Cache the lookup (short TTL).
- Root domain / `platform.` host serves the marketing/landing (if in Figma), `/find-school` (enter school code or subdomain → redirect), and the platform-owner panel.
- **Reserved subdomains** blocked at registration: `www, admin, api, app, mail, platform, static, cdn, support, dashboard, login`. Validate `a-z0-9-`, 3-30 chars, unique.
- Local dev: support `school.localhost:3000` and a `?tenant=slug` dev override (disabled in production).
- Unknown host → friendly "school not found" page. Suspended tenant → "site unavailable" page. Expired custom domain → fall back to subdomain.

### 4.2 Data isolation (critical)
- Every tenant table has `tenant_id uuid not null references tenants(id)` and an index on it.
- **RLS enabled on every table.** Helper functions in a `private` schema (security definer, stable): `private.current_tenant_id()`, `private.current_role()`, `private.is_platform_owner()`, `private.has_feature(feature_key)`.
- Policy pattern: `tenant_id = (select private.current_tenant_id())` plus role checks; platform owner bypass via explicit policy, not via service role in the browser.
- **Never trust a `tenant_id` sent from the client.** Set it server-side or via `default private.current_tenant_id()` / trigger.
- Public website content: anon `select` allowed only on rows with `is_published = true` for active tenants. Sensitive tables (students, guardians, fees, payments, applications, documents, audit logs) have **no anon access**. Public submissions (admission, contact) go through the Worker with Turnstile and rate limiting.
- Write `supabase/tests/` SQL or script tests that prove **cross-tenant isolation** (school A can never read/write school B) for every table. Milestone is not done until they pass.

### 4.3 Auth and roles
Supabase Auth: email + password, magic link; phone OTP behind a flag (enable when an SMS provider is configured); **TOTP 2FA for admin roles**. `profiles(id → auth.users, tenant_id, role, full_name, phone, avatar_url, is_active)`.

Roles: `platform_owner` (us, tenant_id null), `school_super_admin` (principal/owner: everything incl. user management and settings), `school_admin`, `data_entry_operator` (create/edit data only, no delete, no fee settings), `accountant` (fees and payments), `teacher` (read-only lists for now), `parent`, `student`. Basic plan: single admin login (limit via `max_staff_users` feature). Provide a permission matrix in `config/roles.ts` and enforce it in server actions **and** RLS.

### 4.4 Security baseline
Rate limiting on public endpoints and login; file upload validation (mime, extension, size, magic bytes) and image re-encoding to WebP; signed URLs for private files; security headers/CSP; audit log (who changed/deleted what, when, old/new values) via triggers on sensitive tables; soft delete on students/fees; no secrets in client; input sanitisation for rich text; DPDP Act 2023 awareness (student data is minor data): privacy policy page per tenant, parent consent checkbox in admission, access restricted by role, data export and delete request flow for the school.

---

## 5. Database (design and create as migrations)

Design proper normalised tables, FKs, indexes, `created_at/updated_at/created_by`, enums, and RLS for all. Minimum set:

**Platform:** `plans`, `plan_features`, `addons`, `tenants` (name, subdomain, status, plan_id, billing_cycle, trial_ends_at, paid_till, subscription_status, default_locale, timezone), `tenant_addons`, `tenant_feature_overrides`, `tenant_domains` (hostname unique, type subdomain|custom, status pending|verifying|active|failed, cf_hostname_id, verified_at), `domain_requests` (+ `domain_request_documents`, `domain_request_events`: status Requested → Documents received → Registered → DNS setup → Live | Rejected; desired_domain, tld, registrar, registrant_name, expiry_date, renewal_status, paid_till, notes), `service_requests` (type: google_submit | maps_register | seo_other | white_label_app | other; status; price; notes), `platform_invoices` (SaaS billing tracking, manual mark-paid first), `audit_logs`, `file_objects` (tenant_id, key, bytes, mime, module, uploaded_by) for storage usage and quota.

**Identity:** `profiles`.

**Website CMS:** `site_settings` (logo, favicon, school name, tagline, affiliation/board, established year, theme preset, primary color, contact phone/email/address, map coordinates, social links, working hours, SEO title/description/OG image, default locale), `about_content` (mission, vision, objectives jsonb), `home_slides`, `achievements`, `activities`, `gallery_albums`, `gallery_images`, `faculty` (name, designation, qualification, subjects, experience, bio, photo, display_order, is_published, contact visibility flag), `facilities` (title, short description, images), `notices` (title, body, category, attachment, is_pinned, publish_at, expire_at, is_published), `contact_messages`. All content tables: `display_order`, `is_published`.

**Academic (Essential+):** `academic_years`, `classes`, `sections`, `students` (admission_no, roll_no, class, section, name, dob, gender, photo, residence_type `day|hosteller`, status, admission_date, address, blood_group, extra jsonb), `guardians` (linked to students, optional `user_id` for parent login), `student_documents`.

**Fees (Essential+):** `fee_heads`, `fee_structures` (academic_year × class × residence_type × fee_head × amount), `fee_schedules` (installments/due dates), `concessions` (type: concession | scholarship, value type flat|percent), `student_fee_assignments`, `late_fee_rules`, `invoices`, `invoice_items`, `payments` (mode online|cash|upi|cheque|dd, gateway_order_id, gateway_payment_id, status, **idempotency_key unique**, paid_at, collected_by), `receipts` (per-tenant, per-year sequential numbers, PDF key), `refunds`, `payment_gateway_accounts` (tenant linked account id, mode test|live).

**Admission (Essential+):** `admission_settings` (open/close dates, classes and seats, admission fee, required documents, configurable extra fields), `applications` (application_no, status: draft, submitted, payment_pending, under_review, approved, rejected, waitlisted, enrolled; data jsonb; applicant and guardian info; payment_id), `application_documents`, `application_status_history`.

**Analytics (Pro):** `site_events` (tenant_id, path, referrer, device, country, hashed visitor id with rotating salt, no PII), `site_stats_daily`; SQL views/RPCs for principal dashboard aggregates (student counts by class/gender/residence type/status, admissions trend, fee collected this month/year, total due, defaulters, collection by mode, month-wise trend).

Sequence generation must be race-safe (admission_no, receipt_no, application_no). Money stored as integer paise or `numeric(12,2)`, never float.

---

## 6. Public school website (all plans), tenant-branded

Routes (SSR/SSG, mobile-first, fast, low-bandwidth friendly, lazy-loaded WebP images):

1. **Home `/`:** hero/banner slides, achievements highlights, **gallery with auto-slide carousel**, **faculty gallery with quick biodata**, notices ticker, quick links (Admission, Pay Fee, Contact) shown only if the feature is enabled.
2. **Activities `/activities`:** achievements and activities list with images, filters, detail view.
3. **Faculty `/faculty`, `/faculty/[id]`:** photo grid, interactive card/modal with full biodata.
4. **Facilities `/facilities`:** photos with short descriptions.
5. **About `/about`:** mission, vision, objectives, contact, address, embedded map link, working hours, contact form (Turnstile).
6. **Notice board `/notices`, `/notices/[id]`:** pinned first, categories, search, attachments (PDF/image), publish/expire dates.
7. **Gallery `/gallery`:** albums and lightbox.
8. **Essential+:** `/admission` (info + apply + status tracking), `/pay-fee` (parent fee lookup and payment), `/login` (parent/student/staff).

Theme system: `theme_presets` (at least 8 from the Figma tokens), each defined as CSS variables; school picks preset + primary color override; dark mode optional. **SEO built in for every tenant:** per-page title/description (editable), `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph tags, `schema.org/School` JSON-LD, correct `hreflang` if multilingual. **PWA:** per-tenant `manifest.webmanifest` (school name, logo as icon, theme color), service worker with offline shell and cached notices, "Add to Home Screen" prompt.

## 7. School admin panel

- Dashboard (Basic: simple counts and recent activity; Essential/Pro: richer per UI level).
- **CMS for every public module** (create, edit, reorder, publish/unpublish, delete with confirm): slides, achievements, activities, gallery, faculty, facilities, about, notices, contact messages inbox.
- **Image handling:** client-side resize + WebP compression, upload via Worker-signed R2 URL, progress, crop where the design shows it, per-tenant path `tenants/{tenant_id}/{module}/{uuid}.webp`, quota check before upload, storage meter, orphan cleanup when content is deleted. Video = YouTube embed only (no video uploads).
- **Settings:** school profile, logo/favicon, theme, SEO fields, language, users and roles (Essential+), **Domain** page (see 8.5), storage usage, plan and add-ons view with upgrade prompts.
- Audit log viewer (Essential+).
- Every list: search, pagination, empty/loading/error states, bulk actions where sensible, unsaved-changes warning, toasts.

## 8. Essential plan modules

### 8.1 Students
Classes, sections, academic years; student CRUD with photo and documents; guardian links; **residence type Day / Hosteller**; CSV import with validation report and CSV export; filters; promote-to-next-class flow; student profile page with fee history. Data Entry Operator can add/edit but not delete.

### 8.2 Fees
Fee heads (tuition, admission, hostel, transport, exam, custom). **Separate fee structures for Day and Hosteller** per class per academic year. Installments with due dates, late-fee rules, concessions/scholarships, invoice generation (single and bulk per class), dues list and defaulters, **offline collection by Accountant** (cash/UPI/cheque/DD) and **online payment by parent** via `PaymentProvider`. Razorpay Route split settlement to the school's linked account; **verify webhook signatures, idempotent processing, reconcile on failure**; sequential receipt numbers; **PDF receipt generated automatically**, downloadable and emailable; refunds/adjustments with audit. Parent portal: see children, dues, pay, download receipts, payment history.

### 8.3 Online admission (public)
Multi-step form (student info → guardian info → class applying for → documents upload → declaration/consent → admission fee payment). Form fields configurable per tenant. Application number and acknowledgement PDF/email. Public status tracking (application no + phone/OTP or email). Admin side: applications list, filters, document review, notes, status changes with history, approve / reject / waitlist, **approve → convert into student record** (creates student + guardian, assigns class/section, generates admission no, creates fee invoice). Admission window and seat limits enforced. Turnstile + rate limit.

### 8.4 Portals / app
Parent/student portal (`/portal/*`) as installable PWA: notices, fee dues and payment, receipts, child profile. Root-domain `/find-school` for the shared-app model (enter school code → school). Push notifications: build the subscription model and settings only if time permits; mark as Stub otherwise.

### 8.5 Domain management (all plans)
School admin **Settings → Domain**: shows the free subdomain; "Connect my domain" form (validates hostname, recommends `www`) → creates a Cloudflare for SaaS custom hostname through the Worker (`apps/api`) → displays the exact CNAME and TXT records to add → "Verify" button polls status → Active. Statuses and error messages in plain language. Auto fallback to subdomain if custom hostname fails/expires. "Get a domain" request form (desired domain, type, school details, document uploads: recognition certificate, authorisation letter, address proof, ID proof; `.edu.in`/`.ac.in` show the extra document list) with a status timeline: Requested → Documents received → Registered → DNS setup → Live. Platform owner side: request queue, document review, status updates, registrar/expiry/renewal tracking, and **cron reminders at 60/30/15/7 days** before expiry (email now, SMS/app later), grace-period handling. All Cloudflare calls in a `DomainProvider` interface with a mock until credentials exist.

## 9. Pro plan modules

- **Website analytics:** privacy-friendly first-party tracking (`/api/track` on the Worker; no cookies, no PII): visitors, page views, top pages, referrers, devices, date-range filter, charts. Optionally surface Cloudflare Web Analytics.
- **Principal dashboard:** student stats (total, by class, gender, day vs hosteller, new admissions trend), fee stats (collected this month, this year, **total due**, collection by mode, month-wise trend, class-wise due, defaulters top list), admission funnel. Date/academic-year filters, CSV/PDF export. Charts follow the Figma **UI level 2** design.
- **UI level** flag (`1` vs `2`) switches richer component variants (dashboards, cards, motion) per the Figma designs.

## 10. Platform owner panel (us)

Tenants list and detail; onboarding wizard (school info, subdomain check, plan, first admin invite); suspend/resume; plan change and per-tenant feature overrides; add-ons; SaaS billing tracker (invoices, paid_till, manual mark-paid; Razorpay subscriptions later); trial management; domain request queue and renewal tracker (8.5); service requests queue (Google Submit, Maps register, SEO, white-label); storage usage per tenant; platform analytics (tenants by plan, MRR estimate, signups); **audited impersonation** ("view as school admin", every session logged); platform audit log; plan/feature/add-on editor UI.

## 11. Quality bars

- Every screen: loading, empty, error, and permission-denied states; responsive from 360px; keyboard accessible; sufficient contrast; alt text.
- Performance: images WebP with width/height, `next/image` or equivalent, lazy loading, route-level code splitting, target Lighthouse mobile 90+ on public pages.
- Errors: user-friendly messages; Sentry hooks prepared (DSN via env).
- Tests: RLS isolation tests (mandatory), unit tests for fee calculation, late fee, sequence generation, feature gating, payment webhook idempotency; a few Playwright smoke tests for the main flows (public site loads per tenant, admin login, add notice, admission submit, fee collection).
- `supabase/seed.sql` (dev only): 2 demo tenants (Mount Carmel School on Pro, St Mary's School on Basic) with realistic content, users for each role, sample students, fees and applications, so every screen can be tested. Provide the demo logins in `docs/README.md`.
- README: one-command local setup, how to run migrations, how to deploy to Cloudflare, how to add env secrets.

## 12. Milestones (execute in order)

- **M0 Audit and plan:** save this brief, audit the Figma export, `AUDIT.md`, `DESIGN_GAPS.md`, implementation plan.
- **M1 Foundation:** monorepo, env, design tokens and UI kit from Figma, migrations for platform + identity + RLS helpers, auth (email, magic link, 2FA), tenant resolution middleware, feature-flag engine, theme system, i18n skeleton, layouts, docs skeleton, seed (2 tenants), RLS isolation tests.
- **M2 Basic plan:** all 6 public modules + gallery + SEO + PWA + admin CMS for each + R2 storage layer with compression and quota + settings + notices. Fully working end to end.
- **M3 Platform owner panel:** tenants, plans/features editor, onboarding, subdomain provisioning, billing tracker, impersonation.
- **M4 Essential plan:** roles/permissions, students, fee structures, invoices, offline + online payments, receipts, admission (public + admin + convert to student), parent/student portal PWA, audit log viewer.
- **M5 Pro plan:** analytics pipeline and dashboard, principal dashboard, UI level 2 variants.
- **M6 Domains and services:** custom domain connect flow, domain request tracker, renewal cron and reminders, service requests (Google Submit, Maps).
- **M7 Hardening:** security review against section 4, performance pass, full tests, docs completed (`FEATURES.md`, `EDIT_GUIDE.md` verified against the real file paths), deployment guide.

## 13. What I will provide later (build with mocks until then)

Cloudflare R2 credentials, Cloudflare API token and zone, Razorpay keys, Resend key, Turnstile keys, final app name and root domain. When you reach a point that needs one, keep building against the mock provider, list it under "Needs from me" in your milestone report, and tell me exactly which env var to set and where.

## 14. Definition of done for the whole project

A school can be onboarded from the platform panel, gets a working branded site on its subdomain, edits all content and images from the admin panel, and (on Essential/Pro) manages students, collects Day/Hosteller fees online and offline with receipts, receives online admissions with fee payment, and (on Pro) sees analytics and the principal dashboard. Plans change without deploys, one school can never see another's data (proved by tests), and I can find where to edit anything from `docs/EDIT_GUIDE.md`.

**Begin with Milestone 0 now.**
