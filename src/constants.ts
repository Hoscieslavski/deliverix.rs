/**
 * Default fallback site settings for instant render without blocking UI.
 */
export const DEFAULT_SITE_SETTINGS = {
  hero_enabled: true,
  hero_title: "",
  hero_platform_title: "Besplatno povezivanje sa proverenim partnerskim agencijama u Srbiji",
  homepage_subtitle: "Deliverix je nezavisna platforma koja besplatno povezuje buduće dostavljače sa proverenim partnerskim agencijama za Wolt, Glovo i druge dostavne platforme u Srbiji.",
  hero_badge_title: "Besplatna Podrška",
  hero_badge_text: "Pomažemo ti od prijave do prve dostave.",
  hero_right_mode: "single", // 'single' or 'slider'
  hero_image_url: "/src/assets/images/delivery_courier_hero_1783427588712.webp",
  hero_image_alt: "Dostavljač hrane - Wolt Glovo Srbija",
  
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
  ga_measurement_id: "G-XXXXXXXXXX"
};
