# Principal Executive Dashboard (Pro Tier)

The Principal Dashboard (`@eduportal/web/features/principal`) is the high-level executive analytics suite for institutional principals and directors.

## Features
- **UI Level 2 Cards (`UILevel2Card`)**: Interactive metric cards that expand into drilldown breakdown modals for instant detail inspection.
- **Financial Collection Trends**: Visual bar chart comparison of monthly fee collection vs targets.
- **Class Dues Matrix**: Progress bar breakdown of fee collection rates across classes.
- **Fee Defaulter Workflow**: Actionable defaulter roster with 1-click SMS/WhatsApp fee reminder notifications.
- **Admission Funnel**: Stage-by-stage visual conversion pipeline from lead to fee-paid enrolled student.
- **Export & Reporting**: Trigger full CSV or PDF snapshot generation.

## Security & Access
Restricted to institutional administrators (`principal`, `management`, `owner`) via multi-tenant RLS checks and Pro feature tier verification.
