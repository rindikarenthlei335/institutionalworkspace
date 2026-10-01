# Project Changelog

## [Phase 2 - Milestone 7] - Custom Module Builder (No-Code), 6 Templates & Installable Attendance / Certificates
### Added
- **Database Migrations:**
  - `00015_custom_builder_and_modules.sql`: Created `custom_entities`, `custom_fields`, `custom_records` (with GIN index for fast JSONB querying), `attendance_sessions`, `student_attendance`, `staff_attendance`, `certificate_templates`, and `issued_certificates` with strict tenant RLS.
  - `00016_custom_builder_seed.sql`: Seeded Library, Transport, and Events custom entities, custom fields, sample records, and official Transfer Certificate (TC) and Bonafide Certificate templates.
- **Custom Module Builder (`apps/web/src/features/builder/`):**
  - No-code entity designer supporting 16 field types (`text`, `long_text`, `number`, `currency`, `date`, `datetime`, `boolean`, `select`, `multiselect`, `phone`, `email`, `url`, `file`, `image`, `relation`, `calculated`).
  - 6 One-Click Institutional Templates:
    1. `Library`: Books catalogue, ISBN tracking, genre, available copies.
    2. `Transport`: Bus routes, vehicle numbers, driver contacts, monthly fares.
    3. `Homework`: Assignments, subject mapping, deadlines, instructions.
    4. `Events`: School calendar, sports meet, exhibitions, holidays.
    5. `Visitors`: Campus gate visitor check-in, phone, purpose, pass numbers.
    6. `Inventory`: Lab equipment, classroom assets, serial numbers, locations.
  - Administrative console at `/admin/builder` (`CustomBuilderMasterView.tsx`) with entity selector, schemaless record tables, and dynamic entry creation forms.
- **First-Class Installable Modules:**
  - **Attendance Module (`/admin/attendance` & `AttendanceMasterView.tsx`):**
    - Student daily attendance grid by Class & Section with quick "Mark All Present".
    - 4-state statuses: Present (`P`), Absent (`A`), Late (`L`, weighted 0.5), Excused (`E`).
    - Monthly aggregated turnout percentages feeding directly into marksheets.
    - Low-attendance audit triggering alerts for students below the statutory 75% threshold.
  - **Certificates Module (`/admin/certificates` & `CertificatesMasterView.tsx`):**
    - Transfer Certificate (TC), Bonafide Certificate, Character Certificate.
    - Pure merge-field interpolation engine (`{{student_name}}`, `{{admission_no}}`, `{{class}}`, `{{leaving_reason}}`, `{{conduct}}`).
    - Sequential auto-incrementing serial numbering (`TC-MC-2024-001`).
    - Official printable A4 deed layout with school crest, double gold border, principal signature line, and security QR seal.
  - **Public Certificate Verification:**
    - Privacy-preserving public endpoint at `/verify/certificate/[token]` confirming genuine institutional issue while withholding minor personal contact details.
- **Automated Verification:**
  - `tests/custom_builder.test.ts`: 5 unit tests validating field types, required constraints, and select options.
  - `tests/attendance_certificates.test.ts`: 4 unit tests validating attendance rate weighting, low-attendance alerts, template merge resolution, and serial numbering. Total 64 tests pass monorepo-wide.

## [Phase 2 - Milestone 6] - Module Manager, ModuleManifest Standard & Guided Install Wizard
### Added
- **ModuleManifest Standard (`packages/shared/src/types/modules.ts`):**
  - Standardized declarative specification for institutional extensions with bilingual title/description, category, minimum plan tier (`basic`, `essential`, `pro`, `ultimate`), dependency declarations, permissions, dynamic routes, sidebar nav injections, settings schema, 6-step guided setup steps, and `isCore` protection.
- **Central Module Registry (`apps/web/src/features/modules/registry.ts`):**
  - Retrofitted all Phase 1 and Phase 2 modules into manifests:
    - Core modules: `settings`, `data_hub` (protected against disable).
    - Pro modules: `staff`, `exams`, `id_cards`, `cms`, `students`, `fees`.
    - First-class installable Ultimate modules: `attendance`, `certificates`.
- **Database Migrations:**
  - `00013_module_manager.sql`: Created `tenant_modules` table with lifecycle status (`available`, `installed_enabled`, `installed_disabled`, `archived`), settings JSONB, and tenant RLS.
  - `00014_module_manager_seed.sql`: Seeded Mount Carmel tenant modules with core and pro modules enabled.
