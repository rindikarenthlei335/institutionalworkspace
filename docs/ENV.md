# Environment Variables & Configuration Guide

This document details all required public environment variables and server secrets.

---

## 1. Client & Public Environment Variables (`apps/web/.env.local`)
```env
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://wxspzgzrzichefggbbic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c3B6Z3pyemljaGVmZ2diYmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc5MjQsImV4cCI6MjEwNjM1MzkyNH0.ur2rmSNqv_qQgcSTsDbWyrODuJp9fnDz-05eQgcoLKg

# Platform Config
NEXT_PUBLIC_APP_NAME=EduPortal
NEXT_PUBLIC_ROOT_DOMAIN=eduportal.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=mock_turnstile_site_key
```

---

## 2. Server-Only Secrets (`.env.example` / Wrangler Secrets)
*WARNING: Never commit server secrets to Git or expose in client bundles.*

| Secret Variable Key | Usage Scope | Purpose |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Next.js Server & Worker | Admin operations & system triggers |
| `R2_ACCOUNT_ID` | Cloudflare Worker (`apps/api`) | Cloudflare R2 Account Identifier |
| `R2_ACCESS_KEY_ID` | Cloudflare Worker (`apps/api`) | S3 API Access Key ID for R2 |
| `R2_SECRET_ACCESS_KEY` | Cloudflare Worker (`apps/api`) | S3 API Secret Key for R2 |
| `R2_BUCKET_PUBLIC` | Cloudflare Worker (`apps/api`) | Public CDN Bucket Name (`eduportal-public`) |
| `R2_BUCKET_PRIVATE` | Cloudflare Worker (`apps/api`) | Private Documents Bucket Name (`eduportal-private`) |
| `R2_PUBLIC_BASE_URL` | Next.js Server & Worker | Base CDN domain for media assets |
| `RAZORPAY_KEY_ID` | Cloudflare Worker & Web | Razorpay Payment Gateway Key ID |
| `RAZORPAY_KEY_SECRET` | Cloudflare Worker (`apps/api`) | Razorpay Payment Gateway Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Cloudflare Worker (`apps/api`) | Razorpay HMAC Webhook Signature Secret |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Worker (`apps/api`) | API Token for Cloudflare for SaaS custom hostnames |
| `CLOUDFLARE_ZONE_ID` | Cloudflare Worker (`apps/api`) | Cloudflare Zone ID for `ROOT_DOMAIN` |
| `RESEND_API_KEY` | Cloudflare Worker (`apps/api`) | Resend Email API Key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Worker (`apps/api`) | Cloudflare Turnstile bot verification secret |
| `PLATFORM_RAZORPAY_KEY_ID` | Next.js Server & Worker | Platform Razorpay Key ID for prepaid service add-ons & subscriptions |
| `PLATFORM_RAZORPAY_KEY_SECRET` | Next.js Server & Worker | Platform Razorpay Secret Key for prepaid service add-ons & subscriptions |
| `PLATFORM_RAZORPAY_WEBHOOK_SECRET` | Next.js Server & Worker | Platform Razorpay Webhook Secret for order fulfillment verification |
| `ANTHROPIC_API_KEY` | Next.js Server & Worker | Anthropic Claude API Key for AI Copilot (Claude Haiku 4.5 & Sonnet 5.5) |
| `EXPO_TOKEN` | Platform CI / Worker | Expo EAS deployment token for automated white-label app compilation |
| `EAS_PROJECT_ID` | Platform CI / Mobile | Expo Application Services project identifier |

