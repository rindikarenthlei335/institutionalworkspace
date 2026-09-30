# Design Gaps & Missing Screens (`// TODO(design)`)

This document lists every screen, modal, or component required by `docs/PROJECT_SPEC.md` that was not present in the original Figma export. All missing items are constructed using the official design tokens and components specified in `docs/AUDIT.md`.

---

## 1. Public School Website
- `// TODO(design): Public Photo & Video Gallery Album Lightbox` (`/gallery`)
  - Album grid with cover images, lightbox viewer with full-screen WebP navigation.
- `// TODO(design): Admission Application Public Status Tracker` (`/admission/status`)
  - Status search by application number + phone/OTP, showing timeline progress step (Draft -> Submitted -> Under Review -> Approved/Rejected).
- `// TODO(design): Tenant DPDP Act Privacy & Minor Data Consent Modal`
  - Explicit parent/guardian consent checkbox and terms modal on public admission forms.

## 2. School Admin Panel
- `// TODO(design): Custom Domain Setup & CNAME/TXT DNS Verifier Page` (`/admin/settings/domain`)
  - Displays CNAME `school.root_domain` and TXT verification record, live status pill (Pending -> Verifying -> Active -> Failed), manual "Verify DNS" trigger button, and "Get a domain" request wizard.
- `// TODO(design): Student CSV Import & Validation Errors Report Modal` (`/admin/students/import`)
  - Drag-and-drop CSV uploader, row-by-row validation feedback (missing fields, duplicate roll numbers), preview table, and bulk insert action.
- `// TODO(design): Fee Structure Builder (Day vs Hosteller Split)` (`/admin/fees/structures`)
  - Grid matrix allocating fee heads across Academic Year x Class x Residence Type (Day / Hosteller) with installment due date assignment.
- `// TODO(design): Admission Application Review & Convert-to-Student Workflow` (`/admin/admissions/[id]`)
  - Application detailed view, document inspection, approval action that auto-provisions student record, generates admission number, and creates initial fee invoice.
- `// TODO(design): Multi-Tenant Audit Log Viewer` (`/admin/audit-logs`)
  - Filterable activity table showing timestamp, actor profile, action type, target table, and old/new JSON diffs.

## 3. Platform Owner Panel
- `// TODO(design): Tenant Onboarding Wizard` (`/platform/tenants/new`)
  - Multi-step modal: School basic info -> Subdomain check & validation -> Plan selection -> Initial Super Admin invite creation.
- `// TODO(design): Domain Purchase & DNS Setup Workflow Queue` (`/platform/domains`)
  - Request queue table for `.edu.in`, `.ac.in`, `.com` requests, document attachment viewer, status transition controls, registrar renewal tracking, and manual override trigger.
- `// TODO(design): Audited Admin Impersonation Modal & Banner`
  - Warning dialog before entering a school admin context as platform owner, persistent top banner indicating active impersonation mode.
- `// TODO(design): Service Requests Queue` (`/platform/services`)
  - Queue for Google Search Console submission, Google Maps claim/register, SEO manual packages, and White-label app request tracking.
