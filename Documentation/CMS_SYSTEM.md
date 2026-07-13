# CMS System Content Flow

This document outlines the content flows and rendering pathways of the **Deliverix Content Management System (CMS)**, explaining how content edited in the Admin Panel is persisted and served to public users and search spiders.

---

## 1. Content Flows Overview

Deliverix operates on a completely unified content rendering pipeline. This ensures that a single database edit updates all client and server outputs simultaneously.

```
+-------------------------------------------------------+
|                 ADMIN DASHBOARD EDIT                  |
+-------------------------------------------------------+
                           │
                           ▼
+-------------------------------------------------------+
|                    FIRESTORE DB                       |
|  - site_configs/homepage_settings                     |
|  - blog_posts/                                        |
+-------------------------------------------------------+
            │                               │
            ▼ (Express Server)              ▼ (React Frontend App)
+------------------------+      +------------------------+
| Server-Side Injector   |      | Client Live listener   |
| - Pre-renders Meta     |      | - Hydrates DOM         |
| - Injects JSON-LD      |      | - Real-time layouts    |
| - Pre-renders HTML     |      | - Fast Transitions     |
+------------------------+      +------------------------+
            │                               │
            ▼                               ▼
     [Googlebot / SEO]               [Active Users]
```

---

## 2. Dynamic Content Subsystems

### 2.1 Homepage & Hero CMS
- **Database Path:** `site_configs/homepage_settings`
- **Fields Managed:** H1, Hero Paragraph, Platform listings, Cover image URL, Slider images, and Footer labels.
- **Client Render:** The React homepage fetches these settings upon hydration, rendering the visual hero banner and custom badges.
- **Server Injection:** The Express server pre-renders these headings inside a `<noscript>` container so Googlebot reads the H1 and copy immediately.

### 2.2 Landing Pages CMS
- **Supported Paths:** `/postani-dostavljac`, `/wolt-dostavljac`, `/glovo-dostavljac`, `/posao-dostavljac-beograd`.
- **Fields Managed:** Page title, meta descriptions, localized city texts, vehicle specifications, and CTA links.
- **Unified Routing:** The frontend parses the active route and populates page components dynamically from the corresponding Firestore configuration block, eliminating the need for hardcoded static layouts.

### 2.3 Blog CMS
- **Database Path:** `blog_posts/*` (Unique post ID or slug matches)
- **Fields Managed:** Title, slug, content body (Markdown), excerpt, cover image URL, author, status (draft/published), date created.
- **Render flow:**
  - **Dynamic Route:** `/blog/:slug` fetches the specific Firestore entry.
  - **Markdown Parsing:** The post body is rendered into clean HTML using a Markdown rendering library (`react-markdown`).
  - **SEO Injection:** The backend injects the cover image and excerpt as social metadata tags (`og:image`, `og:description`).

### 2.4 FAQ CMS
- **Database Path:** `site_configs/homepage_settings.faqs` (Array of objects)
- **Fields Managed:** `question` (string), `answer` (string).
- **Consolidation Benefit:** Hardcoded FAQs have been purged. The same array renders the React accordion component, compiles the server-rendered `<noscript>` fallback, and generates the `FAQPage` JSON-LD schema.
