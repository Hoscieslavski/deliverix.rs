# Deliverix Documentation Suite

Welcome to the official documentation repository for the **Deliverix** platform. Deliverix is a highly optimized, high-performance web platform designed to facilitate candidate acquisition, CRM onboarding pipeline management, and matching for on-demand delivery couriers (such as Wolt and Glovo) with official fleet partners in the Republic of Serbia.

This directory contains complete technical and business documentation reflecting the production state of the application.

## 📖 Directory Structure

This documentation suite is organized modularly to allow developers, managers, and automated agents to locate crucial information quickly:

1. **[Master Entry Point](DELIVERIX_MASTER_DOCUMENT.md)** - The central reference file outlining the entire ecosystem. Start here.
2. **[Project State](PROJECT_STATE.md)** - Current operational status, metrics, and production checkpoint validation.
3. **[Changelog](CHANGELOG.md)** - Complete history of system architectural milestones.
4. **[System Architecture](ARCHITECTURE.md)** - In-depth breakdown of the Express server, React client, and server-side injection architecture.
5. **[Business Model](BUSINESS_MODEL.md)** - Scope definition of Deliverix's role as a marketplace connector and recruitment partner.
6. **[SEO Engine & Google Structure](SEO_SYSTEM.md)** - Full documentation of metadata management, JSON-LD generation, dynamic sitemap, and Googlebot crawling optimizations.
7. **[Admin Panel Manual](ADMIN_PANEL.md)** - Complete operator instructions for content management, candidates, and configuration panels.
8. **[CMS System Flow](CMS_SYSTEM.md)** - Mechanism explaining how landing, home, and blog data is retrieved, modified, and rendered.
9. **[Database Schema](DATABASE.md)** - Collection specifications and relationships within Google Cloud Firestore.
10. **[Candidate CRM Pipeline](CRM_PIPELINE.md)** - Onboarding lifecycle stages and recruitment funnel tracking.
11. **[Deployment Configuration](DEPLOYMENT.md)** - Standalone build setup and execution pipelines on Railway.
12. **[Security Protocols](SECURITY.md)** - Environment variables, credential safety, and permission boundaries.
13. **[Roadmap](ROADMAP.md)** - Product phases from short-term optimization to long-term expansion.

## 🛠️ Technology Stack Overview

- **Frontend:** React 18 with Vite, Tailwind CSS for modern responsive styling, Lucide icons, Framer Motion for elegant route transitions.
- **Backend:** Express (TypeScript) serving as both the API proxy layer and the dynamic Server-Side SEO injection system.
- **Database:** Google Cloud Firestore (NoSQL, persistent, realtime listeners).
- **Hosting:** Railway (Container-based deployment tracking git pushes on `main`).

---

*This suite is kept strictly up to date with the latest production deployments. Feel free to navigate to any file above to explore the architecture.*
