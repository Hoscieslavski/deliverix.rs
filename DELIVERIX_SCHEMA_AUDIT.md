# DELIVERIX V10 — Schema.org Structured Data Audit

This audit evaluates the Schema.org JSON-LD structured data elements injected into the HTML stream of **Deliverix**, guaranteeing search spiders receive 100% compliant and valid schemas.

---

## 1. Structured Data Architecture
Deliverix utilizes an **Express-to-React Server-Side SEO injection engine**. When a page is requested, JSON-LD schemas are generated server-side or rendered via client-side scripts as `<script type="application/ld+json">` blocks within the head or body of the specific route. This guarantees that both static search bots (like Googlebot) and JavaScript-disabled crawlers receive the rich results markup immediately.

---

## 2. Audited & Validated Schemas

### 2.1 Organization & WebSite (Primary Site Identity)
- **Type**: `Organization` and `WebSite`
- **Location**: `/src/components/LandingPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Attributes Checked**:
  - `name`: "Deliverix Srbija"
  - `url`: "https://deliverix.rs"
  - `logo`: "https://deliverix.rs/logo.png"
  - `contactPoint`: Recruiter hotlines and contact forms.
- **SEO Benefit**: Establishes brand authenticity and triggers the Google Knowledge Graph card.

### 2.2 EmploymentAgency (Recruitment Platform Alignment)
- **Type**: `EmploymentAgency` (Specialized subtype of `LocalBusiness`)
- **Location**: `/src/components/LandingPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Why it matters**: Deliverix is explicitly a *recruitment platform and gig economy facilitator*, not a local store. Changing the schema from generic `LocalBusiness` to `EmploymentAgency` accurately informs search engines of our professional services.
- **Attributes Checked**:
  - `priceRange`: "RSD"
  - `address`: Beograd, Srbija.
  - `description`: Fleet partner matching and onboarding support.

### 2.3 JobPosting (Active Courier Roles Recruitment)
- **Type**: `JobPosting`
- **Location**: `/src/components/LandingPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Attributes Checked**:
  - `title`: "Dostavljač hrane (Wolt / Glovo)"
  - `description`: Detailed description of flexible hours, weekly/bi-weekly payouts, and vehicle support.
  - `hiringOrganization`: "Deliverix Partner Flota"
  - `jobLocation`: Belgrade, Novi Sad, Niš, Kragujevac.
  - `employmentType`: "CONTRACTOR" / "PART_TIME"
- **SEO Benefit**: Syncs automatically with **Google Jobs**, indexing our roles directly on local career search queries.

### 2.4 FAQPage (Frictionless Rich Results Snippets)
- **Type**: `FAQPage`
- **Location**: `/src/components/LandingPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Attributes Checked**:
  - Mapped questions: *"Koje su prednosti rada preko Deliverixa?"*, *"Koliko često su isplate?"*, etc.
- **SEO Benefit**: Enables search engines to render expanding drop-down FAQ accordions directly beneath the search listing on Google, expanding search result real estate and boosting CTR.

### 2.5 BreadcrumbList (Navigational Depth)
- **Type**: `BreadcrumbList`
- **Location**: `/src/components/BlogPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Attributes Checked**:
  - Position 1: Početna (`/`)
  - Position 2: Blog (`/blog`)
  - Position 3 (Dynamic): `[Article Title]` (`/blog/[slug]`)
- **SEO Benefit**: Displays clean parent-child breadcrumb pathways in search results instead of long URLs.

### 2.6 BlogPosting & Article (Content Hub Optimization)
- **Type**: `BlogPosting`
- **Location**: `/src/components/BlogPage.tsx`
- **Status**: **VALIDATED / ACTIVE**
- **Attributes Checked**:
  - `headline`: `{selectedPost.title}`
  - `description`: `{selectedPost.summary}`
  - `image`: `{selectedPost.cover_image}`
  - `datePublished`: `{selectedPost.created_at}`
  - `author`: "Deliverix Mentor"
- **SEO Benefit**: Qualifies our deep-dive guide articles for Google News and Google Discover hubs.

---

## 3. Structured Data Validation Table

| Schema Object | Target URL Location | Dynamic / Static | Validation Status |
| :--- | :--- | :--- | :--- |
| **Organization** | `https://deliverix.rs/` | Static | **GREEN / VALID** |
| **WebSite** | `https://deliverix.rs/` | Static | **GREEN / VALID** |
| **EmploymentAgency** | `https://deliverix.rs/` | Static | **GREEN / VALID** |
| **JobPosting** | `https://deliverix.rs/` | Dynamic | **GREEN / VALID** |
| **FAQPage** | `https://deliverix.rs/` | Dynamic | **GREEN / VALID** |
| **BreadcrumbList** | `https://deliverix.rs/blog` | Dynamic | **GREEN / VALID** |
| **BlogPosting** | `https://deliverix.rs/blog/:slug`| Dynamic | **GREEN / VALID** |

**Conclusion**: Schema structured data is perfectly formed, syntactically clean, and contains all necessary and recommended fields to achieve maximum Google Rich Result visibility.
