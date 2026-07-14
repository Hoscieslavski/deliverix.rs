/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Users, 
  Lock, 
  Menu, 
  X, 
  Check, 
  Plus, 
  Phone, 
  HelpCircle,
  MessageSquare,
  Compass,
  Image,
  Upload
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import { Cookie } from 'lucide-react';

// Lazy loaded views for maximum startup performance (LCP)
const ApplicationForm = lazy(() => import('./components/ApplicationForm'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CandidatePortal = lazy(() => import('./components/CandidatePortal'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const PrivacyPolicy = lazy(() => import('./components/privacy-policy'));
const TermsOfService = lazy(() => import('./components/terms-of-service'));

import { DeliverixLogo } from './components/DeliverixLogo';
import { DEFAULT_SITE_SETTINGS } from './constants';

let seoCache: any = null;

export async function getSeoSettings() {
  if (seoCache) {
    return seoCache;
  }
  try {
    const res = await fetch('/api/marketing/seo-public');
    seoCache = await res.json();
    return seoCache;
  } catch (err) {
    console.error('Greška pri dohvatanju javnog SEO:', err);
    return { success: false };
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'candidate' | 'blog' | 'privacy' | 'terms'>(() => {
    const saved = localStorage.getItem('current_view');
    if (saved === 'admin' || saved === 'candidate' || saved === 'blog' || saved === 'landing' || saved === 'privacy' || saved === 'terms') {
      return saved as any;
    }
    return 'landing';
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(DEFAULT_SITE_SETTINGS);
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'rejected' | null>(() => {
    const saved = localStorage.getItem('deliverix_cookie_consent');
    if (saved === 'accepted' || saved === 'rejected') {
      return saved as any;
    }
    return null;
  });

  const handleAcceptCookies = () => {
    setCookieConsent('accepted');
    localStorage.setItem('deliverix_cookie_consent', 'accepted');
  };

  const handleRejectCookies = () => {
    setCookieConsent('rejected');
    localStorage.setItem('deliverix_cookie_consent', 'rejected');
  };

  const [logoStyle, setLogoStyle] = useState<'flow' | 'neon' | 'urban' | 'custom'>(() => {
    return (localStorage.getItem('deliverix_logo_style') as any) || 'flow';
  });

  const [customLogoUrl, setCustomLogoUrl] = useState<string>(() => {
    return localStorage.getItem('deliverix_custom_logo') || '';
  });

  const [logoBlendMode, setLogoBlendMode] = useState<'normal' | 'multiply'>(() => {
    return (localStorage.getItem('deliverix_logo_blend_mode') as any) || 'normal';
  });

  const [footerLogoStyle, setFooterLogoStyle] = useState<'flow' | 'neon' | 'urban' | 'custom'>(() => {
    return (localStorage.getItem('deliverix_footer_logo_style') as any) || 'flow';
  });

  const [footerCustomLogoUrl, setFooterCustomLogoUrl] = useState<string>(() => {
    return localStorage.getItem('deliverix_footer_custom_logo') || '';
  });

  const [footerLogoBlendMode, setFooterLogoBlendMode] = useState<'normal' | 'multiply'>(() => {
    return (localStorage.getItem('deliverix_footer_logo_blend_mode') as any) || 'normal';
  });

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Učitavanje logotipa i SEO podešavanja sa servera u pozadini (asinhrono i neblokirajuće)
  useEffect(() => {
    getSeoSettings()
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings((prev: any) => ({ ...prev, ...data.settings }));
          if (data.settings.logo_style) {
            setLogoStyle(data.settings.logo_style);
          }
          if (data.settings.logo_url !== undefined) {
            setCustomLogoUrl(data.settings.logo_url);
          }
          if (data.settings.logo_blend_mode) {
            setLogoBlendMode(data.settings.logo_blend_mode);
          }
          if (data.settings.footer_logo_style) {
            setFooterLogoStyle(data.settings.footer_logo_style);
          }
          if (data.settings.footer_logo_url !== undefined) {
            setFooterCustomLogoUrl(data.settings.footer_logo_url);
          }
          if (data.settings.footer_logo_blend_mode) {
            setFooterLogoBlendMode(data.settings.footer_logo_blend_mode);
          }

          // Dinamičko učitavanje Google Analytics-a / Google Tag Manager-a na osnovu konfigurisanog ID-ja (Odloženo - Faza 5)
          const gaId = data.settings.ga_measurement_id;
          if (gaId && gaId !== 'G-XXXXXXXXXX') {
            const loadAnalytics = () => {
              if ((window as any).__dynamic_analytics_loaded) return;
              (window as any).__dynamic_analytics_loaded = true;

              window.removeEventListener('scroll', loadAnalytics);
              window.removeEventListener('click', loadAnalytics);
              window.removeEventListener('touchstart', loadAnalytics);
              window.removeEventListener('mousemove', loadAnalytics);
              window.removeEventListener('keydown', loadAnalytics);
              clearTimeout(analyticsTimeout);

              if (gaId.startsWith('G-')) {
                // Standardni Google Analytics (gtag.js)
                if (!document.getElementById('google-analytics-script')) {
                  const script1 = document.createElement('script');
                  script1.id = 'google-analytics-script';
                  script1.async = true;
                  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                  document.head.appendChild(script1);

                  const script2 = document.createElement('script');
                  script2.id = 'google-analytics-init';
                  script2.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                  `;
                  document.head.appendChild(script2);
                }
              } else if (gaId.startsWith('GTM-')) {
                // Google Tag Manager (gtm.js)
                if (!document.getElementById('google-gtm-script')) {
                  const script1 = document.createElement('script');
                  script1.id = 'google-gtm-script';
                  script1.innerHTML = `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${gaId}');
                  `;
                  document.head.appendChild(script1);

                  // NoScript iFrame za GTM u body
                  if (!document.getElementById('google-gtm-noscript')) {
                    const noscript = document.createElement('noscript');
                    noscript.id = 'google-gtm-noscript';
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gaId}`;
                    iframe.height = '0';
                    iframe.width = '0';
                    iframe.style.display = 'none';
                    iframe.style.visibility = 'hidden';
                    noscript.appendChild(iframe);
                    document.body.insertBefore(noscript, document.body.firstChild);
                  }
                }
              }
            };

            const analyticsTimeout = setTimeout(loadAnalytics, 5000);
            window.addEventListener('scroll', loadAnalytics, { passive: true });
            window.addEventListener('click', loadAnalytics, { passive: true });
            window.addEventListener('touchstart', loadAnalytics, { passive: true });
            window.addEventListener('mousemove', loadAnalytics, { passive: true });
            window.addEventListener('keydown', loadAnalytics, { passive: true });
          }
        }
      })
      .catch(err => console.error('Greška pri učitavanju globalnih podešavanja logotipa/SEO:', err));

    // Učitavanje kompletnih podešavanja sajta u pozadini (asinhrono i neblokirajuće)
    const loadFullSettings = () => {
      fetch('/api/marketing/seo')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            setSiteSettings((prev: any) => ({ ...prev, ...data.settings }));
            if (data.settings.logo_style) {
              setLogoStyle(data.settings.logo_style);
            }
            if (data.settings.logo_url !== undefined) {
              setCustomLogoUrl(data.settings.logo_url);
            }
            if (data.settings.logo_blend_mode) {
              setLogoBlendMode(data.settings.logo_blend_mode);
            }
            if (data.settings.footer_logo_style) {
              setFooterLogoStyle(data.settings.footer_logo_style);
            }
            if (data.settings.footer_logo_url !== undefined) {
              setFooterCustomLogoUrl(data.settings.footer_logo_url);
            }
            if (data.settings.footer_logo_blend_mode) {
              setFooterLogoBlendMode(data.settings.footer_logo_blend_mode);
            }
          }
        })
        .catch(err => console.error('Greška pri asinhronom učitavanju kompletnih podešavanja:', err));
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setTimeout(loadFullSettings, 100);
      });
    } else {
      setTimeout(loadFullSettings, 300);
    }
  }, []);

  // Sačuvaj trenutni prikaz u localStorage na promenu
  useEffect(() => {
    localStorage.setItem('current_view', currentView);
  }, [currentView]);

  // Dinamičko ažuriranje favikona (favicon) u zavisnosti od izabranog logotipa
  useEffect(() => {
    let faviconUrl = '/logo.png';

    // Koristimo prilagođeni logo za favikon samo ako je u pitanju ispravan base64 data URL koji preživljava restarte
    if (logoStyle === 'custom' && customLogoUrl && customLogoUrl.startsWith('data:')) {
      faviconUrl = customLogoUrl;
    } else {
      faviconUrl = '/logo.png';
    }

    const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = faviconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = 'image/png';
      newLink.href = faviconUrl;
      document.head.appendChild(newLink);
    }
  }, [logoStyle, customLogoUrl]);

  const handleLogoStyleChange = (style: 'flow' | 'neon' | 'urban' | 'custom') => {
    setLogoStyle(style);
    localStorage.setItem('deliverix_logo_style', style);
  };
  
  // Parametri za praćenje
  const [source, setSource] = useState('direct');
  const [referralCode, setReferralCode] = useState('');
  const [appUrl, setAppUrl] = useState('');

  // State za dinamičko zaglavlje (header) tokom skrolovanja
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Praćenje skrolovanja
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ako smo blizu vrha, uvek prikaži zaglavlje
      if (currentScrollY < 80) {
        setShowHeader(true);
      } else {
        // Ako skrolujemo nadole, sakrij zaglavlje
        if (currentScrollY > lastScrollY) {
          setShowHeader(false);
        } else {
          // Ako skrolujemo nagore, prikaži ga
          setShowHeader(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Sakupljanje UTM / Referral parametara
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get('source') || params.get('utm_source') || '';
    const urlRef = params.get('ref') || params.get('referral') || '';

    if (urlSource) {
      setSource(urlSource);
      localStorage.setItem('candidate_source', urlSource);
    } else {
      const savedSource = localStorage.getItem('candidate_source');
      if (savedSource) setSource(savedSource);
    }

    if (urlRef) {
      setReferralCode(urlRef);
      localStorage.setItem('candidate_referral', urlRef);
    } else {
      const savedRef = localStorage.getItem('candidate_referral');
      if (savedRef) setReferralCode(savedRef);
    }

    // Dobijanje APP_URL ako je potrebno
    setAppUrl(window.location.origin);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white" id="global-loading">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
          Učitavanje...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/20 text-gray-900 font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden" id="main-application-root">
      
      {/* Gornji Navigacioni Bar - Dinamičko sakrivanje sa transition */}
      <header className={`sticky top-0 z-40 bg-white border-b border-gray-100 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`} id="main-header">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Brending */}
          <button 
            id="logo-home-btn"
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-2 sm:gap-3 text-left cursor-pointer group shrink-0 focus:outline-none focus-visible:outline-none"
          >
            <DeliverixLogo style={logoStyle} customLogoUrl={customLogoUrl} logoBlendMode={logoBlendMode} className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform" />
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-wider text-sky-600 block leading-none font-sans uppercase">
                DELIVERIX
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-extrabold block uppercase tracking-[0.15em] mt-0.5 sm:mt-1">
                POSTANI DOSTAVLJAČ
              </span>
            </div>
          </button>

          {/* Navigacija i Akcije */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-6">
              <button
                id="nav-what-is-btn"
                onClick={() => {
                  setCurrentView('landing');
                  setTimeout(() => {
                    document.getElementById('section-sta-je-deliverix')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors relative group py-2 cursor-pointer"
              >
                Šta je Deliverix?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
              </button>
              
              <button
                id="nav-kome-btn"
                onClick={() => {
                  setCurrentView('landing');
                  setTimeout(() => {
                    document.getElementById('section-kome-je-namenjen')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors relative group py-2 cursor-pointer"
              >
                Kome je namenjen?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
              </button>

              {siteSettings?.steps_enabled !== false && (
                <button
                  id="nav-how-it-works-btn"
                  onClick={() => {
                    setCurrentView('landing');
                    setTimeout(() => {
                      document.getElementById('kako-funkcionise')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors relative group py-2 cursor-pointer"
                >
                  Kako funkcioniše
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                </button>
              )}

              <button
                id="nav-zasto-btn"
                onClick={() => {
                  setCurrentView('landing');
                  setTimeout(() => {
                    document.getElementById('zasto-se-prijaviti')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors relative group py-2 cursor-pointer"
              >
                Zašto mi?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
              </button>

              {siteSettings?.faq_enabled !== false && (
                <button
                  id="nav-faq-btn"
                  onClick={() => {
                    setCurrentView('landing');
                    setTimeout(() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors relative group py-2 cursor-pointer"
                >
                  FAQ
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
                </button>
              )}

              {siteSettings?.blog_enabled !== false && (
                <button
                  id="nav-blog-btn"
                  onClick={() => setCurrentView('blog')}
                  className={`text-sm font-semibold transition-colors relative group py-2 cursor-pointer ${currentView === 'blog' ? 'text-sky-500 font-black' : 'text-gray-600 hover:text-sky-500'}`}
                >
                  Blog
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-sky-500 transition-all ${currentView === 'blog' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              )}
            </div>

            {(currentView === 'landing' || currentView === 'blog') ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  id="header-apply-btn"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-[11px] sm:text-sm font-black rounded-xl shadow-md sm:shadow-lg shadow-sky-500/15 active:translate-y-0.5 transition cursor-pointer whitespace-nowrap text-center shrink-0"
                >
                  Prijavi se
                </button>
                <button
                  id="header-portal-btn"
                  onClick={() => setCurrentView('candidate')}
                  className="hidden sm:flex px-3 sm:px-4 py-2 sm:py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-600 text-[11px] sm:text-sm font-black rounded-xl transition cursor-pointer items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Prati prijavu
                </button>

                {/* Mobilni hamburger taster */}
                <button
                  id="mobile-menu-toggle-btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex lg:hidden p-2 text-gray-500 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition shrink-0 cursor-pointer"
                  aria-label="Meni"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <button
                id="header-back-btn"
                onClick={() => setCurrentView('landing')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition cursor-pointer"
              >
                Nazad na sajt
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobilni Meni Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <DeliverixLogo style={logoStyle} customLogoUrl={customLogoUrl} logoBlendMode={logoBlendMode} className="w-8 h-8" />
                    <div>
                      <span className="text-md font-black tracking-wider text-sky-600 block leading-none font-sans uppercase">
                        DELIVERIX
                      </span>
                      <span className="text-[10px] text-gray-500 font-extrabold block uppercase tracking-[0.1em] mt-0.5">
                        PODRŠKA ZA DOSTAVLJAČE
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 mb-2">Navigacija</p>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setCurrentView('landing');
                      setTimeout(() => {
                        document.getElementById('section-sta-je-deliverix')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:text-sky-500 hover:bg-sky-50 transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Šta je Deliverix?</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setCurrentView('landing');
                      setTimeout(() => {
                        document.getElementById('section-kome-je-namenjen')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:text-sky-500 hover:bg-sky-50 transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Kome je namenjen?</span>
                  </button>

                  {siteSettings?.steps_enabled !== false && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setCurrentView('landing');
                        setTimeout(() => {
                          document.getElementById('kako-funkcionise')?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:text-sky-500 hover:bg-sky-50 transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>Kako funkcioniše</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setCurrentView('landing');
                      setTimeout(() => {
                        document.getElementById('zasto-se-prijaviti')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:text-sky-500 hover:bg-sky-50 transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Zašto mi?</span>
                  </button>

                  {siteSettings?.faq_enabled !== false && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setCurrentView('landing');
                        setTimeout(() => {
                          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:text-sky-500 hover:bg-sky-50 transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>Česta pitanja (FAQ)</span>
                    </button>
                  )}

                  {siteSettings?.blog_enabled !== false && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setCurrentView('blog');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2.5 cursor-pointer ${currentView === 'blog' ? 'bg-sky-50 text-sky-600 font-extrabold' : 'text-gray-700 hover:text-sky-500 hover:bg-sky-50'}`}
                    >
                      <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>Blog vesti</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Akcije na dnu mobilnog menija */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-black rounded-xl shadow-lg shadow-sky-500/25 transition text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Prijavi se odmah</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentView('candidate');
                  }}
                  className="w-full py-3.5 bg-sky-50 hover:bg-sky-100 text-sky-600 text-sm font-black rounded-xl transition text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Prati svoju prijavu</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glavni Sadržaj */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" id="main-content-layout">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] py-16" id="lazy-view-loading">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Učitavanje stranice...</p>
          </div>
        }>
          <AnimatePresence mode="wait">
            {currentView === 'landing' ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <LandingPage 
                  siteSettings={siteSettings}
                  onOpenApply={() => setIsApplyModalOpen(true)} 
                  onNavigateToBlog={() => setCurrentView('blog')}
                />
              </motion.div>
            ) : currentView === 'blog' ? (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <BlogPage onBackToLanding={() => setCurrentView('landing')} />
              </motion.div>
            ) : currentView === 'admin' ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <AdminDashboard 
                  appUrl={appUrl} 
                  onLogout={() => setCurrentView('landing')}
                  onLogoChange={(style, url, blendMode) => {
                    setLogoStyle(style);
                    setCustomLogoUrl(url);
                    if (blendMode) {
                      setLogoBlendMode(blendMode);
                    }
                  }}
                  onFooterLogoChange={(style, url, blendMode) => {
                    setFooterLogoStyle(style);
                    setFooterCustomLogoUrl(url);
                    if (blendMode) {
                      setFooterLogoBlendMode(blendMode);
                    }
                  }}
                />
              </motion.div>
            ) : currentView === 'privacy' ? (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <PrivacyPolicy onBack={() => setCurrentView('landing')} />
              </motion.div>
            ) : currentView === 'terms' ? (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <TermsOfService onBack={() => setCurrentView('landing')} />
              </motion.div>
            ) : (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CandidatePortal onBack={() => setCurrentView('landing')} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Modal sa Formom za Prijavu */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-4 z-50" id="application-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-8 border border-gray-100 relative mt-12 mb-12 sm:my-16"
            >
              {/* Zatvori dugme */}
              <button
                id="btn-close-apply-modal"
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
                  <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Učitavanje forme...</p>
                </div>
              }>
                <ApplicationForm 
                  onSuccess={() => {
                    // Sačekamo kratko i zatvorimo modal
                    setTimeout(() => setIsApplyModalOpen(false), 2500);
                  }} 
                  onClose={() => setIsApplyModalOpen(false)}
                  referralCode={referralCode}
                  source={source}
                />
              </Suspense>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Podnožje */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-16" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 pb-2">
            {/* Leva strana: Naziv i opis */}
            <div className="text-center md:text-left space-y-3">
              <div className="space-y-1">
                <p className="font-extrabold text-gray-900">Deliverix Srbija</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto md:mx-0">Besplatne konsultacije i posredovanje pri zapošljavanju dostavljača.</p>
              </div>
              
              {/* Opcije za deljenje */}
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Podeli sa prijateljima:</span>
                <div className="flex items-center gap-1.5">
                  <a 
                    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdeliverix.rs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200 flex items-center justify-center"
                    title="Podeli na Facebook-u"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                  <a 
                    href="viber://forward?text=%C5%BDeli%C5%A1%20posao%20sa%20fleksibilnim%20radnim%20vremenom%20i%20zaradom%20do%20150.000%20RSD%3F%20Prijavi%20se%20preko%20Deliverix-a%3A%20https%3A%2F%2Fdeliverix.rs" 
                    className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition duration-200 flex items-center justify-center"
                    title="Podeli na Viber-u"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <circle cx="9" cy="10" r="1" fill="currentColor" />
                      <circle cx="13" cy="10" r="1" fill="currentColor" />
                      <circle cx="17" cy="10" r="1" fill="currentColor" />
                    </svg>
                  </a>
                  <a 
                    href="https://api.whatsapp.com/send?text=%C5%BDeli%C5%A1%20posao%20sa%20fleksibilnim%20radnim%20vremenom%20i%20zaradom%20do%20150.000%20RSD%3F%20Prijavi%20se%20preko%20Deliverix-a%3A%20https%3A%2F%2Fdeliverix.rs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition duration-200 flex items-center justify-center"
                    title="Podeli na WhatsApp-u"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Sredina: Istaknuti logo u srazmernim dimenzijama */}
            <div className="flex justify-center shrink-0">
              <DeliverixLogo style={footerLogoStyle} customLogoUrl={footerCustomLogoUrl} logoBlendMode={footerLogoBlendMode} className="w-32 h-32 md:w-36 md:h-36" />
            </div>
            
            {/* Desna strana: Navigacioni linkovi */}
            <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-xs font-bold text-gray-500">
              <button onClick={() => {
                document.getElementById('kako-funkcionise')?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-sky-500 cursor-pointer">Kako radi</button>
              <button onClick={() => {
                document.getElementById('sta-je-potrebno')?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-sky-500 cursor-pointer">Uslovi</button>
              <button onClick={() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-sky-500 cursor-pointer">FAQ</button>
              {currentView === 'landing' ? (
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                  <button 
                    id="footer-portal-link"
                    onClick={() => setCurrentView('candidate')} 
                    className="hover:text-sky-500 cursor-pointer text-sky-600 flex items-center gap-1 font-black"
                  >
                    <Lock className="w-3.5 h-3.5" /> Kandidat Portal
                  </button>
                  <button 
                    id="footer-admin-link"
                    onClick={() => setCurrentView('admin')} 
                    className="hover:text-sky-500 cursor-pointer text-gray-500 flex items-center gap-1 font-bold"
                  >
                    <Lock className="w-3.5 h-3.5" /> Admin Panel
                  </button>
                </div>
              ) : (
                <button 
                  id="footer-back-link"
                  onClick={() => setCurrentView('landing')} 
                  className="hover:text-sky-500 cursor-pointer flex items-center gap-1 font-black"
                >
                  Nazad na sajt
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} Deliverix.rs. Sva prava zadržana.</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <button 
                onClick={() => {
                  setCurrentView('terms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-sky-500 font-semibold cursor-pointer transition"
              >
                Uslovi korišćenja
              </button>
              <span className="hidden sm:inline text-gray-300">•</span>
              <button 
                onClick={() => {
                  setCurrentView('privacy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-sky-500 font-semibold cursor-pointer transition"
              >
                Politika privatnosti
              </button>
            </div>
            <p className="text-[10px] text-gray-500 max-w-md text-center sm:text-right">
              Izjava o odgovornosti: Mi nismo zvanični predstavnici niti deo kompanija Wolt, Glovo ili drugih dostavnih platformi. Mi smo nezavisni informativni portal koji pomaže kandidatima da se lakše povežu sa registrovanim partnerskim agencijama za dostavu u Republici Srbiji.
            </p>
          </div>
        </div>
      </footer>

      {/* GDPR Cookie Consent Banner */}
      <AnimatePresence>
        {cookieConsent === null && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 flex flex-col gap-3"
            id="cookie-consent-banner"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-500 rounded-xl mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">Kolačići i privatnost</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Naš sajt koristi kolačiće (cookies) za poboljšanje iskustva i analitiku poseta (Google Analytics). Možete prihvatiti sve ili nastaviti bez njih. Pročitajte našu <button onClick={() => { setCurrentView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sky-500 hover:underline font-semibold cursor-pointer">Politiku privatnosti</button>.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end text-xs font-bold mt-2">
              <button
                onClick={handleRejectCookies}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Odbij
              </button>
              <button
                onClick={handleAcceptCookies}
                className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
                aria-label="Prihvati kolačiće"
              >
                Prihvati sve
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
