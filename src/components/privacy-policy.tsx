import React from 'react';
import { ShieldCheck, ArrowLeft, Mail, Calendar, Eye, FileText, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12" id="privacy-policy-view">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-deliverix-500 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 shadow-xs transition cursor-pointer mb-8"
        id="privacy-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazad na sajt
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-deliverix-50 text-deliverix-500 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Politika Privatnosti</h1>
              <p className="text-xs text-gray-400 mt-1">Zadnja izmena: 10. jul 2026.</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="font-medium text-gray-700">
            Dobrodošli na portal <strong>Deliverix.rs</strong>. Vaša privatnost i bezbednost vaših podataka su nam na prvom mestu. 
            U ovoj Politici privatnosti objašnjavamo koje podatke prikupljamo kada koristite naš portal, u koje svrhe ih koristimo i kako ih štitimo u skladu sa važećim Zakonom o zaštiti podataka o ličnosti Republike Srbije.
          </p>

          {/* Section 1 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-deliverix-500" />
              1. Podaci koje prikupljamo
            </h2>
            <p>
              Prilikom korišćenja našeg portala, a posebno prilikom popunjavanja formulara za prijavu za posao dostavljača, prikupljamo sledeće podatke o ličnosti koje nam dobrovoljno dostavljate:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Ime i prezime:</strong> Radi identifikacije i uspostavljanja kontakta.</li>
              <li><strong>Broj telefona:</strong> Neophodan za kontaktiranje i verifikaciju statusa prijave putem SMS koda.</li>
              <li><strong>Grad rada:</strong> Kako bismo vas povezali sa odgovarajućim partnerskim agencijama u vašem gradu (npr. Beograd, Novi Sad).</li>
              <li><strong>Željeno prevozno sredstvo:</strong> (Bicikl, sopstveni e-bicikl, skuter/motor, automobil) kako bismo prilagodili ponudu posla.</li>
              <li><strong>Informacija o posedovanju sopstvenog vozila:</strong> Da bismo znali sa kojim prevoznim sredstvom planirate da vršite dostavu.</li>
              <li><strong>Izvor (kako ste čuli za nas):</strong> U statističke svrhe i optimizaciju marketinških kampanja.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-deliverix-500" />
              2. Svrha obrade podataka
            </h2>
            <p>
              Vaše podatke o ličnosti prikupljamo i obrađujemo isključivo u sledeće svrhe:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Besplatno posredovanje i podrška pri zapošljavanju:</strong> Obrada vaše prijave i njeno prosleđivanje zvaničnim, registrovanim partnerskim agencijama koje imaju ugovor sa Wolt i Glovo platformama.</li>
              <li><strong>Kontaktiranje:</strong> Pružanje informacija o procesu registracije, obuke, preuzimanja opreme i uslovima rada.</li>
              <li><strong>Kandidat Portal:</strong> Omogućavanje pristupa vašem ličnom panelu gde možete pratiti u kom se statusu nalazi vaša prijava (preko verifikacionog SMS OTP koda).</li>
              <li><strong>Analitika:</strong> Praćenje poseta portalu radi poboljšanja korisničkog iskustva kroz anonimizovane kolačiće.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-deliverix-500" />
              3. Bezbednost i deljenje podataka
            </h2>
            <p>
              Vaši podaci se čuvaju u sigurnim cloud bazama zaštićenim savremenim sigurnosnim protokolima. Podatke delimo isključivo sa našim proverenim i registrovanim partnerskim flotama koje su direktno zadužene za vaše zapošljavanje na Wolt i Glovo platformama. 
            </p>
            <p className="bg-deliverix-50/50 border border-deliverix-100 rounded-2xl p-4 text-deliverix-800 text-xs sm:text-sm">
              <strong>Napomena:</strong> Deliverix nikada ne prodaje, ne iznajmljuje niti deli vaše privatne podatke trećim stranama u marketinške svrhe. Deljenje se vrši isključivo uz vaš pristanak radi uspostavljanja radnog odnosa sa partnerskom agencijom za dostavu.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-deliverix-500" />
              4. Kolačići (Cookies) i Google servisi
            </h2>
            <p>
              Naš portal koristi kolačiće kako bi obezbedio pravilno funkcionisanje sistema (npr. čuvanje sesije prijave) i za praćenje analitike poseta (Google Analytics / Google Tag Manager).
            </p>
            <p>
              Kolačići za analitiku nam pomažu da razumemo koji delovi portala su najkorisniji posetiocima i kako možemo poboljšati brzinu i stabilnost sajta. Možete kontrolisati ili onemogućiti kolačiće u podešavanjima vašeg internet pretraživača.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-deliverix-500" />
              5. Vaša prava
            </h2>
            <p>
              U skladu sa Zakonom o zaštiti podataka o ličnosti, imate sledeća prava u vezi sa vašim podacima:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Pravo na uvid i informaciju o tome kako se vaši podaci obrađuju.</li>
              <li>Pravo na ispravku netačnih ili dopunu nepotpunih podataka.</li>
              <li><strong>Pravo na brisanje ("pravo na zaborav"):</strong> Možete u svakom trenutku zahtevati da trajno obrišemo sve vaše podatke iz našeg sistema.</li>
              <li>Pravo na povlačenje pristanka za obradu podataka.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-deliverix-500" />
              6. Kontakt za pitanja i brisanje podataka
            </h2>
            <p>
              Ukoliko imate bilo kakvih pitanja o tome kako postupamo sa vašim podacima ili želite da podnesete zahtev za brisanje vaših podataka iz naše baze, molimo vas da nas kontaktirate direktno putem e-pošte:
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 inline-flex items-center gap-3 border border-gray-100">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href="mailto:info@deliverix.rs" className="font-mono text-xs sm:text-sm text-deliverix-600 hover:underline">
                info@deliverix.rs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
