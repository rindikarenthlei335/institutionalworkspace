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
