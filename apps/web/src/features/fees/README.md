# Fee Management & Payment Settlement Module

## Purpose
Configures Day vs Hosteller fee structures, handles offline Accountant collection with idempotency verification, processes online Razorpay payments, and generates sequential PDF receipts.

## Routes
- Admin: `/admin/fees`
- Parent Public: `/pay-fee`, `/portal/fees`

## Tables
`fee_heads`, `fee_structures`, `invoices`, `payments`, `receipts`, `payment_gateway_accounts`.

## Permissions
- `accountant`, `school_super_admin`, `school_admin`: Full fee collection & invoicing
- `data_entry_operator`: Cannot edit fee structures
