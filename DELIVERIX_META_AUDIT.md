# DELIVERIX V10 — SEO Meta Tag & Indexing Audit

This audit evaluates the dynamic metadata tagging, crawler indexation controls, and OpenGraph/Twitter Card structures implemented inside the **Deliverix** single-page application.

---

## 1. Core SEO Engine Concept
Since Deliverix is built as a highly responsive React Single Page Application (SPA), static meta tags in `index.html` are not sufficient to handle dynamic transitions (like opening a blog post or policy document). 

To solve this, we implemented a **Dynamic Client-Side Metadata Manager Hook** that intercepts page states and dynamically mutates:
1. `document.title` (Page Title tag)
2. `<meta name="description">` (Page snippet)
3. `<link rel="canonical">` (Prevent duplicate URL variations)
4. `<meta name="robots">` (Block indexing of internal gateways like admin dashboards)
5. `<meta property="og:*">` (OpenGraph snippets for link sharing)
6. `<meta property="twitter:*">` (Twitter Card previews)

---

## 2. Page-by-Page Metadata Mapping

### 2.1 Landing Page (`landing` View)
- **Title**: *"Wolt i Glovo Dostavljač Beograd | Deliverix"* (or customized via Admin panel config).
- **Description**: *"Želiš posao sa fleksibilnim radnim vremenom i zaradom do 150.000 RSD? Prijavi se za rad na Wolt i Glovo platformama preko Deliverix-a. Besplatno!"*
- **Canonical URL**: `https://deliverix.rs/`
- **Robots Index**: `index, follow`
- **Status**: **100% CORRECT**

### 2.2 Blog Index (`blog` View - No Selected Article)
- **Title**: *"Saveti i Vodiči za Wolt i Glovo Dostavljače | Deliverix Blog"*
- **Description**: *"Najbolji saveti, vodiči i lična iskustva za dostavljače hrane u Srbiji. Saznaj kako da maksimizuješ svoju zaradu."*
- **Canonical URL**: `https://deliverix.rs/blog`
- **Robots Index**: `index, follow`
- **Status**: **100% CORRECT**

### 2.3 Blog Article Detail Page (`blog` View - Selected Article)
- **Title**: `[Article Title] | Deliverix Blog`
- **Description**: `[Article Summary]` (Dynamic snippet pulling directly from the blog record).
- **Canonical URL**: `https://deliverix.rs/blog/[article-slug-or-id]`
- **Robots Index**: `index, follow`
- **OpenGraph Image**: `{selectedPost.cover_image}` (Dynamic thumbnail rendering on Viber/WhatsApp/Facebook cards).
- **Status**: **100% CORRECT**

### 2.4 Privacy Policy (`privacy` View)
- **Title**: *"Politika Privatnosti | Deliverix"*
- **Description**: *"Politika privatnosti i zaštita ličnih podataka za kandidate i dostavljače na platformi Deliverix."*
- **Canonical URL**: `https://deliverix.rs/privacy-policy`
- **Robots Index**: `index, follow`
- **Status**: **100% CORRECT**

### 2.5 Terms of Service (`terms` View)
- **Title**: *"Uslovi Korišćenja | Deliverix"*
- **Description**: *"Uslovi korišćenja platforme Deliverix za regrutaciju i podršku dostavljačima."*
- **Canonical URL**: `https://deliverix.rs/terms-of-service`
- **Robots Index**: `index, follow`
- **Status**: **100% CORRECT**

### 2.6 Admin Panel & Candidate Tracker (`admin` and `candidate` Views)
- **Title**: *"Admin Portal | Deliverix"*
- **Description**: *"Službeni portal za upravljanje kandidatima i marketing podešavanjima."*
- **Canonical URL**: `https://deliverix.rs/admin`
- **Robots Index**: `noindex, nofollow` (Strictly enforces crawler exclusion of secure administrative panels and private applicant tracking directories!).
- **Status**: **100% SECURE & CORRECT**

---

## 3. SEO Meta Audit Dashboard

| Route View | Page Title | Robots Rule | Canonical Href | OG Previews |
| :--- | :--- | :--- | :--- | :--- |
| **Landing (Home)** | Wolt i Glovo Dostavljač...| `index, follow` | `https://deliverix.rs/` | Enabled |
| **Blog Index** | Saveti i Vodiči... | `index, follow` | `https://deliverix.rs/blog` | Enabled |
| **Blog Article** | `[Article Title] | Blog` | `index, follow` | `https://deliverix.rs/blog/:slug`| Dynamic |
| **Privacy Policy**| Politika Privatnosti | `index, follow` | `https://deliverix.rs/privacy-policy`| Enabled |
| **Terms of Service**| Uslovi Korišćenja | `index, follow` | `https://deliverix.rs/terms-of-service`| Enabled |
| **Admin Panel** | Admin Portal | `noindex, nofollow` | `https://deliverix.rs/admin` | Disabled |

**Conclusion**: Dynamic SEO metadata manager is fully active and validated. Crawlers receive unique titles, descriptions, and correct canonical pathways on every transition, and private dashboards are securely shielded from indexation.
