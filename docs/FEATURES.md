# Feature Matrix & Status Directory

This file maintains the complete list of platform features, plan availability, allowed roles, database dependencies, and file paths.

---

| Feature Key | Name | Status | Min Plan | Allowed Roles | Routes | Database Tables | Implementation Files |
|---|---|---|---|---|---|---|---|
| `public_website` | Public Branded Website | Ready | Basic | Anon, All | `/`, `/about`, `/faculty`, `/facilities`, `/activities`, `/notices`, `/gallery` | `site_settings`, `about_content`, `home_slides`, `achievements`, `activities`, `gallery_albums`, `gallery_images`, `faculty`, `facilities`, `notices` | `apps/web/src/features/public-website/` |
| `theme_customization` | Logo, Favicon & Theme Preset | Ready | Basic | `school_super_admin`, `school_admin` | `/admin/settings` | `site_settings` | `apps/web/src/features/settings/` |
| `cms_admin` | Content Management System | Ready | Basic | `school_super_admin`, `school_admin`, `data_entry_operator` | `/admin/content` | Content tables | `apps/web/src/features/cms/` |
| `user_management` | Staff Users & Roles | Ready | Essential | `school_super_admin` | `/admin/settings/users` | `profiles` | `apps/web/src/features/users/` |
| `student_management` | Students & Guardians | Ready | Essential | `school_super_admin`, `school_admin`, `data_entry_operator`, `teacher` | `/admin/students` | `academic_years`, `classes`, `sections`, `students`, `guardians`, `student_documents` | `apps/web/src/features/students/` |
| `fee_management` | Fee Structures & Invoicing | Ready | Essential | `school_super_admin`, `school_admin`, `accountant` | `/admin/fees` | `fee_heads`, `fee_structures`, `fee_schedules`, `concessions`, `invoices`, `payments`, `receipts` | `apps/web/src/features/fees/` |
| `online_payment` | Parent Online Fee Collection | Ready | Essential | Parent, Anon | `/pay-fee`, `/portal/fees` | `payments`, `receipts`, `payment_gateway_accounts` | `apps/web/src/features/fees/` |
| `online_admission` | Student Admission Portal | Ready | Essential | Anon, Staff | `/admission`, `/admin/admissions` | `admission_settings`, `applications`, `application_documents`, `application_status_history` | `apps/web/src/features/admission/` |
| `parent_portal` | Parent / Student PWA Portal | Ready | Essential | Parent, Student | `/portal/*` | All | `apps/web/src/features/portal/` |
| `custom_domain` | Custom Domain Connection | Ready | Basic | `school_super_admin` | `/admin/settings/domain` | `tenant_domains`, `domain_requests` | `apps/web/src/features/domains/` |
| `domain_registration` | Managed Domain Service | Ready | Basic | `school_super_admin`, Platform Owner | `/admin/settings/domain`, `/platform/domains` | `domain_requests`, `domain_request_documents`, `domain_request_events` | `apps/web/src/features/domains/` |
| `website_analytics` | First-Party Privacy Analytics | Ready | Pro | `school_super_admin`, `school_admin`, Platform Owner | `/admin/analytics` | `site_events`, `site_stats_daily` | `apps/web/src/features/analytics/` |
| `principal_dashboard` | Executive Dashboard & Funnel | Ready | Pro | `school_super_admin` | `/admin/principal` | SQL Views / RPCs | `apps/web/src/features/principal/` |
| `platform_panel` | SaaS Platform Owner Dashboard | Ready | Platform Owner | `platform_owner` | `/platform/*` | Platform tables | `apps/web/src/features/platform/` |
