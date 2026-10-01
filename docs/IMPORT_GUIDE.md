# Excel Import & Data Hub Guide: School Operator Runbook

## 1. Overview
The **Excel Import & Export Center** (`/admin/data-hub`) enables school data entry operators, clerks, and administrators to bulk-import up to 20,000+ student, staff, marks, and fee records directly using Excel (`.xlsx`) or CSV workbooks.

---

## 2. Step-by-Step Import Workflow

```
+--------------------+      +--------------------+      +--------------------+
| 1. Download        | ---> | 2. Upload & Auto-  | ---> | 3. Dry-Run & Diff  |
| Official Template  |      | Map Columns        |      | Verification       |
+--------------------+      +--------------------+      +--------------------+
                                                                   |
                                                                   v
+--------------------+      +--------------------+      +--------------------+
| 6. Download Batch  | <--- | 5. Transactional   | <--- | 4. Confirm &       |
| Result / Undo Log  |      | Batch Execution    |      | Apply Changes      |
+--------------------+      +--------------------+      +--------------------+
```

### Step 1: Download the Official Entity Template
1. Open **Admin -> Data Hub -> Import Center**.
2. Select your target entity:
   - `Students & Guardians`: Admission number, legal name, gender, DOB, class, section, residence type, blood group, guardian name & phone.
   - `Staff & Teachers`: Employee ID, name, designation, department, qualification, joining date, teaching subjects.
   - `Exam Marks`: Exam session, class, roll number, subject marks.
   - `Fee Opening Balances`: Student admission number, previous term arrears (₹).
3. Choose your preferred header language: **English (`en`)** or **Mizo (`lus`)**.
4. Download the generated `.xlsx` workbook. Sheet 1 contains the formatted table with sample data; Sheet 2 outlines all validation rules and allowed values.

### Step 2: Fill Data & Upload
- Maintain mandatory fields (e.g. `admission_no`, `name`, `class`, `gender`).
- Save the file and upload it in the Import Center.
- The browser parser reads the workbook client-side in streaming chunks without crashing browser memory.

### Step 3: Column Mapping & Auto-Detection
- The engine automatically maps your spreadsheet columns using fuzzy matching against both English and Mizo dictionary labels.
- If your spreadsheet uses custom headers, adjust the dropdown selections.
- Save your custom mapping as a preset for future monthly imports.

### Step 4: Dry-Run Validation & Visual Diff
Before writing anything to the database:
- The system checks every row for required fields, phone number validity, and date formats.
- Checks for duplicate admission numbers within the spreadsheet itself.
- Visual Diff: Displays green for new records, blue for records that will be updated, gray for unchanged records, and red for blocked rows.

### Step 5: Transactional Batch Commit
- Click **Confirm & Import**.
- Records are inserted/updated in atomic batches.
- If any row encounters a fatal database error, the transaction halts cleanly without leaving orphaned records.

### Step 6: Batch Result Report & 1-Click Rollback
- Every import run receives an immutable identifier (e.g. `IMP-2026-0012`).
- If mistakes are spotted post-import:
  - Click **Undo / Rollback Import**.
  - All records created during that batch are deleted, and modified records are restored to their pre-import state.

---

## 3. Bulk Student Photo ZIP Unpacker
To upload student or staff profile photos in bulk:
1. Name image files using the exact admission number or employee ID (e.g. `ADM-2024-001.jpg`, `ADM-2024-002.png`, `EMP-101.webp`).
2. Compress all images into a single `.zip` file.
3. In the Data Hub Photo Center, upload the ZIP archive.
4. The system automatically unpacks, converts images to WebP format, uploads them to private Cloudflare R2 object storage, and associates them with the corresponding student and staff records.

---

## 4. Troubleshooting Common Import Errors
- **Error: "Missing required field 'Full Name'"**: Ensure column headers match and every row has a student name.
- **Error: "Invalid Date of Birth"**: Use ISO format `YYYY-MM-DD` or standard Excel date formatting.
- **Error: "Duplicate admission number"**: Admission numbers must be unique across the entire school. Use **Upsert (Sync)** mode if you intend to update existing students.
