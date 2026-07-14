# DELIVERIX V8 — LAUNCH SAFETY & OPERATIONAL GROWTH PLAN

**Status:** 🚀 SPREMNO ZA REALNI SAOBRAĆAJ I PRIJEM PRVIH KORISNIKA  
**Tip dokumenta:** Operativni plan i Launch Safety specifikacija  
**Fokus:** Lead Management, Backup, Monitoring, Marketing i strategija za prvih 100 korisnika  

---

## 1. Lead Management Engine (Operativni tok prijave)

Kada kandidat poseti **Deliverix** i popuni formular na početnoj stranici, pokreće se visoko automatizovan i strukturiran proces. Cilj je da se frikcija svede na minimum i da kandidat bude kontaktiran u roku od **manje od 24 sata**.

### Detaljan tehničko-operativni tok (Flow):

```
Kandidat popunjava formu
       │
       ▼
Slanje u Firestore (`applications` kolekciju)
       │
       ├─► Status: 'NEW' (NOV)
       ├─► Generisanje jedinstvenog ID-a
       ├─► Čuvanje metapodataka (grad, vozilo, telefon, izvor saobraćaja, UTM parametri)
       │
       ▼
Okidač za obaveštenje (Telegram / Email integracija)
       │
       ▼
Admin Dashboard obaveštenje (Zvučni i vizuelni signal za operatera)
       │
       ▼
Kontakt operatera u roku <24h (WhatsApp / Poziv)
       │
       ▼
Ažuriranje statusa u realnom vremenu na Admin panelu
```

### Operativne faze i statusi kandidata:

U **AdminDashboard.tsx** i backendu je već ugrađen kompletan State Machine za praćenje svakog kandidata od prijave do aktivnog rada:

1.  **`NOV` (NEW):** 
    *   *Značenje:* Prijava je tek pristigla u bazu i niko je još nije preuzeo.
    *   *Akcija:* Operater odmah šalje personalizovanu WhatsApp poruku (jednim klikom preko ugrađene prečice u dashboardu) ili poziva broj.
2.  **`KONTAKTIRAN` (CONTACTED):**
    *   *Značenje:* Kandidatu je poslat prvi kontakt, objašnjeni su mu uslovi i poslata lista dokumenata.
    *   *Akcija:* Čeka se odgovor kandidata sa slikama dokumenata.
3.  **`DOKUMENTI_NA_ČEKANJU` (DOCUMENTS_PENDING):**
    *   *Značenje:* Kandidat je izrazio želju za radom, ali još uvek prikuplja dokumentaciju (npr. uverenje o nekažnjavanju, slika lične karte ili vozačke dozvole).
4.  **`POSLATO_PARTNERU` (SENT_TO_PARTNER):**
    *   *Značenje:* Deliverix tim je odabrao najbolju i najpovoljniju flotu u gradu kandidata i prosledio njegove podatke tom partneru.
5.  **`REGISTRACIJA` (REGISTRATION):**
    *   *Značenje:* Partner vrši prijavu kandidata na Wolt/Glovo sistem i otvara mu profil.
6.  **`AKTIVAN` (ACTIVE):**
    *   *Značenje:* Kandidat je preuzeo opremu i odradio svoju prvu dostavu. **Čestitamo! Konverzija je uspešno završena.**
7.  **`ODBIJEN` (REJECTED) / `NEAKTIVAN` (INACTIVE):**
    *   *Značenje:* Kandidat je odustao, ne javlja se na telefon ili je odbijen zbog neispunjavanja zakonskih uslova.

---

## 2. Backup & Data Export (Bezbednost podataka)

Ukoliko dođe do bilo kakvog tehničkog kvara na strani klijenta ili baze, ili ako želite da migrirate podatke u sopstveni eksterni CRM (npr. HubSpot, ActiveCampaign ili Google Sheets), Deliverix poseduje sisteme zaštite:

*   **Durable Cloud Storage (Firestore):** Podaci se čuvaju u Google Cloud-u u Nemačkoj (ili izabranoj evropskoj regiji) sa višestrukom geografskom redundansom i automatskim dnevnim snapshot backup-om na nivou GCP projekta.
*   **One-Click CSV Export:** U okviru Admin Dashboard-a ugrađeno je dugme za **eksport svih prijava u .csv format** sa svim filtrima (grad, vozilo, status). Ovo omogućava vlasniku platforme da u svakom trenutku lokalno sačuva kompletnu listu svih kontakata i prijava jednim klikom na dugme `Eksportuj u Excel/CSV`.

---

## 3. Real-Time Monitoring & Error Tracking

Za stabilno poslovanje platforme kritično je da preduhitrimo tehničke probleme. "Ako pukne API, mi moramo saznati pre nego što korisnik primeti."

### Implementiran plan nadgledanja (Monitoring):

1.  **Uptime Monitoring (Dostupnost sajta):**
    *   Povezati spoljni besplatni servis (npr. **UptimeRobot** ili **Better Stack**) da vrši ping zahteve na svakih **60 sekundi** na rute:
        *   Početna strana: `https://deliverix.rs/`
        *   Dinamička marketing ruta: `https://deliverix.rs/api/marketing/seo-public` (koja testira i rad Express servera i vezu sa Firestore bazom).
    *   *U slučaju pada:* Servis šalje instant notifikaciju na Telegram i e-mail administratora.