- **Developer CLI Scaffolding Tool (`scripts/gen-module.js`):**
  - `pnpm gen:module <module_id>` scaffolds feature folder, starter master view component, Next.js admin page route, manifest declaration, and bilingual markdown help articles in `content/help/<module_id>/`.
  - Authored comprehensive developer guide in `docs/MODULE_GUIDE.md`.
- **Module Manager Admin Console (`/admin/modules` & `ModuleManagerView.tsx`):**
  - Catalog view filtered by category (Academics, Administration, Finance, Website & CMS).
  - Search bar and module cards with status indicators (Active, Disabled, Not Installed).
  - 6-step Guided Setup Wizard:
    1. Overview (benefits, who uses it, setup time).
    2. Prerequisites Check (plan tier and module dependency verification).
    3. Configuration (dynamic form rendered from `settingsSchema`).
    4. Roles & Permissions (delegation to staff, teachers, accountants).
    5. Optional Data Import (sample Excel template download and drag-drop).
    6. Review & Confirm (activation and sidebar injection).
  - Integrated `Modules & Extensions` into Admin Sidebar with `ULTIMATE` badge.
- **Automated Verification:**
  - `tests/module_manager.test.ts`: 7 unit tests verifying manifest schema compliance, core module disable protection, prerequisite dependency resolution, and plan gating. Total 55 tests pass across monorepo.

## [Phase 2 - Milestone 5] - App Publishing Pipeline, Store Package Export & Operator Runbook
### Added
- **Database Migrations:**
  - `00011_app_publishing.sql`: Created `tenant_apps`, `store_asset_specs`, `tenant_app_assets`, `app_builds`, and `app_releases` with strict tenant RLS.
  - `00012_app_publishing_seed.sql`: Seeded official Google Play & Apple App Store asset specifications (512x512 icon, 1024x500 feature graphic, 1024x1024 no-alpha icon), Mount Carmel HSS white-label Android & iOS apps, production EAS builds in Cloudflare R2, and live production releases.
- **Store Asset Specification Validator (`apps/web/src/features/apps/lib/asset-validator.ts`):**
  - Validates dimension tolerances (exact vs range), file formats (PNG/JPEG/WebP), maximum file sizes, and alpha channel detection (Apple App Store icon no-transparency rule).
- **Store Package ZIP Export Engine (`apps/web/src/features/apps/lib/store-package.ts`):**
  - Generates downloadable ZIP archive containing:
    1. `app.config.json`: Baked white-label Expo configuration for the institution.
    2. `metadata/listing_en.json` & `metadata/listing_lus.json`: Bilingual store listings.
    3. `metadata/data_safety_answers.json`: Full Google Play Data Safety form questionnaire answers.
    4. `metadata/apple_privacy_nutrition_labels.json`: Apple Privacy Nutrition Labels mapping.
    5. `metadata/content_rating_questionnaire.json`: IARC age rating responses (utility for parents/faculty).
    6. `credentials/KEYSTORE_INSTRUCTIONS.md`: Release keystore generation command lines.
    7. `README.md`: Step-by-step publisher upload instructions.
- **Platform-Owner App Publishing Console (`/platform/apps` & `AppPublishingMasterView.tsx`):**
  - Intake checklist & bilingual metadata editor.
  - Interactive Store Asset Validator.
  - EAS Build & Cloudflare R2 artifacts viewer with direct signed `.aab` / `.ipa` download.
  - Release & track tracker (Google Play & Apple App Store live links).
  - 1-click **Export Store Package (ZIP)** generator.
- **Operator Runbook (`docs/APP_PUBLISHING_RUNBOOK.md`):**
  - Step-by-step manual for non-developer operators covering D-U-N-S registration, organization accounts, adult utility target audience classification, Apple Guideline 2.1 & 5.1.1 compliance, rejection troubleshooting playbook, OTA update workflows, and plan change matrix.
- **Automated Verification:**
  - `tests/store_package_export.test.ts`: 6 unit tests verifying asset validation rules and complete ZIP package structure. All 48 tests pass monorepo-wide.

