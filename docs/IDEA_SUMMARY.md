# School / Institution Web & App Platform — Master Idea & Architecture Summary

> **Document Type:** Institutional Blueprint & System Specification  
> **Platform Name:** EduPortal (Multi-Tenant Institutional SaaS)  
> **Currency:** All figures in INR (₹)  

---

## 1. Plan 3 (Tier) leh an Feature

| Feature / Module | Basic (₹1,499 / thla) | Essential (₹3,999 / thla) | Pro (₹8,000 / thla) |
| :--- | :---: | :---: | :---: |
| **Category** | Simple School Website | Website + Mobile App | Website + App + Full Analytics |
| **Logo Upload** | Awm | Awm | Awm |
| **Theme Customizer** | Awm | Awm | Awm |
| **Admin Panel (Data & Image Upload)** | Awm | Awm | Awm |
| **Module 6 (Home, Activities, Faculty, Facilities, About, Notice)** | Awm | Awm | Awm |
| **Admin Login** | — | Awm | Awm |
| **Fee Payment (Day / Hosteller hran)** | — | Awm | Awm |
| **Online Admission + Admission Fee** | — | Awm | Awm |
| **Super Admin + Data Entry Operator Login** | — | Awm | Awm |
| **Student Management (Class, Section, Roll No, Parents)** | — | Awm | Awm |
| **Website Analytics (Visitor insights)** | — | — | Awm |
| **Principal Dashboard (Student stats, Fee collection thla/kum/due)** | — | — | Awm |
| **UI Design Level** | Basic Level | Level 1 (Modern) | Level 2 (Collegiate/Executive) |
| **Google Submit + Maps Register** | Add-on (₹1,200 Bundle) | Add-on (₹1,200 Bundle) | **Free (Included)** |
| **Domain Register Service** | ₹5,000 | ₹5,000 | **₹3,000 (Discounted)** |
| **Subdomain (*.eduportal.in)** | Free | Free | Free |
| **Own Domain Connect** | Free | Free | Free |

### Module 6 (Basic Plan) Chhui Zau:
1. **Home Screen:** Achievements highlight, auto-sliding photo gallery, faculty gallery & leadership bio.
2. **Activities:** School sports, annual functions, clubs & student achievements.
3. **Faculty Directory:** Interactive teacher gallery, designations, subjects taught & biodata.
4. **Campus Facilities:** Labs, library, transport bus routes & smart classroom details.
5. **About Us:** School history, mission, vision, objectives, address & contact information.
6. **Digital Notice Board:** Circulars, exam routines, holiday notices & urgent announcements.

### Role Hierarchy:
- **Platform Owner (Super Admin):** Tenant onboarding, DNS routing, subscriptions, global audit logs.
- **School Admin / Principal:** Full campus oversight, teacher allocation, notices, approvals, executive cockpit.
- **Accountant:** Fee collections, receipt generation, Day/Hosteller fee structures, due reports.
- **Data Entry Operator:** Admission entries, student demographic updates, marksheet entry.
- **Teacher:** Attendance marking, assignment uploads, internal marks submission.
- **Parent / Student:** Public portal, report card download, fee payment receipts, notice alerts.

---

## 2. Backend, Database leh Technology Stack

### Recommended Architecture:
- **Database:** PostgreSQL with Row Level Security (RLS) + `tenant_id` partitioning.
- **Frontend (Public & Portals):** Next.js 15 (App Router) on Cloudflare Pages.
- **Asset Storage:** Cloudflare R2 bucket (`/school-{tenant_id}/...`) with automated WebP compression.
- **Caching & Edge Routing:** Cloudflare Workers + Hyperdrive for connection pooling.
- **Mobile Application:** React Native (Expo) / Flutter (Android + iOS universal build).
- **Background Jobs:** Cloudflare Queues / Edge Workers for SMS alerts, PDF fee receipt generation, email dispatches.
- **Push Notifications:** Firebase Cloud Messaging (FCM).
- **Analytics:** Cloudflare Web Analytics + PostgreSQL SQL aggregates for Principal dashboards.

---

## 3. Multi-Tenancy: Shared Engine, Dedicated Isolation

