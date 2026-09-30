# Developer & Product Owner Edit Guide

"If you want to change X, edit these files."

---

## 1. Public Website Layout & Structure
- **To edit public header or footer:**
  - `apps/web/src/app/(public)/layout.tsx`
- **To edit Home page hero slider or section order:**
  - `apps/web/src/app/(public)/page.tsx`

---

## 2. Admission Form Fields & Process
- **To add a field to the public online admission form:**
  - `packages/shared/src/schemas/admission.ts` (Zod validation schema)
  - `apps/web/src/app/(public)/admission/page.tsx` (Form UI & input handlers)
  - `supabase/migrations/00003_academic_fees_admission_analytics.sql` (DB schema migration)

---

## 3. Fee Heads & Fee Structures
- **To add a new fee head type (e.g. Computer Fee, Bus Maintenance):**
  - `packages/shared/src/schemas/fee.ts`
  - `apps/web/src/app/admin/fees/page.tsx`

---

## 4. Dashboard Widgets & Stat Cards
- **To add a new stat card to the Principal Dashboard:**
  - `apps/web/src/app/admin/principal/page.tsx`
  - `apps/web/src/components/ui/StatCard.tsx`

---

## 5. Themes & Design System Presets
- **To add a new school color theme preset:**
  - `packages/shared/src/constants/themes.ts`
  - `apps/web/src/lib/theme.ts`
  - `apps/web/src/app/globals.css`

---

## 6. Languages & Internationalization (i18n)
- **To add a new translation string or language:**
  - `packages/shared/src/i18n/en.json` (English base dictionary)
  - `packages/shared/src/i18n/mizo.json` (Mizo dictionary)
  - `packages/shared/src/index.ts` (Loader exports)

---

## 7. Plan Features & Upgrade Prompts
- **To change feature availability across plans:**
  - `packages/shared/src/constants/plans.ts` (Plan default mappings)
  - `apps/web/src/lib/features.ts` (Feature flag check engine)
  - `supabase/seed.sql` (Database seed rows)
