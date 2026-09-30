# Student & Guardian Management Module

## Purpose
Manages student records, class/section assignments, Day vs Hosteller residence types, CSV bulk import/export, and promote-to-next-class workflows.

## Routes
- Admin: `/admin/students`

## Tables
`students`, `guardians`, `student_documents`, `classes`, `sections`, `academic_years`.

## Permissions
- `school_super_admin`, `school_admin`, `data_entry_operator`: Create & Edit
- `data_entry_operator`: Cannot delete records
- `accountant`, `teacher`: Read-only lists
