# Plan Arhitekture i Dizajn MVP Aplikacije za Regrutaciju Dostavljača

Ovaj dokument sadrži detaljan plan arhitekture, strukturu foldera, wireframe strukturu stranica i model baze podataka za partnersku agenciju za zapošljavanje Wolt dostavljača u Srbiji.

---

## 1. Plan Arhitekture (Architecture Plan)

Aplikacija je koncipirana kao **Full-stack SPA (Single Page Application)** sa Node.js/Express backendom i React/Vite frontendom. 

### Ključne komponente:
* **Klijent (React / Tailwind CSS / Motion):** Brz, responzivan (mobile-first), bez nepotrebnog učitavanja, sa modernim animacijama.
* **Server (Express):** Proxy sloj koji upravlja API zahtevima, komunicira sa bazom podataka (Firestore) i obezbeđuje sigurnost (sakrivanje API ključeva, validacija, admin autentifikacija).
* **Baza podataka (Firebase Firestore):** Pouzdan i brz NoSQL cloud skladišni sistem koji čuva informacije o kandidatima i omogućava real-time ažuriranja i promene statusa iz admin panela.
* **Sigurnost (Security):** Admin panel je zaštićen administratorskom lozinkom (Admin Passcode) koja se proverava isključivo na serverskoj strani, sprečavajući neovlašćen pristup podacima kandidata.

---

## 2. Struktura Foldera (Folder Structure)

```text
/
├── .env.example                  # Primer ekoloških promenljivih (lozinke, ključevi)
├── index.html                    # Glavni HTML šablon
├── metadata.json                 # Metapodaci aplikacije
├── package.json                  # Zavisnosti i skripte za pokretanje
├── server.ts                     # Express server & API rute (backend)
├── vite.config.ts                # Vite konfiguracija
├── ARCHITECTURE.md               # Ovaj fajl (Plan i specifikacija)
└── src/
    ├── main.tsx                  # Glavna ulazna tačka za React
    ├── App.tsx                   # Glavna komponenta (usmeravanje i raspored)
    ├── index.css                 # Globalni stilovi i Tailwind CSS importi
    ├── types.ts                  # TypeScript tipovi za kandidate i stanja
    ├── components/               # Višekratne komponente
    │   ├── LandingPage.tsx       # Glavna stranica sa sekcijama
    │   ├── ApplicationForm.tsx   # Moderna i jednostavna forma za prijavu
    │   ├── AdminDashboard.tsx    # Admin interfejs za upravljanje kandidatima
    │   └── UI/                   # Mali UI elementi (dugmad, kartice, modal)
    └── utils/                    # Pomoćne funkcije (npr. formiranje WhatsApp poruka)
```

---

## 3. Wireframe Stranica (Page Wireframes)

### A. Landing Page (Glavna Stranica)
```text
+-------------------------------------------------------------+
| [Wolt Partner Logo/Branding]            [CTA: Prijavi Se]   |
+-------------------------------------------------------------+
|                                                             |
|                 POSTANI WOLT DOSTAVLJAČ                     |
|    Pomažemo ti da brzo kreneš sa radom. Dobijaš informacije, |
|           podršku i vođenje kroz ceo proces.                |
|                                                             |
|                    [ Dugme: Prijavi se ]                    |
|                                                             |
+-------------------------------------------------------------+
| KAKO FUNKCIONIŠE PROCES (3 koraka sa ikonama)               |
| [1. Prijava] ------> [2. Razgovor] ------> [3. Početak rada]|
+-------------------------------------------------------------+
| ŠTA TI JE POTREBNO (Vozilo, Telefon, Želja za radom)        |
+-------------------------------------------------------------+
| ČESTA PITANJA (FAQ sa harmonika/accordion elementima)       |
| - Koliko mogu da zaradim?                                   |
| - Da li moram da imam svoje vozilo?                         |
| - Kako ide isplata?                                         |
+-------------------------------------------------------------+
| KONTAKT & PODRŠKA (Podaci za direktan kontakt, bez pritiska)|
+-------------------------------------------------------------+
```

### B. Forma za Prijavu (Application Form)
```text
+-------------------------------------------------------------+
|                  PRIJAVA ZA WOLT DOSTAVLJAČA                |
|                                                             |
|  * Ime i prezime:  [____________________________________]   |
|  * Telefon:        [+381 6______________________________]   |
|  * Grad:           [ Izaberi grad (Beograd, Novi Sad...) ]   |
|  * Vozilo:         ( ) Bicikl  ( ) Skuter  ( ) Automobil     |
|  * Iskustvo:       ( ) Da, radio sam  ( ) Ne, bez iskustva   |
|  * Kada počinješ:  [ Izaberi (Odmah / Za par dana...)   ]   |
|                                                             |
|                 [ DUGME: POŠALJI PRIJAVU ]                  |
+-------------------------------------------------------------+
```

### C. Admin Panel (Dashboard)
```text
+-------------------------------------------------------------+
| ADMIN PANEL -- WOLT PARTNER                   [Lozinka: ***]|
+-------------------------------------------------------------+
| STATISTIKA:                                                 |
| [ Novi: 5 ]   [ Kontaktirani: 12 ]   [ Aktivni: 8 ]   [ Ukupno: 25 ]
+-------------------------------------------------------------+
| FILTERI: Grad: [Svi] | Vozilo: [Sve] | Status: [Svi]        |
+-------------------------------------------------------------+
| LISTA KANDIDATA:                                            |
| Ime i Prezime | Telefon   | Grad | Vozilo | Status (Izmena) | Akcija
| --------------+-----------+------+--------+-----------------+--------
| Petar Petrović| 061123456 | BG   | Skuter | [ SENT_TO... ]  | [WA] [✉]
| Marko Marković| 064987654 | NS   | Auto   | [ NEW        ]  | [WA] [✉]
+-------------------------------------------------------------+
```

---

## 4. Predlog Baze Podataka (Firestore Database Schema)

Koristićemo Firestore kolekciju pod nazivom `candidates`. Svaki dokument predstavlja jednog kandidata sa sledećim modelom podataka:

```typescript
interface Candidate {
  id: string;                  // Jedinstveni Firestore ID
  ime: string;                 // Ime i prezime
  telefon: string;             // Telefon (npr. +38161234567)
  grad: string;                // Grad (Beograd, Novi Sad, Niš, Kragujevac, itd.)
  vozilo: 'bicikl' | 'skuter' | 'automobil';
  iskustvo: 'da' | 'ne';       // Da li ima prethodnog iskustva u dostavi
  kada_poceti: string;         // "odmah", "par_dana", "sledece_nedelje"
  datum_prijave: string;       // ISO format datuma prijave
  status: 'NEW' | 'CONTACTED' | 'SENT_TO_PARTNER' | 'ACTIVE' | 'INACTIVE';
  
  // Automatizacija i buduće proširenje:
  izvor: string;               // Praćenje izvora prijave (npr. "direct", "facebook", "referral")
  referral_code?: string;      // Šifra preporučioca ako postoji
  napomena?: string;           // Interni komentar administratora
  last_updated_at?: string;    // Poslednje vreme izmene kandidata
}
```

Ovaj model omogućava izuzetno laku migraciju na relacione baze podataka u budućnosti i podržava pretragu, statistiku i praćenje konverzija.
