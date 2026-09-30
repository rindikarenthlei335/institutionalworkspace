# PHASE 2 BRIEF: Service Store, App Publishing, Pro Modules, Ultimate Plan

This brief extends the existing project. Phase 1 (docs/PROJECT_SPEC.md) is built and is the base. Do not rewrite or break it. Everything here is additive: new migrations, new feature folders, new registry entries.

FIRST ACTION: save this file as docs/PROJECT_SPEC_PHASE2.md. Then read, in this order: docs/PROJECT_SPEC.md, docs/FEATURES.md, docs/ARCHITECTURE.md, docs/EDIT_GUIDE.md, docs/DECISIONS.md, and the current codebase. Where Phase 2 conflicts with Phase 1, Phase 2 wins; record every such change in docs/DECISIONS.md.

---

## 0. How to work
- **P2-M0 (audit):** compare the real codebase against Phase 1 docs. Write docs/PHASE2_PLAN.md: what exists, what is partial or broken, what must be refactored so Phase 2 fits (for example, hard-coded plan checks, tables to reconcile). Fix Phase 1 gaps that block Phase 2. Then continue automatically.
- Follow all Phase 1 architecture rules: feature folders, registries (features.ts, nav.ts, roles.ts, plans.ts), [EDIT-HERE] markers, zod on all input, RLS on every table with cross-tenant isolation tests, audit logging, empty/loading/error/permission states, mobile-first, WebP images.
- **Design:** keep using the Figma export and its tokens. New screens without a design: build with the same tokens/components and log them in docs/DESIGN_GAPS.md.
- **Bilingual from day one:** every new string exists in English (en) and Mizo (lus). No hard-coded strings. Add a script `pnpm i18n:check` that fails when any en key lacks an lus value. Mizo drafts are acceptable; mark machine-drafted ones with a needs_review flag so I can review them.
- Work in milestones (section 10). After each: typecheck, lint, build, tests, update docs (FEATURES.md, EDIT_GUIDE.md, DATABASE.md), commit, short report (built / how to test / next / needs from me). Continue automatically; stop only for secrets or decisions only I can provide.
- Every price, duration, limit and plan rule in this brief is a seed default stored in the database and editable from the platform panel, never hard-coded.

---

## 1. Plans (now four) and feature keys

Add a fourth plan. Names are placeholders stored in DB (Ultimate may be renamed).

| | Basic ₹1499 | Essential ₹3999 | Pro ₹8000 | Ultimate ₹9999 (per month) |
|---|---|---|---|---|
| Phase 1 features | as Phase 1 | as Phase 1 | as Phase 1 | as Phase 1 |
| Service Store (tick add-ons, prepaid checkout) | Yes | Yes | Yes | Yes |
| Free / discounted services | none | none | several free | more free |
| Data Hub + Excel Import/Export center | No | No | Yes | Yes |
| Staff and teacher information module | No | No | Yes | Yes |
| Exams, marks, marksheets (visible to parents/students) | No | No | Yes | Yes |
| ID card generator (students, staff) | No | No | Yes | Yes |
| App publishing to Play Store / App Store (paid service) | Yes | Yes | Yes (discount) | Yes (bigger discount) |
| AI Copilot (Mizo + English) | No | No | No | Yes |
| Module Manager (add / configure / disable modules) | No | No | No | Yes |
| Custom Module Builder (no-code) + module templates | No | No | No | Yes |
| Optional first-class modules (Attendance, Certificates) | No | No | No | Installable |
| UI level | Basic | Level 1 | Level 2 | Level 2 (+ AI dock) |
| Storage | 2 GB | 5 GB | 20 GB | 50 GB |
| Priority support | No | No | Yes | Yes |

New feature keys: `service_store`, `data_hub`, `excel_import`, `staff_module`, `exams_module`, `id_card_module`, `app_publishing`, `ai_copilot`, `ai_monthly_message_quota`, `module_manager`, `custom_module_builder`, `optional_modules`. Add them to plan_features, seed, config/features.ts, and the platform panel plan editor.

