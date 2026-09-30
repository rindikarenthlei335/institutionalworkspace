# Project Changelog

## [Milestone 1] - Foundation Architecture
### Added
- Created `pnpm` monorepo with `apps/web`, `apps/api`, `packages/shared`, `supabase/`.
- Rebuilt shared UI Kit (`Button`, `Badge`, `Card`, `Input`, `StatCard`, `Skeleton`, `LockedFeature`) matching Figma design tokens.
- Authored comprehensive Supabase SQL migrations:
  - `00001_platform_identity.sql`: Private schema, `private.current_tenant_id()`, `private.current_role()`, `private.is_platform_owner()`, `private.has_feature()`, platform & profile tables, RLS.
  - `00002_cms.sql`: CMS tables (`site_settings`, `notices`, `faculty`, `facilities`, `gallery`, `contact_messages`) & RLS.
  - `00003_academic_fees_admission_analytics.sql`: Academic, fees, admission, analytics tables, race-safe sequence functions & RLS.
- Created `supabase/seed.sql` with 2 demo tenants: Mount Carmel School (Pro) & St Mary's School (Basic).
- Created `supabase/tests/rls_test.sql` SQL isolation verification test.
- Implemented tenant resolution middleware (`apps/web/src/middleware.ts`) handling subdomains, custom domains, `localhost:3000`, and `?tenant=slug` override.
- Implemented feature-flag engine (`apps/web/src/lib/features.ts`) and theme system (`apps/web/src/lib/theme.ts`).
- Built complete App Router layout & page architecture across Public Website, Admin Panel, Principal Dashboard, Parent PWA Portal, and Platform Owner Panel.
- Verified workspace with clean `pnpm typecheck` and successful `pnpm build` (28 routes).

## [Milestone 0] - Audit and Master Planning
### Added
- Saved master brief as permanent source of truth in `docs/PROJECT_SPEC.md`.
- Preserved original Figma export prototype in `design-export/` (read-only reference).
- Completed audit report in `docs/AUDIT.md`.
