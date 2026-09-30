# Project Changelog

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