- **Single Database & Shared Backend:** All institutions run on a unified codebase and database instance, isolated via `tenant_id`.
- **PostgreSQL Row Level Security (RLS):** Ensures zero tenant cross-contamination; queries automatically scope to the authenticated `tenant_id`.
- **Hybrid Growth Path:**
  - *Basic & Essential tiers:* Shared multi-tenant database.
  - *Pro / Large Universities:* Optional dedicated database connection string with identical table schemas.

---

## 4. Website Address (Domain Provisioning)

| Type | Example | Cost | Setup Method |
| :--- | :--- | :---: | :--- |
| **Subdomain (Default)** | `mtcarmel.eduportal.in` | **Free (₹0)** | Wildcard DNS `*.eduportal.in` + Cloudflare Edge SSL |
| **Own Domain Connect** | `www.mtcarmelschool.com` | **Free (₹0)** | Cloudflare for SaaS Custom Hostnames + CNAME pointing |
| **Domain Register Service** | `www.school.edu.in / .com / .in` | **₹5,000** (Pro: **₹3,000**) | Reseller registrar provisioning + DNS + 1st Year Domain |

### Domain Document Requirements:
- **.com / .in:** School legal name, address, Principal / Secretary ID proof (Aadhaar / PAN).
- **.edu.in / .ac.in:** Trust / Society Registration Certificate, Board Affiliation / Recognition Letter, Principal Authorization Letter on School Letterhead with Stamp, Campus Land / Electricity Deed.

---

## 5. SEO, Google Search Console & Google Maps

1. **Basic SEO (Free on all tiers):** Automatic `sitemap.xml`, `robots.txt`, OpenGraph tags, schema.org School microdata, mobile responsiveness.
2. **Google Search Console & Sitemap Submission:** ₹1,000 (Pro: Free).
3. **Google Maps Location Pin & Claim:** ₹500 (Pro: Free).
4. **Google Presence Bundle (Both Submit + Maps):** ₹1,200 (Pro: Free).

---

## 6. Mobile Application Strategy

- **Option A: Shared Institutional App (EduPortal Mobile):**
  - Included Free in Essential & Pro plans.
  - Parents enter school code or scan school QR code to load the school's theme, logo, and fee desk.
- **Option B: White-Label Custom Android App on Play Store:**
  - Dedicated branded APK uploaded under school/platform Play Console account.
  - Setup fee: ₹8,000 – ₹15,000.
  - Mandatory 14-day closed testing with 12 testers and Google organization verification (30–50 days timeline).
- **Option C: Progressive Web App (PWA):**
  - Included Free across all tiers with zero installation hurdles.

---

## 7. Comprehensive Add-on & Pricing Table

| Service / Add-on | Basic (₹1,499) | Essential (₹3,999) | Pro (₹8,000) |
| :--- | :---: | :---: | :---: |
| **Institutional Subdomain** | Free | Free | Free |
| **Own Domain Connect** | Free | Free | Free |
| **Domain Registration Service** | ₹5,000 | ₹5,000 | **₹3,000** |
| **Domain Renewal (Kum tin)** | Actual + ₹400 | Actual + ₹400 | Actual + ₹400 |
| **Basic SEO Engine** | Free | Free | Free |
| **Google Search Console Submit** | ₹1,000 | ₹1,000 | **Free** |
| **Google Maps Pin & Claim** | ₹500 | ₹500 | **Free** |
| **Google Presence Bundle** | ₹1,200 | ₹1,200 | **Free** |
| **Shared App / PWA** | PWA | App + PWA | App + PWA |
| **White-Label Android App** | ₹8,000 | ₹8,000 | ₹8,000 |

---

## 8. Payment Gateway & Legal Compliance

- **Payment Gateway:** Razorpay Route / Cashfree Split Settlement: Tuition and admission fees settle directly into the school's verified institutional bank account.
- **Data Protection:** India Digital Personal Data Protection Act (DPDP Act 2023) compliant parent consent models.
- **Bilingual Interface:** English + Mizo native language support.

---

## 9. Development Phases & Checklist

1. **Phase 1 (Core Onboarding & Basic Web):** Multi-tenant routing, White + Forest Green UI, Plan 1499 Module 6, Subdomain provisioning, Basic SEO.
2. **Phase 2 (Admissions, Fees & Shared App):** Student database, Day/Hosteller fee structures, UPI QR / Payment receipts, admission workflow, Shared app wrapper.
3. **Phase 3 (Enterprise Analytics & White-label):** Principal executive dashboard, Google Console automated submission, White-label APK distribution, custom domain DNS automation.