Plan change behaviour (upgrade / downgrade / cancel), driven only by entitlements:
- **Upgrade:** features unlock immediately, no redeploy, no store release.
- **Downgrade:** locked features become read-only with an upgrade banner for a grace period (default 30 days), then hidden. Data is never deleted on downgrade. Data retained at least 90 days after cancellation, then archived (school can request export any time).
- **Non-payment or suspension:** website shows a neutral "temporarily unavailable" page; apps show a friendly "service unavailable, contact your school" screen. No data deletion.
- All grace and retention periods are platform settings.

---

## 2. Service Store (tick add-ons, prepaid checkout)

Goal: any school on any plan can tick extra services, upload the documents each one needs, see how long it takes, and pay in advance at the end. Also available inside the platform onboarding/signup wizard so a new school can tick services while choosing a plan.

### 2.1 School-side UX
- Admin → Services & Add-ons page: catalog grouped by category, each service as a tick card showing: name, one-line benefit, price for the school's plan (with "Free with Pro" badge or strikethrough discounted price), estimated duration, documents needed, recurring cost if any. "Details" drawer explains what is delivered and what the school must do.
- Sticky cart summary (selected services, subtotal, discounts, tax if enabled, total). Bundles auto-apply (for example Google Presence Bundle).
- Checkout wizard: (1) review → (2) per-service form + document upload → (3) accept terms/refund policy (store acceptance with timestamp, IP hash, terms version) → (4) pay → (5) confirmation.
- Prepaid is mandatory by default (`platform_settings.require_prepayment = true`): work never starts before payment. Payment goes to the platform's own Razorpay account, separate from the school's Route/linked account used for student fees. Keep two clearly separate payment contexts and env vars (`PLATFORM_RAZORPAY_*`).
- Order tracking page per order and per item: status timeline, expected completion date, documents status (approved / rejected with reason and re-upload), "action needed from you" messages, invoice/receipt PDF, support message thread.
- Only `school_super_admin` can order and pay; other admins can view.
- Tax: optional GST configuration in platform settings (rate, GSTIN, HSN/SAC text on invoices). Default disabled until I configure it.

### 2.2 Documents (DOCX and others)
- Each service defines `required_documents`: key, label (en/lus), accepted types (docx, pdf, jpg, png), max MB, required or optional, conditional rules (for example .edu.in and .ac.in need recognition certificate + authorisation letter; .com needs ID proof only).
- Provide downloadable templates the school can fill: generate .docx on the fly with school details pre-filled (authorisation letter on letterhead placeholder, domain registrant declaration, Play/App Store publisher authorisation letter). Use a Workers/browser-compatible docx library.
- Upload: virus/type/size validation, private R2 bucket, signed URL access only for the school and platform staff.
- Platform reviewer can approve/reject each document with a reason; the school is notified and re-uploads.

### 2.3 Durations and status engine
- Each service has `eta_min_days`, `eta_max_days` (working days) and `eta_note`. Show as "Usually 3 to 5 working days after payment and complete documents".
- The clock starts only when both payment is confirmed and all required documents are approved. Compute `expected_from`/`expected_to` skipping non-working days (configurable working week and holiday table). Show countdown and "delayed" flag when past due.
- Item statuses: `awaiting_payment` → `awaiting_documents` → `documents_under_review` → `in_progress` → `awaiting_school_action` (for example enter postcard verification code, approve Google ownership request) → `completed` | `rejected` | `cancelled` | `refunded`. Every transition writes to an events timeline and sends an email (in-app notification too).
- Cancel/refund rules per service (configurable): full refund minus gateway fee before work starts; non-refundable once started; domain pass-through cost non-refundable once registered; if a registry rejects (for example .edu.in), refund the work fee minus a configurable verification fee. Show the rule at checkout.

