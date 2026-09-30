# EduPortal App Publishing & Store Operations Runbook

## 1. Executive Summary & Objective
This runbook provides non-developer platform operators with a precise, step-by-step procedure to publish and maintain white-label mobile applications on the **Google Play Console** and **Apple App Store Connect**.

---

## 2. Developer Account Ownership Strategy

### Option A: School-Owned Developer Account (Recommended)
- **Why**: Protects institutional sovereignty, complies strictly with Apple Guideline 5.2.1 (institutional legal entity representation), and avoids multi-tenant account suspension contamination.
- **Prerequisites for the School**:
  1. **Legal Organization Entity**: Society registration, Trust deed, or CBSE/MBSE affiliation document.
  2. **D-U-N-S Number (Dun & Bradstreet)**: Free 9-digit identifier required by both Apple and Google for organization verification.
  3. **Fees**:
     - Google Play Console: \$25 one-time registration fee.
     - Apple Developer Program: \$99/year annual subscription.
  4. **Access Delegation**: The school invites the platform operator as `Admin` or `Developer` via App Store Connect Users & Access and Google Play Console Users & Permissions.

### Option B: Platform-Owned Publishing
- Allowed for schools lacking an immediate D-U-N-S number.
- Apps are published under `EduPortal Institutional Technologies Private Limited`.
- **Transfer Path**: When the school acquires its D-U-N-S number, app ownership can be transferred seamlessly via the standard App Store Connect App Transfer tool and Google Play Console App Transfer tool with zero user disruption or app reinstallations.

---

## 3. Regulatory Classification: Target Audience Decision
> [!IMPORTANT]
> **Classify the app as a Utility for Adults (Parents & Faculty, Ages 18+)**.
> Although K-12 students may access marks, classifying an application under Google Play's *Families Policy* or Apple's *Kids Category* triggers onerous COPPA audits, bans standard analytics, and mandates human-reviewed ad networks.
> 
> In both store questionnaires:
> - **Target Age Group**: 18 and older.
> - **Could the app unintentionally appeal to children?**: Select "No" (The app is an administrative institutional utility for grades, tuition fees, and official notices).

---

## 4. App Store Review Compliance Guardrails

### A. Apple Guideline 2.1 (Preloaded App Review Demo Credentials)
- Apple reviewers **will reject** any app requiring a login if valid test credentials are not provided in the App Review Information note.
- **Reviewer Credentials**:
  - **Username**: `apple.reviewer@mountcarmel.edu.in`
  - **Password**: `ReviewerDemo2025!`
  - **Role**: Parent (Provides realistic term marks, fee statements, and digital student pass without exposing real minor demographics).
  - The login screen includes a visible `🛡️ App Reviewer Demo Account (1-Tap Fill)` helper button.

### B. Apple Guideline 5.1.1 (In-App Account Deletion Requirement)
- Any app supporting account creation or login must provide a direct mechanism to request account deletion within the app.
- **Workflow**: Accessible directly in `ProfileScreen` → `Request Account Deletion`.
- **Policy**:
  1. A 30-day grace period is granted to prevent accidental data loss.
  2. Mobile login tokens and push notification registrations are purged.
  3. Official academic transcripts and statutory examination records remain preserved in the school offline archive per MBSE / CBSE government mandates.

### C. Apple Guideline 4.2 (Minimum Functionality & Native Rebuttal)
- Apple frequently challenges school apps under Guideline 4.2 ("Too simple / repackaged website").
- **Rebuttal Statement**:
  > "EduPortal is a pure native React Native / Expo application utilizing device hardware capabilities including camera QR code scanning for physical security gates, native biometric credentials, local SQLite cached offline grade pass, and push notifications. It is not a WebKit wrapper."

---

## 5. Google Play Store Submission Step-by-Step

1. **Download Store Package**:
   - Navigate to `/platform/apps` in the EduPortal Platform Control.
   - Click **Export Store Package (ZIP)** to download `mountcarmel-store-package.zip`.
2. **Create New App in Google Play Console**:
   - App Name: `Mount Carmel HSS Aizawl`
   - Default Language: English (India)
   - App or Game: App
   - Free or Paid: Free
3. **App Content & Data Safety**:
   - Open `metadata/data_safety_answers.json` from the ZIP.
   - Declare Data Collected: Personal Info (Name, Email, Student ID), Financial Info (Purchase history), Photos (ID card).
   - Declare Data Shared: None (Zero third-party data sharing).
   - Encryption in transit: Checked (HTTPS / TLS 1.3).
   - Account deletion URL: Enter the URL from `metadata/listing_en.json`.
4. **Store Listing Assets**:
   - App Icon: Upload `assets/icon-512x512.png`.
   - Feature Graphic: Upload `assets/feature-graphic-1024x500.png`.
   - Screenshots: Upload phone screenshots.
   - Copy English and Mizo descriptions from `metadata/listing_en.json` and `metadata/listing_lus.json`.
5. **Upload Production Binary**:
   - Download the production `.aab` (Android App Bundle) from Cloudflare R2 via `/platform/apps`.
   - Upload to Production track.
6. **Submit for Review**:
   - Standard review time: 3 to 7 working days.

---

## 6. Apple App Store Submission Step-by-Step

1. **App Store Connect Setup**:
   - Click `+` → **New App**.
   - Platforms: iOS.
   - Name: `Mount Carmel HSS Aizawl`.
   - Primary Language: English.
   - Bundle ID: `in.edu.mountcarmel.portal`.
   - SKU: `mountcarmel-portal`.
2. **App Privacy Nutrition Labels**:
   - Open `metadata/apple_privacy_nutrition_labels.json`.
   - Declare Contact Info (Email, Name, Phone), Financial Info (Payment history), Identifiers (User ID).
   - Declare purpose as **App Functionality**.
3. **App Review Information**:
   - Sign-in required: Checked.
   - Username: `apple.reviewer@mountcarmel.edu.in`.
   - Password: `ReviewerDemo2025!`.
   - Notes: Explain that the app provides student report cards, tuition fee statements, and offline digital identity passes.
4. **Attach Build**:
   - Link the compiled `.ipa` uploaded via EAS Submit / TestFlight.
5. **Submit for App Review**:
   - Standard review time: 24 to 48 hours.

---

## 7. Version Updates: OTA vs Native Store Releases

| Change Type | Release Channel | Requires Store Review? | Turnaround |
| :--- | :--- | :--- | :--- |
| **JS / UI Tweaks / Bugfixes** | EAS Update (Over-the-Air) | **No** | Instant (5 minutes) |
| **Bilingual Mizo String Updates**| EAS Update (Over-the-Air) | **No** | Instant (5 minutes) |
| **Plan Feature Unlocks (Upgrades)**| Runtime Entitlements (`/v1/tenant/config`) | **No** | Real-time (0 seconds) |
| **New Native Device Permissions (Camera, NFC)** | New Binary (`.aab` / `.ipa`) | **Yes** | 2 to 5 days |
| **Icon or Store Listing Text Changes** | Store Metadata Update | **Yes** | 1 to 2 days |

---

## 8. Plan Change Matrix (Upgrades & Downgrades)

- **Plan Upgrade (e.g. Essential → Pro)**:
  - Immediate unlock: The mobile app queries `/api/v1/tenant/config` at launch and enables the `exams` and `digitalId` tabs dynamically. No app rebuild or store submission is required.
- **Plan Downgrade**:
  - 30-day grace period: Modules display read-only records with a notice to contact the administrator.
  - After 30 days: Modules are omitted from the bottom navigation bar.
- **Account Suspension**:
  - Mobile app displays an institutional service unavailable banner. Academic data is never deleted.