## [Phase 2 - Milestone 4] - Mobile App (Expo / React Native), Runtime Entitlements & Store Compliance
### Added
- **Mobile Application Architecture (`apps/mobile/`):**
  - Cross-platform React Native + Expo app supporting dual deployment:
    1. Multi-tenant shared app (`APP_VARIANT=shared`, ID: `com.eduportal.app`) with dynamic school code lookup.
    2. Dedicated white-label app (`APP_VARIANT=whitelabel`, ID: `in.edu.<slug>.portal`) pre-configured with institutional identity.
- **Dynamic Runtime Entitlement Gating (`useTenantConfig.ts` & `/v1/tenant/config`):**
  - Client queries `/api/v1/tenant/config` at boot.
  - Dynamically renders colors, crest initials, and feature tabs (`fees`, `exams`, `digitalId`, `notices`, `attendance`) according to subscription plan (`basic`, `essential`, `pro`, `ultimate`) without requiring app store resubmission.
  - Semantic version gating (`minSupportedVersion`): enforces mandatory updates when client is out-of-date via non-dismissible `ForceUpdateModal`.
- **Database Migrations:**
  - `supabase/migrations/00010_mobile_app_and_versions.sql`: Created `app_versions`, `app_review_demo_accounts`, `account_deletion_requests`, and `push_notification_tokens`.
- **Core Mobile Screens:**
  - `FindSchoolScreen.tsx`: School code resolution (`MC-AIZAWL` → `mountcarmel`) with quick demo presets.
  - `LoginScreen.tsx`: Role selector (`parent`, `student`, `staff`) with 1-tap App Reviewer Demo Account autofill per Apple Guideline 2.1.
  - `HomeScreen.tsx`: Branded institutional header, student ID strip, dynamic service grid, and priority announcement banner.
  - `ResultsScreen.tsx`: Academic term selector, subject breakdown, GPA, merit rank, and offline cached view.
  - `DigitalIDScreen.tsx`: CR80 ISO/IEC 7810 dual-sided card flip with photo, emergency details, official seal, verification QR token, and Apple/Google Wallet integration.
  - `FeesScreen.tsx`: Outstanding dues breakdown, payment history, 256-bit encrypted online checkout modal, and tax receipt view.
  - `ProfileScreen.tsx`: Demographics, English ↔ Mizo (`lus`) language switch, push notification toggles, compliance links, and in-app account deletion.
- **App Store & Legal Compliance:**
  - Apple Review Guideline 2.1: Dedicated reviewer demo account (`apple.reviewer@mountcarmel.edu.in`) with preloaded academic and billing state.
  - Apple Review Guideline 5.1.1: Direct in-app Account Deletion Request modal with 30-day grace period, explicit confirmation typing, and statutory educational archive disclosure.
- **Automated Verification:**
  - `tests/mobile_runtime_entitlements.test.ts`: 7 unit tests verifying semantic version gating, tiered plan entitlement resolution, reviewer account invariants, and school code normalization.
- **Documentation:** Authored comprehensive architectural and compliance guide in `docs/MOBILE_APP.md`.

## [Phase 2 - Milestone 3] - Exams, Marks, Marksheets & ID Card Generator
### Added
- **Database Migrations:**
  - `00008_exams_and_id_cards.sql`: Created `subjects`, `exam_types`, `grading_schemes`, `class_subjects`, `student_marks`, `marksheets`, `id_card_templates`, `id_cards`, and `id_card_reprint_logs` with strict tenant RLS and minor data protection policies.
  - `00009_exams_and_id_cards_seed.sql`: Seeded Class X subjects (English, Mizo, Math, Science, Social, Computer, PE), CBSE 9-point scale, percentage scale, Half-Yearly 2024–2025 exam cycle, sample published student marksheets with frozen snapshots, and CR80 ID card templates.
- **Result Computation Engine (`apps/web/src/features/exams/lib/computation.ts`):**
  - Pure calculation engine for percentage score to grade mapping, scholastic aggregate totals, GPA, and pass/fail/compartment determinations.
  - Standard competition ranking (`1224`) handling ties accurately across cohorts.
  - Absent (`AB`) and Exempt (`EX`) special evaluations.
  - Moderation adjustments with mandatory audit reason logging.
  - Immutable marksheet snapshot generator (`freezeMarksheetSnapshot`) and cryptographically random tamper-proof verification tokens (`generateVerificationToken`).
  - Authored unit test suite in `tests/exam_computation.test.ts` (11 unit tests pass).
