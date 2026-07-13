# Deployment & Production Pipelines

This document details the build processes, runtime environments, domain routing, and hosting configurations for **Deliverix** on the **Railway** platform.

---

## 1. Hosting Environment & Runtime Specs

Deliverix is deployed as a Dockerized Node.js application on **Railway**:

- **Port & Host:** The application listens strictly on **port `3000`** binding to **host `0.0.0.0`**. Railway dynamically routes all external traffic (port `80` and `443` HTTPS) through an edge Nginx proxy to this port.
- **Node Environment:** Set to `production` in live container runs.
- **Auto-deployment:** Railway monitors the `main` branch of the GitHub repository and triggers an automated rebuild and rolling update on every git push.

---

## 2. Standalone Compilation & Start Commands

The build pipeline compiles dynamic backend TypeScript and bundles client-side assets to ensure rapid startup:

### 2.1 The Build Script
Defined in `package.json`:
```bash
vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
```
- **Vite Build:** Compiles the React client application, generating highly optimized HTML, JS, and CSS files under `/dist`.
- **Esbuild Server:** Bundles the TypeScript server (`server.ts`) into a standalone CommonJS file `/dist/server.cjs`. This avoids runtime package resolve issues and enhances cold start performance.

### 2.2 The Start Script
The production container runs the compiled CommonJS server directly using Node:
```json
"start": "node dist/server.cjs"
```

---

## 3. Required Environment Variables

To protect credentials, all secrets must be set directly in the Railway Environment variables dashboard (do *not* write them into source files):

| Environment Variable | Description & Scope |
| :--- | :--- |
| **`NODE_ENV`** | Set to `production` in the live environment. |
| **`PORT`** | Set to `3000` (Managed automatically by Railway). |
| **`GEMINI_API_KEY`** | Secret key for Gemini content assistance (never prefix with `VITE_`). |
| **`VITE_FIREBASE_API_KEY`**| Web API Key for initializing the client-side Firebase Auth. |
| **`VITE_FIREBASE_AUTH_DOMAIN`**| Auth domain coordinate (e.g., `deliverix.firebaseapp.com`). |
| **`VITE_FIREBASE_PROJECT_ID`**| Identifies the Google Cloud Project hosting the database. |

---

## 4. Robots.txt and Sitemap Routing

For optimal search indexing, dynamic files are served at the root directory:

- **Sitemap Location:** Served dynamically at `/sitemap.xml`. It fetches the latest published blog articles directly from Firestore on every request.
- **Robots.txt Location:** Served at `/robots.txt`. It points search crawlers to the sitemap:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin
  
  Sitemap: https://deliverix.rs/sitemap.xml
  ```
- **Caching Headers:** Server static assets inside `/dist` are served with long-term cache headers (`Cache-Control: public, max-age=31536000, immutable`), while `/sitemap.xml` and HTML requests have cache-busting headers to ensure immediate indexing of updated content.