### 2.4 Recurring items and renewals
- `service_subscriptions` for yearly/monthly items (domain renewal yearly = actual cost + admin fee, app maintenance yearly, extra storage monthly, AI credit packs). Renewal invoices are prepaid too. Cron reminders at 60/30/15/7 days before due (email now; SMS/WhatsApp interface stubbed). Grace period, then Phase 1 fallback rules (domain lapses → site falls back to subdomain). Register domain expiry dates from completed domain orders automatically.

### 2.5 Data model (unify with Phase 1)
Replace or migrate Phase 1 `domain_requests` / `service_requests` into this model (keep the platform queue UI working, migrate any existing rows): `service_catalog`, `service_variants` (for example TLD options with pass-through cost), `service_prices` (service × plan × variant → price / free / discount), `service_bundles`, `service_orders` (optionally with one plan-subscription line for signup), `service_order_items`, `service_item_documents`, `service_item_events`, `service_subscriptions`, `order_invoices` + PDF, `terms_acceptances`, `platform_settings`, `holidays`. RLS: school sees only its own; platform staff sees all. Sequences race-safe.

### 2.6 Seed catalog (all editable; prices in ₹, "actual" = registrar cost looked up or entered)
| Service | Basic / Essential | Pro | Ultimate | ETA (working days) |
|---|---|---|---|---|
| Own domain connect (school already owns it) | Free | Free | Free | 0 to 1 |
| Domain register .in / .com / .org (work fee) + first-year domain cost | 5000 + actual | 3000 + actual | 2000 + actual | 3 to 5 |
| Domain register .school | 5000 + actual | 3000 + actual | 2000 + actual | 3 to 5 |
| Domain register .edu.in / .ac.in (needs institution documents) | 5000 + actual | 3000 + actual | 2000 + actual | 7 to 15 |
| Domain renewal (yearly) | actual + 400 | actual + 400 | actual + 400 | reminder-driven |
| Google Submit (Search Console + sitemap) | 1000 | Free | Free | 3 to 14 to appear |
| Google Maps location register/claim | 500 | Free | Free | 5 to 14 (postcard) |
| Google Presence Bundle | 1200 | Free | Free | 5 to 14 |
| Android app publish to Play Store (setup) | 10000 | 7000 | 5000 | 7 to 21 |
| iOS app publish to App Store (setup) | 18000 | 13000 | 9000 | 7 to 21 |
| App yearly maintenance (store updates, OTA) | 4000/yr | 3000/yr | 2000/yr | n/a |
| Data migration help (Excel cleanup + import) | 3000 | 2000 | Free | 2 to 5 |
| Extra storage 10 GB | 200/mo | 200/mo | 200/mo | instant |
| AI credit pack (Ultimate) | n/a | n/a | priced by me | instant |

Always append: "Durations are estimates and depend on third parties (registries, Google, Apple) and on documents being complete. Rank, approval and review outcomes are not guaranteed."

### 2.7 Platform-owner fulfillment console
Queue of all order items with filters (service, status, overdue, tenant), assignee, checklists per service type, internal notes, document viewer/approver, "request more info" action, status changes with timeline, registrar/expiry fields, one-click "mark completed" that also updates dependent records (for example completing a domain order creates the tenant_domains entry and the renewal subscription; completing Play Store publish stores the listing URL). Revenue and pending-work summary. Bulk export to CSV.

---

## 3. App publishing pipeline (Play Store / App Store)

Two app models must both work from one mobile codebase (`apps/mobile`, Expo / React Native, built in this phase):
1. **Shared app ("EduPortal"):** user enters a school code or finds the school, then sees the school's branding and data. Included for Essential and above.
2. **White-label app:** the school's own name, icon, splash and package/bundle ID, published to the Play Store / App Store. Sold as the paid service in section 2.6.

