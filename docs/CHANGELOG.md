# Project Changelog

## [Milestone 3] - Platform Owner Panel & SaaS Management
### Added
- Created `apps/web/src/features/platform/` feature module for SaaS management:
  - `TenantOnboardingWizard.tsx`: Multi-step onboarding modal (school info, subdomain validation, plan selection, initial super admin invite).
  - `AuditedImpersonationModal.tsx`: Audited admin impersonation workflow with security compliance warning dialog and audit logging.
  - `PlanFeatureEditor.tsx`: Interactive SaaS plans & feature matrix editor for toggling feature keys across plans without code deploys.
  - `SaaSBillingTracker.tsx`: SaaS recurring billing tracker, subscription `paid_till` manager, and manual mark-paid action.
  - `PlatformMetricsOverview.tsx`: Stat cards for total active tenants, MRR estimate (₹9,499/mo), platform storage used, and SSL hostnames.
- Platform Routes (`/platform/tenants`, `/platform/plans`, `/platform/billing`, `/platform/domains`, `/platform/services`).
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` across all 32 static routes.

## [Milestone 2] - Basic Plan Modules & CMS System
### Added
- Client-side WebP image resize & compression engine (`apps/web/src/lib/storage.ts`).
- Created `apps/web/src/features/cms/` feature module for all 6 public website modules.
- Created `apps/web/src/features/settings/` feature module with storage meter, theme selector, and domain settings.
- Built SEO & PWA engine (`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js`, `JsonLd.tsx`).

## [Milestone 1] - Foundation Architecture
### Added
- Created `pnpm` monorepo with `apps/web`, `apps/api`, `packages/shared`, `supabase/`.
- Rebuilt shared UI Kit (`Button`, `Badge`, `Card`, `Input`, `StatCard`, `Skeleton`, `LockedFeature`).
- Authored Supabase SQL migrations `00001_platform_identity.sql`, `00002_cms.sql`, `00003_academic_fees_admission_analytics.sql`, `seed.sql`, and `rls_test.sql`.

## [Milestone 0] - Audit and Master Planning
### Added
- Saved master brief as permanent source of truth in `docs/PROJECT_SPEC.md`.