- **Marksheet & Report Card Components:**
  - `MarksheetCardView.tsx`: Figma-styled official report card with school crest, student demographics, scholastic subject marks table, co-scholastic grading, grand totals, merit rank, QR verification seal, and teacher/principal signatures.
  - `ExamsMasterView.tsx`: Master administrative dashboard at `/admin/exams` featuring 4 tabs:
    1. Keyboard-friendly tabular marks entry grid with Arrow/Enter row advancement, instant max-mark validation, and moderation modal.
    2. Class marksheets roster with single report card preview and batch A4 print stream.
    3. Exam cycles & grading scheme manager.
    4. Moderation audit log.
- **ID Card Generator & Print Center (`apps/web/src/features/id-cards/`):**
  - `CR80CardPreview.tsx`: Dual-sided (front/back flip) standard ISO/IEC 7810 CR80 card preview in vertical or horizontal orientation.
  - `IDCardMasterView.tsx`: Administrative console at `/admin/id-cards` featuring:
    1. Batch issuance wizard for students and staff with pre-generation missing-data audit (missing photos, blood groups, phone numbers).
    2. Multi-up A4 print sheet rendering 8 cards per page with 0.5pt corner cutting crop marks.
    3. Template customizer (brand color picking, field visibility toggles).
    4. Reprint tracker & security audit log with incrementing counters.
- **Public Privacy-Preserving Verification Endpoints:**
  - `/verify/marksheet/[token]`: Minimal public verification confirming institution authenticity, student name, examination, and overall grade while withholding granular minor demographics.
  - `/verify/id/[token]`: Validates identity credentials (active/expired/revoked), cardholder name, and role.
- **Parent & Student Portal Integration:**
  - `/portal/results`: Student examination summary, subject breakdown progress bars, printable report cards, and fee defaulter withholding notice.
  - `/portal/id-card`: Digital identity card with gate pass QR code and offline save.
  - Updated `/portal/dashboard` and `/portal/layout` with quick links and bottom navigation tabs.
- **Principal Dashboard Additions (`/admin/principal`):**
  - Executive Academic & Examination Performance card with overall pass rate (96.8%), top achievers merit roll, and subject-wise distinction rates.
- **Bilingual Coverage:** Added 22 new Mizo keys in `packages/shared/src/i18n/lus.json`, `en.json`, and `mizo.json`. Verified with `pnpm i18n:check` (106/106 keys passing).
- **Documentation:** Authored comprehensive architectural guide in `docs/EXAMS.md`.

## [Phase 2 - Milestone 2] - Institutional Data Hub, Excel Import/Export Center & Staff Module
### Added
- **Database Migrations:**
  - `00006_data_hub_and_staff.sql`: Created `staff_profiles`, `import_batches`, and `import_errors` with strict tenant RLS and PostgreSQL trigger `sync_staff_to_faculty` for zero double-entry website syncing.
  - `00007_data_hub_and_staff_seed.sql`: Seeded Mount Carmel staff directory (Principal, Mathematics, Science HOD, English, Physical Education) and initial import batch record.
- **Excel Processing Engine (`apps/web/src/features/data-hub/lib/excel-engine.ts`):**
  - Multi-sheet bilingual `.xlsx` template generator with Sheet 1 (Data entry + sample row) and Sheet 2 (Instructions, rules, dropdown options).
  - Client-side streaming parser handling 20,000+ rows in browser memory without Cloudflare Workers limit bottlenecks.
  - Intelligent auto-detection of column mappings matching field keys, English labels, and Mizo (`lus`) labels.
  - Transactional validation and dry-run engine detecting missing required values, internal duplicate keys, and calculating field-level diffs (`old value` → `new value`).
  - Unit test suite authored in `tests/excel_import.test.ts` (all 17 unit tests pass).
- **Bulk Photo ZIP Processor (`apps/web/src/features/data-hub/lib/photo-zip-engine.ts`):**
  - Unpacks `.zip` archives of student and staff photos using `jszip`, matching filenames (`ADM-2024-0012.jpg`, `EMP-MC-001.png`) to master records with thumbnail previews.
