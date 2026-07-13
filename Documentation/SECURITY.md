# Security & Credential Protection Protocols

This document defines the encryption standards, key protection policies, routing gates, and change permissions for the **Deliverix** platform.

---

## 1. Secrets & Key Isolation

To comply with security audits, Deliverix enforces a strict key isolation policy. Secret keys are divided into two distinct scopes:

### 1.1 Client-Side Configurations (Non-Sensitive)
Variables prefixed with `VITE_` are compiled directly into the client-side browser bundle. They are used exclusively to initialize non-sensitive services like Google Firebase Auth and Firestore:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`

These are publicly visible in browser inspector tools and are locked down using **Firestore Security Rules** to prevent unauthorized database read/write actions.

### 1.2 Server-Side Secrets (Highly Sensitive)
Highly sensitive keys must **never** be prefixed with `VITE_` or referenced in client-side code:
- **`GEMINI_API_KEY`** - Used exclusively by the backend Express server (`server.ts`) to manage content generation.
- **GitHub Tokens / SSH Deploy Keys** - Used by continuous integration runners (such as GitHub Actions or Railway Build) to fetch code. They must never be saved inside static repository files.

---

## 2. Firestore Security Rules

To protect candidate data from malicious client-side modifications, the Google Cloud Firestore instance enforces robust security rules:

- **Candidates Collection (`candidates`):** Public users can create new candidate documents (`allow create: if true`), but they are strictly forbidden from listing, reading, editing, or deleting existing candidate documents. Only authenticated system administrators can access these fields.
- **Site Configs & Blogs (`site_configs`, `blog_posts`):** Public users have read-only access to published articles and configurations. Edit permissions (`write`, `update`, `delete`) are strictly gated, requiring valid admin authentication tokens.

---

## 3. Allowed vs. Forbidden Modifications

To protect the production stability of the application, developers and automated coding agents must adhere to the following modification rules:

### Allowed Changes:
- Adding new content fields or accordion items to the admin editor panels.
- Creating additional blog publishing features (e.g., tags, category filters).
- Enhancing CRM sorting, search inputs, or pipeline tracking.
- Tuning tailwind styles, font spacing, and layout transitions.

### Forbidden Changes:
- **Do NOT** expose server-side environment secrets to client components.
- **Do NOT** disable the Express server SEO pre-rendering engine or modify the `<noscript>` pre-render fallback.
- **Do NOT** modify package run commands to bind to ports other than `3000`.
- **Do NOT** commit actual credentials or secrets into `.env.example` or static source files.
