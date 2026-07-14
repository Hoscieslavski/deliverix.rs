# Deliverix Master Document

This document serves as the central directory, overview, and architectural blueprint for the **Deliverix** platform. Any engineer, system operator, or automated coding agent must read this document first to understand the boundaries, structural lock, and operational logic of the system.

---

## 1. Project Overview & Mission

Deliverix is an optimized, high-conversion recruitment platform for on-demand delivery couriers in the Republic of Serbia (Beograd, Novi Sad, Niš, Kragujevac, etc.). By offering a streamlined, modern "one-click" application process, Deliverix solves a critical bottleneck in the gig economy: helping candidates quickly and transparently find the best official partner fleets for leading delivery platforms like **Wolt** and **Glovo**.

```
Candidate Traffic
      ↓
Deliverix Landing Page / SEO Route
      ↓
Streamlined Application Form (Vozilo, Grad, Platforma)
      ↓
Firestore NoSQL Database
      ↓
Candidate CRM Pipeline (Admin Panel)
      ↓
Assigned Partner Fleet Match
```

---

## 2. The Locked Architecture

Deliverix operates on a **Single Source of Truth (SSOT)** full-stack architecture. To protect SEO ranking, core responsiveness, and server performance, the platform structure is strictly locked. 

The architecture is locked as a **Full-Stack Express + React SPA with Server-Side SEO Injection**:

- **React SPA Client:** Renders a fast, interactive, and beautifully polished visual interface for candidates and administrators in the browser using React 18, Vite, and Tailwind CSS.
- **Express Backend:** Serves the static assets, provides a highly protected JSON API, serves a dynamically generated `/sitemap.xml`, and acts as a pre-rendering SEO engine for search spiders.
- **Server-Side SEO Injection (Server-Side Pre-Rendering):** When a user or search bot requests an HTML page (e.g., `/blog/kako-postati-wolt-dostavljac`), the Express server intercepts the request before sending `index.html`. It fetches the corresponding article, SEO settings, or FAQ blocks from Firestore and injects fully populated meta tags, canonical link headers, title tags, and a `<noscript>` structural skeleton directly into the raw HTML.
- **Google Cloud Firestore Database:** Persists all candidate data, active partner fleets, blog posts, static site configs, FAQs, and application parameters.

> [!IMPORTANT]
> **No Client-Side Only Meta Tools:** The SEO injection happens exclusively server-side. This ensures Googlebot receives static metadata and complete schema markup instantly without executing client-side JavaScript. This architecture is fixed and must not be altered.

---

## 3. Core Document Mapping

The system capabilities, configurations, and procedures are documented in detail across the following modules:

| Documentation File | Scope & Key Contents | Key Stakeholder |
| :--- | :--- | :--- |
| **[PROJECT_STATE.md](PROJECT_STATE.md)** | Current release logs, production readiness checks, active KPI tracking, and system gaps. | Product Manager |
| **[CHANGELOG.md](CHANGELOG.md)** | Chronological architectural record of Deliverix from inception to stable state. | Engineering Lead |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Technical deep-dive, folder paths, ESM/CJS build system, and data-flow diagrams. | Full-Stack Developer |
| **[BUSINESS_MODEL.md](BUSINESS_MODEL.md)** | Explanation of candidate acquisition funnel, fleet partnerships, and monetization strategy. | Business Owner |
| **[SEO_SYSTEM.md](SEO_SYSTEM.md)** | In-depth mechanics of Server-Side SEO pre-rendering, sitemaps, and JSON-LD schema generators. | SEO Specialist |
| **[ADMIN_PANEL.md](ADMIN_PANEL.md)** | Operator's guide to the Deliverix CRM system, settings sliders, and blog editors. | Admin / Operator |
| **[CMS_SYSTEM.md](CMS_SYSTEM.md)** | Flow specification of dynamic landing content, hero banners, and sitemap additions. | Content Editor |
| **[DATABASE.md](DATABASE.md)** | Field definitions and relationships across Firestore collections. | Database Admin |
| **[CRM_PIPELINE.md](CRM_PIPELINE.md)** | Detailed lifecycle states of job applicants from raw signup to active fleet connection. | Recruitment Coordinator |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Railway container pipelines, build parameters, and environment variable configuration. | DevOps Engineer |
| **[SECURITY.md](SECURITY.md)** | Encryption bounds, credential storage, and Git repository protection policies. | Security Officer |
| **[ROADMAP.md](ROADMAP.md)** | Execution plans divided into Short-Term, Medium-Term, and Long-Term phases. | Product Strategy |

---

## 4. Current Status & Phase

- **Production URL:** [https://deliverix.rs](https://deliverix.rs)
- **Database ID:** `ai-studio-remixstartdostav-f2c60a50-e179-4524-b4f4-bae770c6a2b9`
- **Current Phase:** **V10.0 - Production Finalization & Launch Audit Ready.**
- **Next Phase:** **Production Launch & Campaign Scaling.**

We have verified that the entire recruitment and SEO funnel operates seamlessly:
- **Admin edits homepage/landing pages** -> Firestore updates -> Client UI refreshes in real-time, and Express injects changed H1, Hero, FAQs, and Metadata into the HTML server-side.
- **Admin adds blog article** -> Sitemap updates immediately, schema.org markup is dynamically generated, and the article is fully readable by Googlebot.
- **Candidate signs up** -> Immediately tracked in Admin CRM with complete pipeline tracking.
- **Admin assigns partner fleet** -> Seamless, GDPR-compliant matching with local active partners.
- **V10.0 Launch Optimizations** -> Secondary H1s audited and cleaned, full Schema.org structured data schemas added (Breadcrumbs, JobPosting, FAQPage, BlogPosting), complete dynamic metadata rendering added across views, sitemap extended to include compliance pages, security headers hardened, and image lazy loading enabled.

---

*Refer to the individual markdown files in this folder for complete descriptions of each subsystem.*