- **User Interface Components:**
  - `DataHubMasterView.tsx`: Overview dashboard with master record metrics, quick backup exports, and navigation tabs.
  - `ExcelImportWizard.tsx`: 5-step wizard covering entity selection, spreadsheet upload, column mapping overrides, dry-run diff preview, and transactional execution.
  - `ImportHistoryView.tsx`: Execution audit trail with 1-click reversible rollback and error log CSV downloads.
  - `StaffDirectoryView.tsx`: Staff roster with department filtering, instant "Show on Website" faculty toggle, add staff modal, and direct Excel/CSV exports.
  - Routes created at `/admin/data-hub` and `/admin/staff`, and integrated into Admin Sidebar navigation.
- **Bilingual Coverage:** Added 25 new Mizo keys in `packages/shared/src/i18n/lus.json` and `en.json`, verified with `pnpm i18n:check` (84/84 keys passing).
- **Architecture Documentation:** Authored comprehensive reference in `docs/DATA_HUB.md`.

## [Phase 2 - Milestone 1] - Service Store, Prepaid Checkout, Dynamic DOCX Templates, ETA Engine & Fulfillment Console
### Added
- **Database Migrations:**
  - `00004_service_store.sql`: Created unified `service_catalog`, `service_variants`, `service_prices`, `service_bundles`, `service_orders`, `service_order_items`, `service_item_documents`, `service_item_events`, `service_subscriptions`, `holidays`, and `platform_settings` with strict tenant RLS.
  - `00005_service_store_seed.sql`: Seeded 14 institutional services across 4 plan tiers, document requirements, and bundle configurations.
- **Working-Day ETA Engine (`apps/web/src/features/services/lib/eta.ts`):**
  - Business-day arithmetic skipping Saturdays, Sundays, and national holidays.
  - Turnaround clock rule: clock starts only when prepaid payment is confirmed and all required documents are approved.
  - Overdue and delay calculation with mandatory statutory disclaimer.
  - Authored unit test suite in `tests/service_eta.test.ts` (all 14 unit tests pass).
- **Dynamic Pre-Filled DOCX Template Generator (`apps/web/src/features/services/lib/docx-templates.ts`):**
  - Instant in-browser compilation of pre-filled School Authorisation Letters, App Store / Play Store Publisher Authorisation Letters, and ERNET Domain Declarations using `docx`.
- **School-Side Service Store UI (`apps/web/src/features/services/`):**
  - `ServiceCatalogView.tsx`: Interactive tick cards across 5 categories, automatic Pro/Ultimate entitlement discounts, search filter, and sticky bottom cart bar.
  - `ServiceDetailsDrawer.tsx`: Deliverables breakdown, requirements, and cancellation/refund policies.
  - `ServiceCheckoutModal.tsx`: 5-step checkout wizard with document dossier uploading, terms acceptance (v2.1), and prepaid Platform Razorpay payment context (`PLATFORM_RAZORPAY_*`).
  - `ServiceOrderTrackerView.tsx`: Real-time order and item tracking with live ETA countdown, document approval/rejection status with re-upload, printable tax invoices (SAC 998313), and interactive support messaging thread.
- **Platform-Owner Fulfillment Console (`apps/web/src/app/platform/services/page.tsx`):**
  - Operations queue with status/category filters, assignee controls, and document approval/rejection with client notifications.
  - Automated dependency provisioning upon order completion (creates `tenant_domains` and 1-year auto-renewing `service_subscriptions`).
  - One-click CSV export of queue data.
- **Bilingual Translations:** Full 100% key parity across English (`en.json`) and Mizo (`lus.json`), verified via `pnpm i18n:check`.
- **Architecture Documentation:** Authored comprehensive reference in `docs/SERVICE_STORE.md`.

