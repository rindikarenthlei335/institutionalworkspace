# Milestone 0 Audit Report

## 1. Executive Summary
This audit analyzes the Figma export located in `design-export/` and defines the translation plan into the production multi-tenant architecture specified in `docs/PROJECT_SPEC.md`.

---

## 2. Export Inventory & Framework Identification
- **Original Export Stack:** React 19 + Vite + Tailwind CSS v4 + lucide-react + react-router-dom v7.
- **Target Stack:** Monorepo (pnpm workspaces)
  - `apps/web`: Next.js 15 (App Router, SSR/SSG for SEO) + Tailwind CSS + Supabase `@supabase/ssr`.
  - `apps/api`: Cloudflare Worker + Hono for webhooks, signing, cron, PDF receipts, analytics tracking.
  - `packages/shared`: Shared types, Zod schemas, roles, feature flags.
  - `supabase/`: Postgres migrations, RLS policies, seeds, cross-tenant isolation tests.

---

## 3. Design Tokens Extraction

### 3.1 Color Palette
- **Background Base (`bg-base`):** `#EAEFEC` (Dark: `#0F1F18`)
- **Surface (`bg-surface`):** `#FFFFFF` (Dark: `#16291F`)
- **Elevated / Hover (`bg-elevated`):** `#E3EAE6` (Dark: `#1F3A2C`)
- **Brand Primary (`bg-brand`):** `#1F4D3A` (Dark: `#4FA37A`)
- **Brand Primary Hover (`bg-brand-hover`):** `#163A2B` (Dark: `#63B88E`)
- **Brand Soft / Selected (`bg-brand-soft`):** `#D5E6DC` (Dark: `#1D3A2B`)
- **On Brand (`bg-on-brand`):** `#FFFFFF` (Dark: `#0F1F18`)
- **Text Primary (`text-fg`):** `#0F1A14` (Dark: `#F2F7F4`)
- **Text Secondary (`text-fg-muted`):** `#46574E` (Dark: `#93A79C`)
- **Border Subtle (`border-subtle`):** `#C5D2CB` (Dark: `#2E4A3D`)
- **Border Default (`border-default`):** `#A9BAB1` (Dark: `#3F6151`)
- **Border Strong (`border-strong`):** `#7F958A` (Dark: `#5C8570`)
- **Status Colors:**
  - Success: `#2E9E6B`
  - Warning: `#D9A23A`
  - Error: `#C9504A`
  - Pending: `#7A8A82`

### 3.2 Typography Scale
- **Display:** `Source Serif 4`, 48px / 56px, Bold (700)
- **H1:** `Source Serif 4`, 32px / 40px, Bold (700)
- **H2:** `Source Serif 4`, 24px / 32px, Semibold (600)
- **H3:** `Source Serif 4`, 18px / 26px, Semibold (600)
- **Body:** `Inter`, 16px / 26px, Normal (400)
- **Small:** `Inter`, 14px / 22px, Normal (400)
- **Caption:** `Inter`, 12px / 16px, Medium (500)
- **Mono / Numbers:** `JetBrains Mono`, 14px / 20px, Tabular-nums (500)

### 3.3 Motion & Transitions
- **Hover:** `150ms ease-out`
- **UI Transition:** `250ms cubic-bezier(0.22, 1, 0.36, 1)`
- **Page Reveal:** `400ms cubic-bezier(0.22, 1, 0.36, 1)`
- **Hero / Enter:** `600ms cubic-bezier(0.22, 1, 0.36, 1)`
- **Count-up:** `1200ms cubic-bezier(0, 0, 0.2, 1)`
- **Bottom Sheet:** `350ms cubic-bezier(0.22, 1, 0.36, 1)`

---

## 4. Screen Mapping Table

| Prototype Screen | Design File Path | Target Monorepo Route | Module / Feature | Plan Level |
|---|---|---|---|---|
| Entry Landing | `src/pages/Entry.tsx` | `/` (Root domain) | Platform Marketing | All |
| Design System Showcase | `src/pages/DesignSystem.tsx` | `apps/web/src/app/design/page.tsx` | UI Kit Showcase | Internal |
| Public Website Home | `src/pages/website/WebsiteHome.tsx` | `/` (Tenant Subdomain) | Public Website | Basic+ |
| Public Activities | `src/pages/website/WebsitePages.tsx` | `/activities` | Public CMS | Basic+ |
| Public Faculty | `src/pages/website/WebsitePages.tsx` | `/faculty`, `/faculty/[id]` | Public CMS | Basic+ |
| Public Facilities | `src/pages/website/WebsitePages.tsx` | `/facilities` | Public CMS | Basic+ |
| Public About Us | `src/pages/website/WebsitePages.tsx` | `/about` | Public CMS | Basic+ |
| Public Notices | `src/pages/website/WebsitePages.tsx` | `/notices`, `/notices/[id]` | Public CMS | Basic+ |
| Public Gallery | Missing in prototype | `/gallery` | Public CMS | Basic+ |
| Public Admission Form | `src/pages/app/AppAdmission.tsx` | `/admission` | Online Admission | Essential+ |
| Public Fee Lookup & Pay | `src/pages/app/AppFeePayment.tsx` | `/pay-fee` | Fee Payment | Essential+ |
| School Admin Dashboard | `src/pages/admin/AdminPages.tsx` | `/admin/dashboard` | Admin Panel | Basic+ |
| School Admin Content CMS | `src/pages/admin/AdminPages.tsx` | `/admin/content` | CMS Manager | Basic+ |
| School Admin Fee Approvals | `src/pages/admin/AdminPages.tsx` | `/admin/fees` | Fee Management | Essential+ |
| School Admin Students | `src/pages/admin/AdminPages.tsx` | `/admin/students` | Student Management | Essential+ |
| School Admin Settings | `src/pages/admin/AdminPages.tsx` | `/admin/settings` | School Settings | Basic+ |
| Parent Portal App | `src/pages/app/AppHome.tsx` | `/portal/*` | Parent/Student PWA | Essential+ |
| Principal Dashboard | `src/pages/principal/PrincipalDashboard.tsx` | `/admin/principal` | Principal Dashboard | Pro |
| Platform SuperAdmin | `src/pages/superadmin/SuperAdmin.tsx` | `/platform/*` | Platform Owner Panel | Internal |

---

## 5. Identified Risks & Technical Mitigations

1. **Cross-Tenant Data Isolation Leakage:**
   - *Risk:* Queries accidentally missing `tenant_id` filters.
   - *Mitigation:* Enforce Supabase RLS on **every single table** with `private.current_tenant_id()` session variable and automated SQL tests in `supabase/tests/`.

2. **Subdomain / Host Header Spoofing:**
   - *Risk:* Host header tampering in Next.js middleware.
   - *Mitigation:* Resolve domain strictly against `tenant_domains` database table with short TTL memory cache.

3. **Concurrency in Receipt and Admission Numbers:**
   - *Risk:* Two simultaneous payments getting duplicate receipt numbers.
   - *Mitigation:* Use atomic Postgres sequence functions/triggers per tenant per academic year.

4. **Payment Webhook Idempotency:**
   - *Risk:* Razorpay duplicate webhook calls causing double fee updates.
   - *Mitigation:* Unique `idempotency_key` constraint on `payments` table combined with transactional reconciliation in Hono Worker.
