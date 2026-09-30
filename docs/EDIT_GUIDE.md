# Developer & Product Owner Edit Guide

"If you want to change X, edit these files."

---

## 1. Public Website Layout & Modules
- **To edit public header or footer:**
  - `apps/web/src/app/(public)/layout.tsx`
- **To edit Home page hero slider, achievements, or gallery:**
  - `apps/web/src/app/(public)/page.tsx`
  - `apps/web/src/features/cms/components/`
- **To edit Faculty directory or Facilities showcase:**
  - `apps/web/src/app/(public)/faculty/page.tsx`
  - `apps/web/src/app/(public)/facilities/page.tsx`

---

## 2. Student Management & Academic Records
- **To add fields to the student profile (e.g. blood group, Aadhaar):**
  - `apps/web/src/features/students/schema.ts` (Zod schema)
  - `apps/web/src/features/students/components/StudentFormModal.tsx` (Form UI)
  - `apps/web/src/features/students/components/StudentListTable.tsx` (Table display)
- **To modify bulk CSV student import columns or validation:**
  - `apps/web/src/features/students/components/CSVImportModal.tsx`

---

## 3. Fee Heads, Invoicing & Receipts
- **To add a new fee head type or change Day vs Hosteller fee logic:**
  - `packages/shared/src/schemas/fee.ts`
  - `apps/web/src/features/fees/components/FeeStructureBuilder.tsx`
- **To edit offline accountant fee collection dialog & receipt preview:**
  - `apps/web/src/features/fees/components/OfflineCollectionModal.tsx`
- **To adjust automated receipt formatting (`RCP-YYYY-XXXXX`):**
  - `tests/sequence_generator.test.ts`
  - `apps/web/src/features/fees/`

---

## 4. Online Admissions & DPDP Consent
- **To add a field to the public online admission form:**
  - `apps/web/src/features/admission/schema.ts`
  - `apps/web/src/features/admission/components/PublicAdmissionForm.tsx`
- **To adjust admin application review and convert-to-student workflow:**
  - `apps/web/src/features/admission/components/ConvertToStudentModal.tsx`
  - `apps/web/src/features/admission/components/AdminAdmissionList.tsx`

---

## 5. Website Analytics & Visitor Tracking
- **To change tracking metrics or period filters (7d, 30d, 90d):**
  - `apps/web/src/features/analytics/components/AnalyticsDashboardView.tsx`
- **To customize client-side pageview collection (device, referrer):**
  - `apps/web/src/features/analytics/components/TrackerScript.tsx`
  - `apps/api/src/index.ts` (`/api/track` endpoint)

---

## 6. Principal Executive Dashboard & Level 2 Cards
- **To add or modify Level 2 drilldown modal metrics:**
  - `apps/web/src/features/principal/components/UILevel2Card.tsx`
- **To change monthly fee collection vs target chart or defaulter reminders:**
  - `apps/web/src/features/principal/components/PrincipalDashboardView.tsx`

---

## 7. Custom Domains, Managed Registrations & Renewals
- **To change custom domain DNS CNAME/TXT generation or verification:**
  - `apps/web/src/features/domains/components/ConnectDomainCard.tsx`
  - `apps/api/src/index.ts` (`/api/domains/connect`, `/api/domains/verify`)
- **To adjust managed domain registration form or ERNET document checklists:**
  - `apps/web/src/features/domains/components/RequestDomainModal.tsx`
  - `apps/web/src/app/platform/domains/page.tsx`
- **To adjust the 60/30/15/7-day renewal expiration notification schedule:**
  - `apps/web/src/features/domains/components/DomainRenewalCard.tsx`
  - `apps/api/src/index.ts` (`checkDomainRenewals` cron function)

---

## 8. Add-on Services (SEO, Maps, Apps)
- **To add a new platform service or adjust pricing:**
  - `apps/web/src/features/services/components/ServiceCatalogView.tsx`
  - `apps/web/src/features/services/types.ts`
- **To edit platform owner service request triage queue:**
  - `apps/web/src/app/platform/services/page.tsx`

---

## 9. Themes & Design System Presets
- **To add a new school color theme preset:**
  - `packages/shared/src/constants/themes.ts`
  - `apps/web/src/lib/theme.ts`
  - `apps/web/src/app/globals.css`

---

## 10. Platform Owner & Multi-Tenant Management
- **To customize tenant onboarding wizard or plan matrix editor:**
  - `apps/web/src/app/platform/tenants/page.tsx`
  - `apps/web/src/app/platform/plans/page.tsx`
  - `apps/web/src/app/platform/billing/page.tsx`