### 3.1 App architecture requirements
- One codebase, tenant configuration via `app.config.ts` reading `APP_VARIANT` / `TENANT_SLUG`. White-label builds bake the tenant ID; shared app resolves it at runtime.
- **Runtime entitlement fetch:** at launch and every few hours the app calls `GET /v1/tenant/config` (branding, theme, enabled modules, plan features, status, min supported app version, force-update flag). Screens/modules for all features ship in every build and are shown or hidden by entitlements. Consequence: plan upgrades and downgrades never need a store release.
- Use native screens (not a website wrapper), because Apple can reject thin web wrappers. Do not implement in-app "buy plan" flows.
- Versioned API (`/v1`), supporting the current and previous two app versions; `app_versions` table (platform, version, build, min_supported, force_update, notes). OTA updates (expo-updates / EAS Update) for JS-only changes, with runtime-version gating. Native changes require a store release.
- App content for phase 2: school code / find school, login (parent, student, staff), home with notices, fee dues + payment (hosted checkout) + receipts, results/marksheets, digital ID card, profile, language switch (Mizo/English), push notification registration (token model; sending can remain a stub), in-app account deletion request (required by stores), privacy/terms links.
- A per-tenant App Review demo account with sample, non-real data for Apple/Google reviewers.

### 3.2 Data model
`tenant_apps` (tenant, platform android|ios, app_name, package_id / bundle_id, publisher_owner school|platform, store_account_email, listing jsonb: short/long description en+lus, category, keywords, support email/URL, privacy URL, terms URL, account-deletion URL), `store_asset_specs` (configurable size rules), `tenant_app_assets`, `app_builds` (version, build no, type aab|apk|ipa, status, artifact key in private R2, CI run id, log URL), `app_releases` (track internal|closed|production, status draft|submitted|in_review|rejected|approved|live|halted, dates, rejection reason, fix notes), `app_versions`. Store credentials (Play service-account JSON, App Store Connect API key) only in Supabase Vault / encrypted secrets, never plain columns, never logged.

### 3.3 Platform-owner "App Publishing" console (per tenant)
- Intake checklist pulled from the order: app name, short/long description (en/lus), category, contact email, support/privacy/terms/account-deletion URLs (auto-generated tenant pages), icon, splash, screenshots, feature graphic, developer account ownership choice (school-owned recommended; platform-owned allowed with a documented transfer path).
- Asset validator using `store_asset_specs` (seed with current requirements: Android icon 512×512 PNG, feature graphic 1024×500, phone screenshots; iOS icon 1024×1024 without alpha, required screenshot sizes; verify against current Google/Apple docs and make specs editable). Guide auto-generation of screenshots from the demo tenant where possible.
- Build: "Generate build" triggers CI (GitHub Actions workflow_dispatch or EAS Build; verify current EAS multi-app support and record the choice) with the tenant config; shows status/logs; stores AAB/IPA in private R2; per-tenant signing handled per Play App Signing / Apple certificates, documented.
- Export Store Package (ZIP), downloadable by platform staff: tenant app.config JSON, all icon/splash sizes, screenshots, feature graphic, listing text (en + lus), privacy/terms/deletion URLs, Data safety and privacy-label answer drafts, content-rating notes, release notes, keystore/credentials instructions, and a README with exact upload steps. This lets me publish manually with my own or the school's store account.
- Publish tracking: manual "mark submitted / in review / rejected / live" with store URL, or automated submit through a StorePublisher interface (Google Play Developer API, App Store Connect API / EAS Submit) when credentials exist; mock until then. Rejection log with reasons and fixes.
- Updates: version bump, changelog, OTA publish, force-update switch, staged rollout note.

### 3.4 Runbook (generate docs/APP_PUBLISHING_RUNBOOK.md, plain and step by step, for a non-developer operator)
Cover: choosing who owns the developer account; creating the Play Console (one-time fee, organisation vs personal account, D-U-N-S for organisations, the closed-testing requirement for new personal accounts) and Apple Developer account (annual fee, D-U-N-S for organisations); target-audience decision (parents/staff adults; avoid child-directed classification which triggers extra policies); privacy policy, Data safety form and Apple privacy labels; account-deletion requirement; reviewer demo account; Apple guideline risks (thin web-view apps, login-required apps need demo credentials); tracks (internal → closed → production); expected review times (show as ranges from service_catalog, note they vary); how to respond to a rejection; how to publish updates; plan change matrix (upgrade / downgrade / branding change / suspension / termination).

