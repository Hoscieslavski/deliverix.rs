# Changelog: Deliverix

This document tracks all major milestones, architectural updates, and systemic modifications of the **Deliverix** platform in chronological order.

---

## [1.0.0] - Initial Setup & React Architecture
### Added
- Standardized Vite + React 18 boilerplate integrated with Tailwind CSS.
- Initial structural components: Header, Navigation, Footer, and core Homepage skeleton.
- Modularized component directories for enhanced code maintainability.
- Added Lucide React as the unified icon system.

---

## [1.1.0] - Form Engine & Candidate Pipeline Initial Setup
### Added
- Modern multi-step applicant form on `/postani-dostavljac`.
- Field captures: Ime i prezime, Broj telefona, Grad, Tip vozila, Željena platforma.
- Initial client-side local storage persistence for unfinished applications.

---

## [1.2.0] - Express Server & Full-Stack Migration
### Added
- Custom backend entry point (`server.ts`) implemented in TypeScript.
- Integrated `tsx` for high-speed dev execution and bundling via `esbuild`.
- Configured Node environment to run securely behind Nginx on port `3000`.
- Integrated Express Static serving for `/dist` outputs.

---

## [1.3.0] - Firestore Integration & Cloud Persistence
### Added
- Integrated Firebase Web SDK and initialized Firestore in React.
- Configured Firestore collections: `candidates`, `partners`, and `site_configs`.
- Secure client-side writing mechanisms ensuring data persistence even if the browser cache is purged.
- Enabled Firebase Auth rules for secure administrative logging.

---

## [1.4.0] - Express SEO Engine & Server-Side Pre-rendering
### Added
- Implemented HTML pre-processor interceptor in `server.ts`.
- Server-side parsing of incoming routes to separate users from indexing crawlers.
- Dynamic replacement of `<title>`, meta tags (`description`, `og:image`, `canonical`), and dynamic scripts on the server.
- Built a `<noscript>` crawler fallback skeleton containing rich headings, lists, and complete text sections.

---

## [1.5.0] - Admin Panel & SEO CMS Subtabs
### Added
- Integrated Admin Dashboard with secure login gating.
- Added modular subsections: Candidates CRM, Partners Manager, Blog Publisher, FAQ Editor, and SEO Settings.
- Real-time Firestore updates using `onSnapshot` inside components.
- Live database-to-UI binding ensuring changes reflect immediately.

---

## [1.6.0] - Dynamic Sitemap & FAQ Schema
### Added
- Live dynamic XML generator on `/sitemap.xml`.
- Automatic article inclusion: new blogs instantly generate sitemap `<url>` items, while deleted blogs are purged.
- purge of duplicate hardcoded React faq components.
- Dynamically compiled `FAQPage` JSON-LD schema added to Express HTML responses.

---

## [1.7.0] - Business Model Alignment & Fleet CRM
### Added
- Updated public communication texts to present Deliverix strictly as a *marketplace marketplace connector* (e.g. *"Deliverix povezuje kandidate sa proverenim partnerskim flotama"*).
- Expanded CRM applicant pipeline states:
  `NEW` → `CONTACTED` → `DOCUMENTS_PENDING` → `SENT_TO_PARTNER` → `REGISTRATION` → `ACTIVE` → `REJECTED`.
- Secure fleet distribution module with GDPR-compliant data sharing indicators.

---

## [1.8.0] - Final Validation & Complete Production Release
### Verified
- Zero TypeScript compiler errors.
- Stable asset bundling using `npm run build`.
- Successful standalone production start (`node dist/server.cjs`).
- Full automated SEO pre-render tests completed successfully on all subpages.