2.  **Error Tracking (Sentry integracija):**
    *   Predlaže se integrisanje **Sentry SDK** na klijentskoj i serverskoj strani. 
    *   Svaka neočekivana greška u JavaScriptu ili prilikom slanja forme biće automatski presretnuta i poslata na Sentry dashboard sa kompletnim call-stack-om i informacijama o uređaju korisnika.

---

## 4. Marketing priprema (Launch kampanje)

Pre nego što se pusti plaćeni saobraćaj, oglasi se moraju struktuirati tako da direktno pogađaju bolne tačke (pain-points) potencijalnih kurira.

### Google Ads struktura (Search & Performance Max):
*   **Ključne reči:** "posao dostavljaca beograd", "kako postati wolt dostavljac", "glovo prijava za posao", "najbolja wolt agencija srbija".
*   **Glavni oglasni tekstovi (Ad Copies):**
    *   *Naslov 1:* Postani Dostavljač | Brza Prijava za 60s
    *   *Naslov 2:* Zarada do 150.000 RSD | Wolt & Glovo
    *   *Naslov 3:* 100% Besplatna Podrška i Mentorstvo
    *   *Opis:* Želiš fleksibilno radno vreme i odličnu zaradu? Prijavi se preko Deliverix platforme. Povezujemo te sa najpouzdanijim agencijama bez skrivenih troškova.

### Social Media (Instagram / TikTok / YouTube Shorts):
Kuriri najviše veruju video sadržaju. Najbolji rezultati se postižu autentičnim, sirovim telefonskim video zapisima:
*   **Video tip 1 (Iskustvo kurira):** Kratak intervju sa aktivnim dostavljačem: *"Koliko zapravo zarađujem na skuteru u Beogradu? Bez cenzure."*
*   **Video tip 2 (FAQ otklanjanje sumnji):** *"Da li moram da imam svoju opremu i firmu?"* (Odgovor: Ne, Deliverix ti obezbeđuje popuste za najam e-bicikala/skutera i povezuje te sa partnerskom agencijom).
*   **Video tip 3 (How-To):** Vodič korak po korak od prijave na Deliverix-u do prve isporučene porudžbine.

---

## 5. DELIVERIX V8 — FIRST 100 USERS PLAN (Plan rasta)

Kako dovesti prvih 100 dostavljača i privući prvih 10 partnerskih agencija na Deliverix platformu bez trošenja ogromnih budžeta?

### Faza A: Prvih 20 kurira (Gerila & Organski marketing)
1.  **Facebook grupe (Besplatno):** Grupe poput *"Posao Beograd"*, *"Dostavljači Srbija"*, *"Wolt i Glovo Kuriri"*. Postavljanje informativnih postova sa linkovima koji imaju UTM parametre kako bi se pratila konverzija (npr. `?source=facebook&ref=grupa_beograd`).
2.  **TikTok organski rast:** Kreiranje TikTok naloga i postavljanje 1-2 videa nedeljno. TikTok algoritam gura lokalni sadržaj u Srbiji izuzetno dobro i donosi stotine organskih lead-ova bez ijednog uloženog dinara.
3.  **Referral sistem (Preporuke):** Ponuditi kuririma bonus od npr. 2.000 RSD za svakog novog dostavljača kojeg dovedu, a koji odradi bar 50 dostava (isplatu bonusa vrši agencija partner).

### Faza B: Do 100 kurira (Mikro-targetirani plaćeni oglasi)
1.  **Google Ads Search (Budžet: 10-15 EUR dnevno):** Visoko konvertujući saobraćaj jer ljudi koji ovo pretražuju već žele taj posao.
2.  **Meta Ads (Instagram/Facebook) Lead Generation (Budžet: 10 EUR dnevno):** Targetirati populaciju od 18-35 godina, studente, i ljude zainteresovane za dodatnu zaradu u većim gradovima.

### Faza C: Prvih 10 partnerskih agencija (B2B Outreach)
Vlasnici agencija flote konstantno traže nove ljude jer je fluktuacija dostavljača ogromna. Deliverix za njih predstavlja "spas" jer im donosi već filtrirane i spremne kandidate.
1.  **Direktan kontakt (Cold Outreach):** Pozvati i poslati ponudu registrovanim agencijama. 
    *   *Ponuda:* *"Donosimo vam 10 spremnih kurira mesečno. Prva 3 meseca su potpuno besplatna kako biste se uverili u kvalitet naših kandidata, a nakon toga plaćate malu fiksnu naknadu po aktiviranom kuriru."* Ovo je ponuda koju nijedan vlasnik flote ne može da odbije.
2.  **B2B Landing sekcija:** Na sajtu postoji sekcija za firme ("Partneri") gde agencije mogu poslati upit za saradnju, što automatski aktivira B2B lead funnel.

---

**Deliverix je sada operativno i tehnički spreman da postane vodeći agregator i platforma za zapošljavanje dostavljača na Balkanu. Lansiranje može da počne!**