---

## 4. Pro plan modules

All modules: feature-flagged (pro+), role-checked in server actions and RLS, bilingual, audited, available in web and in the mobile app where the user is a parent/student/teacher. Each ships help articles (`content/help/<module>/*.md`, en + lus) for the AI Copilot and the help center.

### 4.1 Data Hub and Excel Import/Export Center (single source of truth)
- Data Hub = the master records the whole system reads from: students, guardians, staff/teachers, classes/sections/subjects, fee assignments, exam marks. ID cards, marksheets, fee invoices, website faculty pages and portal all read from here. No module keeps its own copy of these facts. Enter data by form or by Excel, interchangeably.
- Import Center (Admin → Data Hub → Import):
  - Pick entity (students, guardians, staff, subjects, class-subject mapping, marks, fee assignments, opening balances).
  - Download template .xlsx: correct headers, instructions sheet, sample row, dropdown validation (class, section, gender, residence type, status), en or lus header language.
  - Upload; parse in the browser (SheetJS/ExcelJS) in chunks to respect Workers limits; support 20,000+ rows.
  - Auto-detect and let the user adjust column mapping; save mapping presets.
  - Validation and preview with row-level errors, warnings and a diff: new / will update / unchanged / error. Duplicate detection (admission no; fuzzy name + DOB + guardian phone).
  - Modes: create only / update only / upsert (sync) by a unique key (admission_no, employee_id). Dry-run first, then confirm.
  - Apply in transactional batches through RPCs with progress; store every run as an import_batch with a downloadable result report (created/updated/skipped/errors) and undo last import for created rows and field-level rollback for updated rows.
  - Bulk photo upload by ZIP, matching filenames to admission_no / employee_id.
- Export any entity or filtered list to .xlsx / .csv (also full backup export). Data Entry Operators may import; destructive updates over a configurable threshold require Admin approval.

### 4.2 Staff and Teachers module
Staff master records: employee ID (auto or imported), name, photo, designation, department, employment type, qualification, experience, DOB, gender, joining date, contact, address, emergency contact, ID documents, subjects taught, classes assigned, class-teacher assignment, status. Sensitive fields (ID documents, personal contact) visible only to allowed roles. Create a teacher login from a staff record (invite). `show_on_website` toggle publishes selected staff to the public Faculty page and home faculty gallery so there is no double entry. Staff directory, filters, profile, staff ID card, Excel import/export, help articles.

### 4.3 Exams, Marks and Marksheets
- Setup: academic year; exam types (unit test, term, annual, custom) with weightage; class-wise subjects (max marks, pass marks, scholastic vs co-scholastic, optional); grading schemes as data (percentage bands to grade, grade points, GPA optional). Seed presets: generic percentage + grade, and a 9-point scale; fully editable.
- Marks entry: grid per class-section-subject exam, keyboard friendly, absent/exempt codes, max-mark validation, autosave, Excel import/export of the grid, teacher sees only assigned subjects, Data Entry Operator can enter, workflow draft → submitted → verified → published, lock/unlock with reason, moderation adjustment with audit.
- Result computation: totals, percentage, grade, rank (with tie handling), pass/fail, remarks, promotion decision, optional attendance % (if Attendance module installed). Recompute on change; store snapshots at publish so published marksheets never change silently.
- Marksheet / report card: templates matching the Figma design (school header, logo, photo, subject table, co-scholastic, remarks, signature images for class teacher and principal, QR). PDF generation single and bulk by class (queued in the Worker, stored in private R2, ZIP download), print-ready A4. Public verification page `/verify/marksheet/<token>` showing only minimal confirmation data.
- Visibility: parents and students see published results in the web portal and mobile app: exam list, marksheet view, PDF download, subject-wise performance chart, term-over-term trend. Optional setting "withhold results for fee defaulters" (default off, clearly warned). Push/email on publish.

