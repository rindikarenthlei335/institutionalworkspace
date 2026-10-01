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

---

## ADR-006: 4-Tier Plan Structure & Entitlement Lifecycle (Phase 2)
- **Decision:** Introduce a 4th tier: **Ultimate (₹9,999/mo)** with 50 GB storage, AI Copilot, Module Manager, and Custom Module Builder.
- **Entitlement Rules:**
  - Upgrades take effect immediately without requiring code redeployments or mobile store releases.
  - Downgrades transition locked features into a 30-day read-only grace period before being hidden. Data is never deleted on downgrade.
  - Cancellations preserve data for at least 90 days before archiving, during which the institution can request a full data export.
- **Rationale:** Aligns platform monetization with feature complexity while safeguarding institutional data continuity.

---

## ADR-007: Unified Service Store Architecture & Migration
- **Decision:** Consolidate Phase 1 discrete domain requests and service requests into a unified Service Store ordering engine (`service_catalog`, `service_variants`, `service_prices`, `service_orders`, `service_order_items`, `service_item_documents`).
- **Rationale:** Provides a unified cart & checkout experience for schools to tick add-ons, preview ETAs, upload compliance documents, and pay in advance.

---

## ADR-008: Dual Payment Gateway Contexts
- **Decision:** Separate platform revenue from student fee collection:
  - Student tuition & admission fees flow through the school's linked Razorpay Route account.
  - Service Store purchases and SaaS subscriptions flow directly into the SaaS platform's Razorpay account (`PLATFORM_RAZORPAY_*`).
- **Rationale:** Prevents commingling of platform SaaS revenue with institutional school tuition collections.

---

## ADR-009: Bilingual en / lus (Mizo) Strict Parity
- **Decision:** Mandate complete bilingual parity across all user-facing strings in English (`en`) and Mizo (`lus`).
- **Enforcement:** Automated `pnpm i18n:check` script validates that zero English keys are missing Mizo translations in CI/test pipelines.
- **Rationale:** Ensures native cultural suitability for schools across Mizoram and Northeast India from day one.

---

## ADR-010: Zero Double-Entry Architecture (Data Hub as Master)
- **Decision:** All modules—including Student Profiles, Guardians, Staff & Faculty, Subjects, Exam Marks, ID Cards, Marksheets, Certificates, and Website Public Faculty—read and write directly from the Data Hub foundation.
- **Rationale:** Eliminates data duplication, eliminates synchronization drift, and guarantees institutional facts are always in sync.

---

## ADR-011: Mobile Architecture & Regulatory Strategy
- **Decision:** Build a single Expo / React Native codebase (`apps/mobile/`) supporting both shared app and white-label standalone publishing. Runtime entitlements are fetched via `GET /api/v1/tenant/config` so plan upgrades/downgrades never require app store redeployments.
- **Regulatory Strategy:** For Apple and Google store compliance, classify the app strictly as an Adult/Parent/Faculty Utility (18+) to avoid child-directed COPPA and Google Families Policy burdens; provide a 1-tap demo reviewer login account; and provide an in-app account deletion request with a 30-day grace period.

---

## ADR-012: Minor Student Privacy & Minimal Verification Endpoints
- **Decision:** Public verification routes (`/verify/marksheet/[token]`, `/verify/id/[token]`, `/verify/certificate/[token]`) expose minimal verification facts only (student name, school name, verification status) and strictly withhold private phone numbers, home addresses, dates of birth, and parents' personal details.
- **Rationale:** Protects minor student safety and complies with India's Digital Personal Data Protection (DPDP) Act 2023.

---

## ADR-013: Core Module Protection Invariant
- **Decision:** In the Module Manager, foundational modules (`settings`, `data_hub`) are marked `isCore = true` and are hard-locked against being disabled or uninstalled.
- **Rationale:** Prevents tenant administrators from accidentally bricking school settings or master data pipelines.

---

## ADR-014: AI Copilot: Zero Auto-Apply Invariant & Quotas
- **Decision:** AI Copilot operates in 4 modes (Guide, Data, Action, General) with an official Mizo glossary injected into prompts. In Action mode, drafts are created with `pending_confirmation` status and can ONLY be applied when an authorized human operator clicks "Confirm & Apply". Quota is governed at 3,000 monthly messages on the Ultimate plan.
- **Rationale:** Prevents hallucinated or unauthorized automated state changes in school databases while enabling administrators to leverage generative AI safely.

