# Project Changelog

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