### 4.4 ID Card generator
Templates (front/back) chosen from Figma-based presets with school colors/logo; fields from Data Hub (photo, name, class/section, admission no or employee ID, DOB, blood group, guardian phone, address, validity); QR/barcode resolving to `/verify/id/<token>` (minimal public data: name, school, valid/invalid). Single and bulk generation, CR80 card size and A4 multi-up print sheets, missing-photo and missing-field report before generation, reprint tracking, digital ID inside the mobile app. Students and staff.

---

## 5. Ultimate plan (₹9999 per month): the most capable tier

### 5.1 Module Manager
- Every function of the product is described by a `ModuleManifest` in code: id, name and description (en/lus), icon, category, min_plan, dependencies, permissions, routes, nav entries, settings schema, guided-setup steps, help articles, core flag, install/enable/disable/uninstall hooks. Retrofit all Phase 1 and Phase 2 modules into manifests.
- `tenant_modules` (tenant, module, status available | installed_enabled | installed_disabled | archived, settings jsonb, version, installed_by/at).
- Admin → Modules (Ultimate): catalog cards grouped by category with description, who uses it, preview, dependencies, data it creates, setup time.
- Add module launches a guided setup wizard: overview → prerequisites check → configuration → roles and permissions → optional Excel data import → preview → confirm. After install the module appears in the sidebar automatically.
- Core modules (settings, users, Module Manager, Data Hub) cannot be disabled; all others, including existing public-site sections and Fees, can be.
- Developer aid: `pnpm gen:module <id>` scaffolds a manifest + feature folder + help article stubs; write `docs/MODULE_GUIDE.md` explaining how to add a new first-class module step by step.

### 5.2 Custom Module Builder (no-code)
- Entity designer: name (en/lus), icon, fields with types: text, long text, number, currency, date, datetime, yes/no, single select, multi select, phone, email, URL, file, image, relation (to student, staff, class, or another custom entity), simple calculated field.
- Form designer, list views, detail page, bulk actions.
- Permissions per role and portal visibility.
- Storage: `custom_entities`, `custom_fields`, `custom_records` (tenant_id, entity_id, data jsonb, GIN index).
- Templates (one-click install): Library, Transport, Homework, Events and Calendar, Visitors log, Inventory.

### 5.3 First-class optional modules (installable via Module Manager)
- **Attendance:** student daily attendance, staff attendance, monthly reports, parent view, low-attendance alerts, feeds attendance % into marksheets.
- **Certificates:** Transfer Certificate, Bonafide, Character, custom templates with merge fields from Data Hub, numbering sequence, approval flow, PDF with QR verification.

### 5.4 AI Copilot (Mizo + English)
- Built-in assistant for school staff (and optionally parents behind flag `ai_parent_assistant`, default off).
- Where: floating dock on every admin page plus a full-page chat; language switch (English / Mizo).
- **Guide mode:** answers "how do I ...?" using help articles (`content/help/<module>/*.md`, en + lus) via Postgres full-text search `search_help` and returns deep links (`navigate`).
- **Data mode:** read-only tools that run with the user's session (RLS applies): `student_stats`, `fee_summary`, `list_defaulters`, `exam_results_summary`, `attendance_summary`, `search_students`.
- **Action mode:** only drafts with a confirm card (draft a notice, draft a circular, draft translation). Nothing applied without user pressing Apply. Audited.
- **General mode:** school-appropriate writing/summarising/translating assistant.
- Provider: `LLMProvider` interface implemented with Anthropic API through the Worker (`ANTHROPIC_API_KEY`). Models: `AI_MODEL_FAST` (claude-haiku-4-5-20251001), `AI_MODEL_SMART` (claude-sonnet-5-5). Mock provider until key exists.
- Mizo glossary in `packages/shared/i18n/glossary.lus.json`. 30-question evaluation set in `ai-evals/`.
- Quotas & governance: `ai_monthly_message_quota` (default 3000 for Ultimate), per-user rate limit, `ai_usage` table.

