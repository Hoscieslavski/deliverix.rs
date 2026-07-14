import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bike, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight, 
  HeartHandshake, 
  Smartphone,
  Check,
  Compass,
  MessageSquare,
  Zap,
  Car
} from 'lucide-react';
import ScooterIcon from './ScooterIcon';
import { DEFAULT_SITE_SETTINGS } from '../constants';
import { getSeoSettings } from '../App';

interface LandingPageProps {
  onOpenApply: () => void;
  onNavigateToBlog: () => void;
  siteSettings?: any;
}

function SafeBlogImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className={`${className} bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white`}>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-lg"></div>
        <div className="relative z-10 flex flex-col items-center gap-2 text-center select-none">
          <Bike className="w-8 h-8 opacity-90 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Deliverix Blog</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function LandingPage({ onOpenApply, onNavigateToBlog, siteSettings: initialSettings }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<'wolt' | 'glovo'>('wolt');
  const [siteSettings, setSiteSettings] = useState<any>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [landingBlogIndex, setLandingBlogIndex] = useState(0);
  const landingBlogRef = React.useRef<HTMLDivElement>(null);

  const handleLandingBlogScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      setLandingBlogIndex(index);
    }
  };

  const scrollLandingBlogTo = (idx: number) => {
    if (landingBlogRef.current) {
      const container = landingBlogRef.current;
      const cards = container.querySelectorAll('.snap-start');
      if (cards[idx]) {
        cards[idx].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    }
  };

  React.useEffect(() => {
    if (siteSettings?.hero_right_mode !== 'slider') return;
    const slidesCount = siteSettings?.hero_slider_images?.length || 0;
    if (slidesCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slidesCount);
    }, 7000);

    return () => clearInterval(timer);
  }, [siteSettings, siteSettings?.hero_slider_images]);

  React.useEffect(() => {
    // Sinkronizuj podešavanja iz roditeljskog App.tsx kad god se učitaju/ažuriraju
    if (initialSettings) {
      setSiteSettings(initialSettings);
    }
  }, [initialSettings]);

  React.useEffect(() => {
    // Učitaj SEO i podešavanja sajta u pozadini / osveži ih preko keširanog javnog SEO endpointa
    getSeoSettings()
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings((prev: any) => ({ ...prev, ...data.settings }));
          if (data.settings.meta_title) {
            document.title = data.settings.meta_title;
          } else {
            document.title = "Wolt i Glovo Dostavljač Beograd | Deliverix";
          }
          
          // Dinamički ažuriraj meta description u dokumentu
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', data.settings.meta_description || "Želiš posao sa fleksibilnim radnim vremenom i zaradom do 150.000 RSD? Prijavi se za rad na Wolt i Glovo platformama preko Deliverix-a. Besplatno!");
          }
        }
      })
      .catch(err => console.error('Greška pri učitavanju SEO podešavanja:', err));

    // Učitaj najnovija 3 blog posta u pozadini sa odlaganjem (Faza 4)
    const loadBlogPosts = () => {
      fetch('/api/blog-posts')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.posts) {
            setLatestPosts(data.posts.slice(0, 3));
          }
        })
        .catch(err => console.error('Greška pri učitavanju blog postova za landing:', err));
    };

    let isBlogLoaded = false;
    const triggerBlogLoad = () => {
      if (isBlogLoaded) return;
      isBlogLoaded = true;
      window.removeEventListener('scroll', triggerBlogLoad);
      window.removeEventListener('touchstart', triggerBlogLoad);
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          loadBlogPosts();
        });
      } else {
        setTimeout(loadBlogPosts, 1000);
      }
    };

    window.addEventListener('scroll', triggerBlogLoad, { passive: true });
    window.addEventListener('touchstart', triggerBlogLoad, { passive: true });

    const fallbackTimeout = setTimeout(triggerBlogLoad, 4000);

    return () => {
      window.removeEventListener('scroll', triggerBlogLoad);
      window.removeEventListener('touchstart', triggerBlogLoad);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const slides = siteSettings?.hero_slider_slides && siteSettings.hero_slider_slides.length > 0
    ? siteSettings.hero_slider_slides
    : (siteSettings?.hero_slider_images || []).map((img: string) => ({
        image: img,
        badge_title: siteSettings?.hero_badge_title || 'Dostupno odmah',
        badge_text: siteSettings?.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
      }));

  const activeSlide = siteSettings?.hero_right_mode === 'slider' && slides.length > 0
    ? slides[currentSlide % slides.length]
    : {
        badge_title: siteSettings?.hero_badge_title || 'Dostupno odmah',
        badge_text: siteSettings?.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
      };

  const iconMap: Record<string, any> = {
    Smartphone: Smartphone,
    Bike: Bike,
    FileText: FileText,
    Clock: Clock,
    MapPin: MapPin,
    ShieldCheck: ShieldCheck,
    ScooterIcon: ScooterIcon,
    Car: Car
  };

  const steps = siteSettings?.steps && siteSettings.steps.length > 0
    ? siteSettings.steps
    : [
        {
          number: '01',
          title: 'Brza Prijava',
          desc: 'Popuni jednostavan formular na našem sajtu za manje od 60 sekundi. Bez komplikovane dokumentacije na samom početku.'
        },
        {
          number: '02',
          title: 'Kratak Telefonski Poziv',
          desc: 'Pozvaćemo te da odgovorimo na sva tvoja pitanja, objasnimo ti sistem zarade, opreme i ugovora, i prilagodimo sve tvojim željama.'
        },
        {
          number: '03',
          title: 'Početak Rada',
          desc: 'Povezujemo te sa zvaničnom partnerskom agencijom, pomažemo ti oko aktivacije naloga i preuzimanja opreme. Spreman si za prvu dostavu!'
        }
      ];

  const requirements = siteSettings?.requirements && siteSettings.requirements.length > 0
    ? siteSettings.requirements.map((req: any) => ({
        title: req.title,
        desc: req.desc,
        icon: iconMap[req.icon] || Smartphone
      }))
    : [
        {
          title: 'Pametni telefon',
          desc: 'Android ili iPhone sa internetom kako bi mogao da koristiš Wolt Partner aplikaciju za dostave.',
          icon: Smartphone
        },
        {
          title: 'Prevozno sredstvo',
          desc: 'Bicikl (sopstveni ili električni), skuter / motor ili automobil. Sam biraš sa čim želiš da radiš.',
          icon: Bike
        },
        {
          title: 'Lični dokumenti',
          desc: 'Važeća lična karta (moraš imati najmanje 18 godina) i vozačka dozvola ukoliko voziš motorno vozilo.',
          icon: FileText
        }
      ];

  const rentItems = siteSettings?.rent_items && siteSettings.rent_items.length > 0
    ? siteSettings.rent_items.map((item: any) => ({
        title: item.title,
        desc: item.desc,
        icon: iconMap[item.icon] || Bike,
        badge: item.badge,
        enabled: item.enabled !== false,
        available: item.available !== false
      }))
    : [
        {
          title: 'Električni bicikl',
          desc: 'Mesečni najam za 25.000 RSD sa uračunatim servisima i stanicom za punjenje baterija.',
          icon: Bike,
          badge: 'Najtraženije',
          enabled: siteSettings?.rent_bike_enabled !== false,
          available: true
        },
        {
          title: 'Skuter / Motor',
          desc: 'Brzina i efikasnost na dužim distancama. Povoljni paketi sa uključenim servisiranjem.',
          icon: ScooterIcon,
          badge: 'Najbrže',
          enabled: siteSettings?.rent_scooter_enabled !== false,
          available: true
        },
        {
          title: 'Dostavni Automobil',
          desc: 'Udobnost tokom cele godine bez obzira na vremenske prilike. Idealno za veće porudžbine.',
          icon: Car,
          badge: 'Za sve vremenske uslove',
          enabled: siteSettings?.rent_car_enabled !== false,
          available: false
        }
      ];

  const faqs = siteSettings?.faqs && siteSettings.faqs.length > 0
    ? siteSettings.faqs
    : [
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
        },
        {
          q: 'Šta ako nemam sopstveno vozilo za dostavu?',
          a: 'To uopšte nije problem. Preko naših partnerskih agencija obezbeđujemo mogućnost povoljnog najma električnih bickala (e-bike), skutera ili automobila po povlašćenim uslovima sa uključenim servisima, tako da možete početi odmah.'
        },
        {
          q: 'Kako i kada funkcionišu isplate?',
          a: 'Isplate se vrše redovno i na vreme, svake dve nedelje (na svakih 15 dana) direktno na vaš tekući račun. Uz svaku isplatu dobijate detaljan i transparentan obračun odrađenih dostava, bonusa i bakšiša.'
        },
        {
          q: 'U kojim gradovima u Srbiji mogu da radim?',
          a: 'Primarni fokus nam je na Beograd i Novi Sad gde je potražnja za dostavljačima najveća, ali prijave prihvatamo i za sve ostale veće gradove u Srbiji u kojima su dostupne Wolt i Glovo dostavne usluge.'
        }
      ];

  const targetAudienceItems = siteSettings?.target_audience_items && siteSettings.target_audience_items.length > 0
    ? siteSettings.target_audience_items
    : [
        'Osobe koje žele odličnu zaradu i stabilan prihod uz potpunu kontrolu nad svojim vremenom',
        'Studente koji žele da rade samo vikendom ili par sati dnevno',
        'Zaposlene koji traže dodatni izvor prihoda nakon radnog vremena',
        'Osobe bez ikakvog prethodnog iskustva u dostavi ili prodaji'
      ];

  const whyApplyItems = siteSettings?.why_apply_items && siteSettings.why_apply_items.length > 0
    ? siteSettings.why_apply_items
    : [
        { title: 'Jedna prijava umesto više formulara', desc: 'Popunjavaš samo jedan obrazac, a mi odrađujemo sve ostalo sa partnerskim agencijama.' },
        { title: 'Besplatna pomoć tokom cele prijave', desc: 'Naš tim te savetuje i vodi kroz sve korake bez ikakvih skrivenih troškova.' },
        { title: 'Saveti oko izbora agencije', desc: 'Preporučujemo ti isključivo proverene partnere sa najmanjom provizijom.' },
        { title: 'Pomoć oko aktivacije naloga', desc: 'Ubrzavamo proces odobrenja na platformama Wolt i Glovo.' },
        { title: 'Informacije o zaradi i opremi', desc: 'Saznaj unapred sve detalje o bonusima, opremi, isplatama i dokumentaciji.' },
        { title: 'Mentor za sva pitanja', desc: 'Dobijaš svog mentora kome možeš da postavljaš pitanja u bilo koje doba dana.' },
        { title: 'Brži početak rada', desc: 'Skraćujemo vreme čekanja kako bi počeo da zarađuješ već u roku od 24-48 sati.' }
      ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 animate-fade-in" id="landing-loading">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
          Učitavanje...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-16" id="landing-page-root">
      
      {/* Obaveštenje sa vrha (Samo ako postoji) */}
      {siteSettings?.announcement_banner && (
        <div className="bg-amber-50 border border-amber-150 text-amber-900 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{siteSettings?.announcement_banner}</span>
        </div>
      )}

      {/* Hero Sekcija - Dve kolone */}
      {siteSettings?.hero_enabled !== false && (
        <section className="relative overflow-hidden pt-4 pb-4 lg:pt-8 lg:pb-10" id="section-hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Tekst Hero Sekcije (Leva strana) */}
          <div className="lg:col-span-7 space-y-5 text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider border border-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Pronađi posao dostavljača uz Deliverix</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5.5xl font-black text-gray-900 tracking-tight leading-[1.12] text-left">
              {siteSettings?.hero_title ? (
                <span>{siteSettings.hero_title}</span>
              ) : (
                <>Pronađi <span className="text-sky-500 underline decoration-sky-300 decoration-wavy decoration-3">posao dostavljača</span> uz Deliverix</>
              )}
            </h1>

            <h2 className="text-lg sm:text-xl font-extrabold text-gray-700 tracking-tight text-left text-sky-600">
              {siteSettings?.hero_platform_title || "Besplatno povezivanje sa proverenim partnerskim agencijama u Srbiji"}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-500 leading-snug sm:leading-relaxed max-w-xl text-left">
              {siteSettings?.homepage_subtitle || "Deliverix je nezavisna platforma koja besplatno povezuje buduće dostavljače sa proverenim partnerskim agencijama za Wolt, Glovo i druge dostavne platforme u Srbiji."}
            </p>

            {/* Ključne stavke u Hero sekciji (Celina 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full pt-1">
              {[
                "Prijava traje 2 minuta",
                "Besplatna podrška",
                "Pomažemo do prve dostave",
                "Beograd i Novi Sad"
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Isticanje Partnerskih Platformi (Celina C - 3.1) */}
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-50 border border-gray-150 rounded-2xl max-w-lg w-full">
              <button
                type="button"
                onClick={() => setActivePlatformTab('wolt')}
                className={`flex-1 p-3.5 rounded-xl transition-all cursor-pointer text-left flex flex-col justify-between border ${
                  activePlatformTab === 'wolt'
                    ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-black uppercase tracking-wider">Wolt</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activePlatformTab === 'wolt' ? 'bg-white text-sky-600' : 'bg-emerald-100 text-emerald-800 animate-pulse'}`}>
                    Aktivno / Prijavi se
                  </span>
                </div>
                <p className={`text-[10px] mt-1 font-semibold ${activePlatformTab === 'wolt' ? 'text-sky-200' : 'text-gray-500'}`}>
                  Isplate na 15 dana. Fleksibilno vreme.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('glovo')}
                className={`flex-1 p-3.5 rounded-xl transition-all cursor-pointer text-left flex flex-col justify-between border ${
                  activePlatformTab === 'glovo'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-sm font-black uppercase tracking-wider">Glovo</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activePlatformTab === 'glovo' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'}`}>
                    Uskoro / Rezerviši mesto
                  </span>
                </div>
                <p className={`text-[10px] mt-1 font-semibold ${activePlatformTab === 'glovo' ? 'text-amber-100' : 'text-gray-500'}`}>
                  Uskoro krećemo! Prijavi se i osiguraj mesto.
                </p>
              </button>
            </div>

            {/* Ključne stavke odmah vidljive */}
            <div className="grid grid-cols-2 gap-2 text-left w-full max-w-lg">
              {[
                activePlatformTab === 'wolt' ? 'Fleksibilno radno vreme' : 'Radno vreme na zakazivanje',
                'Redovne isplate',
                'Sopstveno/iznajmljeno vozilo',
                'Besplatna podrška za start'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-150/50 p-2.5 rounded-xl">
                  <div className="w-4.5 h-4.5 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA dugmad */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <button
                id="hero-apply-btn"
                onClick={onOpenApply}
                className="flex-1 px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-black rounded-xl shadow-lg shadow-sky-500/20 text-center active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Započni prijavu odmah <ArrowRight className="w-4 h-4" />
              </button>
              <a
                id="hero-learn-more-btn"
                href={
                  siteSettings?.steps_enabled !== false 
                    ? "#kako-funkcionise" 
                    : siteSettings?.requirements_enabled !== false 
                    ? "#sta-je-potrebno" 
                    : siteSettings?.rent_enabled === true 
                    ? "#renta-vozila" 
                    : "#kontakt"
                }
                className="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-bold rounded-xl text-center transition flex items-center justify-center"
              >
                Kako funkcioniše?
              </a>
            </div>
          </div>

          {/* Vizuelni desni deo (Slika dostavljača / Slajder) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-sm lg:max-w-none">
              {/* Ukrasni pozadinski elementi (Ambijentalno blago svetlo) */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-sky-200/20 blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>
              <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-blue-100/15 blur-2xl -z-10"></div>
              
              <div className="relative bg-white p-2.5 rounded-[2rem] border border-gray-150/80 shadow-2xl overflow-hidden aspect-square group">
                <div className="w-full h-full relative overflow-hidden rounded-[1.75rem] bg-gray-50">
                  {/* Slajder / Slika prikaz */}
                  {siteSettings?.hero_right_mode === 'slider' && slides.length > 0 ? (
                    <>
                      {slides.map((slide: any, idx: number) => (
                        <motion.img
                          key={idx}
                          src={slide.image}
                          alt={siteSettings?.hero_image_alt || 'Dostavljač hrane - Wolt Glovo Srbija'}
                          className="absolute inset-0 w-full h-full object-cover rounded-[1.75rem]"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ 
                            opacity: currentSlide === idx ? 1 : 0,
                            scale: currentSlide === idx ? 1 : 1.05,
                            zIndex: currentSlide === idx ? 10 : 0
                          }}
                          transition={{ duration: 0.8, ease: 'easeInOut' }}
                          referrerPolicy="no-referrer"
                        />
                      ))}

                      {/* Navigacioni tasteri levo / desno (prikazuju se na hover na desktopu, uvek vidljivi na mobilnom) */}
                      {slides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 text-gray-800 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300 focus:outline-none cursor-pointer hover:scale-105 active:scale-95"
                            title="Prethodna slika"
                          >
                            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 text-gray-800 flex items-center justify-center shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300 focus:outline-none cursor-pointer hover:scale-105 active:scale-95"
                            title="Sledeća slika"
                          >
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    /* Standardna pojedinačna slika u WebP formatu */
                    <img
                      src={siteSettings?.hero_image_url || '/src/assets/images/delivery_courier_hero_1783427588712.webp'}
                      alt={siteSettings?.hero_image_alt || 'Dostavljač hrane - Wolt Glovo Srbija'}
                      className="w-full h-full object-cover rounded-[1.75rem]"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Moderni statusni tag - zajednički za oba moda */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      {activeSlide?.badge_title || 'Besplatna Podrška'}
                    </span>
                  </div>

                  {/* Suptilan i elegantan overlay na dnu slike koji eliminiše osećaj reklame */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 sm:p-6 pt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
                    <div className="min-w-0 text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                        Započni posao lakše
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
                        {activeSlide?.badge_text || 'Pomažemo ti od prijave do prve dostave.'}
                      </p>
                    </div>
                    
                    {/* Indikatori u vidu tačkica integrisani u desni ugao (samo ako je slider) */}
                    {siteSettings?.hero_right_mode === 'slider' && slides.length > 1 && (
                      <div className="flex gap-1 shrink-0 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/5 self-start sm:self-auto">
                        {slides.map((_: any, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentSlide(idx)}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer"
                            aria-label={`Slajd ${idx + 1}`}
                          >
                            <span className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-3' : 'bg-white/40 w-1.5'}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      )}

      {/* Sekcija: Šta je Deliverix? (Celina 2) */}
      {siteSettings?.about_enabled !== false && (
      <section className="bg-white border border-slate-100/90 p-8 sm:p-12 rounded-[2rem] space-y-8 shadow-xl relative overflow-hidden" id="section-sta-je-deliverix">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50/60 text-sky-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-sky-100/50">
            <Compass className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Saznajte ko smo mi i šta radimo</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Leva strana - Naslov i istaknuti uvod */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 tracking-tight leading-tight">
                {siteSettings?.about_title || 'Šta je Deliverix?'}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-bold">
                {siteSettings?.about_intro || 'Deliverix je nezavisna platforma za prijavu dostavljača u Srbiji koja povezuje kandidate sa proverenim partnerskim agencijama za rad na dostavnim platformama kao što su Wolt i Glovo.'}
              </p>
            </div>
            
            {/* Desna strana - Detaljniji opis i tagovi */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {siteSettings?.about_paragraph1 || 'Umesto da samostalno tražiš oglase, kontaktiraš više agencija i prolaziš kroz različite procedure, dovoljno je da ostaviš jednu prijavu. Na osnovu tvoje lokacije, raspoloživosti i željenog načina rada, pomažemo ti da pronađeš odgovarajuću saradnju.'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {siteSettings?.about_paragraph2 || 'Naša podrška je potpuno besplatna i vodi te kroz ceo proces — od prve prijave do aktivacije naloga i početka rada.'}
              </p>
              
              {/* Popularne pretrage u podnožju desne strane */}
              <div className="pt-4 border-t border-slate-100/50 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-2">Popularne pretrage:</span>
                {(siteSettings?.about_tags && siteSettings.about_tags.length > 0
                  ? siteSettings.about_tags
                  : [
                    "posao dostavljača",
                    "prijava za dostavljača",
                    "dostavljač Wolt",
                    "dostavljač Glovo",
                    "posao kurira",
                    "dostava hrane",
                    "dostavljač Srbija"
                  ]
                ).map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-sky-50/40 hover:bg-sky-50 text-sky-700 hover:text-sky-800 rounded-full text-xs font-semibold border border-sky-100/50 transition duration-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Sekcija: Kome je namenjen Deliverix? (Celina 3) */}
      <section className="space-y-8" id="section-kome-je-namenjen">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider border border-amber-100">
            <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Kome pomažemo u pronalasku posla</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 tracking-tight">Kome je namenjen Deliverix?</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Deliverix je namenjen svima koji žele da rade kao dostavljači ili traže fleksibilan posao sa mogućnošću dobre zarade. Pomažemo kandidatima različitih profila da brzo započnu sa radom:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Studentima",
              desc: "Tražiš džeparac ili stabilan prihod uz predavanja? Radi fleksibilno, vikendima ili samo nekoliko sati tokom radne nedelje.",
              icon: Sparkles
            },
            {
              title: "Zaposlenima za dodatni prihod",
              desc: "Imaš stalan posao ali želiš dodatnu zaradu u slobodno vreme? Sam biraš kada se uključuješ na platformu.",
              icon: Clock
            },
            {
              title: "Nezaposlenima i aktivnim tražiocima",
              desc: "Tražiš posao sa punim radnim vremenom i visokom zaradom? Dostava pruža stabilan i odmah dostupan izvor prihoda.",
              icon: ShieldCheck
            },
            {
              title: "Ljudima bez ikakvog iskustva",
              desc: "Nikada nisi radio dostavu? Ne brini, naš mentorski tim ti pruža potpuno besplatnu obuku i vodi te korak po korak.",
              icon: HeartHandshake
            },
            {
              title: "Vozačima automobila",
              desc: "Iskoristi svoj automobil za rad. Savršeno rešenje za sve vremenske prilike i veće dostavne distance.",
              icon: Car
            },
            {
              title: "Vozačima skutera i motora",
              desc: "Najbrži način kretanja kroz gradske gužve u Beogradu i Novom Sadu. Visoka efikasnost i veći broj dostava po satu.",
              icon: ScooterIcon
            },
            {
              title: "Biciklistima i e-bike vozačima",
              desc: "Najzdraviji i najjeftiniji način za obavljanje dostave. Pomažemo ti i oko povoljnog najma električnih bicikala.",
              icon: Bike
            },
            {
              title: "Svima koji žele potpunu slobodu",
              desc: "Nemaš fiksno radno vreme niti šefa. Ti diktiraš tempo rada, kada odmaraš i koliko zarađuješ.",
              icon: Compass
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-sky-300 transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center shrink-0 border border-sky-100/50">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {siteSettings?.why_choose_us_enabled !== false && (
        <section className="bg-gradient-to-tr from-sky-500 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-sky-500/10 space-y-6" id="zasto-nas-biraju">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-wider border border-white/10">
            <Bike className="w-4 h-4 shrink-0" />
            <span>100% Besplatno</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {siteSettings?.why_choose_us_title || "Zašto kandidati biraju nas?"}
          </h2>
          <p className="text-xs sm:text-base text-sky-50 leading-relaxed max-w-3xl mx-auto font-medium">
            {siteSettings?.why_choose_us_subtitle || "Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna za sve kandidate. Nemamo nikakve skrivene naknade, članarine niti uzimamo procenat od tvoje zarade."}
          </p>
        </div>

        <div className="border-t border-white/20 pt-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(siteSettings?.why_choose_us_items && siteSettings.why_choose_us_items.length > 0
              ? siteSettings.why_choose_us_items
              : [
                'Besplatna obuka i priprema za start',
                '0 RSD troškova za našu podršku',
                'Povezivanje sa najpouzdanijim partnerima',
                'Dostupni smo ti za sva pitanja – uvek besplatno'
              ]
            ).map((item: string, idx: number) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-5.5 h-5.5 bg-white text-sky-600 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white antialiased">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}



      {/* Kako funkcioniše proces */}
      {siteSettings?.steps_enabled !== false && (
        <section id="kako-funkcionise" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{siteSettings?.steps_title || "Kako funkcioniše proces?"}</h2>
            <p className="text-gray-700 text-sm sm:text-base font-semibold leading-relaxed">
              Prijava preko Deliverix platforme je jednostavna i traje svega nekoliko minuta. Naš cilj je da ti olakšamo početak rada tako što te povezujemo sa odgovarajućom partnerskom agencijom i pružamo podršku tokom cele procedure.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Od prijave do tvoje prve isplate deli te samo nekoliko jednostavnih koraka:
            </p>
          </div>

          <div className={`grid gap-8 ${
            steps.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
            steps.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 
            steps.length > 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100 relative space-y-4 hover:border-sky-300 transition-all duration-300 group">
                <span className="text-5xl font-black text-sky-200 group-hover:text-sky-300 transition-colors absolute top-4 right-6">{step.number || `0${idx + 1}`}</span>
                <h3 className="text-xl font-bold text-gray-900 pt-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Šta ti je potrebno */}
      {siteSettings?.requirements_enabled !== false && (
        <section id="sta-je-potrebno" className="bg-slate-50/30 rounded-[2rem] p-8 sm:p-12 border border-slate-100 space-y-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{siteSettings?.requirements_title || "Uslovi za Rad i Prijava za Deliverix Flotu"}</h2>
            <p className="text-gray-600 text-sm sm:text-base font-semibold">{siteSettings?.requirements_subtitle || "Uslovi su minimalni i dostupni svima koji žele pošteno da zarade"}</p>
          </div>

          <div className={`grid gap-8 ${
            requirements.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
            requirements.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 
            requirements.length > 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {requirements.map((req, idx) => {
              const ReqIcon = req.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 space-y-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center border border-sky-100/50">
                    <ReqIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{req.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sekcija: Nemaš Vozilo? Nema Problema! (Celina C - 3.2 i H3 2.2) */}
      {siteSettings?.rent_enabled === true && (
        <section id="renta-vozila" className="bg-sky-50/20 rounded-[2rem] p-8 sm:p-12 border border-sky-100/30 space-y-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/60 text-amber-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-amber-100/50">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Nemaš Vozilo? Nema Problema!</span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {siteSettings?.rent_section_title || "Nemate sopstveno vozilo? Obezbeđujemo povoljnu rentu!"}
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {siteSettings?.rent_section_text || "Nemaš sopstveni auto, skuter ili električni bicikl? Deliverix sarađuje sa vodećim agencijama za rentiranje vozila. Pomažemo ti da obezbediš pouzdano vozilo po povlašćenim cenama i odmah počneš sa radom."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onOpenApply}
                className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Iznajmi vozilo i počni <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {rentItems.filter(v => v.enabled).map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className={`bg-white p-4.5 rounded-2xl border flex items-start gap-4 shadow-sm hover:shadow-xl hover:border-sky-200 transition duration-300 ${
                  v.available ? 'border-slate-100' : 'border-slate-200 bg-gray-50/50 opacity-90'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    v.available ? 'bg-sky-50 text-sky-500 border-sky-100/50' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{v.title}</h3>
                        {v.badge && (
                          <span className="text-[9px] font-extrabold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-100 shrink-0">
                            {v.badge}
                          </span>
                        )}
                      </div>
                      
                      {/* Availability badge */}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border flex items-center gap-1 ${
                        v.available 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                          : 'bg-rose-50 text-rose-600 border-rose-100/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {v.available ? 'Dostupno' : 'Zauzeto'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Sekcija: Zašto se prijaviti preko Deliverix-a? (Jedinstveni benefiti platforme - optimizovano) */}
      {siteSettings?.target_audience_enabled !== false && (
        <section id="zasto-se-prijaviti" className="bg-white border border-slate-100/90 rounded-[2rem] p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50/60 text-sky-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-sky-100/50">
              <HeartHandshake className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Prednosti Deliverix Platforme</span>
            </div>
            
            <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 tracking-tight leading-tight">
              {siteSettings?.why_apply_title || "Zašto se prijaviti preko Deliverix-a?"}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold">
              {siteSettings?.why_apply_desc || "Za razliku od pojedinačnog prijavljivanja kod različitih agencija, Deliverix ti omogućava da na jednom mestu dobiješ sve potrebne informacije, besplatnu podršku i preporuku partnera koji najbolje odgovara tvojoj trenutnoj situaciji."}
            </p>
          </div>

          <div className={`grid gap-6 pt-2 ${
            whyApplyItems.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
            whyApplyItems.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            whyApplyItems.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            whyApplyItems.length % 3 === 0 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {whyApplyItems.map((item: any, idx: number) => (
              <div key={idx} className="p-5 bg-slate-50/30 border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/40">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-500 font-bold max-w-md">
              Svi naši servisi, saveti i spajanje sa partnerima su potpuno besplatni. Bez skrivenih provizija i troškova.
            </p>
            <button
              id="zasto-prijavi-se-btn"
              onClick={onOpenApply}
              className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Započni besplatnu prijavu <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Najnovije sa Bloga */}
      {siteSettings?.blog_enabled !== false && (
        <section id="najnovije-sa-bloga" className="space-y-10 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-2">
              <span className="text-xs font-black text-sky-500 uppercase tracking-widest block">Korisni saveti & novosti</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Najnovije sa našeg bloga</h2>
              <p className="text-sm text-gray-500 max-w-xl">
                Pročitaj stručne savete, vodiče i stvarna iskustva dostavljača kako bi maksimizovao svoju zaradu.
              </p>
            </div>
            <button
              id="view-all-blog-posts-teaser-btn"
              onClick={onNavigateToBlog}
              className="text-sm font-black text-sky-500 hover:text-sky-600 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Poseti naš blog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            ref={landingBlogRef}
            onScroll={handleLandingBlogScroll}
            className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {latestPosts.length === 0 ? (
              /* High-fidelity Skeleton loaders for CLS prevention */
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`blog-skeleton-${idx}`}
                  className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs flex flex-col shrink-0 w-[85%] sm:w-[60%] md:w-full animate-pulse"
                >
                  {/* Skeleton Image */}
                  <div className="h-48 bg-gray-200 relative"></div>
                  {/* Skeleton Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex gap-1.5">
                        <div className="w-12 h-4 bg-gray-200 rounded-md"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="w-3/4 h-5 bg-gray-250 rounded-md"></div>
                      <div className="w-1/2 h-5 bg-gray-250 rounded-md"></div>
                      <div className="space-y-2 pt-1">
                        <div className="w-full h-3 bg-gray-200 rounded-md"></div>
                        <div className="w-full h-3 bg-gray-200 rounded-md"></div>
                        <div className="w-5/6 h-3 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div className="w-16 h-3 bg-gray-250 rounded-md"></div>
                      <div className="w-20 h-3 bg-sky-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              latestPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={onNavigateToBlog}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200/80 transition duration-300 flex flex-col cursor-pointer group snap-start shrink-0 w-[85%] sm:w-[60%] md:w-full"
                >
                  {/* Slika */}
                  <div className="h-48 overflow-hidden bg-gray-100 relative shrink-0">
                    <SafeBlogImage
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-600 shadow-xs uppercase tracking-wider">
                      {post.read_time} čitanja
                    </div>
                  </div>

                  {/* Sadržaj kartice */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Tagovi */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[10px] font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {/* Naslov */}
                      <h3 className="font-extrabold text-gray-900 group-hover:text-sky-500 transition line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      {/* Kratak opis */}
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500 font-bold">
                      <span>{post.author}</span>
                      <span className="text-sky-500 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 font-extrabold">
                        Pročitaj više <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobilni indikatori i kontrole */}
          {latestPosts.length > 1 && (
            <div className="flex md:hidden flex-col items-center gap-4 pt-2">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {latestPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollLandingBlogTo(idx)}
                    className="w-8 h-8 flex items-center justify-center cursor-pointer"
                    aria-label={`Prikaži članak ${idx + 1}`}
                  >
                    <span className={`h-2 rounded-full transition-all duration-300 ${landingBlogIndex === idx ? 'w-6 bg-sky-500' : 'w-2 bg-gray-200 hover:bg-gray-300'}`} />
                  </button>
                ))}
              </div>
              
              {/* Navigacija */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollLandingBlogTo(Math.max(0, landingBlogIndex - 1))}
                  disabled={landingBlogIndex === 0}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-150 rounded-full shadow-xs active:scale-95 text-gray-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  aria-label="Prethodni članak"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollLandingBlogTo(Math.min(latestPosts.length - 1, landingBlogIndex + 1))}
                  disabled={landingBlogIndex === latestPosts.length - 1}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-150 rounded-full shadow-xs active:scale-95 text-gray-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  aria-label="Sledeći članak"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Informativna Sekcija: Zašto kandidati biraju posao dostavljača? */}
      <section className="bg-white border border-slate-100/90 rounded-[2rem] p-8 sm:p-12 space-y-8 shadow-xl" id="vodic-zasto-posao-dostavljaca">
        <div className="w-full space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50/60 text-sky-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-sky-100/50">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Karijerni vodič i saveti</span>
          </div>
          
          <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 tracking-tight leading-tight">
            Zašto kandidati biraju posao dostavljača u Srbiji?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
            <div className="space-y-4">
              <p>
                Tržište dostave hrane i pošiljaka u Srbiji doživljava ogroman rast u poslednjih nekoliko godina. Sve veći broj ljudi traži <span className="font-extrabold text-slate-800">fleksibilan posao</span> koji im omogućava da sami diktiraju svoje radno vreme, usklađuju privatne obaveze i ostvaruju natprosečne prihode. Upravo zbog toga, <span className="font-extrabold text-slate-800">posao dostavljača</span> postao je jedan od najtraženijih i najpopularnijih poslova na našim prostorima.
              </p>
              <p>
                Bilo da vas zanima rad kao <span className="font-extrabold text-slate-800">dostavljač Wolt</span> platforme ili želite da postanete <span className="font-extrabold text-slate-800">dostavljač Glovo</span> flote, Deliverix platforma je tu da vam maksimalno pojednostavi i ubrza ceo proces zapošljavanja. Naš cilj je da eliminišemo administrativne prepreke i povežemo vas sa partnerima koji nude najbolje finansijske uslove, najniže provizije i redovne dvonedeljne isplate na račun.
              </p>
              <p>
                Jedna od najvećih prednosti jeste sloboda izbora prevoznog sredstva. Ukoliko preferirate dinamičnu vožnju kroz grad bez troškova goriva, <span className="font-semibold text-slate-800">posao sa biciklom</span> ili električnim biciklom predstavlja izuzetan izbor. Sa druge strane, radnici koji žele maksimalan komfor tokom cele godine i rad bez obzira na kišu, sneg ili visoke temperature biraju <span className="font-semibold text-slate-800">posao sa automobilom</span>.
              </p>
            </div>
            
            <div className="space-y-4">
              <p>
                Takođe, <span className="font-semibold text-slate-800">posao kurira</span> je izuzetno popularan kao <span className="font-semibold text-slate-800">posao za studente</span> koji traže način da zarade džeparac tokom raspusta ili vikendima. Fleksibilna priroda aplikacije omogućava vam da radite tačno onoliko koliko želite – bez fiksnog radnog vremena, pritiska nadređenih ili obaveznih smena. Vi ste sami svoj šef.
              </p>
              <p>
                Pored studenata, mnogi zaposleni koriste dostavu kao izvor za <span className="font-semibold text-slate-800">dodatnu zaradu</span> nakon redovnih radnih sati na primarnom poslu. Samo 2-3 sata dnevno može vam doneti značajnu dopunu kućnog budžeta. Isplate se vrše redovno, a transparentan sistem unutar aplikacije omogućava vam da u svakom trenutku pratite svoju zaradu, ostvarene bonuse i bakšiš koji vam korisnici ostavljaju.
              </p>
              <p>
                Deliverix Srbija ne naplaćuje apsolutno ništa kandidatima. Naša misija je da pružimo besplatnu podršku, stručne savete i pomognemo vam da odaberete najbolju opciju za vaš profil. Od prve prijave na sajtu, preko prikupljanja dokumentacije, pa sve do preuzimanja opreme i prve uspešne dostave – naš mentorski tim je tu da vam pruži sigurnost i odgovori na sve nedoumice.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-gray-900">Maksimalna Fleksibilnost</h3>
              <p className="text-xs text-gray-500">Sami birate kada radite, koliko dugo ostajete na terenu i kada pravite pauzu.</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-gray-900">Odlična i Brza Zarada</h3>
              <p className="text-xs text-gray-500">Mogućnost ostvarivanja zarade i preko 150.000 RSD mesečno uz redovne isplate na svakih 15 dana.</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-gray-900">Puna Podrška Mentora</h3>
              <p className="text-xs text-gray-500">Deliverix platforma vam pruža besplatnu obuku i savetovanje kako biste odmah krenuli uspešno.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Česta Pitanja (FAQ) */}
      {siteSettings?.faq_enabled !== false && (
        <section id="faq" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Česta Pitanja (FAQ)</h2>
            <p className="text-gray-600">Sve što te interesuje na jednom mestu, jasno i transparentno</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3" id="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden transition-colors"
                  id={`faq-item-${idx}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left font-bold text-gray-900 flex justify-between items-center hover:bg-gray-50/50 cursor-pointer transition text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Kontakt / Poziv na akciju */}
      {siteSettings?.footer_cta_enabled !== false && (
        <section id="kontakt" className="bg-sky-500 rounded-3xl text-white p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
          {/* Dekorativni krugovi */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mb-20 pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {siteSettings?.footer_cta_title || "Započni svoju dostavljačku karijeru danas"}
            </h2>
            <p className="text-sky-200 text-sm sm:text-base">
              {siteSettings?.footer_cta_desc || "Nemoj odlagati priliku za odličnu zaradu i potpunu slobodu. Registracija te ništa ne košta i ne obavezuje te ni na šta. Pomažemo ti oko celog procesa besplatno."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              id="cta-footer-apply-btn"
              onClick={onOpenApply}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-sky-600 font-black rounded-2xl shadow-lg shadow-sky-950/20 transition cursor-pointer flex items-center gap-2"
            >
              Započni prijavu odmah (Traje 1 min) <ArrowRight className="w-5 h-5" />
            </button>
            
            <a
              href={`tel:${(siteSettings?.support_phone || "+381 60 123 4567").replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs sm:text-sm font-semibold backdrop-blur-xs transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-sky-200" />
              <span>Podrška: {siteSettings?.support_phone || "+381 60 123 4567"}</span>
            </a>
          </div>

          <p className="text-[11px] text-sky-200/90">
            {siteSettings?.footer_disclaimer || "Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne."}
          </p>
        </section>
      )}

    </div>
  );
}
