# Project Changelog

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
