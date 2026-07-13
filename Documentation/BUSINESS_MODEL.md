# Business Model & Operational Scope

This document details the operational boundaries, candidate acquisition model, partner workflow, and monetization framework of the **Deliverix** platform.

---

## 1. What Deliverix IS and IS NOT

To maintain clear legal, tax, and brand positioning in the Republic of Serbia, Deliverix enforces strict operational definitions:

### Deliverix IS NOT:
- ❌ **A direct employer:** Deliverix does not employ delivery couriers, sign labor contracts, or pay salaries directly.
- ❌ **A fleet owner/operator:** Deliverix does not own fleets, manage delivery cars/bikes, or handle payroll administration.
- ❌ **An official delivery service:** Deliverix is not Wolt, Glovo, or Mister D.

### Deliverix IS:
- ✅ **A marketplace connector:** Deliverix is a modern recruiting marketplace that connects independent candidates with authorized and vetted fleet partners.
- ✅ **An enablement platform:** Deliverix provides candidates with free consultation, fast application filing, and equipment leasing partnerships (e-bikes, scooters, cars).
- ✅ **A lead acquisition partner:** Deliverix acts as a highly efficient marketing and screening filter for fleet operators.

---

## 2. The Business Funnel

Deliverix matches supply (candidates seeking work) with demand (authorized fleets requiring active couriers):

```
1. ORGANIC TRAFFIC GENERATION (SEO, Blog, Landing Pages, Social)
                          ↓
2. USER ENGAGEMENT & RETENTION (Fast Form, Transparent Info, Support FAQs)
                          ↓
3. SYSTEM CONVERSION (Application Created inside Firestore DB)
                          ↓
4. CRM PIPELINE FILTER (Admin screens, verifies availability, and contacts candidate)
                          ↓
5. GDPR-COMPLIANT MATCHING (Application data routed to local fleet partner)
                          ↓
6. SUCCESSFUL ACTIVATION (Partner signs agreement, courier starts working)
```

---

## 3. Candidate Acquisition

Candidate acquisition is powered by three key pillars:

1. **High-Intent SEO Infrastructure:** Optimized search engine positioning on phrases like *"Wolt dostavljač posao"*, *"Glovo posao Beograd"*, and *"Zarada dostavljača hrane"*. Users landing on these pages are ready to work.
2. **Simplified One-Form Funnel:** Standard partner websites require candidates to fill out lengthy forms across multiple external platforms. Deliverix offers a single, clean form that can be completed in under 60 seconds.
3. **Transparent Support FAQs:** By addressing common pain points (e.g., *"How often is payout?"*, *"Can I rent a vehicle?"*, *"Do I need my own company?"*), Deliverix builds trust before the candidate ever submits an application.

---

## 4. Partner Fleet Workflow & Management

Authorized fleet partners are onboarded and managed directly within the Deliverix Admin Panel:

- **Vetting:** Partners are thoroughly screened to ensure they offer the lowest commissions, regular 15-day payouts, and proper contracts.
- **UTM / Referral Tracking:** The Admin Panel includes a built-in Link Generator, allowing admins to create custom partner-specific links (e.g., `?ref=partner-xyz`). This ensures precise tracking of candidate sourcing.
- **Handover Procedure:** When a candidate's state is changed in the CRM to `SENT_TO_PARTNER`, the system logs the assignment. The partner is notified and assumes direct communication for signing contract documentation.

---

## 5. Revenue Model

Deliverix monetizes its platform through three primary revenue streams:

1. **Pay-Per-Lead (PPL) / CPA:** Fleet partners pay a fixed referral fee for every qualified candidate successfully connected and activated on Wolt or Glovo through Deliverix.
2. **Premium Partnerships:** Vetted partners can pay a monthly premium to be listed as "Preferred Fleet" in specific regions (e.g., Beograd, Novi Sad).
3. **Vehicle Rental Referrals:** Deliverix partners with local e-bike and scooter rental businesses. When candidates rent vehicles through Deliverix partner links, a referral commission is earned.
