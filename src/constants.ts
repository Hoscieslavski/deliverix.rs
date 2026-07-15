/**
 * Default fallback site settings for instant render without blocking UI.
 */
export const DEFAULT_SITE_SETTINGS = {
  hero_enabled: true,
  hero_h1: "Pronađi posao dostavljača uz Deliverix",
  hero_title: "Tvoja vožnja. Tvoja zarada. Tvoj tempo.",
  hero_platform_title: "Besplatno povezivanje sa proverenim partnerskim agencijama u Srbiji",
  homepage_subtitle: "Deliverix je nezavisna platforma koja besplatno povezuje buduće dostavljače sa proverenim partnerskim agencijama za Wolt, Glovo i druge dostavne platforme u Srbiji.",
  hero_badge_title: "Wolt i Glovo prijava za dostavljače",
  hero_badge_text: "Pomažemo ti od prijave do prve dostave.",
  hero_bullets: [
    { text: "Prijava traje 2 minuta" },
    { text: "Besplatna podrška" },
    { text: "Pomažemo do prve dostave" },
    { text: "Beograd i Novi Sad" }
  ],
  hero_right_mode: "single", // 'single' or 'slider'
  hero_image_url: "/src/assets/images/delivery_courier_hero_1783427588712.webp",
  hero_image_alt: "Dostavljač hrane - Wolt Glovo Srbija",
  hero_wolt_bullet_1: "Fleksibilno radno vreme",
  hero_glovo_bullet_1: "Radno vreme na zakazivanje",
  hero_bullet_2: "Redovne isplate",
  hero_bullet_3: "Sopstveno/iznajmljeno vozilo",
  hero_bullet_4: "Besplatna podrška za start",
  hero_slider_upper_text: "Započni posao lakše",
  hero_slider_slides: [
    {
      image: "/src/assets/images/delivery_courier_hero_1783427588712.webp",
      badge_title: "Brzi Start",
      badge_text: "Aktivacija naloga i oprema u roku od 24h",
      seo_alt: "Dostavljač hrane na skuteru u Beogradu"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
      badge_title: "Redovna Isplata",
      badge_text: "Sigurna zarada na svake dve nedelje",
      seo_alt: "Wolt kurir sa plavom torbom na biciklu"
    },
    {
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800",
      badge_title: "Fleksibilno Vreme",
      badge_text: "Sami birate kada radite i koliko zarađujete",
      seo_alt: "Glovo dostavljač sa žutim rancem u Novom Sadu"
    }
  ],
  
  about_enabled: true,
  about_title: "Šta je Deliverix?",
  about_intro: "Deliverix je nezavisna platforma za prijavu dostavljača u Srbiji koja povezuje kandidate sa proverenim partnerskim agencijama za rad na dostavnim platformama kao što su Wolt i Glovo.",
  about_paragraph1: "Umesto da samostalno tražiš oglase, kontaktiraš više agencija i prolaziš kroz različite procedure, dovoljno je da ostaviš jednu prijavu. Na osnovu tvoje lokacije, raspoloživosti i željenog načina rada, pomažemo ti da pronađeš odgovarajuću saradnju.",
  about_paragraph2: "Naša podrška je potpuno besplatna i vodi te kroz ceo proces — od prve prijave do aktivacije naloga i početka rada.",
  about_tags: [
    "posao dostavljača",
    "prijava za dostavljača",
    "dostavljač Wolt",
    "dostavljač Glovo",
    "posao kurira",
    "dostava hrane",
    "dostavljač Srbija"
  ],
  
  why_choose_us_enabled: true,
  why_choose_us_title: "Zašto kandidati biraju nas?",
  why_choose_us_subtitle: "Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna za sve kandidate. Nemamo nikakve skrivene naknade, članarine niti uzimamo procenat od tvoje zarade.",
  why_choose_us_items: [
    "Besplatna obuka i priprema za start",
    "0 RSD troškova za našu podršku",
    "Povezivanje sa najpouzdanijim partnerima",
    "Dostupni smo ti za sva pitanja – uvek besplatno"
  ],
  
  steps_enabled: true,
  steps_title: "Kako funkcioniše proces?",
  steps: [
    {
      number: "01",
      title: "Brza Prijava",
      desc: "Popuni jednostavan formular na našem sajtu za manje od 60 sekundi. Bez komplikovane dokumentacije na samom početku."
    },
    {
      number: "02",
      title: "Kratak Telefonski Poziv",
      desc: "Pozvaćemo te da odgovorimo na sva tvoja pitanja, objasnimo ti sistem zarade, opreme i ugovora, i prilagodimo sve tvojim željama."
    },
    {
      number: "03",
      title: "Početak Rada",
      desc: "Povezujemo te sa zvaničnom partnerskom agencijom, pomažemo ti oko aktivacije naloga i preuzimanja opreme. Spreman si za prvu dostavu!"
    }
  ],
  
  requirements_enabled: true,
  requirements_title: "Uslovi za Rad i Prijava za Deliverix Flotu",
  requirements_subtitle: "Uslovi su minimalni i dostupni svima koji žele pošteno da zarade",
  requirements: [
    {
      title: "Pametni telefon",
      desc: "Android ili iPhone sa internetom kako bi mogao da koristiš Wolt Partner aplikaciju za dostave.",
      icon: "Smartphone"
    },
    {
      title: "Prevozno sredstvo",
      desc: "Bicikl (sopstveni ili električni), skuter / motor ili automobil. Sam biraš sa čim želiš da radiš.",
      icon: "Bike"
    },
    {
      title: "Lični dokumenti",
      desc: "Važeća lična karta (moraš imati najmanje 18 godina) i vozačka dozvola ukoliko voziš motorno vozilo.",
      icon: "FileText"
    }
  ],
  
  rent_enabled: true,
  rent_section_title: "Nemate sopstveno vozilo? Obezbeđujemo povoljnu renta!",
  rent_section_text: "Nemaš sopstveni auto, skuter ili električni bicikl? Deliverix sarađuje sa vodećim agencijama za rentiranje vozila. Pomažemo ti da obezbediš pouzdano vozilo po povlašćenim cenama i odmah počneš sa radom.",
  rent_bike_enabled: true,
  rent_scooter_enabled: true,
  rent_car_enabled: false,
  rent_items: [
    {
      title: "Električni bicikl",
      desc: "Mesečni najam za 25.000 RSD sa uračunatim servisima i stanicom za punjenje baterija.",
      icon: "Bike",
      badge: "Najtraženije",
      enabled: true,
      available: true
    },
    {
      title: "Skuter / Motor",
      desc: "Brzina i efikasnost na dužim distancama. Povoljni paketi sa uključenim servisiranjem.",
      icon: "ScooterIcon",
      badge: "Najbrže",
      enabled: true,
      available: true
    },
    {
      title: "Dostavni Automobil",
      desc: "Udobnost tokom cele godine bez obzira na vremenske prilike. Idealno za veće porudžbine.",
      icon: "Car",
      badge: "Za sve vremenske uslove",
      enabled: false,
      available: false
    }
  ],
  
  faq_enabled: true,
  blog_enabled: true,
  announcement_banner: "",
  
  logo_style: "flow",
  logo_url: "",
  logo_blend_mode: "normal",
  footer_logo_style: "flow",
  footer_logo_url: "",
  footer_logo_blend_mode: "normal",
  ga_measurement_id: "G-XXXXXXXXXX",

  // Kome je namenjen Deliverix? (Target Audience)
  target_audience_title: "Kome je namenjen Deliverix?",
  target_audience_desc: "Deliverix je namenjen svima koji žele da rade kao dostavljači ili traže fleksibilan posao sa mogućnošću dobre zarade. Pomažemo kandidatima različitih profila da brzo započnu sa radom:",
  target_audience_cards: [
    {
      title: "Studentima",
      desc: "Tražiš džeparac ili stabilan prihod uz predavanja? Radi fleksibilno, vikendima ili samo nekoliko sati tokom radne nedelje.",
      icon: "Sparkles"
    },
    {
      title: "Zaposlenima za dodatni prihod",
      desc: "Imaš stalan posao ali želiš dodatnu zaradu u slobodno vreme? Sam biraš kada se uključuješ na platformu.",
      icon: "Clock"
    },
    {
      title: "Nezaposlenima i aktivnim tražiocima",
      desc: "Tražiš posao sa punim radnim vremenom i visokom zaradom? Dostava pruža stabilan i odmah dostupan izvor prihoda.",
      icon: "ShieldCheck"
    },
    {
      title: "Ljudima bez ikakvog iskustva",
      desc: "Nikada nisi radio dostavu? Ne brini, naš mentorski tim ti pruža potpuno besplatnu obuku i vodi te korak po korak.",
      icon: "HeartHandshake"
    },
    {
      title: "Vozačima automobila",
      desc: "Iskoristi svoj automobil za rad. Savršeno rešenje za sve vremenske prilike i veće dostavne distance.",
      icon: "Car"
    },
    {
      title: "Vozačima skutera i motora",
      desc: "Najbrži način kretanja kroz gradske gužve u Beogradu i Novom Sadu. Visoka efikasnost i veći broj dostava po satu.",
      icon: "ScooterIcon"
    },
    {
      title: "Biciklistima i e-bike vozačima",
      desc: "Najzdraviji i najjeftiniji način za obavljanje dostave. Pomažemo ti i oko povoljnog najma električnih bicikala.",
      icon: "Bike"
    },
    {
      title: "Svima koji žele potpunu slobodu",
      desc: "Nemaš fiksno radno vreme niti šefa. Ti diktiraš tempo rada, kada odmaraš i koliko zarađuješ.",
      icon: "Compass"
    }
  ],

  // Kako funkcioniše proces
  steps_intro: "Prijava preko Deliverix platforme je jednostavna i traje svega nekoliko minuta. Naš cilj je da ti olakšamo početak rada tako što te povezujemo sa odgovarajućom partnerskom agencijom i pružamo podršku tokom cele procedure.",
  steps_subtitle: "Od prijave do tvoje prve isplate deli te samo nekoliko jednostavnih koraka:",

  // SEO Karijerni vodič sekcija
  seo_article_enabled: true,
  seo_article_badge: "Karijerni vodič i saveti",
  seo_article_title: "Zašto kandidati biraju posao dostavljača u Srbiji?",
  seo_article_p1: "Tržište dostave hrane i pošiljaka u Srbiji doživljava ogroman rast u poslednjih nekoliko godina. Sve veći broj ljudi traži fleksibilan posao koji im omogućava da sami diktiraju svoje radno vreme, usklađuju privatne obaveze i ostvaruju natprosečne prihode. Upravo zbog toga, posao dostavljača postao je jedan od najtraženijih i najpopularnijih poslova na našim prostorima.",
  seo_article_p2: "Bilo da vas zanima rad kao dostavljač Wolt platforme ili želite da postanete dostavljač Glovo flote, Deliverix platforma je tu da vam maksimalno pojednostavi i ubrza ceo proces zapošljavanja. Naš cilj je da eliminišemo administrativne prepreke i povežemo vas sa partnerima koji nude najbolje finansijske uslove, najniže provizije i redovne dvonedeljne isplate na račun.",
  seo_article_p3: "Jedna od najvećih prednosti jeste sloboda izbora prevoznog sredstva. Ukoliko preferirate dinamičnu vožnju kroz grad bez troškova goriva, posao sa biciklom ili električnim biciklom predstavlja izuzetan izbor. Sa druge strane, radnici koji žele maksimalan komfor tokom cele godine i rad bez obzira na kišu, sneg ili visoke temperature biraju posao sa automobilom.",
  seo_article_p4: "Takođe, posao kurira je izuzetno popularan kao posao za studente koji traže način da zarade džeparac tokom raspusta ili vikendima. Fleksibilna priroda aplikacije omogućava vam da radite tačno onoliko koliko želite – bez fiksnog radnog vremena, pritiska nadređenih ili obaveznih smena. Vi ste sami svoj šef.",
  seo_article_p5: "Pored studenata, many zaposleni koriste dostavu kao izvor za dodatnu zaradu nakon redovnih radnih sati na primarnom poslu. Samo 2-3 sata dnevno može vam doneti značajnu dopunu kućnog budžeta. Isplate se vrše redovno, a transparentan sistem unutar aplikacije omogućava vam da u svakom trenutku pratite svoju zaradu, ostvarene bonuse i bakšiš koji vam korisnici ostavljaju.",
  seo_article_p6: "Deliverix Srbija ne naplaćuje apsolutno ništa kandidatima. Naša misija je da pružimo besplatnu podršku, stručne savete i pomognemo vam da odaberete najbolju opciju za vaš profil. Od prve prijave na sajtu, preko prikupljanja dokumentacije, pa sve do preuzimanja opreme i prve uspešne dostave – naš mentorski tim je tu da vam pruži sigurnost i odgovori na sve nedoumice.",
  seo_article_metric1_title: "Maksimalna Fleksibilnost",
  seo_article_metric1_desc: "Sami birate kada radite, koliko dugo ostajete na terenu i kada pravite pauzu.",
  seo_article_metric2_title: "Odlična i Brza Zarada",
  seo_article_metric2_desc: "Mogućnost ostvarivanja zarade i preko 150.000 RSD mesečno uz redovne isplate na svakih 15 dana.",
  seo_article_metric3_title: "Puna Podrška Mentora",
  seo_article_metric3_desc: "Deliverix platforma vam pruža besplatnu obuku i savetovanje kako biste odmah krenuli uspešno.",

  // FAQ
  faq_title: "Česta Pitanja (FAQ)",
  faq_subtitle: "Sve što te interesuje na jednom mestu, jasno i transparentno",
  faqs: [
    {
      q: 'Da li je Deliverix besplatan?',
      a: 'Da! Deliverix platforma je 100% besplatna za sve kandidate. Pomoć oko prijave, savetovanje, obuka i spajanje sa proverenim partnerskim agencijama vas ne košta apsolutno ništa. Nemamo nikakve skrivene troškove niti uzimamo procenat od vaše zarade.'
    },
    {
      q: 'Da li Deliverix zapošljava?',
      a: 'Deliverix je nezavisna platforma za podršku, informisanje i regrutaciju, a ne direktni poslodavac. Mi vas besplatno povezujemo sa zvaničnim i pouzdanim partnerskim agencijama (flotama) koje su licencirane za rad sa Wolt i Glovo platformama u Srbiji.'
    },
    {
      q: 'Da li ste vi Wolt ili Glovo?',
      a: 'Ne, mi nismo Wolt niti Glovo. Deliverix je nezavisna platforma koja pomaže budućim dostavljačima da brzo i jednostavno prođu kroz proceduru prijave i započnu rad kod proverenih partnerskih agencija (flota) za Wolt, Glovo i druge dostavne platforme.'
    },
    {
      q: 'Koliko mogu da zaradim kao dostavljač?',
      a: 'Zarada direktno zavisi od broja radnih sati, izabranog prevoznog sredstva i ostvarenih bonusa. Aktivni dostavljači koji rade puno radno vreme mogu ostvariti zaradu od 100.000 do preko 150.000 RSD mesečno. Takođe, sav bakšiš koji dobijete od kupaca ostaje 100% vama.'
    },
    {
      q: 'Koliko traje proces prijave?',
      a: 'Sama prijava na našem sajtu traje manje od 2 minuta. Nakon što popunite formular, naš mentorski tim će vas kontaktirati u najkraćem roku (najčešće u roku od nekoliko sati) kako bismo odgovorili na vaša pitanja i dogovorili sledeće korake.'
    },
    {
      q: 'Kada mogu da počnem sa radom?',
      a: 'Nakon razgovora sa našim mentorom i spajanja sa agencijom, proces aktivacije naloga i preuzimanja opreme obično traje između 24 i 48 sati. To znači da već za dan ili dva možete biti na ulicama i praviti svoje prve isporuke.'
    },
    {
      q: 'Da li mogu da radim samo vikendom ili nekoliko sati dnevno?',
      a: 'Apsolutno! Fleksibilnost je najveća prednost ovog posla. Sami birate kada se uključujete na aplikaciju i koliko radite. Možete raditi samo vikendom, nekoliko sati posle podne kao dodatni posao, ili puno radno vreme – izbor je isključivo vaš.'
    }
  ],

  // Footer & Legal Notes
  footer_company_name: "Deliverix Srbija",
  footer_description: "Besplatne konsultacije i posredovanje pri zapošljavanju dostavljača.",
  footer_disclaimer: "Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne.",
  footer_legal_disclaimer: "Izjava o odgovornosti: Mi nismo zvanični predstavnici niti deo kompanija Wolt, Glovo ili drugih dostavnih platformi. Mi smo nezavisni informativni portal koji pomaže kandidatima da se lakše povežu sa registrovanim partnerskim agencijama za dostavu u Republici Srbiji.",

  // CTA buttons
  button_hero_cta: "Započni prijavu odmah",
  button_hero_secondary_cta: "Kako funkcioniše?",
  button_requirements_cta: "Započni besplatnu prijavu",
  button_blog_cta: "Poseti naš blog",
  button_footer_cta: "Započni prijavu odmah (Traje 1 min)",
  button_header_apply: "Prijavi se",
  button_header_portal: "Prati prijavu",

  // Tab labels (Wolt & Glovo)
  button_wolt_title: "Wolt",
  button_wolt_badge: "Aktivno / Prijavi se",
  button_wolt_desc: "Isplate na 15 dana. Fleksibilno vreme.",
  button_glovo_title: "Glovo",
  button_glovo_badge: "Uskoro / Rezerviši mesto",
  button_glovo_desc: "Uskoro krećemo! Prijavi se i osiguraj mesto."
};
