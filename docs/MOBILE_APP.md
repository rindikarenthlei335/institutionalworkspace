# EduPortal Mobile App Architecture & Compliance Guide (P2-M4)

## 1. Overview
The EduPortal Mobile Application is built with React Native and Expo (`apps/mobile/`), providing parents, students, and institutional faculty with real-time access to grades, digital student IDs, fee settlement, and administrative announcements.

The app supports a dual-deployment model:
1. **Shared Multi-Tenant App (`APP_VARIANT=shared`, ID: `com.eduportal.app`)**: Single download on Apple App Store & Google Play Store. Users select their institution using a short school code (e.g., `MC-AIZAWL`). The app dynamically skins its UI, crest, and primary/secondary colors to match the institution.
2. **Dedicated White-Label App (`APP_VARIANT=whitelabel`, ID: `in.edu.<slug>.portal`)**: Pre-configured build directly branded for high-tier institutions (e.g., Mount Carmel HSS), bypassing the school finder.

---

## 2. Dynamic Runtime Entitlements & Configuration
Instead of requiring client app rebuilds when an institution upgrades its plan or toggles feature flags, the mobile client queries `/api/v1/tenant/config` at boot.

### Response Payload Structure:
```json
{
  "tenant": {
    "id": "00000000-0000-0000-0000-000000000001",
    "slug": "mountcarmel",
    "name": "Mount Carmel Higher Secondary School",
    "schoolCode": "MC-AIZAWL",
    "plan": "pro",
    "status": "active"
  },
  "branding": {
    "primaryColor": "#163A2B",
    "secondaryColor": "#C9A84C",
    "crestInitials": "MC",
    "logoUrl": "https://institutionalworkspace.r2.cloudflarestorage.com/mountcarmel/branding/crest.webp"
  },
  "entitlements": {
    "planId": "pro",
    "modulesEnabled": {
      "fees": true,
      "exams": true,
      "digitalId": true,
      "notices": true,
      "attendance": false
    }
  },
  "appVersioning": {
    "clientVersion": "1.0.0",
    "latestVersion": "1.0.0",
    "minSupportedVersion": "1.0.0",
    "forceUpdate": false
  },
  "compliance": {
    "privacyPolicyUrl": "https://mountcarmel.eduportal.com/about#privacy",
    "termsOfServiceUrl": "https://mountcarmel.eduportal.com/about#terms",
    "accountDeletionUrl": "https://mountcarmel.eduportal.com/portal/profile#delete-account"
  },
  "reviewerDemoAccount": {
    "isAvailable": true,
    "username": "apple.reviewer@mountcarmel.edu.in",
    "passwordHint": "ReviewerDemo2025!",
    "role": "parent"
  }
}
```

### Module Gating Rule:
Bottom tabs and home screen action cards are rendered strictly if their module flag is true. If an institution is on the `essential` plan, `exams` and `digitalId` are cleanly omitted without runtime errors.

---

## 3. Screen Catalog

| Screen | File Path | Features & Entitlements |
| :--- | :--- | :--- |
| **School Finder** | `src/screens/FindSchoolScreen.tsx` | School code input (`MC-AIZAWL`), slug normalization, preset quick links. |
| **Login** | `src/screens/LoginScreen.tsx` | Parent/Student/Staff role tabs, credentials entry, 1-tap Apple Reviewer demo autofill. |
| **Home Dashboard** | `src/screens/HomeScreen.tsx` | Institutional branded banner, digital ID quick strip, dynamic service grid, announcement feed. |
| **Exam Results** | `src/screens/ResultsScreen.tsx` | Gated by `modules.exams`. Term marksheet, GPA breakdown, class rank badge, offline caching. |
| **Digital ID Card** | `src/screens/DigitalIDScreen.tsx` | Gated by `modules.digitalId`. CR80 aspect ratio front/back card flip, offline token verification QR, Apple/Google Wallet action. |
| **Fees & Invoices** | `src/screens/FeesScreen.tsx` | Gated by `modules.fees`. Outstanding ledger, paid history, online settlement modal, tax receipts. |
| **Profile & Settings** | `src/screens/ProfileScreen.tsx` | Demographic summary, English ↔ Mizo bilingual language switch, push notification toggles, Apple 5.1.1 Account Deletion. |
| **Force Update Modal** | `src/screens/ForceUpdateModal.tsx` | Non-dismissible blocking modal when client version < `minSupportedVersion`. |

---

## 4. App Store Review Compliance Guardrails

### A. Apple Guideline 2.1 (App Review Demo Accounts)
- Apple App Store review requires active credentials for private portals.
- The mobile login screen provides an explicit `🛡️ App Reviewer Demo Account (1-Tap Fill)` button.
- Pre-fills `apple.reviewer@mountcarmel.edu.in` with valid parent data and full access to term marks, tuition ledger, and student pass.

### B. Apple Guideline 5.1.1 (Account Deletion in App)
- Apps supporting account creation/login must allow in-app account deletion initiation.
- The `ProfileScreen` features a dedicated `Request Account Deletion` flow.
- Highlights:
  1. A 30-day institutional grace period.
  2. Clear differentiation: mobile login sessions and device tokens are purged, while statutory educational archives are preserved per MBSE / CBSE government mandates.
  3. Strict user confirmation requiring typing `"DELETE"`.
  4. Generates a unique tracking reference (e.g. `DEL-xxxx-ADM001`) and records it in database table `account_deletion_requests`.

---

## 5. Bilingual Support (English & Mizo)
Every screen accepts `language: 'en' | 'lus'`. When switched to `lus` (Mizo):
- Header titles: *Digital Student ID* → *Zirlai ID Card*
- Flip action: *Flip to Back* → *Hnunglam En rawh*
- Fees ledger: *Total Outstanding* → *Chawi tur zat*
- Buttons: *Pay Now* → *Chawi nghal rawh*

---

## 6. Verification & Automated Tests
Automated unit tests are located in `tests/mobile_runtime_entitlements.test.ts`:
- **Semantic Version Gating**: Verifies `shouldForceUpdate` correctly triggers on lower versions and allows current/newer versions.
- **Tiered Plan Entitlement Resolution**: Validates basic, essential, pro, and ultimate feature sets.
- **Reviewer Demo Account Contract**: Checks username and password length invariants.
- **School Identifier Normalization**: Validates case-insensitivity and whitespace stripping.