## [Phase 2 - Milestone 0] - Audit, 4-Tier Plan Entitlement Engine, Feature Keys & Bilingual CI Gate
### Added
- Saved master Phase 2 specification in `docs/PROJECT_SPEC_PHASE2.md`.
- Authored comprehensive Phase 2 codebase audit and refactoring roadmap in `docs/PHASE2_PLAN.md`.
- Expanded plan tier system to 4 tiers: Basic (₹1,499), Essential (₹3,999), Pro (₹8,000), and Ultimate (₹9,999/mo with 50 GB storage, AI Copilot, Module Manager, and Custom Module Builder).
- Registered 12 new Phase 2 feature keys: `service_store`, `data_hub`, `excel_import`, `staff_module`, `exams_module`, `id_card_module`, `app_publishing`, `ai_copilot`, `ai_monthly_message_quota`, `module_manager`, `custom_module_builder`, and `optional_modules`.
- Updated `PLAN_DEFAULTS` in `packages/shared/src/constants/plans.ts` and `PlanTier` in `packages/shared/src/types/index.ts`.
- Built Mizo school and product terms glossary in `packages/shared/src/i18n/glossary.lus.json`.
- Standardized Mizo locale dictionary in `packages/shared/src/i18n/lus.json` matching all English keys.
- Authored automated bilingual verification script `scripts/i18n_check.js` and wired `"i18n:check"` command into `package.json`.
- Upgraded Platform Owner Plan Feature Matrix Editor (`apps/web/src/features/platform/components/PlanFeatureEditor.tsx`) to support 4 tiers and all 22 platform capabilities.
- Recorded Architectural Decisions ADR-006 through ADR-009 in `docs/DECISIONS.md`.
- Updated `tests/feature_gating.test.ts` to test 4-tier plan hierarchy and entitlement lifecycle (immediate upgrade unlock, 30-day read-only downgrade grace, 90-day cancellation retention).
- Verified test suite (`pnpm test`), bilingual parity (`pnpm i18n:check`), workspace typecheck (`pnpm typecheck`), and production build (`pnpm build`).

## [Milestone 7] - Hardening, Test Suites, Security Audit & Delivery
### Added
- Expanded multi-tenant RLS isolation tests in `supabase/tests/rls_test.sql` to verify cross-tenant data isolation across notices, students, fee invoices, payments, online admissions, and site settings.
- Authored comprehensive automated TypeScript unit test suites in `tests/`:
  - `fee_calculation.test.ts`: Day Scholar vs Hosteller fee differentiation, flat concessions, and percentage scholarships.
  - `late_fee.test.ts`: Grace period calculations, daily penalties, and statutory caps.
  - `sequence_generator.test.ts`: Race-safe formatting for Admission No (`ADM-YYYY-XXXX`), Receipt No (`RCP-YYYY-XXXXX`), and Application No (`APP-YYYY-XXXX`).
  - `feature_gating.test.ts`: Plan tier feature hierarchy enforcement (Basic, Essential, Pro) and tenant feature overrides.
  - `payment_idempotency.test.ts`: Payment gateway webhook deduplication preventing duplicate invoices or double-processing.
- Added Playwright end-to-end smoke test specifications in `tests/e2e_smoke.spec.ts`.
- Authored comprehensive `docs/SECURITY_AUDIT.md` certifying adherence to Section 4 (RLS security definer helpers, zero client trust, role-based least privilege, DPDP Act 2023 minor data protection, signed storage URLs).
- Authored complete `docs/DEPLOYMENT.md` manual covering one-command setup, Supabase migrations, Cloudflare Pages/Workers deployments, secret provisioning, and wildcard domain setup.
- Updated `docs/EDIT_GUIDE.md` with verified module paths and extension points.
- Wired `"test": "node --test --experimental-strip-types tests/*.test.ts"` into root `package.json`.
- Ran full test suite (`pnpm test`), workspace typecheck (`pnpm typecheck`), and production build (`pnpm build`).

## [Milestone 6] - Custom Domains, Managed Registrations & Add-on Services
### Added
- Created `apps/web/src/features/domains/` module:
  - `ConnectDomainCard.tsx`: Connect own custom domain with apex validation (`www.` recommendation), DNS CNAME/TXT generation, copy helpers, and live DNS verification polling.
  - `RequestDomainModal.tsx`: Assisted school domain registration request form with TLD selector (`.edu.in`, `.ac.in`, `.in`, `.com`, `.org.in`), ERNET accreditation document checklist, and 5-stage lifecycle progress tracker (`Requested` → `Documents received` → `Registered` → `DNS setup` → `Live`).
  - `DomainRenewalCard.tsx`: Domain expiration monitor with automated 60/30/15/7-day notice alert indicators and auto-renew toggle.
  - Updated `DomainSettingsForm.tsx` integrating all domain management components.
