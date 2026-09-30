# Custom Domains & Managed Registration (`@eduportal/web/features/domains`)

Handles custom domain lifecycle, Cloudflare for SaaS custom hostnames, managed domain registration, and automated expiration renewal workflows.

## Capabilities
1. **Connect Own Domain (`ConnectDomainCard`)**:
   - Hostname validation with apex detection and `www.` recommendation.
   - Generates CNAME (`custom.eduportal.com`) and Cloudflare verification TXT tokens.
   - Live DNS polling with user-friendly error diagnostics and auto-fallback to subdomain.
2. **Managed Domain Registration ("Get a domain") (`RequestDomainModal`)**:
   - TLD selection (`.edu.in`, `.ac.in`, `.in`, `.com`).
   - Compliance document checklist (recognition certificate, authorization letter, government order).
   - Real-time status lifecycle: `Requested` → `Documents received` → `Registered` → `DNS setup` → `Live`.
3. **Renewal Tracker & Expiration Alerts (`DomainRenewalCard`)**:
   - Real-time expiration tracking with automated warnings at 60, 30, 15, and 7 days.
   - Auto-renew / manual invoice toggle.
