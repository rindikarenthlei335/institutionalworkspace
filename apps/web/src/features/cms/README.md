# Website CMS Feature Module

## Purpose
Manages public website content for all 6 core public modules (Notices, Slides, Faculty, Facilities, Activities/Achievements, Gallery, About).

## Routes
- Public: `/`, `/about`, `/faculty`, `/facilities`, `/activities`, `/notices`, `/gallery`
- Admin: `/admin/content`

## Tables
`site_settings`, `about_content`, `home_slides`, `achievements`, `activities`, `gallery_albums`, `gallery_images`, `faculty`, `facilities`, `notices`, `contact_messages`.

## Permissions
- Anon: `SELECT` published content (`is_published = true`)
- Staff (`school_super_admin`, `school_admin`, `data_entry_operator`): Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` within tenant scope.

## How to Extend
Add new Zod validation in `schema.ts`, declare UI types in `types.ts`, add server actions in `actions/`, and register in `apps/web/src/config/nav.ts`.
