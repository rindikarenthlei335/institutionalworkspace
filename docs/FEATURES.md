# Feature Matrix & Status Directory

This file maintains the complete list of platform features, plan availability, allowed roles, database dependencies, and file paths.

---

| Feature Key | Name | Status | Min Plan | Allowed Roles | Routes | Database Tables | Implementation Files |
|---|---|---|---|---|---|---|---|
| `public_website` | Public Branded Website | Done (M2 Basic) | Basic | Anon, All | `/`, `/about`, `/faculty`, `/facilities`, `/activities`, `/notices`, `/gallery` | `site_settings`, `about_content`, `home_slides`, `achievements`, `activities`, `gallery_albums`, `gallery_images`, `faculty`, `facilities`, `notices` | `apps/web/src/app/(public)/` |
| `theme_customization` | Logo, Favicon & Theme Preset | Done (M2 Basic) | Basic | `school_super_admin`, `school_admin` | `/admin/settings` | `site_settings` | `apps/web/src/features/settings/` |
| `cms_admin` | Content Management System | Done (M2 Basic) | Basic | `school_super_admin`, `school_admin`, `data_entry_operator` | `/admin/content` | Content tables | `apps/web/src/features/cms/` |
| `user_management` | Staff Users & Roles | Done (M4 Essential) | Essential | `school_super_admin` | `/admin/settings` | `profiles` | `packages/shared/src/constants/roles.ts` |
| `student_management` | Students & Guardians | Done (M4 Essential) | Essential | `school_super_admin`, `school_admin`, `data_entry_operator`, `teacher` | `/admin/students` | `academic_years`, `classes`, `sections`, `students`, `guardians`, `student_documents` | `apps/web/src/features/students/` |
| `fee_management` | Fee Structures & Invoicing | Done (M4 Essential) | Essential | `school_super_admin`, `school_admin`, `accountant` | `/admin/fees` | `fee_heads`, `fee_structures`, `fee_schedules`, `concessions`, `invoices`, `payments`, `receipts` | `apps/web/src/features/fees/` |
| `online_payment` | Parent Online Fee Collection | Done (M4 Essential) | Essential | Parent, Anon | `/pay-fee`, `/portal/fees` | `payments`, `receipts`, `payment_gateway_accounts` | `apps/web/src/app/(public)/pay-fee/` |
| `online_admission` | Student Admission Portal | Done (M4 Essential) | Essential | Anon, Staff | `/admission`, `/admin/admissions` | `admission_settings`, `applications`, `application_documents` | `apps/web/src/features/admission/` |
| `parent_portal` | Parent / Student PWA Portal | Done (M4 Essential) | Essential | Parent, Student | `/portal/*` | All | `apps/web/src/app/portal/` |
| `custom_domain` | Custom Domain Connection | Done (M2 Basic) | Basic | `school_super_admin` | `/admin/settings` | `tenant_domains` | `apps/web/src/features/settings/components/DomainSettingsForm.tsx` |
| `domain_registration` | Managed Domain Service | Done (M3 Platform) | Basic | `school_super_admin`, Platform Owner | `/platform/domains` | `domain_requests` | `apps/web/src/app/platform/domains/` |
| `website_analytics` | First-Party Privacy Analytics | Ready | Pro | `school_super_admin`, Platform Owner | `/api/track` | `site_events` | `apps/api/src/index.ts` |
| `principal_dashboard` | Executive Dashboard & Funnel | Done (M2 Basic) | Pro | `school_super_admin` | `/admin/principal` | SQL Views / RPCs | `apps/web/src/app/admin/principal/` |
| `platform_panel` | SaaS Platform Owner Dashboard | Done (M3 Platform) | Platform Owner | `platform_owner` | `/platform/*` | Platform tables | `apps/web/src/features/platform/` |
