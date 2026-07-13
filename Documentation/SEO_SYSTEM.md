# SEO Engine & Google Crawling Optimization

This document details the Server-Side SEO Engine built into the **Deliverix** full-stack server (`server.ts`). It outlines the metadata mechanics, dynamic JSON-LD schemas, sitemap synchronization, and crawlers indexing strategy.

---

## 1. The SEO Injection Mechanism

Deliverix uses an Express-based pre-renderer that intercepts incoming HTML requests before delivering the React Shell.

```
Request (GET /blog/kako-postati-wolt)
               ↓
Express intercepts, parses URL
               ↓
Check user-agent / accept header (HTML request)
               ↓
Query Firestore collection (blog_posts / site_configs)
               ↓
Inject raw <title>, <meta>, <link rel="canonical">, JSON-LD schema
               ↓
Inject readable <noscript> content (full page body)
               ↓
Serve fully populated HTML to browser or crawler (Googlebot)
```

---

## 2. Injected SEO Metadata Elements

When an HTML page is pre-rendered on the server, the following tags are dynamically generated and injected into the `<head>`:

### 2.1 Standard Meta Tags
- **`<title>`**: Populated with high-intent keywords (e.g., `Kako postati Wolt dostavljač u 2026. | Deliverix`).
- **`meta name="description"`**: Short, action-driven summaries written by content editors in the Admin Panel.
- **`link rel="canonical"`**: Dynamically calculated full URL (e.g., `https://deliverix.rs/blog/kako-postati-wolt-dostavljac-2026`) to avoid double indexing and protect authority.

### 2.2 Social Graph Data (Open Graph & Twitter Cards)
To guarantee high conversion rates when articles are shared on Facebook, Viber, WhatsApp, and Telegram, the server injects:
- **`og:title`**, **`og:description`**, **`og:url`**, and **`og:image`** (utilizing the cover image URL uploaded to Firestore).
- **`twitter:card`** (styled as `summary_large_image`), **`twitter:title`**, and **`twitter:description`**.

---

## 3. Dynamic JSON-LD Structured Data (Schemas)

Structured Schema.org markup is injected directly as `<script type="application/ld+json">` payloads in the HTML document to help Googlebot display rich snippets in search results.

### 3.1 FAQPage Schema
Generated dynamically on the homepage from the unified Firestore FAQ block:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Kako postati dostavljač preko Deliverixa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Popuni prijavu i povezaćemo te sa partnerskim flotama."
      }
    }
  ]
}
```

### 3.2 BlogPosting Schema
Generated dynamically for individual blog articles:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Kako postati Wolt dostavljač u 2026.",
  "image": "https://images.unsplash.com/photo-example",
  "datePublished": "2026-07-12T13:57:01Z",
  "author": {
    "@type": "Organization",
    "name": "Deliverix"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Deliverix",
    "logo": "https://deliverix.rs/logo.png"
  },
  "description": "Kompletan vodič kako postati dostavljač..."
}
```

### 3.3 BreadcrumbList Schema
Injected across all child routes to structure search console paths:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Početna",
      "item": "https://deliverix.rs"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://deliverix.rs/blog"
    }
  ]
}
```

---

## 4. The `<noscript>` Fallback Strategy

To ensure search crawlers parse the full textual body of dynamic landing pages and blog articles even if they do not execute JavaScript, the server injects a custom `<noscript>` block inside `index.html`.

This block is structurally clean:
- **`<h1>`** matching the database-driven title.
- Complete textual paragraph divisions, bold highlights, bullet items, and links.
- Rendered using server-side markdown parsing to output clean HTML tags.

---

## 5. Dynamic `/sitemap.xml` Generation

The sitemap is generated in real-time by the Express server on every request.

### 5.1 Static Pages Included:
- `/` (Home)
- `/postani-dostavljac`
- `/wolt-dostavljac`
- `/glovo-dostavljac`
- `/posao-dostavljac-beograd`

### 5.2 Dynamic Pages Included:
The server queries the Firestore `blog_posts` collection. It iterates through all posts where `status` is set to published, and injects:
```xml
<url>
  <loc>https://deliverix.rs/blog/kako-postati-wolt-dostavljac-2026</loc>
  <lastmod>2026-07-13</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```
If an article is deleted or hidden in the Admin Panel, it is immediately excluded from the sitemap.

---

## 6. Google Search Console Workflow

To maintain high search placement, the following procedures are recommended:
1. **Submit Sitemap:** Register `https://deliverix.rs/sitemap.xml` directly in Google Search Console.
2. **Inspect URL:** Use the URL Inspection tool on newly created landing pages or blog slugs to verify that Googlebot sees the pre-rendered Title, Description, and JSON-LD markup correctly.
3. **Audit Rich Snippets:** Check the Structured Data report to verify that "FAQPage" and "Article" rich snippets show zero parsing warnings or errors.