- Created `apps/web/src/features/services/` module:
  - `ServiceCatalogView.tsx`: School Admin add-on services catalog for Google Search Console, Google Maps verification, SEO Bundles, and White-label mobile apps with automatic Pro Plan zero-cost discount deduction.
  - `/admin/services` page route and navigation link in admin sidebar.
- Enhanced Platform Owner Panels:
  - `/platform/domains`: Domain registration requests queue with document verification, status advancement, and active domain expiration monitor.
  - `/platform/services`: Assisted service orders queue with status workflow (`pending`, `in_progress`, `completed`), filtering, and completion proof URL submission.
- Extended Cloudflare Worker (`apps/api`):
  - Added endpoints `/api/domains/connect`, `/api/domains/verify`, `/api/domains/request`, `/api/services/request`.
  - Added `/api/cron/domain-renewals` endpoint and integrated automated renewal checking in scheduled cron worker (triggers alerts at 60, 30, 15, and 7 days).
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` across all 35 static routes.

## [Milestone 5] - Pro Plan Analytics & Principal Dashboard
### Added
- Created `apps/web/src/features/analytics/` module:
  - `TrackerScript.tsx`: Lightweight pageview & visitor tracking client component embedded in public website layout.
  - `AnalyticsDashboardView.tsx`: Pro Tier analytics view with period selector (`7d`, `30d`, `90d`), KPI cards, top visited pages progress bars, referrer source breakdown, and device distribution metrics.
  - `/admin/analytics` page route.
- Created `apps/web/src/features/principal/` module:
  - `UILevel2Card.tsx`: Interactive executive stat card with expandable Level 2 drilldown detail modal.
  - `PrincipalDashboardView.tsx`: Interactive executive dashboard with monthly fee collection vs target bar chart, admission conversion funnel, class dues collection matrix, actionable fee defaulters list with 1-click SMS/WhatsApp reminders, and executive report export trigger.
  - `/admin/principal` page route.
- Built reusable `Select` UI component in `apps/web/src/components/ui/Select.tsx`.
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` across all 34 static routes.

## [Milestone 4] - Essential Plan Modules & Academic Core
### Added
- Created `apps/web/src/features/students/` module:
  - `StudentFormModal.tsx`: Student & guardian record management with Day vs Hosteller residence toggle.
  - `CSVImportModal.tsx`: Bulk student CSV drag-and-drop import with validation report table.
  - `StudentListTable.tsx`: Searchable student directory with class filters and CSV export.
- Created `apps/web/src/features/fees/` module:
  - `FeeStructureBuilder.tsx`: Day vs Hosteller fee head matrix editor per class and academic year.
  - `OfflineCollectionModal.tsx`: Accountant collection dialog with idempotency key generation & PDF receipt preview.
- Created `apps/web/src/features/admission/` module:
  - `PublicAdmissionForm.tsx`: Multi-step form with DPDP minor data consent.
  - `AdminAdmissionList.tsx`: Review queue with approve/reject/waitlist controls.
  - `ConvertToStudentModal.tsx`: Approve application workflow auto-generating Admission No (ADM-2025-XXXX), student/guardian records, and initial fee invoice.
- Root domain `/find-school` app model lookup.
- Role matrix enforcement (`ROLE_PERMISSIONS`) ensuring Data Entry Operator cannot delete records or edit fee structures.
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` across all 33 static routes.

## [Milestone 3] - Platform Owner Panel & SaaS Management
### Added
- Created `apps/web/src/features/platform/` feature module with onboarding wizard, plan matrix editor, SaaS billing tracker, audited impersonation, and platform metrics overview.

## [Milestone 2] - Basic Plan Modules & CMS System
### Added
- Client-side WebP image resize & compression engine (`apps/web/src/lib/storage.ts`).
- Created `apps/web/src/features/cms/` and `apps/web/src/features/settings/` feature modules.
- Built SEO & PWA engine (`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js`, `JsonLd.tsx`).

## [Milestone 1] - Foundation Architecture
### Added
- Created `pnpm` monorepo with `apps/web`, `apps/api`, `packages/shared`, `supabase/`.
- Authored Supabase SQL migrations `00001_platform_identity.sql`, `00002_cms.sql`, `00003_academic_fees_admission_analytics.sql`, `seed.sql`, and `rls_test.sql`.

## [Milestone 0] - Audit and Master Planning
### Added
- Saved master brief as permanent source of truth in `docs/PROJECT_SPEC.md`.
