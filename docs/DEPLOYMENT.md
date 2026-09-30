# EduPortal Platform Deployment & Operations Manual

This guide describes the end-to-end process for deploying the EduPortal multi-tenant SaaS platform to production using Supabase and Cloudflare.

---

## 1. Local Development Setup

### Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x
- Git

### One-Command Setup
```bash
# Clone the repository
git clone <repo-url>
cd CMS_workspace

# Install workspace dependencies
pnpm install

# Run database tests & unit tests
pnpm test

# Start local Next.js dev server
pnpm dev
```
Access the application at `http://localhost:3000`. Test tenant resolution using `http://school.localhost:3000/?tenant=mountcarmel` or `?tenant=stmarys`.

---

## 2. Supabase Database Migrations

Apply the migration scripts sequentially to your Supabase PostgreSQL instance:

```bash
# Using Supabase CLI
supabase db push

# Or execute SQL files in Supabase Dashboard SQL Editor in order:
# 1. supabase/migrations/00001_platform_identity.sql
# 2. supabase/migrations/00002_cms.sql
# 3. supabase/migrations/00003_academic_fees_admission_analytics.sql
# 4. (Optional for local dev) supabase/seed.sql
```

### Verify Cross-Tenant RLS Isolation
Run the verification test script in your SQL editor:
```sql
\i supabase/tests/rls_test.sql
```
Confirm that `ALL RLS ISOLATION TESTS PASSED CLEANLY` is reported.

---

## 3. Cloudflare Deployment Architecture

### 3.1 apps/web (Next.js App Router on Cloudflare Pages)
`apps/web` contains the tenant-facing web portal, admin control panel, and platform owner panel.
1. Build the production bundle:
   ```bash
   pnpm --filter web build
   ```
2. Configure Cloudflare Pages project with environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://wxspzgzrzichefggbbic.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon-key>`
   - `NEXT_PUBLIC_APP_NAME`: `EduPortal`
   - `NEXT_PUBLIC_ROOT_DOMAIN`: `eduportal.com`

### 3.2 apps/api (Cloudflare Worker Privileged Backend)
`apps/api` executes privileged operations (storage signing, payment webhooks, custom hostnames, renewal crons).
1. Navigate to `apps/api`:
   ```bash
   cd apps/api
   ```
2. Set production secrets via Wrangler:
   ```bash
   wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   wrangler secret put RAZORPAY_KEY_ID
   wrangler secret put RAZORPAY_KEY_SECRET
   wrangler secret put RAZORPAY_WEBHOOK_SECRET
   wrangler secret put CLOUDFLARE_API_TOKEN
   wrangler secret put CLOUDFLARE_ZONE_ID
   wrangler secret put R2_ACCESS_KEY_ID
   wrangler secret put R2_SECRET_ACCESS_KEY
   wrangler secret put RESEND_API_KEY
   ```
3. Deploy to Cloudflare Workers:
   ```bash
   wrangler deploy
   ```

### 3.3 Automated Cron Triggers
The Worker's `scheduled` handler automatically executes daily at 00:00 UTC to inspect domain renewal deadlines (60, 30, 15, and 7 days) and trigger notifications.

---

## 4. Wildcard DNS & Cloudflare for SaaS Configuration

1. In your Cloudflare DNS dashboard for `eduportal.com`, create a wildcard DNS record:
   - Type: `CNAME`
   - Name: `*`
   - Target: `eduportal.com` (Proxied: Yes)
2. Under **SSL/TLS → Custom Hostnames (Cloudflare for SaaS)**:
   - Set fallback origin: `fallback.eduportal.com`
   - This enables schools to connect arbitrary custom domains (`www.mountcarmelschool.com`) with automated SSL provisioning.

---

## 5. Demo Tenant Credentials for Testing

| Tenant / School | Plan | Subdomain | Sample Admin Login | Password |
|---|---|---|---|---|
| **Mount Carmel Higher Secondary School** | **Pro** (₹8,000/mo) | `mountcarmel` | `principal@mountcarmel.edu.in` | `password` |
| **St. Mary's Convent High School** | **Basic** (₹1,499/mo) | `stmarys` | `admin@stmarys.eduportal.com` | `password` |
| **Platform Owner** | SaaS SuperAdmin | `platform` | `owner@eduportal.com` | `password` |
