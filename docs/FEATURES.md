# Feature Matrix & Status Directory

This file maintains the complete list of platform features across Phase 1 and Phase 2, plan availability (Basic, Essential, Pro, Ultimate), allowed roles, database dependencies, and file paths.

---

| Feature Key | Name | Status | Min Plan | Allowed Roles | Routes | Database Tables | Implementation Files |
|---|---|---|---|---|---|---|---|
| `public_website` | Public Branded Website | Done (P1 M2) | Basic | Anon, All | `/`, `/about`, `/faculty`, `/facilities`, `/activities`, `/notices`, `/gallery` | `site_settings`, `about_content`, `home_slides`, `achievements`, `activities`, `gallery_albums`, `gallery_images`, `faculty`, `facilities`, `notices` | `apps/web/src/app/(public)/` |
| `theme_customization` | Logo, Favicon & Theme Preset | Done (P1 M2) | Basic | `school_super_admin`, `school_admin` | `/admin/settings` | `site_settings` | `apps/web/src/features/settings/` |
| `cms_admin` | Content Management System | Done (P1 M2) | Basic | `school_super_admin`, `school_admin`, `data_entry_operator` | `/admin/content` | Content tables | `apps/web/src/features/cms/` |
| `user_management` | Staff Users & Roles | Done (P1 M4) | Essential | `school_super_admin` | `/admin/settings` | `profiles` | `packages/shared/src/constants/roles.ts` |
| `student_management` | Students & Guardians | Done (P1 M4) | Essential | `school_super_admin`, `school_admin`, `data_entry_operator`, `teacher` | `/admin/students` | `academic_years`, `classes`, `sections`, `students`, `guardians`, `student_documents` | `apps/web/src/features/students/` |
| `fee_management` | Fee Structures & Invoicing | Done (P1 M4) | Essential | `school_super_admin`, `school_admin`, `accountant` | `/admin/fees` | `fee_heads`, `fee_structures`, `fee_schedules`, `concessions`, `invoices`, `payments`, `receipts` | `apps/web/src/features/fees/` |
| `online_payment` | Parent Online Fee Collection | Done (P1 M4) | Essential | Parent, Anon | `/pay-fee`, `/portal/fees` | `payments`, `receipts`, `payment_gateway_accounts` | `apps/web/src/app/(public)/pay-fee/` |
| `online_admission` | Student Admission Portal | Done (P1 M4) | Essential | Anon, Staff | `/admission`, `/admin/admissions` | `admission_settings`, `applications`, `application_documents` | `apps/web/src/features/admission/` |
| `parent_portal` | Parent / Student PWA Portal | Done (P1 M4) | Essential | Parent, Student | `/portal/*` | All | `apps/web/src/app/portal/` |
| `custom_domain` | Custom Domain Connection | Done (P1 M6) | Basic | `school_super_admin` | `/admin/settings` | `tenant_domains` | `apps/web/src/features/domains/` |
| `domain_registration` | Managed Domain Service & Renewal | Done (P1 M6) | Basic | `school_super_admin`, Platform Owner | `/admin/settings`, `/platform/domains` | `domain_requests` | `apps/web/src/features/domains/` |
| `service_store` | Service Store & Prepaid Checkout | Done (P2 M1) | Basic | `school_super_admin` | `/admin/services`, `/platform/services` | `service_catalog`, `service_orders`, `service_order_items`, `service_item_documents`, `service_subscriptions` | `apps/web/src/features/services/` |
| `app_publishing` | App Store / Play Store Publishing | In Progress (P2 M1/M5) | Basic | `school_super_admin`, Platform Owner | `/admin/services`, `/platform/apps` | `tenant_apps`, `app_builds` | `apps/web/src/features/apps/` |
| `website_analytics` | First-Party Privacy Analytics | Done (P1 M5) | Pro | `school_super_admin`, Platform Owner | `/admin/analytics` | `site_events` | `apps/web/src/features/analytics/` |
| `principal_dashboard` | Executive Dashboard & Funnel | Done (P1 M5) | Pro | `school_super_admin` | `/admin/principal` | SQL Views / RPCs | `apps/web/src/features/principal/` |
| `data_hub` | Data Hub Master Records | Planned (P2 M2) | Pro | `school_super_admin`, `school_admin` | `/admin/data-hub` | Master academic tables | `apps/web/src/features/data-hub/` |
| `excel_import` | Excel Import / Export Center | Planned (P2 M2) | Pro | Staff | `/admin/data-hub/import` | `import_batches` | `apps/web/src/features/data-hub/` |
| `staff_module` | Staff & Teacher Master Module | Planned (P2 M2) | Pro | `school_super_admin`, `school_admin` | `/admin/staff` | `staff_profiles` | `apps/web/src/features/staff/` |
| `exams_module` | Exams, Marks & Marksheets | Planned (P2 M3) | Pro | `school_super_admin`, `teacher` | `/admin/exams`, `/verify/marksheet` | `exams`, `marks`, `marksheets` | `apps/web/src/features/exams/` |
| `id_card_module` | ID Card Generator | Planned (P2 M3) | Pro | `school_super_admin`, `school_admin` | `/admin/id-cards`, `/verify/id` | `id_cards` | `apps/web/src/features/id-cards/` |
| `ai_copilot` | AI Copilot (Mizo + English) | Planned (P2 M8) | Ultimate | Staff, Parents (flag) | `/admin/copilot`, Floating dock | `ai_usage`, `ai_conversations` | `apps/web/src/features/copilot/` |
| `module_manager` | Dynamic Module Manager | Planned (P2 M6) | Ultimate | `school_super_admin` | `/admin/modules` | `tenant_modules` | `apps/web/src/features/modules/` |
| `custom_module_builder` | Custom Module Builder (No-Code) | Planned (P2 M7) | Ultimate | `school_super_admin` | `/admin/builder` | `custom_entities`, `custom_records` | `apps/web/src/features/builder/` |
| `optional_modules` | Installable Modules (Attendance, etc.) | Planned (P2 M7) | Ultimate | Staff | Modular routes | Dynamic tables | `apps/web/src/features/modules/` |
| `platform_panel` | SaaS Platform Owner Dashboard | Done (P1 M3) | Platform Owner | `platform_owner` | `/platform/*` | Platform tables | `apps/web/src/features/platform/` |
