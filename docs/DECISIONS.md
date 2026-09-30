# Architectural & Design Decisions (ADR Log)

This document records key decisions, Sensible Defaults, and trade-offs made during development.

---

## ADR-001: Monorepo & Application Architecture
- **Decision:** Use `pnpm` workspace monorepo layout:
  - `apps/web`: Next.js 15 App Router (TypeScript strict, Tailwind CSS).
  - `apps/api`: Cloudflare Worker with Hono framework.
  - `packages/shared`: Shared types, Zod schemas, roles, feature definitions.
  - `supabase/`: Database migrations, seed files, and RLS tests.
- **Rationale:** Separates high-speed SSR/SSG public site & admin UI (`apps/web`) from edge background tasks, PDF generation, cron execution, and webhooks (`apps/api`).

---

## ADR-002: Tenant Resolution & Edge Middleware Strategy
- **Decision:** Tenant lookup resolved from `Host` header via Next.js Middleware:
  - Subdomains (`school.ROOT_DOMAIN`) map to `tenant_domains` where `type = 'subdomain'`.
  - Custom hostnames (`www.school.com`) map to `tenant_domains` where `type = 'custom'`.
  - In local dev mode (`localhost:3000`), support `school.localhost:3000` or `?tenant=slug` query parameter override.
- **Rationale:** Ensures seamless multi-tenant routing with zero code duplication across school websites and admin interfaces.

---

## ADR-003: Postgres RLS Helper Functions & Security Definer Paradigm
- **Decision:** Place tenant session helpers in a separate `private` schema:
  - `private.current_tenant_id()`
  - `private.current_role()`
  - `private.is_platform_owner()`
  - `private.has_feature(feature_key)`
- **Rationale:** Encapsulates security logic inside Postgres, eliminating client-side tenant spoofing.

---

## ADR-004: Payment Settlement & Idempotency
- **Decision:** Fee payment routing relies on Razorpay Route split settlement.
  - Every payment record requires a unique `idempotency_key` generated on initiation.
  - Webhooks processed transactional by the Cloudflare Worker.
- **Rationale:** Prevents duplicate fee collection and ensures fee money settles directly into the school's linked bank account.

---

## ADR-005: File Storage & Media Pipeline
- **Decision:** Storage abstract interface (`StorageProvider`) wrapping Cloudflare R2:
  - Public bucket for WebP transformed images via CDN.
  - Private bucket for admission documents & receipts accessible only via Worker signed URLs.
- **Rationale:** Provides high security for sensitive minor student data while maintaining fast image loading for public school sites.
