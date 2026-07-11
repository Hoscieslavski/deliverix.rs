import React from 'react';
import { FileText, ArrowLeft, Mail, Scale, HelpCircle, CheckCircle, Info } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12" id="terms-of-service-view">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-sky-500 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 shadow-xs transition cursor-pointer mb-8"
        id="terms-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazad na sajt
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Uslovi Korišćenja</h1>
              <p className="text-xs text-gray-400 mt-1">Zadnja izmena: 10. jul 2026.</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="font-medium text-gray-700">
            Dobrodošli na portal <strong>Deliverix.rs</strong>. Molimo vas da pažljivo pročitate ove Uslove korišćenja pre nego što nastavite sa upotrebom naših usluga, pretraživanjem bloga ili slanjem vaše prijave. 
            Pristupanjem i korišćenjem ovog portala, potvrđujete da ste u potpunosti razumeli i prihvatili ove uslove.
          </p>

          {/* Section 1 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-sky-500" />
              1. Opis usluge i uloga Deliverix portala
            </h2>
            <p>
              Deliverix.rs je nezavisni, besplatni informativni i regrutacioni portal čiji je cilj da pruži jasne, neutralne i ažurne informacije o radu dostavljača hrane u Republici Srbiji, kao i da olakša proces prijave novih kandidata.
            </p>
            <p className="font-semibold text-gray-800">
              Izjava o nezavisnosti:
            </p>
            <p className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm">
              Deliverix nije zvanični predstavnik, podružnica niti deo kompanija Wolt, Glovo ili drugih dostavnih platformi u Srbiji. Mi smo nezavisni posrednik koji obezbeđuje besplatnu podršku, informacije i regrutaciju, povezujući zainteresovane kandidate sa proverenim, zvanično registrovanim partnerskim agencijama flote u Srbiji.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-sky-500" />
              2. Uslovi za podnošenje prijave
            </h2>
            <p>
              Prilikom popunjavanja našeg formulara za prijavu, saglasni ste i garantujete sledeće:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Da imate najmanje <strong>18 godina</strong> starosti (punoletstvo je zakonski uslov za rad).</li>
              <li>Da su svi podaci koje unesete u formular (ime, prezime, telefon, grad, prevozno sredstvo) tačni, istiniti i potpuni. Unos lažnih podataka ili lažno predstavljanje može dovesti do odbijanja prijave.</li>
              <li>Da unosite sopstveni broj telefona na koji možete primiti SMS verifikacioni kod radi kontrole i praćenja statusa vaše prijave u Kandidat Portalu.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-500" />
              3. Ograničenje odgovornosti i garancija
            </h2>
            <p>
              Deliverix.rs ulaže maksimalne napore da sve informacije na sajtu i blogu budu tačne, aktuelne i korisne. Ipak:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Deliverix ne snosi odgovornost za eventualne privremene tehničke probleme na sajtu, kašnjenja u slanju SMS kodova ili greške u radu provajdera trećih strana.</li>
              <li>Sve informacije o zaradi dostavljača (npr. "zarada do 150.000 RSD") predstavljaju realne procene zasnovane na prosečnim rezultatima aktivnih dostavljača na tržištu, ali ne predstavljaju zakonsku garanciju fiksne ili sigurne zarade, jer ista zavisi od broja isporučenih porudžbina, radnog vremena, bonus modela i angažovanja samog dostavljača.</li>
              <li>Ugovor o radu ili saradnji sklapate direktno sa zvaničnom partnerskom agencijom flote u skladu sa zakonima Republike Srbije. Deliverix ne učestvuje u isplatama zarada niti regulisanju radnih odnosa nakon uspešnog povezivanja.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-500" />
              4. Zloupotreba i zaštita sistema
            </h2>
            <p>
              Strogo je zabranjeno bilo kakvo korišćenje skripti, automatizovanih softvera (botova) za masovno slanje lažnih prijava, zloupotreba SMS OTP verifikacionog sistema, kao i pokušaji narušavanja bezbednosti baze podataka ili servera portala Deliverix.rs. 
            </p>
            <p>
              Sve sumnjive aktivnosti biće odmah blokirane, a IP adresa počinioca biće trajno onemogućena za pristup portalu.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-500" />
              5. Izmene uslova korišćenja
            </h2>
            <p>
              Zadržavamo pravo da u bilo kom trenutku izmenimo ili dopunimo ove Uslove korišćenja u skladu sa promenama zakonskih propisa, uslova rada dostavnih platformi ili uvođenja novih funkcionalnosti na portal. Sve izmene stupaju na snagu u momentu objavljivanja na ovoj stranici. Nastavak korišćenja sajta nakon izmena smatra se prihvatanjem novih uslova.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-500" />
              6. Kontakt za podršku i primedbe
            </h2>
            <p>
              Ukoliko imate bilo kakve primedbe, pitanja ili vam je potrebna podrška u vezi sa korišćenjem naših usluga, slobodno nas kontaktirajte putem e-pošte:
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 inline-flex items-center gap-3 border border-gray-100">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href="mailto:info@deliverix.rs" className="font-mono text-xs sm:text-sm text-sky-600 hover:underline">
                info@deliverix.rs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
