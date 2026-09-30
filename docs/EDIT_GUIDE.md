# Developer & Product Owner Edit Guide

"If you want to change X, edit these files."

---

## 1. Public Website Layout & Structure
- **To edit public navigation or header/footer:**
  - `apps/web/src/config/nav.ts` (nav links & required features/roles)
  - `apps/web/src/features/public-website/components/WebsiteHeader.tsx`
  - `apps/web/src/features/public-website/components/WebsiteFooter.tsx`
- **To edit Home page hero slider or section order:**
  - `apps/web/src/app/(public)/page.tsx`
  - `apps/web/src/features/public-website/components/HomeHero.tsx`

---

## 2. Admission Form Fields & Process
- **To add a field to the public online admission form:**
  - `packages/shared/src/schemas/admission.ts` (Zod validation schema)
  - `apps/web/src/features/admission/components/AdmissionForm.tsx` (UI input controls)
  - `supabase/migrations/00005_admission.sql` (if new database column required)

---

## 3. Fee Heads & Fee Structures
- **To add a new fee head type (e.g. Computer Fee, Bus Maintenance):**
  - `packages/shared/src/constants/fees.ts`
  - `apps/web/src/features/fees/components/FeeHeadForm.tsx`
  - // [EDIT-HERE: fee-heads] in `apps/web/src/config/features.ts`

---

## 4. Dashboard Widgets & Stat Cards
- **To add a new stat card to the Principal Dashboard:**
  - `apps/web/src/features/principal/queries/stats.ts` (RPC aggregator query)
  - `apps/web/src/features/principal/components/PrincipalDashboardView.tsx`
  - // [EDIT-HERE: principal-dashboard-widget]

---

## 5. Themes & Design System Presets
- **To add a new school color theme preset:**
  - `apps/web/src/config/theme.ts` (Add CSS variable palette)
  - // [EDIT-HERE: theme-preset]

---

## 6. Languages & Internationalization (i18n)
- **To add a new translation string or language:**
  - `packages/shared/src/i18n/en.json` (English base dictionary)
  - `packages/shared/src/i18n/mizo.json` (Mizo dictionary)
  - `apps/web/src/config/locales.ts` (Locale definitions)

---

## 7. Plan Features & Upgrade Prompts
- **To change feature availability across plans:**
  - `apps/web/src/config/features.ts` (Feature flag definitions)
  - `apps/web/src/config/plans.ts` (Plan default mappings)
  - `supabase/seed.sql` (Database seed rows)
