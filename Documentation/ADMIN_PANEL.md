# Admin Panel & Operator Manual

This document provides a detailed overview of the **Deliverix Admin Panel** (`src/components/AdminDashboard.tsx` and `src/components/AdminSeoSubtabs.tsx`), detailing how administrators can configure and manage the entire platform.

---

## 1. Authentication & Security

- **Access Route:** `/admin`
- **Gating mechanism:** Protected by Firebase Authentication and custom credentials. Unauthorized visitors are redirected to the standard login modal.
- **Log out:** Immediate session termination button that clears the client-side token and refreshes the router.

---

## 2. Dashboard Sections & Workspaces

The Admin Panel is organized into tabbed workspaces:

### 2.1 Candidates CRM Workspace
The primary workflow center for candidate processing and tracking.
- **Metrics Grid:** Real-time counters showing total leads, contacted rate, and partner conversions.
- **Pipeline List:** A complete tabular listing of applicants with details: Name, Telephone, Town, Vehicle Type, Selected Platform, Date of signup, and Referral UTM tag.
- **Filters:** Search instantly by candidate name, telephone number, or filter by specific city and vehicle types.
- **Status Toggles:** A dropdown menu allows admins to move candidates along the pipeline states:
  `NEW` → `CONTACTED` → `DOCUMENTS_PENDING` → `SENT_TO_PARTNER` → `REGISTRATION` → `ACTIVE` → `REJECTED/CANCELLED`.

### 2.2 Partners & Fleet Manager
Configure the official partner fleets receiving candidate referrals.
- **Fleet List:** Tabular view of active partner agencies in Serbia.
- **Fields Config:**
  - Naziv flote (Fleet Name).
  - Aktivni gradovi (Cities supported).
  - Platforme (Supported: Wolt, Glovo, Mister D, etc.).
  - Status (Active / Inactive).
  - Kontakt (Email, Phone, Address).
- **Referral Link Generator:** A tool to generate unique links with custom UTM parameters (e.g., `?ref=agencija-xyz`) for precise marketing channel tracking.

### 2.3 Blog CMS Manager
A complete text-publishing environment for SEO growth.
- **Article Editor:** Simple writing tool supporting Markdown text formatting.
- **Fields Config:**
  - Title (H1 header).
  - Slug (URL segment, e.g., `kako-postati-wolt-dostavljac-2026`).
  - Cover Image (URL selection or direct upload).
  - Excerpt (Short meta-description summary).
  - Content (The article body text).
- **Status Toggle:** Draft or Published. Published articles instantly propagate to the live blog list and the dynamic `/sitemap.xml`.

### 2.4 FAQ & Knowledge Manager
Manage the unified database list of customer support questions.
- **Questions List:** Real-time accordion view of active FAQs.
- **Fields Config:**
  - Pitanje (Question).
  - Odgovor (Answer).
  - Redosled (Order index for positioning).
- **Single Source of Truth (SSOT):** Changes made here instantly update the public FAQ section and the JSON-LD FAQPage schema server-side.

### 2.5 SEO & Global Settings Manager
Control the core meta properties and dynamic design accents of the homepage.
- **Fields Config:**
  - Homepage H1 & Subtitle.
  - SEO Meta Title & Meta Description.
  - Analytics IDs (Google Analytics measurement ID).
  - Hero image URL & Cover Alt attributes.
  - Dynamic Slider images list.
  - Footer copyright details.
- **Save Trigger:** Saves configurations directly to `site_configs/homepage_settings`.

---

## 3. Real-time Synchronization & Caching

Deliverix does not require manual caching or content-purge operations:

- **Real-time Listeners:** The public website uses active Firebase `onSnapshot` listeners. When an administrator modifies a landing page header or blog excerpt, the update propagates to connected users instantly without a reload.
- **Instant Server Updates:** The Express server fetches dynamic settings and blog articles from Firestore on every request. This ensures that search crawlers immediately receive updated meta titles, description, and schemas without manual cache clearing.
