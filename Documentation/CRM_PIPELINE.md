# Candidate CRM Pipeline & Onboarding Lifecycle

This document explains the recruitment lifecycle, tracking parameters, and status transitions of candidates onboarded through the **Deliverix CRM Pipeline** (`src/components/AdminDashboard.tsx`).

---

## 1. Candidate Structural Fields

The CRM logs the following fields for every candidate profile:

| Parameter Field | Data Type | Purpose & Description |
| :--- | :--- | :--- |
| **`id`** | String (Auto) | Unique system identifier. |
| **`name`** | String | Candidate's full name. |
| **`phone`** | String | Normalized contact telephone number. |
| **`city`** | String | Designated city of operation (e.g., Beograd, Novi Sad). |
| **`vehicle`** | String | Selection: Electric Bike, Car, Scooter, or Bicycle. |
| **`platform`** | String | Interes of platform: Wolt, Glovo, or Both. |
| **`status`**| Enum | Current stage in the recruitment pipeline. |
| **`createdAt`**| Timestamp | Automatic registration timestamp. |
| **`utm_source`**| String | Tracking tag (e.g., direct, campaign-fb, or partner_ref). |

---

## 2. Onboarding Pipeline States

To monitor conversion metrics, candidates advance through distinct pipeline states:

```
[ NEW ] -> [ CONTACTED ] -> [ DOCUMENTS_PENDING ] -> [ SENT_TO_PARTNER ] -> [ REGISTRATION ] -> [ ACTIVE ]
                                                                                                      │
                                                                                                      ▼
                                                                                                 [ REJECTED ]
```

### 2.1 State Descriptions & Operations

1. **`NEW` (Nova Prijava)**
   - **Trigger:** Candidate submits the registration form on the homepage or an SEO landing page.
   - **Operator Action:** Lead shows on top of the dashboard. Admin should review and call the candidate within 2 hours.

2. **`CONTACTED` (Kontaktiran Kandidat)**
   - **Trigger:** Admin has called or messaged the candidate to introduce the platform, verify details, and discuss working terms.
   - **Operator Action:** Confirm city of choice and clarify if vehicle rental is needed.

3. **`DOCUMENTS_PENDING` (Dokumentacija u Toku)**
   - **Trigger:** Candidate is collecting the required onboarding documents (e.g., driving license, safety certificate, identification).
   - **Operator Action:** Assist the candidate with any questions regarding necessary documentation.

4. **`SENT_TO_PARTNER` (Prosleđen Partneru)**
   - **Trigger:** Candidate's profile is matched and shared with an active local fleet partner in the candidate's city.
   - **Operator Action:** Hand over the lead data to the designated fleet coordinator.

5. **`REGISTRATION` (Ugovaranje / Registracija)**
   - **Trigger:** The partner fleet is registering the courier in the official Wolt/Glovo systems and signing the contract.
   - **Operator Action:** Monitor the registration progress with the partner fleet.

6. **`ACTIVE` (Aktivan / Uspešno Povezan)**
   - **Trigger:** The courier has completed registration, collected their delivery gear, activated their courier app, and completed their first delivery.
   - **Result:** Successfully converted lead. Deliverix logs the referral reward.

7. **`REJECTED` (Odustao / Odbijen)**
   - **Trigger:** Candidate has withdrawn their application, stopped responding, or did not meet eligibility requirements.
   - **Operator Action:** Archive the candidate and log the reason for cancellation.

---

## 3. GDPR and Privacy Safeguards

- **Consent:** Candidates must accept the Privacy Policy before submitting their application.
- **Access Gating:** Applicant contact details are only visible to authenticated system administrators and assigned fleet partners.
- **Retention:** Cancelled or inactive profiles are archived or deleted upon request, in compliance with GDPR guidelines.
