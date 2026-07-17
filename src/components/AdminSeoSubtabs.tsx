import React from 'react';
import { 
  Globe, Sparkles, Compass, HelpCircle, 
  Plus, Trash2, Upload, Loader2, Check, Bike, Car, Smartphone, FileText, Clock, MapPin, ShieldCheck, HeartHandshake, Phone,
  ArrowUp, ArrowDown
} from 'lucide-react';
import ScooterIcon from './ScooterIcon';
import { DeliverixLogo } from './DeliverixLogo';

interface SeoTabFormProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  isUploadingLogo: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SeoTabForm({
  siteSettings,
  setSiteSettings,
  onSave,
  isUploadingLogo,
  handleLogoUpload
}: SeoTabFormProps) {
  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm w-full" id="seo-tab-form-root">
      <form onSubmit={onSave} className="space-y-6">
        <div className="space-y-1 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-black text-gray-900">Uređivanje sajta & SEO podešavanja</h3>
          <p className="text-xs text-gray-400">Kontrolišite meta oznake za pretraživače, obaveštenja na vrhu sajta i podnaslove u realnom vremenu.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Meta Naslov sajta (SEO Title)</label>
            <input
              type="text"
              required
              placeholder="npr. Deliverix | Postani Wolt Dostavljač u Srbiji"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
              value={siteSettings.meta_title || ''}
              onChange={e => setSiteSettings({ ...siteSettings, meta_title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Meta Opis sajta (SEO Description)</label>
            <textarea
              rows={3}
              required
              placeholder="npr. Prijavi se za rad kao dostavljač i ostvari odličnu zaradu uz 100% fleksibilno vreme..."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              value={siteSettings.meta_description || ''}
              onChange={e => setSiteSettings({ ...siteSettings, meta_description: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Google Analytics ili Google Tag Manager ID</label>
            <input
              type="text"
              placeholder="npr. G-XXXXXXXXXX ili GTM-XXXXXXX"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              value={siteSettings.ga_measurement_id || ''}
              onChange={e => setSiteSettings({ ...siteSettings, ga_measurement_id: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              Važno Obaveštenje na vrhu sajta <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-black">OPCIONO</span>
            </label>
            <input
              type="text"
              placeholder="npr. HITNO: Otvorene prijave za dostavljače sa sopstvenim motorom u Beogradu!"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              value={siteSettings.announcement_banner || ''}
              onChange={e => setSiteSettings({ ...siteSettings, announcement_banner: e.target.value })}
            />
            <p className="text-[10px] text-gray-400">Ostavite prazno ukoliko ne želite da se obaveštenje prikazuje na vrhu sajta.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Broj telefona za podršku (Support Phone)</label>
            <input
              type="text"
              required
              placeholder="npr. +381 60 123 4567"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
              value={siteSettings.support_phone || ''}
              onChange={e => setSiteSettings({ ...siteSettings, support_phone: e.target.value })}
            />
          </div>
        </div>

        {/* Podešavanje Izgleda Logotipa */}
        <div className="pt-5 border-t border-gray-100 space-y-6">
          <h4 className="text-xs font-extrabold text-sky-600 uppercase tracking-wider font-sans">Izgled Logotipa i Brending</h4>
          
          {/* HEADER LOGO */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Logotip sajta (Branding)</h5>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Pregled</span>
                <div 
                  className="w-16 h-16 rounded-xl shadow-xs border border-gray-150 flex items-center justify-center p-2.5 overflow-hidden bg-white"
                >
                  <DeliverixLogo 
                    style="custom" 
                    customLogoUrl={siteSettings.logo_url || "/assets/images/logo_custom.png"} 
                    logoBlendMode={(siteSettings.logo_blend_mode as any) || 'normal'}
                    className="w-12 h-12" 
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase font-sans">Otpremite Vaš Logotip</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 transition group">
                      <div className="flex items-center gap-2">
                        {isUploadingLogo ? (
                          <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition" />
                        )}
                        <span className="text-xs font-bold text-gray-600 group-hover:text-sky-600 transition">
                          {isUploadingLogo ? 'Otpremanje...' : 'Izaberite sliku logotipa'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={isUploadingLogo}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase font-sans">Putanja fajla</label>
                  <input
                    type="text"
                    disabled
                    value="/assets/images/logo_custom.png"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-400 font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
          >
            Sačuvaj opšta podešavanja
          </button>
        </div>
      </form>
    </div>
  );
}

interface HeroTabFormProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  isUploadingHeroImage: boolean;
  isUploadingHeroSlide: boolean;
  handleHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeroSlideUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveHeroSlide: (idx: number) => void;
  handleUpdateSlideText: (idx: number, field: 'badge_title' | 'badge_text' | 'seo_alt', value: string) => void;
}

export function HeroTabForm({
  siteSettings,
  setSiteSettings,
  onSave,
  isUploadingHeroImage,
  isUploadingHeroSlide,
  handleHeroImageUpload,
  handleHeroSlideUpload,
  handleRemoveHeroSlide,
  handleUpdateSlideText
}: HeroTabFormProps) {
  const bullets = siteSettings.hero_bullets && siteSettings.hero_bullets.length > 0
    ? siteSettings.hero_bullets
    : [
        { text: "Prijava traje 2 minuta" },
        { text: "Besplatna podrška" },
        { text: "Pomažemo do prve dostave" },
        { text: "Beograd i Novi Sad" }
      ];

  const handleUpdateBulletText = (index: number, text: string) => {
    const updated = [...bullets];
    updated[index] = { ...updated[index], text };
    setSiteSettings({ ...siteSettings, hero_bullets: updated });
  };

  const handleAddBullet = () => {
    const updated = [...bullets, { text: "" }];
    setSiteSettings({ ...siteSettings, hero_bullets: updated });
  };

  const handleRemoveBullet = (index: number) => {
    const updated = bullets.filter((_: any, i: number) => i !== index);
    setSiteSettings({ ...siteSettings, hero_bullets: updated });
  };

  const handleMoveBulletUp = (index: number) => {
    if (index === 0) return;
    const updated = [...bullets];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSiteSettings({ ...siteSettings, hero_bullets: updated });
  };

  const handleMoveBulletDown = (index: number) => {
    if (index === bullets.length - 1) return;
    const updated = [...bullets];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSiteSettings({ ...siteSettings, hero_bullets: updated });
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm w-full" id="hero-tab-form-root">
      <form onSubmit={onSave} className="space-y-6">
        <div className="space-y-1 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-black text-gray-900">Uređivanje Hero Sekcije</h3>
          <p className="text-xs text-gray-400">Podesite glavne naslove, podnaslove, slike i slajdere koji se vide odmah po otvaranju sajta.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Glavni Hero H1 naslov</label>
            <input
              type="text"
              required
              placeholder="npr. Pronađi posao dostavljača uz Deliverix"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
              value={siteSettings.hero_h1 || ''}
              onChange={e => setSiteSettings({ ...siteSettings, hero_h1: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Hero Slogan (H2)</label>
            <input
              type="text"
              required
              placeholder="npr. Tvoja vožnja. Tvoja zarada. Tvoj tempo."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
              value={siteSettings.hero_title || ''}
              onChange={e => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Hero Podnaslov (Tekst ispod glavnog naslova)</label>
            <textarea
              rows={2}
              required
              placeholder="Upišite podnaslov..."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              value={siteSettings.homepage_subtitle || ''}
              onChange={e => setSiteSettings({ ...siteSettings, homepage_subtitle: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Naslov iznad platformi (Mali plavi tekst iznad Wolt, Glovo ikonica)</label>
            <input
              type="text"
              required
              placeholder="npr. Izaberi platformu za rad:"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
              value={siteSettings.hero_platform_title || ''}
              onChange={e => setSiteSettings({ ...siteSettings, hero_platform_title: e.target.value })}
            />
          </div>
        </div>

        {/* Hero ključne prednosti (Faza 5) */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h4 className="text-xs font-extrabold text-sky-600 uppercase tracking-wider font-sans flex items-center gap-1.5">
            <Check className="w-4 h-4 stroke-[3]" /> Hero ključne prednosti
          </h4>
          <div className="space-y-2">
            {bullets.map((bullet: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                <input
                  type="text"
                  required
                  placeholder="Upišite stavku prednosti..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  value={bullet?.text || bullet || ''}
                  onChange={e => handleUpdateBulletText(idx, e.target.value)}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveBulletUp(idx)}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 border border-gray-200 rounded-lg cursor-pointer"
                    title="Pomeri gore"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === bullets.length - 1}
                    onClick={() => handleMoveBulletDown(idx)}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 border border-gray-200 rounded-lg cursor-pointer"
                    title="Pomeri dole"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  {bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg cursor-pointer"
                      title="Obriši"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddBullet}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Dodaj novu stavku prednosti
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h4 className="text-xs font-extrabold text-sky-600 uppercase tracking-wider font-sans flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Desna strana Hero sekcije (Slika / Slajder)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase font-sans">Tip desnog vizuelnog prikaza</label>
              <select
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-sky-500 focus:outline-none font-semibold cursor-pointer"
                value={siteSettings.hero_right_mode || 'image'}
                onChange={e => setSiteSettings({ ...siteSettings, hero_right_mode: e.target.value })}
              >
                <option value="image">Jedna statička slika</option>
                <option value="slider">Slajder (više slika u nizu)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase font-sans">SEO Alt Oznaka slike / slajdera</label>
              <input
                type="text"
                required
                placeholder="npr. Dostavljač hrane - Wolt Glovo Srbija"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                value={siteSettings.hero_image_alt || ''}
                onChange={e => setSiteSettings({ ...siteSettings, hero_image_alt: e.target.value })}
              />
            </div>
          </div>

          {/* SINGLE STATIC IMAGE REŽIM */}
          {siteSettings.hero_right_mode !== 'slider' && (
            <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Pregled</span>
                  <div className="w-20 h-20 rounded-xl shadow-xs border border-gray-150 flex items-center justify-center overflow-hidden bg-white">
                    <img 
                      src={siteSettings.hero_image_url || '/assets/images/delivery_courier_hero_1783427588712.webp'} 
                      alt="Hero pregled" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase font-sans">Otpremite sliku dostavljača</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 transition group">
                        <div className="flex items-center gap-2">
                          {isUploadingHeroImage ? (
                            <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition" />
                          )}
                          <span className="text-xs font-bold text-gray-600 group-hover:text-sky-600 transition">
                            {isUploadingHeroImage ? 'Otpremanje...' : 'Izaberite sliku'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleHeroImageUpload}
                          disabled={isUploadingHeroImage}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase font-sans">Ili unesite eksterni URL slike</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                      value={siteSettings.hero_image_url || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_image_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100/50 space-y-3">
                <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Mali info bedž preko slike</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase font-sans">Gornji mali naslov</label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Dostupno odmah"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-extrabold text-sky-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      value={siteSettings.hero_badge_title || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_badge_title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase font-sans">Glavni uočljiv tekst</label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Pomoć oko zaposlenja je 100% besplatna!"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      value={siteSettings.hero_badge_text || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_badge_text: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDER REŽIM */}
          {siteSettings.hero_right_mode === 'slider' && (
            <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-fade-in">
              <div className="flex justify-between items-center">
                <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Slike i tekstovi u slajderu</h5>
                <span className="text-[10px] bg-sky-50 text-sky-700 font-extrabold px-2 py-0.5 rounded-full">
                  Broj slika: {siteSettings.hero_slider_images?.length || 0}
                </span>
              </div>

              {(!siteSettings.hero_slider_images || siteSettings.hero_slider_images.length === 0) ? (
                <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">Slajder je prazan. Dodajte prvu sliku ispod.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(siteSettings.hero_slider_slides || []).map((slide: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-4 md:space-y-0 md:flex md:gap-4 items-start">
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video w-full md:w-40 bg-gray-50 shrink-0">
                        <img 
                          src={slide.image} 
                          alt={`Slajd ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroSlide(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Mali naslov</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                              value={slide.badge_title || ''}
                              onChange={e => handleUpdateSlideText(idx, 'badge_title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Glavni tekst</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs"
                              value={slide.badge_text || ''}
                              onChange={e => handleUpdateSlideText(idx, 'badge_text', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">SEO ALT Oznaka slike za ovaj slajd</label>
                          <input
                            type="text"
                            placeholder="npr. Dostavljač Wolt na električnom biciklu Beograd"
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs"
                            value={slide.seo_alt || ''}
                            onChange={e => handleUpdateSlideText(idx, 'seo_alt', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase font-sans">Dodaj novu sliku u slajder</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 transition group">
                    <div className="flex items-center gap-2">
                      {isUploadingHeroSlide ? (
                        <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition" />
                      )}
                      <span className="text-xs font-bold text-gray-600 group-hover:text-sky-600 transition">
                        {isUploadingHeroSlide ? 'Otpremanje...' : 'Izaberite sliku slajda'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleHeroSlideUpload}
                      disabled={isUploadingHeroSlide}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
          >
            Sačuvaj izmene u Hero delu
          </button>
        </div>
      </form>
    </div>
  );
}

interface HomepageSectionsTabFormProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
}

export function HomepageSectionsTabForm({
  siteSettings,
  setSiteSettings,
  onSave
}: HomepageSectionsTabFormProps) {
  // Automatski inicijalizuj prazna ili nedefinisana polja sa podrazumevanim vrednostima sa sajta
  React.useEffect(() => {
    let hasChanges = false;
    const updatedSettings = { ...siteSettings };

    if (!siteSettings.why_choose_us_items || siteSettings.why_choose_us_items.length === 0) {
      updatedSettings.why_choose_us_items = [
        'Besplatna obuka i priprema za start',
        '0 RSD troškova za našu podršku',
        'Povezivanje sa najpouzdanijim partnerima',
        'Dostupni smo ti za sva pitanja – uvek besplatno'
      ];
      hasChanges = true;
    }

    if (!siteSettings.steps || siteSettings.steps.length === 0) {
      updatedSettings.steps = [
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
      hasChanges = true;
    }

    if (!siteSettings.requirements || siteSettings.requirements.length === 0) {
      updatedSettings.requirements = [
        {
          title: 'Pametni telefon',
          desc: 'Android ili iPhone sa internetom kako bi mogao da koristiš Wolt Partner aplikaciju za dostave.',
          icon: 'Smartphone'
        },
        {
          title: 'Prevozno sredstvo',
          desc: 'Bicikl (sopstveni ili električni), skuter / motor ili automobil. Sam biraš sa čim želiš da radiš.',
          icon: 'Bike'
        },
        {
          title: 'Lični dokumenti',
          desc: 'Važeća lična karta (moraš imati najmanje 18 godina) i vozačka dozvola ukoliko voziš motorno vozilo.',
          icon: 'FileText'
        }
      ];
      hasChanges = true;
    }

    if (!siteSettings.rent_items || siteSettings.rent_items.length === 0) {
      updatedSettings.rent_items = [
        {
          title: 'Električni bicikl',
          desc: 'Iznajmljivanje na mesečnom nivou za 25.000 RSD sa uračunatim servisima i stanicom za punjenje baterija.',
          icon: 'Bike',
          badge: 'Najtraženije',
          enabled: siteSettings.rent_bike_enabled !== false,
          available: true
        },
        {
          title: 'Skuter / Motor',
          desc: 'Brzina i efikasnost na dužim distancama. Povoljni paketi sa uključenim servisiranjem.',
          icon: 'ScooterIcon',
          badge: 'Najbrže',
          enabled: siteSettings.rent_scooter_enabled !== false,
          available: true
        },
        {
          title: 'Dostavni Automobil',
          desc: 'Udobnost tokom cele godine bez obzira na vremenske prilike. Idealno za veće porudžbine.',
          icon: 'Car',
          badge: 'Za sve vremenske uslove',
          enabled: siteSettings.rent_car_enabled !== false,
          available: false
        }
      ];
      hasChanges = true;
    }

    if (!siteSettings.why_choose_us_title) {
      updatedSettings.why_choose_us_title = 'Zašto kandidati biraju nas?';
      hasChanges = true;
    }
    if (!siteSettings.why_choose_us_subtitle) {
      updatedSettings.why_choose_us_subtitle = 'Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna za sve kandidate. Nemamo nikakve skrivene naknade, članarine niti uzimamo procenat od tvoje zarade.';
      hasChanges = true;
    }
    if (!siteSettings.steps_title) {
      updatedSettings.steps_title = 'Kako funkcioniše proces?';
      hasChanges = true;
    }
    if (!siteSettings.steps_subtitle) {
      updatedSettings.steps_subtitle = 'Od prijave do tvoje prve isplate deli te samo nekoliko jednostavnih koraka';
      hasChanges = true;
    }
    if (!siteSettings.requirements_title) {
      updatedSettings.requirements_title = 'Uslovi za Rad i Prijava za Deliverix Flotu';
      hasChanges = true;
    }
    if (!siteSettings.requirements_subtitle) {
      updatedSettings.requirements_subtitle = 'Uslovi su minimalni i dostupni svima koji žele pošteno da zarade';
      hasChanges = true;
    }
    if (!siteSettings.target_audience_title) {
      updatedSettings.target_audience_title = 'Za koga je ovaj posao?';
      hasChanges = true;
    }
    if (!siteSettings.target_audience_desc) {
      updatedSettings.target_audience_desc = 'Dostava hrane i pošiljaka je idealna za sve koji cene slobodu i samostalnost u radu. Naš stručni tim ti pruža sigurnost, besplatne savete i brze odgovore u svakom trenutku.';
      hasChanges = true;
    }
    if (!siteSettings.target_audience_items || siteSettings.target_audience_items.length === 0) {
      updatedSettings.target_audience_items = [
        'Osobe koje žele odličnu zaradu i stabilan prihod uz potpunu kontrolu nad svojim vremenom',
        'Studente koji žele da rade samo vikendom ili par sati dnevno',
        'Zaposlene koji traže dodatni izvor prihoda nakon radnog vremena',
        'Osobe bez ikakvog prethodnog iskustva u dostavi ili prodaji'
      ];
      hasChanges = true;
    }
    if (!siteSettings.why_apply_title) {
      updatedSettings.why_apply_title = 'Zašto se prijaviti preko nas?';
      hasChanges = true;
    }
    if (!siteSettings.why_apply_desc) {
      updatedSettings.why_apply_desc = 'Kao nezavisna platforma za podršku, pomažemo ti da pronađeš partnersku agenciju koja nudi najbolje uslove za tvoj profil. To za tebe znači:';
      hasChanges = true;
    }
    if (!siteSettings.why_apply_items || siteSettings.why_apply_items.length === 0) {
      updatedSettings.why_apply_items = [
        { title: 'Sloboda izbora modela', desc: 'Biraš model saradnje i dinamiku rada koji najviše odgovaraju tvojim ličnim potrebama.' },
        { title: 'Najbolja provizija', desc: 'Spajamo te sa agencijama koje nude najpovoljnije uslove i najmanji procenat.' },
        { title: 'Brza podrška', desc: 'Naš mentorski tim ti pomaže oko aplikacije i rešavanja bilo kakvih problema na terenu.' },
        { title: 'Brz start i obuka', desc: 'Pomažemo ti u brzom pokretanju naloga i pružamo besplatne savete pre prve dostave.' }
      ];
      hasChanges = true;
    }
    if (!siteSettings.footer_cta_title) {
      updatedSettings.footer_cta_title = 'Započni svoju dostavljačku karijeru danas';
      hasChanges = true;
    }
    if (!siteSettings.footer_cta_desc) {
      updatedSettings.footer_cta_desc = 'Nemoj odlagati priliku za odličnu zaradu i potpunu slobodu. Registracija te ništa ne košta i ne obavezuje te ni na šta. Pomažemo ti oko celog procesa besplatno.';
      hasChanges = true;
    }
    if (!siteSettings.footer_disclaimer) {
      updatedSettings.footer_disclaimer = 'Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne.';
      hasChanges = true;
    }

    if (!siteSettings.about_title) {
      updatedSettings.about_title = 'Šta je Deliverix?';
      hasChanges = true;
    }
    if (!siteSettings.about_intro) {
      updatedSettings.about_intro = 'Deliverix je nezavisna platforma za prijavu dostavljača u Srbiji koja povezuje kandidate sa proverenim partnerskim agencijama za rad na dostavnim platformama kao što su Wolt i Glovo.';
      hasChanges = true;
    }
    if (!siteSettings.about_paragraph1) {
      updatedSettings.about_paragraph1 = 'Umesto da samostalno tražiš oglase, kontaktiraš više agencija i prolaziš kroz različite procedure, dovoljno je da ostaviš jednu prijavu. Na osnovu tvoje lokacije, raspoloživosti i željenog načina rada, pomažemo ti da pronađeš odgovarajuću saradnju.';
      hasChanges = true;
    }
    if (!siteSettings.about_paragraph2) {
      updatedSettings.about_paragraph2 = 'Naša podrška je potpuno besplatna i vodi te kroz ceo proces — od prve prijave do aktivacije naloga i početka rada.';
      hasChanges = true;
    }
    if (!siteSettings.about_tags || siteSettings.about_tags.length === 0) {
      updatedSettings.about_tags = [
        'posao dostavljača',
        'prijava za dostavljača',
        'dostavljač Wolt',
        'dostavljač Glovo',
        'posao kurira',
        'dostava hrane',
        'dostavljač Srbija'
      ];
      hasChanges = true;
    }

    if (hasChanges) {
      setSiteSettings(updatedSettings);
    }
  }, []);

  // Helpers za Za koga je ovaj posao?
  const targetAudienceItems = (siteSettings.target_audience_items && siteSettings.target_audience_items.length > 0)
    ? siteSettings.target_audience_items
    : [
        'Osobe koje žele odličnu zaradu i stabilan prihod uz potpunu kontrolu nad svojim vremenom',
        'Studente koji žele da rade samo vikendom ili par sati dnevno',
        'Zaposlene koji traže dodatni izvor prihoda nakon radnog vremena',
        'Osobe bez ikakvog prethodnog iskustva u dostavi ili prodaji'
      ];

  const handleUpdateAudienceItem = (index: number, val: string) => {
    const updated = [...targetAudienceItems];
    updated[index] = val;
    setSiteSettings({ ...siteSettings, target_audience_items: updated });
  };

  const handleAddAudienceItem = () => {
    setSiteSettings({ ...siteSettings, target_audience_items: [...targetAudienceItems, ''] });
  };

  const handleRemoveAudienceItem = (index: number) => {
    setSiteSettings({ ...siteSettings, target_audience_items: targetAudienceItems.filter((_: any, i: number) => i !== index) });
  };

  // Helpers za Zašto se prijaviti preko nas
  const whyApplyItems = (siteSettings.why_apply_items && siteSettings.why_apply_items.length > 0)
    ? siteSettings.why_apply_items
    : [
        { title: 'Sloboda izbora modela', desc: 'Biraš model saradnje i dinamiku rada koji najviše odgovaraju tvojim ličnim potrebama.' },
        { title: 'Najbolja provizija', desc: 'Spajamo te sa agencijama koje nude najpovoljnije uslove i najmanji procenat.' },
        { title: 'Brza podrška', desc: 'Naš mentorski tim ti pomaže oko aplikacije i rešavanja bilo kakvih problema na terenu.' },
        { title: 'Brz start i obuka', desc: 'Pomažemo ti u brzom pokretanju naloga i pružamo besplatne savete pre prve dostave.' }
      ];

  const handleUpdateWhyApplyItem = (index: number, field: 'title' | 'desc', val: string) => {
    const updated = [...whyApplyItems];
    if (!updated[index]) {
      updated[index] = { title: '', desc: '' };
    }
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, why_apply_items: updated });
  };

  const handleAddWhyApplyItem = () => {
    setSiteSettings({ ...siteSettings, why_apply_items: [...whyApplyItems, { title: 'Novi razlog', desc: '' }] });
  };

  const handleRemoveWhyApplyItem = (index: number) => {
    setSiteSettings({ ...siteSettings, why_apply_items: whyApplyItems.filter((_: any, i: number) => i !== index) });
  };

  // Helpers za Zašto nas biraju
  const whyChooseUsItems = (siteSettings.why_choose_us_items && siteSettings.why_choose_us_items.length > 0)
    ? siteSettings.why_choose_us_items
    : [
        'Besplatna obuka i priprema za start',
        '0 RSD troškova za našu podršku',
        'Povezivanje sa najpouzdanijim partnerima',
        'Dostupni smo ti za sva pitanja – uvek besplatno'
      ];

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...whyChooseUsItems];
    updated[index] = val;
    setSiteSettings({ ...siteSettings, why_choose_us_items: updated });
  };

  const handleAddBullet = () => {
    setSiteSettings({ ...siteSettings, why_choose_us_items: [...whyChooseUsItems, ''] });
  };

  const handleRemoveBullet = (index: number) => {
    setSiteSettings({ ...siteSettings, why_choose_us_items: whyChooseUsItems.filter((_: any, i: number) => i !== index) });
  };

  // Helpers za Kome je namenjen Deliverix (8 kartica)
  const defaultAudienceCards = [
    { title: 'Osobe koje traže fleksibilnost', desc: 'Sami određujete kada i koliko radite, bez ikakvog pritiska.' },
    { title: 'Studenti', desc: 'Odličan način da zaradite džeparac uporedo sa studijama.' },
    { title: 'Zaposleni (Dodatni posao)', desc: 'Radite par sati dnevno nakon primarnog posla za dodatni prihod.' },
    { title: 'Oni koji žele dobre prihode', desc: 'Zaradite preko 150.000 RSD uz redovne dvonedeljne isplate.' },
    { title: 'Profesionalni vozači', desc: 'Iskoristite svoje poznavanje grada i pretvorite kilometre u novac.' },
    { title: 'Osobe bez iskustva', desc: 'Pružamo besplatnu obuku i podršku, nikakvo predznanje nije potrebno.' },
    { title: 'Ljubitelji biciklizma', desc: 'Spojite rekreaciju i zaradu vozeći sopstveni ili naš električni e-bike.' },
    { title: 'Zajednica / Timski duh', desc: 'Postanite deo velike i podržavajuće flote dostavljača u Srbiji.' }
  ];

  const targetAudienceCards = (siteSettings.target_audience_cards && siteSettings.target_audience_cards.length > 0)
    ? siteSettings.target_audience_cards
    : defaultAudienceCards;

  const handleUpdateAudienceCard = (index: number, field: 'title' | 'desc', val: string) => {
    const updated = [...targetAudienceCards];
    if (!updated[index]) {
      updated[index] = { title: '', desc: '' };
    }
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, target_audience_cards: updated });
  };

  // Helpers za Kako funkcioniše (Steps)
  const steps = (siteSettings.steps && siteSettings.steps.length > 0)
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

  const handleUpdateStep = (index: number, field: 'number' | 'title' | 'desc', val: string) => {
    const updated = [...steps];
    if (!updated[index]) {
      updated[index] = { number: '', title: '', desc: '' };
    }
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, steps: updated });
  };

  const handleAddStep = () => {
    const nextNum = String(steps.length + 1).padStart(2, '0');
    const updated = [...steps, { number: nextNum, title: 'Novi korak', desc: '' }];
    setSiteSettings({ ...siteSettings, steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_: any, i: number) => i !== index)
      .map((step: any, i: number) => ({
        ...step,
        number: String(i + 1).padStart(2, '0')
      }));
    setSiteSettings({ ...siteSettings, steps: updated });
  };

  // Helpers za Uslovi za rad
  const requirements = (siteSettings.requirements && siteSettings.requirements.length > 0)
    ? siteSettings.requirements
    : [
        {
          title: 'Pametni telefon',
          desc: 'Android ili iPhone sa internetom kako bi mogao da koristiš Wolt Partner aplikaciju za dostave.',
          icon: 'Smartphone'
        },
        {
          title: 'Prevozno sredstvo',
          desc: 'Bicikl (sopstveni ili električni), skuter / motor ili automobil. Sam biraš sa čim želiš da radiš.',
          icon: 'Bike'
        },
        {
          title: 'Lični dokumenti',
          desc: 'Važeća lična karta (moraš imati najmanje 18 godina) i vozačka dozvola ukoliko voziš motorno vozilo.',
          icon: 'FileText'
        }
      ];

  const handleUpdateReq = (index: number, field: 'title' | 'desc' | 'icon', val: string) => {
    const updated = [...requirements];
    if (!updated[index]) {
      updated[index] = { title: '', desc: '', icon: 'Smartphone' };
    }
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, requirements: updated });
  };

  const handleAddReq = () => {
    const updated = [...requirements, { title: 'Novi uslov', desc: '', icon: 'Smartphone' }];
    setSiteSettings({ ...siteSettings, requirements: updated });
  };

  const handleRemoveReq = (index: number) => {
    const updated = requirements.filter((_: any, i: number) => i !== index);
    setSiteSettings({ ...siteSettings, requirements: updated });
  };

  // Helpers za Renta vozila
  const rentItems = (siteSettings.rent_items && siteSettings.rent_items.length > 0)
    ? siteSettings.rent_items
    : [
        {
          title: 'Električni bicikl',
          desc: 'Iznajmljivanje na mesečnom nivou za 25.000 RSD sa uračunatim servisima i stanicom za punjenje baterija.',
          icon: 'Bike',
          badge: 'Najtraženije',
          enabled: siteSettings.rent_bike_enabled !== false,
          available: true
        },
        {
          title: 'Skuter / Motor',
          desc: 'Brzina i efikasnost na dužim distancama. Povoljni paketi sa uključenim servisiranjem.',
          icon: 'ScooterIcon',
          badge: 'Najbrže',
          enabled: siteSettings.rent_scooter_enabled !== false,
          available: true
        },
        {
          title: 'Dostavni Automobil',
          desc: 'Udobnost tokom cele godine bez obzira na vremenske prilike. Idealno za veće porudžbine.',
          icon: 'Car',
          badge: 'Za sve vremenske uslove',
          enabled: siteSettings.rent_car_enabled !== false,
          available: false
        }
      ];

  const handleUpdateRentItem = (index: number, field: string, val: any) => {
    const updated = [...rentItems];
    if (!updated[index]) return;
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, rent_items: updated });
  };

  const handleAddRentItem = () => {
    const updated = [...rentItems, {
      title: 'Novo vozilo',
      desc: 'Opis ponude...',
      icon: 'Bike',
      badge: 'Novo',
      enabled: true,
      available: true
    }];
    setSiteSettings({ ...siteSettings, rent_items: updated });
  };

  const handleRemoveRentItem = (index: number) => {
    const updated = rentItems.filter((_: any, i: number) => i !== index);
    setSiteSettings({ ...siteSettings, rent_items: updated });
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm w-full" id="sections-tab-form-root">
      <form onSubmit={onSave} className="space-y-8">
        <div className="space-y-1 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-black text-gray-900">Uređivanje Delova Sajta</h3>
          <p className="text-xs text-gray-400">Prilagodite sekcije "Šta je Deliverix?", "Zašto nas biraju", "Kako funkcioniše", "Uslovi za rad" i "Renta vozila".</p>
        </div>

        {/* SEKCIJA 0: ŠTA JE DELIVERIX? */}
        <div className={`space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border transition-all ${siteSettings.about_enabled !== false ? 'border-gray-100 opacity-100' : 'border-gray-200/80 bg-gray-100/30'}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Sekcija: Šta je Deliverix?
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.about_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
              <button
                type="button"
                onClick={() => setSiteSettings({ ...siteSettings, about_enabled: siteSettings.about_enabled !== false ? false : true })}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  siteSettings.about_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    siteSettings.about_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Glavni naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.about_title || 'Šta je Deliverix?'}
                onChange={e => setSiteSettings({ ...siteSettings, about_title: e.target.value })}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Popularne pretrage (oznake, odvojene zarezom)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-sky-700 font-mono"
                value={(siteSettings.about_tags || []).join(', ')}
                onChange={e => setSiteSettings({ ...siteSettings, about_tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="posao dostavljača, prijava za dostavljača, dostavljač Wolt"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Istaknuti uvodni tekst (Bold)</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium leading-relaxed"
              value={siteSettings.about_intro || ''}
              onChange={e => setSiteSettings({ ...siteSettings, about_intro: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Prvi pasus (Detaljan opis)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 leading-relaxed"
                value={siteSettings.about_paragraph1 || ''}
                onChange={e => setSiteSettings({ ...siteSettings, about_paragraph1: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Drugi pasus (Detaljan opis)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 leading-relaxed"
                value={siteSettings.about_paragraph2 || ''}
                onChange={e => setSiteSettings({ ...siteSettings, about_paragraph2: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SEKCIJA 1: ZAŠTO NAS BIRAJU */}
        <div className={`space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border transition-all ${siteSettings.why_choose_us_enabled !== false ? 'border-gray-100 opacity-100' : 'border-gray-200/80 bg-gray-100/30'}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> Sekcija: Zašto nas biraju (Prednosti)
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.why_choose_us_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
              <button
                type="button"
                onClick={() => setSiteSettings({ ...siteSettings, why_choose_us_enabled: siteSettings.why_choose_us_enabled !== false ? false : true })}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  siteSettings.why_choose_us_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    siteSettings.why_choose_us_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov sekcije</label>
              <input
                type="text"
                placeholder="npr. Zašto kandidati biraju nas?"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.why_choose_us_title || 'Zašto kandidati biraju nas?'}
                onChange={e => setSiteSettings({ ...siteSettings, why_choose_us_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Podnaslov sekcije</label>
              <input
                type="text"
                placeholder="npr. Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.why_choose_us_subtitle || 'Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna za sve kandidate. Nemamo nikakve skrivene naknade, članarine niti uzimamo procenat od tvoje zarade.'}
                onChange={e => setSiteSettings({ ...siteSettings, why_choose_us_subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Lista istaknutih prednosti (Kvačice)</label>
            <div className="space-y-2">
              {whyChooseUsItems.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                    value={item}
                    onChange={e => handleUpdateBullet(idx, e.target.value)}
                  />
                  {whyChooseUsItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddBullet}
              className="mt-2 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj novu prednost
            </button>
          </div>
        </div>

        {/* SEKCIJA 2: KAKO FUNKCIONIŠE */}
        <div className={`space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border transition-all ${siteSettings.steps_enabled !== false ? 'border-gray-100 opacity-100' : 'border-gray-200/80 bg-gray-100/30'}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Sekcija: Kako funkcioniše (Koraci)
            </h4>
            <div className="flex items-center gap-3">
              {siteSettings.steps_enabled !== false && (
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Dodaj Korak
                </button>
              )}
              <div className="flex items-center gap-2 border-l border-gray-250 pl-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.steps_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
                <button
                  type="button"
                  onClick={() => setSiteSettings({ ...siteSettings, steps_enabled: siteSettings.steps_enabled !== false ? false : true })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteSettings.steps_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      siteSettings.steps_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Glavni naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.steps_title || 'Kako funkcioniše proces?'}
                onChange={e => setSiteSettings({ ...siteSettings, steps_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Podnaslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.steps_subtitle || 'Od prijave do tvoje prve isplate deli te samo nekoliko jednostavnih koraka'}
                onChange={e => setSiteSettings({ ...siteSettings, steps_subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje koraka</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 relative">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md font-mono">Korak {idx + 1}</span>
                      <input
                        type="text"
                        className="w-12 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-center text-xs font-bold font-mono"
                        value={step.number || `0${idx + 1}`}
                        onChange={e => handleUpdateStep(idx, 'number', e.target.value)}
                      />
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-150 transition cursor-pointer"
                        title="Ukloni korak"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Naslov koraka</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                      value={step.title || ''}
                      onChange={e => handleUpdateStep(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Opis koraka</label>
                    <textarea
                      rows={3}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed"
                      value={step.desc || ''}
                      onChange={e => handleUpdateStep(idx, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA 3: USLOVI ZA RAD */}
        <div className={`space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border transition-all ${siteSettings.requirements_enabled !== false ? 'border-gray-100 opacity-100' : 'border-gray-200/80 bg-gray-100/30'}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Sekcija: Uslovi za rad
            </h4>
            <div className="flex items-center gap-3">
              {siteSettings.requirements_enabled !== false && (
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Dodaj Uslov
                </button>
              )}
              <div className="flex items-center gap-2 border-l border-gray-250 pl-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.requirements_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
                <button
                  type="button"
                  onClick={() => setSiteSettings({ ...siteSettings, requirements_enabled: siteSettings.requirements_enabled !== false ? false : true })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteSettings.requirements_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      siteSettings.requirements_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.requirements_title || 'Uslovi za Rad i Prijava za Deliverix Flotu'}
                onChange={e => setSiteSettings({ ...siteSettings, requirements_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Podnaslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.requirements_subtitle || 'Uslovi su minimalni i dostupni svima koji žele pošteno da zarade'}
                onChange={e => setSiteSettings({ ...siteSettings, requirements_subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje pojedinačnih uslova</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requirements.map((req: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold text-gray-400">Uslov #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <select
                        className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold cursor-pointer font-sans"
                        value={req.icon || 'Smartphone'}
                        onChange={e => handleUpdateReq(idx, 'icon', e.target.value)}
                      >
                        <option value="Smartphone">Telefon</option>
                        <option value="Bike">Bicikl</option>
                        <option value="ScooterIcon">Skuter</option>
                        <option value="Car">Automobil</option>
                        <option value="FileText">Dokumenta</option>
                        <option value="Clock">Vreme</option>
                        <option value="MapPin">Gradovi</option>
                        <option value="ShieldCheck">Ugovor</option>
                      </select>
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveReq(idx)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-150 transition cursor-pointer"
                          title="Ukloni uslov"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Naslov stavke</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                      value={req.title || ''}
                      onChange={e => handleUpdateReq(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Kratak opis stavke</label>
                    <textarea
                      rows={3}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed"
                      value={req.desc || ''}
                      onChange={e => handleUpdateReq(idx, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA 4: RENTA VOZILA */}
        <div className={`space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border transition-all ${siteSettings.rent_enabled !== false ? 'border-gray-100 opacity-100' : 'border-gray-200/80 bg-gray-100/30'}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Bike className="w-4 h-4" /> Sekcija: Renta vozila & Ponuda
            </h4>
            <div className="flex items-center gap-3">
              {siteSettings.rent_enabled !== false && (
                <button
                  type="button"
                  onClick={handleAddRentItem}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Dodaj Vozilo
                </button>
              )}
              <div className="flex items-center gap-2 border-l border-gray-250 pl-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.rent_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
                <button
                  type="button"
                  onClick={() => setSiteSettings({ ...siteSettings, rent_enabled: siteSettings.rent_enabled !== false ? false : true })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteSettings.rent_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      siteSettings.rent_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.rent_section_title || 'Prevozno sredstvo i oprema za rad'}
                onChange={e => setSiteSettings({ ...siteSettings, rent_section_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Kratak tekst sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.rent_section_text || 'Ukoliko nemaš sopstveno prevozno sredstvo, u partnerskim agencijama te mogu uputiti na najbolje opcije za nabavku ili korišćenje adekvatne opreme.'}
                onChange={e => setSiteSettings({ ...siteSettings, rent_section_text: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje vozila za renta ponudu</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rentItems.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-sky-600 uppercase">Vozilo #{idx + 1}</span>
                      <select
                        className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold cursor-pointer font-sans"
                        value={item.icon || 'Bike'}
                        onChange={e => handleUpdateRentItem(idx, 'icon', e.target.value)}
                      >
                        <option value="Bike">E-Bicikl</option>
                        <option value="ScooterIcon">Skuter / Motor</option>
                        <option value="Car">Automobil</option>
                        <option value="Smartphone">Telefon</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRentItem(idx)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-150 transition cursor-pointer"
                      title="Ukloni vozilo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Naziv vozila</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                        value={item.title || ''}
                        onChange={e => handleUpdateRentItem(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Mali Bedž (Badge)</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-amber-700"
                        value={item.badge || ''}
                        onChange={e => handleUpdateRentItem(idx, 'badge', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Detaljan opis i cena (Opis ponude)</label>
                    <textarea
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed"
                      value={item.desc || ''}
                      onChange={e => handleUpdateRentItem(idx, 'desc', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Prikaži na sajtu</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateRentItem(idx, 'enabled', item.enabled !== false ? false : true)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.enabled !== false ? 'bg-sky-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                            item.enabled !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Dostupno odmah</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateRentItem(idx, 'available', item.available !== false ? false : true)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.available !== false ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                            item.available !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA 5: ZA KOGA JE OVAJ POSAO? */}
        <div className="space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Sekcija: Za koga je ovaj posao?
            </h4>
            <button
              type="button"
              onClick={handleAddAudienceItem}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Dodaj Stavku
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.target_audience_title || 'Za koga je ovaj posao?'}
                onChange={e => setSiteSettings({ ...siteSettings, target_audience_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Uvodni tekst sekcije</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.target_audience_desc || 'Dostava hrane i pošiljaka je idealna za sve koji cene slobodu i samostalnost u radu. Naš stručni tim ti pruža sigurnost, besplatne savete i brze odgovore u svakom trenutku.'}
                onChange={e => setSiteSettings({ ...siteSettings, target_audience_desc: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje ciljnih grupa (stavki)</span>
            <div className="space-y-2">
              {targetAudienceItems.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 shrink-0 min-w-[20px] font-mono">#{idx + 1}</span>
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    value={item || ''}
                    onChange={e => handleUpdateAudienceItem(idx, e.target.value)}
                  />
                  {targetAudienceItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAudienceItem(idx)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-150 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA 6: ZAŠTO SE PRIJAVITI PREKO NAS? */}
        <div className="space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" /> Sekcija: Zašto se prijaviti preko nas?
            </h4>
            <button
              type="button"
              onClick={handleAddWhyApplyItem}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Dodaj Karticu
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.why_apply_title || 'Zašto se prijaviti preko nas?'}
                onChange={e => setSiteSettings({ ...siteSettings, why_apply_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Uvodni tekst sekcije</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.why_apply_desc || 'Kao nezavisna platforma za podršku, pomažemo ti da pronađeš partnersku agenciju koja nudi najbolje uslove za tvoj profil. To za tebe znači:'}
                onChange={e => setSiteSettings({ ...siteSettings, why_apply_desc: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje kartica (razloga)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyApplyItems.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 relative">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-xs font-black text-sky-600">Razlog #{idx + 1}</span>
                    {whyApplyItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWhyApplyItem(idx)}
                        className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-150 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Naslov kartice</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                      value={item.title || ''}
                      onChange={e => handleUpdateWhyApplyItem(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Opis na kartici</label>
                    <textarea
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed"
                      value={item.desc || ''}
                      onChange={e => handleUpdateWhyApplyItem(idx, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA ZA KOME JE NAMENJEN DELIVERIX (8 KARTICA) */}
        <div className="space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Compass className="w-4 h-4" /> Sekcija: Kome je namenjen Deliverix (8 Kartica)
          </h4>
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Uređivanje 8 kartica ciljnih grupa</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {targetAudienceCards.map((card: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 relative">
                  <span className="text-xs font-black text-sky-600">Kartica #{idx + 1}</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Naslov</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                      value={card.title || ''}
                      onChange={e => handleUpdateAudienceCard(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Opis</label>
                    <textarea
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed"
                      value={card.desc || ''}
                      onChange={e => handleUpdateAudienceCard(idx, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEKCIJA ZA SEO ARTIKAL */}
        <div className="space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Sekcija: SEO Karijerni vodič / Artikal
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase">{siteSettings.seo_article_enabled !== false ? 'Aktivna' : 'Isključena'}</span>
              <button
                type="button"
                onClick={() => setSiteSettings({ ...siteSettings, seo_article_enabled: siteSettings.seo_article_enabled !== false ? false : true })}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  siteSettings.seo_article_enabled !== false ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    siteSettings.seo_article_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Glavni naslov artikla</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.seo_article_title || "Zašto kandidati biraju posao dostavljača u Srbiji?"}
                onChange={e => setSiteSettings({ ...siteSettings, seo_article_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Mali bedž na vrhu sekcije</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                value={siteSettings.seo_article_badge || "Karijerni vodič i saveti"}
                onChange={e => setSiteSettings({ ...siteSettings, seo_article_badge: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Paragrafi artikla</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 1 (Leva kolona, vrh)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p1 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p1: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 2 (Leva kolona, sredina)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p2 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p2: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 3 (Leva kolona, dno)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p3 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p3: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 4 (Desna kolona, vrh)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p4 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p4: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 5 (Desna kolona, sredina)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p5 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p5: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Paragraf 6 (Desna kolona, dno)</label>
                  <textarea
                    rows={3}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs leading-relaxed"
                    value={siteSettings.seo_article_p6 || ""}
                    onChange={e => setSiteSettings({ ...siteSettings, seo_article_p6: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-extrabold text-gray-400 uppercase block">Metrike / Karakteristike na dnu artikla</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Karakteristika 1</label>
                <input
                  type="text"
                  placeholder="Naslov"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                  value={siteSettings.seo_article_metric1_title || "Maksimalna Fleksibilnost"}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric1_title: e.target.value })}
                />
                <textarea
                  rows={2}
                  placeholder="Opis"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs"
                  value={siteSettings.seo_article_metric1_desc || "Sami birate kada radite, koliko dugo ostajete na terenu i kada pravite pauzu."}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric1_desc: e.target.value })}
                />
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Karakteristika 2</label>
                <input
                  type="text"
                  placeholder="Naslov"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                  value={siteSettings.seo_article_metric2_title || "Odlična i Brza Zarada"}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric2_title: e.target.value })}
                />
                <textarea
                  rows={2}
                  placeholder="Opis"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs"
                  value={siteSettings.seo_article_metric2_desc || "Mogućnost ostvarivanja zarade i preko 150.000 RSD mesečno uz redovne isplate na svakih 15 dana."}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric2_desc: e.target.value })}
                />
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Karakteristika 3</label>
                <input
                  type="text"
                  placeholder="Naslov"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold"
                  value={siteSettings.seo_article_metric3_title || "Puna Podrška Mentora"}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric3_title: e.target.value })}
                />
                <textarea
                  rows={2}
                  placeholder="Opis"
                  className="w-full px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs"
                  value={siteSettings.seo_article_metric3_desc || "Deliverix platforma vam pruža besplatnu obuku i savetovanje kako biste odmah krenuli uspešno."}
                  onChange={e => setSiteSettings({ ...siteSettings, seo_article_metric3_desc: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEKCIJA 7: DONJI CTA, KONTAKT & NAPOMENA */}
        <div className="space-y-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Phone className="w-4 h-4" /> Sekcija: Donji Poziv na Akciju (CTA) & Napomene
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Glavni naslov (Donji CTA)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={siteSettings.footer_cta_title || 'Započni svoju dostavljačku karijeru danas'}
                onChange={e => setSiteSettings({ ...siteSettings, footer_cta_title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Telefon za podršku (Support Phone)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold font-mono"
                value={siteSettings.support_phone || '+381 60 123 4567'}
                onChange={e => setSiteSettings({ ...siteSettings, support_phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Tekst / Podnaslov donjeg CTA-a</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm leading-relaxed"
              value={siteSettings.footer_cta_desc || 'Nemoj odlagati priliku za odličnu zaradu i potpunu slobodu. Registracija te ništa ne košta i ne obavezuje te ni na šta. Pomažemo ti oko celog procesa besplatno.'}
              onChange={e => setSiteSettings({ ...siteSettings, footer_cta_desc: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Pravna Napomena (Disclaimer na dnu)</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-500 leading-relaxed"
              value={siteSettings.footer_disclaimer || 'Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne.'}
              onChange={e => setSiteSettings({ ...siteSettings, footer_disclaimer: e.target.value })}
            />
          </div>
        </div>

        {/* SEKCIJA 6: POZIVI NA AKCIJU (CTA DUGMAD) & PLATFORME */}
        <div className="space-y-6 p-4 sm:p-6 bg-sky-50/25 rounded-2xl border border-sky-100">
          <h4 className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-sky-100/50 pb-2">
            <Sparkles className="w-4 h-4" /> Uređivanje CTA Dugmadi i Tabova Platformi
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CTA Dugmad Grupa */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Tekstovi na dugmadima (CTA)</h5>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Glavni Hero CTA (Započni prijavu)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_hero_cta || ''}
                  placeholder="npr. Započni prijavu odmah"
                  onChange={e => setSiteSettings({ ...siteSettings, button_hero_cta: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Sporedni Hero CTA (Kako funkcioniše)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_hero_secondary_cta || ''}
                  placeholder="npr. Kako funkcioniše?"
                  onChange={e => setSiteSettings({ ...siteSettings, button_hero_secondary_cta: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Dugme u zaglavlju (Prijavi se)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_header_apply || ''}
                  placeholder="npr. Prijavi se"
                  onChange={e => setSiteSettings({ ...siteSettings, button_header_apply: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Dugme za praćenje prijave (Header)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_header_portal || ''}
                  placeholder="npr. Prati prijavu"
                  onChange={e => setSiteSettings({ ...siteSettings, button_header_portal: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">CTA u sekciji Uslovi</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_requirements_cta || ''}
                  placeholder="npr. Započni besplatnu prijavu"
                  onChange={e => setSiteSettings({ ...siteSettings, button_requirements_cta: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">CTA u sekciji Blog (Poseti naš blog)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_blog_cta || ''}
                  placeholder="npr. Poseti naš blog"
                  onChange={e => setSiteSettings({ ...siteSettings, button_blog_cta: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">CTA u podnožju (Footer)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                  value={siteSettings.button_footer_cta || ''}
                  placeholder="npr. Započni prijavu odmah (Traje 1 min)"
                  onChange={e => setSiteSettings({ ...siteSettings, button_footer_cta: e.target.value })}
                />
              </div>
            </div>

            {/* Platforme Tabovi Grupa */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-wider text-sky-700">Wolt & Glovo Tabovi na vrhu</h5>

              <div className="p-3 bg-white/60 border border-gray-150 rounded-xl space-y-3">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase">Wolt podešavanja</span>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Naslov platforme</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    value={siteSettings.button_wolt_title || ''}
                    placeholder="Wolt"
                    onChange={e => setSiteSettings({ ...siteSettings, button_wolt_title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Oznaka / Značka</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    value={siteSettings.button_wolt_badge || ''}
                    placeholder="Aktivno / Prijavi se"
                    onChange={e => setSiteSettings({ ...siteSettings, button_wolt_badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Opis podnaslov</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                    value={siteSettings.button_wolt_desc || ''}
                    placeholder="Isplate na 15 dana. Fleksibilno vreme."
                    onChange={e => setSiteSettings({ ...siteSettings, button_wolt_desc: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-3 bg-white/60 border border-gray-150 rounded-xl space-y-3">
                <span className="text-[10px] font-extrabold text-amber-600 uppercase">Glovo podešavanja</span>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Naslov platforme</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    value={siteSettings.button_glovo_title || ''}
                    placeholder="Glovo"
                    onChange={e => setSiteSettings({ ...siteSettings, button_glovo_title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Oznaka / Značka</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    value={siteSettings.button_glovo_badge || ''}
                    placeholder="Uskoro / Rezerviši mesto"
                    onChange={e => setSiteSettings({ ...siteSettings, button_glovo_badge: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Opis podnaslov</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                    value={siteSettings.button_glovo_desc || ''}
                    placeholder="Uskoro krećemo! Prijavi se i osiguraj mesto."
                    onChange={e => setSiteSettings({ ...siteSettings, button_glovo_desc: e.target.value })}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>


        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
          >
            Sačuvaj izmene delova sajta
          </button>
        </div>
      </form>
    </div>
  );
}

interface FaqTabFormProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
}

export function FaqTabForm({
  siteSettings,
  setSiteSettings,
  onSave
 }: FaqTabFormProps) {
  // Automatski inicijalizuj prazna ili nedefinisana polja sa podrazumevanim vrednostima sa sajta
  React.useEffect(() => {
    if (!siteSettings.faqs || siteSettings.faqs.length === 0) {
      setSiteSettings((prev: any) => ({
        ...prev,
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
        ]
      }));
    }
  }, []);

  const faqs = (siteSettings.faqs && siteSettings.faqs.length > 0)
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

  const handleUpdateFaq = (index: number, field: 'q' | 'a', val: string) => {
    const updated = [...faqs];
    if (!updated[index]) {
      updated[index] = { q: '', a: '' };
    }
    updated[index] = { ...updated[index], [field]: val };
    setSiteSettings({ ...siteSettings, faqs: updated });
  };

  const handleAddFaq = () => {
    setSiteSettings({ ...siteSettings, faqs: [...faqs, { q: '', a: '' }] });
  };

  const handleRemoveFaq = (index: number) => {
    setSiteSettings({ ...siteSettings, faqs: faqs.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm w-full" id="faq-tab-form-root">
      <form onSubmit={onSave} className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
          <div>
            <h3 className="text-lg font-black text-gray-900">Uređivanje Čestih Pitanja (FAQ)</h3>
            <p className="text-xs text-gray-400 mt-0.5">Dodajte ili menjajte pitanja i odgovore na sajtu kako biste smanjili upite podršci.</p>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Dodaj FAQ
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Naslov FAQ Sekcije</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
              value={siteSettings.faq_title || 'Česta Pitanja (FAQ)'}
              onChange={e => setSiteSettings({ ...siteSettings, faq_title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Podnaslov FAQ Sekcije</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
              value={siteSettings.faq_subtitle || 'Sve što te interesuje na jednom mestu, jasno i transparentno'}
              onChange={e => setSiteSettings({ ...siteSettings, faq_subtitle: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50/50 rounded-xl border border-gray-150 space-y-3 relative group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-sky-600 uppercase">Pitanje #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-150 transition cursor-pointer"
                  title="Obriši pitanje"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tekst pitanja</label>
                <input
                  type="text"
                  required
                  placeholder="npr. Da li je potrebna vaša oprema?"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                  value={faq.q || ''}
                  onChange={e => handleUpdateFaq(idx, 'q', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Odgovor na pitanje</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Upišite detaljan odgovor..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 leading-relaxed"
                  value={faq.a || ''}
                  onChange={e => handleUpdateFaq(idx, 'a', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
          >
            Sačuvaj česta pitanja (FAQ)
          </button>
        </div>
      </form>
    </div>
  );
}
