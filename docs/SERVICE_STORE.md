# Service Store & Add-on Delivery Architecture (Phase 2 Milestone 1)

## 1. Overview
The Service Store enables any school on any plan tier (`basic`, `essential`, `pro`, `ultimate`) to browse, tick, configure, and purchase managed platform add-ons. Work commences only upon receipt of full prepaid payment and document approval.

---

## 2. Catalog & Pricing Matrix

| Service | Slug | Category | Basic (₹1,499) | Essential (₹3,999) | Pro (₹8,000) | Ultimate (₹9,999) | ETA (Working Days) |
|---|---|---|---|---|---|---|---|
| **Own Domain Connect** | `domain-connect` | Domains & DNS | Free | Free | Free | Free | 0 to 1 |
| **Domain Register (.in/.com/.org)** | `domain-register-standard` | Domains & DNS | ₹5,000 + actual | ₹5,000 + actual | ₹3,000 + actual | ₹2,000 + actual | 3 to 5 |
| **Domain Register (.school)** | `domain-register-school` | Domains & DNS | ₹5,000 + actual | ₹5,000 + actual | ₹3,000 + actual | ₹2,000 + actual | 3 to 5 |
| **Domain Register (.edu.in/.ac.in)** | `domain-register-edu-in` | Domains & DNS | ₹5,000 + actual | ₹5,000 + actual | ₹3,000 + actual | ₹2,000 + actual | 7 to 15 |
| **Domain Annual Renewal** | `domain-renewal` | Domains & DNS | ₹400 + actual | ₹400 + actual | ₹400 + actual | ₹400 + actual | Reminder-driven |
| **Google Search Console Indexing** | `google-submit` | Google & SEO | ₹1,000 | ₹1,000 | **Free (Pro)** | **Free (Ultimate)** | 3 to 14 |
| **Google Maps Pin Verification** | `maps-register` | Google & SEO | ₹500 | ₹500 | **Free (Pro)** | **Free (Ultimate)** | 5 to 14 |
| **Google Presence & SEO Bundle** | `seo-bundle` | Google & SEO | ₹1,200 | ₹1,200 | **Free (Pro)** | **Free (Ultimate)** | 5 to 14 |
| **Android Play Store Publish** | `android-app` | Mobile Apps | ₹10,000 | ₹10,000 | ₹7,000 | ₹5,000 | 7 to 21 |
| **iOS App Store Publish** | `ios-app` | Mobile Apps | ₹18,000 | ₹18,000 | ₹13,000 | ₹9,000 | 7 to 21 |
| **Mobile App Maintenance** | `app-maintenance` | Mobile Apps | ₹4,000/yr | ₹4,000/yr | ₹3,000/yr | ₹2,000/yr | Continuous |
| **Data Migration & Excel Cleanup** | `data-migration` | Data & Storage | ₹3,000 | ₹3,000 | ₹2,000 | **Free (Ultimate)** | 2 to 5 |
| **Extra Storage (10 GB Tier)** | `extra-storage-10gb`| Data & Storage | ₹200/mo | ₹200/mo | ₹200/mo | ₹200/mo | Instant |
| **AI Message Pack (5,000 msgs)** | `ai-credit-pack` | AI Copilot | ₹1,500 | ₹1,500 | ₹1,500 | ₹1,500 | Instant |

---

## 3. Working-Day Arithmetic & Turnaround Clock Engine

The working-day arithmetic engine (`apps/web/src/features/services/lib/eta.ts`) enforces the following invariants:
1. **Clock Trigger Rule:** The turnaround clock starts **strictly** when both:
   - Payment is confirmed via `PLATFORM_RAZORPAY` context, AND
   - All mandatory required documents are reviewed and approved by platform operations.
2. **Weekend & Holiday Skipping:** Saturdays, Sundays, and national holidays (Republic Day, Independence Day, Gandhi Jayanti, Christmas Day, New Year) do not decrement the working day count.
3. **Delay Detection:** Computes remaining working days dynamically. If the current date exceeds the projected completion date, `isDelayed: true` is flagged with the exact count of overdue business days.
4. **Mandatory Disclaimer:** Displayed across all customer-facing views:
   > *"Durations are estimates and depend on third parties (registries, Google, Apple) and on documents being complete. Rank, approval and review outcomes are not guaranteed."*

---

## 4. Dynamic Pre-filled DOCX Generation

The `docx` library compiles customized documents in the browser or on the edge:
1. **School Authorisation Letter (`createSchoolAuthorisationDocx`):** Pre-fills institution name, principal name, board affiliation number, phone, email, and campus address. Includes letterhead and seal placeholders.
2. **Publisher Authorisation Letter (`createPublisherAuthorisationDocx`):** Authorises the EduPortal platform team to submit Android (.aab) and iOS (.ipa) applications to Google Play Console and Apple App Store Connect.
3. **Domain Registrant Declaration (`createDomainDeclarationDocx`):** Pre-fills ERNET India / Ministry of IT declaration confirming accreditation and intended educational domain usage.

---

## 5. Dual Razorpay Gateway Contexts

To avoid commingling SaaS platform fees with tenant school collections:
- **Tenant Fee Collection:** Razorpay Route / linked accounts (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
- **Platform Prepaid Service Orders:** Platform's master Razorpay account (`PLATFORM_RAZORPAY_KEY_ID`, `PLATFORM_RAZORPAY_KEY_SECRET`).
- SAC Code: **998313** (Information Technology Software Services). Optional GST (18%) calculated at checkout.

---

## 6. Platform Fulfillment Operations Console (`/platform/services`)

The operations console gives the platform engineering team end-to-end fulfillment controls:
- **Queue Triage:** Filter by category, order status, school, and overdue countdown.
- **Document Dossier Review:** Approve or reject submitted files with actionable rejection notes that notify the school administrator.
- **Automated Lifecycle Bindings:**
  - Marking a domain registration complete automatically provisions records in `tenant_domains` and establishes a 1-year auto-renewing `service_subscriptions` entry.
  - Marking a mobile app publish complete stores the official Google Play / App Store listing URL.
- **Data Export:** Instant one-click CSV export of queue metrics.
