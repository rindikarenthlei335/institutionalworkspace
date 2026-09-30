# Project Changelog

## [Milestone 2] - Basic Plan Modules & CMS System
### Added
- Client-side WebP image resize & compression engine (`apps/web/src/lib/storage.ts`).
- Created `apps/web/src/features/cms/` feature module for all 6 public website modules:
  - `CMSNoticeManager.tsx`: Create, edit, delete, pin, and categorize school notices.
  - `CMSFacultyManager.tsx`: Manage faculty profiles, designations, qualifications, experience.
  - `CMSFacilityManager.tsx`: Campus facilities management with image previews.
  - `CMSGalleryManager.tsx`: Gallery album creation & image lightbox viewer.
  - `CMSHomeSlideManager.tsx`: Homepage banner slide editor with CTA link mapping.
- Created `apps/web/src/features/settings/` feature module:
  - `SchoolProfileForm.tsx`: School profile & SEO parameters.
  - `ThemeSelector.tsx`: Interactive theme selector supporting 8 preset palettes.
  - `StorageMeter.tsx`: Tenant cloud storage usage tracking meter.
  - `DomainSettingsForm.tsx`: Subdomain status & custom hostname CNAME/TXT connection.
- SEO & PWA System:
  - Dynamic per-tenant sitemap generator (`/sitemap.xml`).
  - Per-tenant `robots.txt` generator (`/robots.txt`).
  - Dynamic PWA Webmanifest endpoint (`/manifest.webmanifest`).
  - Offline PWA Service Worker (`/sw.js`).
  - Schema.org/School JSON-LD component (`JsonLd.tsx`).
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` across all 31 static routes.

## [Milestone 1] - Foundation Architecture
### Added
- Created `pnpm` monorepo with `apps/web`, `apps/api`, `packages/shared`, `supabase/`.
- Rebuilt shared UI Kit (`Button`, `Badge`, `Card`, `Input`, `StatCard`, `Skeleton`, `LockedFeature`).
- Authored Supabase SQL migrations `00001_platform_identity.sql`, `00002_cms.sql`, `00003_academic_fees_admission_analytics.sql`, `seed.sql`, and `rls_test.sql`.

## [Milestone 0] - Audit and Master Planning
### Added
- Saved master brief as permanent source of truth in `docs/PROJECT_SPEC.md`.
