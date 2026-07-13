# Firestore Database Schema

This document details the schema definitions, collections, and structural relationships within the Google Cloud Firestore NoSQL database for the **Deliverix** platform.

---

## 1. Firestore Database Structure

The database is structured into four primary root collections:

```
Firestore Root
  ├── site_configs (General site, hero and SEO configs)
  ├── blog_posts (Published and draft blog articles)
  ├── candidates (Applicant CRM registrations)
  └── partners (Vetted fleet partners)
```

---

## 2. Collections Deep-Dive & Schemas

### 2.1 `site_configs` Collection
Holds static configuration documents for the homepage, general SEO parameters, and dynamic sections.

#### Document: `homepage_settings`
- **`meta_title`** (string): Default SEO title of the website.
- **`meta_description`** (string): Default SEO meta-description.
- **`hero_title`** (string): Main display H1 on the homepage.
- **`hero_platform_title`** (string): Second line of the H1 highlighting platforms.
- **`homepage_subtitle`** (string): Under-hero subtext copy.
- **`hero_image_url`** (string): Dynamic hero background path or external image URL.
- **`ga_measurement_id`** (string): Google Analytics tracking tag (e.g., `G-XXXXXXXXXX`).
- **`faqs`** (array of objects):
  - **`question`** (string): The support question text.
  - **`answer`** (string): The detailed markdown answer text.

---

### 2.2 `blog_posts` Collection
Contains individual articles for SEO and industry news.

- **Document ID:** Auto-generated ID (or matching slug for direct lookups).
- **`title`** (string): Main article header (H1).
- **`slug`** (string): URL-friendly string (e.g., `kako-postati-wolt-dostavljac-2026`). Must be unique.
- **`content`** (string): Markdown content body of the article.
- **`excerpt`** (string): Meta description and card preview text.
- **`coverImage`** (string): Cover image path or URL.
- **`status`** (string): Can be `draft` or `published`.
- **`createdAt`** (timestamp): Date of creation.
- **`updatedAt`** (timestamp): Date of last edit.

---

### 2.3 `candidates` Collection
Stores applications filled out by job-seeking couriers.

- **Document ID:** Auto-generated ID.
- **`name`** (string): Candidate's full name.
- **`phone`** (string): Contact phone number.
- **`city`** (string): Town of interest (e.g., `Beograd`, `Novi Sad`, `Niš`).
- **`vehicle`** (string): Vehicle type (e.g., `electric_bike`, `scooter`, `car`, `bicycle`).
- **`platform`** (string): Desired platform (e.g., `Wolt`, `Glovo`, `Both`).
- **`status`** (string / Enum): Onboarding pipeline stage. Must match one of:
  - `NEW`
  - `CONTACTED`
  - `DOCUMENTS_PENDING`
  - `SENT_TO_PARTNER`
  - `REGISTRATION`
  - `ACTIVE`
  - `REJECTED`
- **`createdAt`** (timestamp): Date of submission.
- **`utm_source`** (string): Sourcing campaign parameters (e.g., `facebook`, `google_ads`, `partner-ref-xyz`).

---

### 2.4 `partners` Collection
Authorized flotas (fleet partners) approved to receive candidate referrals.

- **Document ID:** Auto-generated ID.
- **`name`** (string): Name of the partner agency.
- **`cities`** (array of strings): Cities where the agency is licensed to operate.
- **`platforms`** (array of strings): Platforms the agency works with (e.g., `Wolt`, `Glovo`).
- **`status`** (string): Operational state, either `active` or `inactive`.
- **`contact`** (string): Contact email, phone number, and physical office location.

---

## 3. Structural Relationships

Although Firestore is a NoSQL database, Deliverix enforces relational-like integrity through logical bindings:

- **Candidate-to-Partner Matching:** When an administrator transitions a candidate's status to `SENT_TO_PARTNER`, they can optionally store a field `assignedPartnerId` referencing the corresponding partner document. This helps track which fleet has received which candidate's details.
- **Unified Site Config Mapping:** All landing pages reference fields within the single `site_configs` document dynamically, preventing layout mismatches between public subroutes.
