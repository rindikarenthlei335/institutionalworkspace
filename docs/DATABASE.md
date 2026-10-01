# Database Schema & RLS Security Policy Reference

All tables enforce `tenant_id uuid not null references tenants(id)` (except platform global tables) with appropriate indexes and strict RLS policies.

---

## 1. Helper Security Functions (`private` schema)
- `private.current_tenant_id()`: Returns `uuid` of current request tenant from session setting or JWT.
- `private.current_role()`: Returns `text` of current user role from `profiles`.
- `private.is_platform_owner()`: Returns `boolean` if user role is `platform_owner`.
- `private.has_feature(feature_key text)`: Checks if current tenant plan or override has active feature.

---

## 2. Table Summary & RLS Policies

| Table Name | Tenant ID Required | Public Anon Access | Admin / Staff Write Access | RLS Isolation Policy Summary |
|---|---|---|---|---|
| `plans` | No | Read-only | Platform Owner only | Global reference table |
| `plan_features` | No | Read-only | Platform Owner only | Global reference table |
| `tenants` | Primary Key (`id`) | Published details only | Platform Owner & Super Admin | `id = private.current_tenant_id()` or platform owner |
| `tenant_domains` | Yes | Published custom domain lookup | Platform Owner & Super Admin | Domain lookup public; write restricted to owner/super_admin |
| `profiles` | Yes | No | Self & Super Admin | `tenant_id = private.current_tenant_id()` |
| `site_settings` | Yes | Read `is_published=true` | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `notices` | Yes | Read `is_published=true` | Super Admin, Admin, Data Entry | `tenant_id = private.current_tenant_id()` |
| `faculty` | Yes | Read `is_published=true` | Super Admin, Admin, Data Entry | `tenant_id = private.current_tenant_id()` |
| `facilities` | Yes | Read `is_published=true` | Super Admin, Admin, Data Entry | `tenant_id = private.current_tenant_id()` |
| `gallery_albums` | Yes | Read `is_published=true` | Super Admin, Admin, Data Entry | `tenant_id = private.current_tenant_id()` |
| `students` | Yes | **NO ACCESS** | Super Admin, Admin, Data Entry, Accountant | `tenant_id = private.current_tenant_id()` |
| `guardians` | Yes | **NO ACCESS** | Staff & Linked Parent | `tenant_id = private.current_tenant_id()` |
| `fee_structures` | Yes | **NO ACCESS** | Super Admin, Admin, Accountant | `tenant_id = private.current_tenant_id()` |
| `invoices` | Yes | **NO ACCESS** | Accountant, Super Admin, Linked Parent | `tenant_id = private.current_tenant_id()` |
| `payments` | Yes | **NO ACCESS** | Accountant, Super Admin, Linked Parent | `tenant_id = private.current_tenant_id()` |
| `applications` | Yes | Insert (Turnstile protected) | Staff | `tenant_id = private.current_tenant_id()` |
| `domain_requests` | Yes | **NO ACCESS** | Super Admin & Platform Owner | `tenant_id = private.current_tenant_id()` |
| `audit_logs` | Yes | **NO ACCESS** | Super Admin & Platform Owner | `tenant_id = private.current_tenant_id()` |
| `service_catalog` | No | Read-only | Platform Owner only | Global add-on catalog |
| `service_orders` | Yes | **NO ACCESS** | Super Admin & Platform Owner | `tenant_id = private.current_tenant_id()` |
| `service_order_items`| Yes | **NO ACCESS** | Super Admin & Platform Owner | Inherited via order tenant_id |
| `service_item_documents`| Yes | **NO ACCESS** | Super Admin & Platform Owner | Private R2 bucket, signed URLs |
| `service_subscriptions`| Yes | **NO ACCESS** | Super Admin & Platform Owner | `tenant_id = private.current_tenant_id()` |
| `staff_profiles` | Yes | Public Faculty Sync | Super Admin & Admin | Sensitive fields hidden from public |
| `import_batches` | Yes | **NO ACCESS** | Super Admin & Data Entry | `tenant_id = private.current_tenant_id()` |
| `exam_types` | Yes | Read-only for Parent | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `grading_schemes` | Yes | Read-only for Parent | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `student_marks` | Yes | **NO ACCESS** | Teachers (assigned) & Admin | `tenant_id = private.current_tenant_id()` |
| `marksheets` | Yes | Public Verification Token | Super Admin & Admin | Minimal confirmation at `/verify/marksheet/[token]` |
| `id_card_templates` | Yes | **NO ACCESS** | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `id_cards` | Yes | Public Verification Token | Super Admin & Admin | Minimal confirmation at `/verify/id/[token]` |
| `app_versions` | No | Public / Client App | Platform Owner | Global mobile version management |
| `tenant_apps` | Yes | **NO ACCESS** | Super Admin & Platform Owner | Store credentials encrypted in Vault |
| `app_builds` | Yes | **NO ACCESS** | Platform Owner | Private R2 build artifact storage |
| `app_releases` | Yes | **NO ACCESS** | Platform Owner | Release track status & audit |
| `tenant_modules` | Yes | **NO ACCESS** | Super Admin | `tenant_id = private.current_tenant_id()` |
| `custom_entities` | Yes | **NO ACCESS** | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `custom_fields` | No (entity) | **NO ACCESS** | Super Admin & Admin | Cascades from entity |
| `custom_records` | Yes | **NO ACCESS** | Role-permission gated | GIN indexed JSONB; `tenant_id` isolated |
| `attendance_sessions`| Yes | **NO ACCESS** | Teachers & Admin | `tenant_id = private.current_tenant_id()` |
| `student_attendance`| Yes | Parent Portal View | Teachers & Admin | Minor student attendance isolation |
| `certificate_templates`| Yes | **NO ACCESS** | Super Admin & Admin | `tenant_id = private.current_tenant_id()` |
| `issued_certificates`| Yes | Public Verification Token | Super Admin & Admin | Minimal confirmation at `/verify/certificate/[token]` |
| `ai_usage` | Yes | **NO ACCESS** | Super Admin & Platform Owner | Usage token tracking & monthly quota |
| `ai_conversations` | Yes | **NO ACCESS** | User (Self) | Private tenant conversation history |
| `ai_messages` | No (conv) | **NO ACCESS** | User (Self) | Cascades from conversation |
| `help_articles` | No | Read-only (Auth) | Platform Staff | Searchable knowledge base (en + lus) |