---

## 6. Language: full Mizo and English
- Public school website, admin panel, portals and mobile app all switchable between English and Mizo (lus).
- Translatable content stored with `translations jsonb` with English fallback.
- `pnpm i18n:check` script in CI; a `needs_review` list in the platform panel for Mizo reviews.

---

## 7. Security, privacy, compliance additions
- Results, IDs, and attendance are minor's data: strict RLS, verification pages reveal minimal data, signed URLs with short expiry.
- Service Store documents in private storage, access-logged.
- Separation of Platform payments vs School payments (separate Razorpay credentials).
- App store credentials in Vault only.
- Tests to add: RLS for every new table, unit tests for prices, ETAs, working-day calculations, refunds, imports, grades, rank, entitlements, module dependencies, AI permissions/quotas.

---

## 8. Documentation deliverables
Update `FEATURES.md`, `EDIT_GUIDE.md`, `DATABASE.md`, `ENV.md`, `DECISIONS.md`. New docs:
- `docs/SERVICE_STORE.md`
- `docs/IMPORT_GUIDE.md`
- `docs/MODULE_GUIDE.md`
- `docs/APP_PUBLISHING_RUNBOOK.md`
- `docs/AI_COPILOT.md`
- `docs/HELP_CONTENT_GUIDE.md`

---

## 9. Needs from me (build against mocks until provided)
`PLATFORM_RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`, Expo/EAS token and GitHub Actions secrets for builds, registrar reseller credentials, store developer credentials (through Vault), GST details, final Mizo review.

---

## 10. Milestones (execute in order)
- **P2-M0:** Audit, PHASE2_PLAN.md, fix Phase 1 gaps, 4-plan entitlement engine, new feature keys, plan-change behaviour.
- **P2-M1:** Service Store: catalog, prices, tick UI, checkout with documents and DOCX templates, platform payment context, order tracking, ETA engine, renewals and cron, fulfillment console, migration of Phase 1 domain/service requests, signup wizard with service ticking.
- **P2-M2:** Data Hub, Import Center (Excel templates, mapping, preview, upsert, undo, photo ZIP), export, Staff module, website faculty sync.
- **P2-M3:** Exams and Marksheets (setup, grading, marks entry, workflow, results, PDF, verification), parent/student web portal views, principal dashboard additions, ID card generator.
- **P2-M4:** Mobile app (Expo): shared app with school code, runtime entitlements, core portal screens, results, digital ID, fee payment, language switch, account deletion, demo reviewer account.
- **P2-M5:** App publishing: white-label config, versions and OTA, build pipeline, asset validator, Store Package export, platform console, Vault credentials, runbook.
- **P2-M6:** Module Manager: manifests for all modules, tenant_modules, catalog, guided setup wizard, enable/disable/remove, sidebar integration, gen:module scaffold, MODULE_GUIDE.md.
- **P2-M7:** Custom Module Builder, six templates, Attendance, Certificates.
- **P2-M8:** AI Copilot (guide, data, action, general modes), help KB in en + lus, translation assist, quotas, governance, evals.
- **P2-M9:** Full bilingual audit (i18n:check green), security review against sections 1 and 7, performance pass, full test suite, docs completed and verified against real file paths.

---

## 11. Definition of done
A school on any plan can tick services, upload documents, pay in advance and track fulfilment; platform owner can fulfil from one console; Pro schools manage students, staff, marks, and ID cards via forms or Excel; parents and students see published results; Ultimate schools configure and build modules without code and use bilingual AI Copilot. Plan changes never require a store release. Verified by tests.
