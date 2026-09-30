# Phase 2 Implementation & Refactoring Plan (P2-M0)

## 1. Codebase Audit vs Phase 1 Deliverables

| Area | Phase 1 Status | Phase 2 Impact / Gaps | Action Required |
|---|---|---|---|
| **Plan Architecture** | 3 plans (`basic`, `essential`, `pro`) in `packages/shared/src/types` and `constants/plans.ts`. | Phase 2 introduces 4th plan (`ultimate` ₹9999/mo) with AI Copilot, Module Manager, Custom Module Builder, 50 GB storage. | Update `PlanTier`, `PLAN_DEFAULTS`, feature matrices, and platform plan editor. |
| **Feature Keys** | 18 keys in `FeatureKey`. | Phase 2 adds 12 new feature keys: `service_store`, `data_hub`, `excel_import`, `staff_module`, `exams_module`, `id_card_module`, `app_publishing`, `ai_copilot`, `ai_monthly_message_quota`, `module_manager`, `custom_module_builder`, `optional_modules`. | Register all keys in `packages/shared/src/types/index.ts`, `config/features.ts`, and DB seed. |
| **Service Store** | Discrete forms for custom domains (`apps/web/src/features/domains`) and service requests (`apps/web/src/features/services`). | Phase 2 requires unified cart & checkout: ticking add-ons, prepaid platform checkout via `PLATFORM_RAZORPAY_*`, DOCX template generation, working-day ETA engine, order tracking. | Unify data model (`service_catalog`, `service_variants`, `service_prices`, `service_orders`, `service_order_items`, `service_item_documents`) and migrate Phase 1 records cleanly. |
| **i18n & Localization** | English (`en.json`) and Mizo (`mizo.json`) skeletons. | Phase 2 mandates bilingual from day 1 for all strings (en + lus), glossary in `glossary.lus.json`, and CI script `pnpm i18n:check` that enforces zero missing keys. | Standardize on `lus.json` (Mizo), create glossary, add `scripts/i18n_check.js`, add script to `package.json`. |
| **Mobile Architecture** | Reserved workspace (`apps/mobile`). | Phase 2 builds Expo / React Native shared app + white-label pipeline, runtime entitlement fetch `/v1/tenant/config`, Store Package export ZIP, and publishing runbook. | Build `apps/mobile` with Expo, app versioning, entitlement synchronization, and reviewer demo accounts. |
| **Pro Modules** | Analytics & Principal Dashboard built in M5. | Phase 2 adds Data Hub with browser Excel import/export (SheetJS), Staff master module with website faculty sync, Exams/Marksheet pipeline with A4 print PDF and public verification `/verify/marksheet/<token>`, and ID card generator. | Build feature modules: `data_hub`, `staff`, `exams`, `id_cards`. |
| **Ultimate Modules** | None (Phase 1 capped at Pro). | Module Manager (`ModuleManifest` standard), Custom Module Builder (no-code entities/forms/records), first-class installable Attendance & Certificates, and bilingual AI Copilot (Anthropic API). | Build `module_manager`, `custom_builder`, `attendance`, `certificates`, `ai_copilot`. |

---

## 2. Refactoring & Compatibility Safeguards

1. **Additive Schema Migrations:**
   - All Phase 2 tables (`service_catalog`, `service_orders`, `staff`, `exams`, `marksheets`, `id_cards`, `tenant_modules`, `custom_entities`, `custom_records`, `ai_usage`) are introduced via new migrations without modifying Phase 1 table constraints.
2. **Entitlement-Driven Plan Changes:**
   - Upgrades unlock features instantly via entitlement caches.
   - Downgrades implement a 30-day grace period where features remain read-only with upgrade prompts before being hidden.
   - Data is never deleted on plan downgrade or cancellation (90-day retention).
3. **Dual Payment Gateway Separation:**
   - Platform services & subscriptions use `PLATFORM_RAZORPAY_KEY_ID` / `SECRET`.
   - School fee collection continues to use the tenant's linked Razorpay Route account.
4. **Bilingual Rigor (en / lus):**
   - Every UI string in Phase 2 must exist in both `en.json` and `lus.json`.
   - `pnpm i18n:check` will be enforced in test runs.

---

## 3. Execution Roadmap (Milestones P2-M0 through P2-M9)

- **P2-M0 (Current):** Audit, 4-tier plan engine, new feature keys, plan change rules, Mizo glossary, i18n checker.
- **P2-M1:** Service Store: Unified catalog, tick cards, DOCX template generator, prepaid checkout, order tracking & fulfillment console.
- **P2-M2:** Data Hub, Excel Import/Export Center (SheetJS chunks, row validation, undo), Staff module & website faculty sync.
- **P2-M3:** Exams, Marks Grid, Marksheets (A4 PDF, QR verification), Parent Portal views, Principal Dashboard analytics, ID Card Generator.
- **P2-M4:** Mobile App (`apps/mobile` Expo): Shared app, runtime entitlement fetch, student/parent portal, offline PWA.
- **P2-M5:** App Publishing Pipeline: White-label configuration, Store Package ZIP export, asset validator, Vault secrets, operator runbook.
- **P2-M6:** Module Manager: `ModuleManifest` standard, tenant module lifecycle, guided install wizard, `pnpm gen:module`.
- **P2-M7:** Custom Module Builder (no-code entities, forms, lists, RLS), 6 templates, Attendance & Certificates installable modules.
- **P2-M8:** AI Copilot: Guide, Data, Action, and General modes (Anthropic API), Mizo prompt engineering, glossary injection, evals, quotas.
- **P2-M9:** Full bilingual audit (`i18n:check`), security audit against sections 1 & 7, performance pass, full tests, final delivery.
