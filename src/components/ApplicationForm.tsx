import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  MapPin, 
  Bike, 
  Car, 
  Zap, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';
import ScooterIcon from './ScooterIcon';

interface ApplicationFormProps {
  onSuccess: () => void;
  onClose?: () => void;
  referralCode?: string;
  source?: string;
}

const GRAD_OPTIONS = [
  'Beograd',
  'Novi Sad',
  'Niš',
  'Kragujevac',
  'Subotica',
  'Zrenjanin',
  'Čačak',
  'Kraljevo',
  'Kruševac',
  'Valjevo',
  'Užice',
  'Smederevo',
  'Ostali gradovi u Srbiji'
];

const ACTIVE_CITIES = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac'];

export default function ApplicationForm({ onSuccess, onClose, referralCode = '', source = 'direct' }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    ime: '',
    telefon: '',
    grad: '',
    customGrad: '',
    vozilo: 'bicikl',
    iskustvo: 'ne',
    kada_poceti: 'odmah'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedCity, setSubmittedCity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validacija telefona (mora biti bar 9 karaktera, samo brojevi, plus ili kosa crta)
    const telClean = formData.telefon.replace(/[\s\-]/g, '');
    if (telClean.length < 8) {
      setError('Molimo unesite validan broj telefona sa pozivnim brojem (npr. 061234567).');
      setLoading(false);
      return;
    }

    const konacanGrad = formData.grad === 'Ostali gradovi u Srbiji' && formData.customGrad 
      ? formData.customGrad 
      : formData.grad;

    if (!konacanGrad) {
      setError('Molimo izaberite ili upišite grad.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ime: formData.ime,
          telefon: formData.telefon,
          grad: konacanGrad,
          vozilo: formData.vozilo,
          iskustvo: formData.iskustvo,
          kada_poceti: formData.kada_poceti,
          izvor: source,
          referral_code: referralCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmittedCity(konacanGrad);
        setSuccess(true);
        const isActive = ACTIVE_CITIES.includes(konacanGrad);
        setTimeout(() => {
          onSuccess();
          if (onClose) onClose();
        }, isActive ? 3000 : 9000);
      } else {
        setError(data.error || 'Došlo je do greške prilikom slanja prijave.');
      }
    } catch (err) {
      setError('Problem sa povezivanjem sa serverom. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const isActiveCity = ACTIVE_CITIES.includes(submittedCity);
    return (
      <div className="text-center py-8 px-4" id="form-success-container">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        
        {isActiveCity ? (
          <>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Prijava uspešno poslata!</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Hvala ti na interesovanju za rad. Naš tim će te kontaktirati u najkraćem roku (najčešće u roku od nekoliko sati) putem telefona ili WhatsApp poruke sa daljim koracima.
            </p>
            <div className="bg-deliverix-50 text-deliverix-800 text-xs p-4 rounded-xl max-w-sm mx-auto flex items-start gap-3 text-left border border-deliverix-100">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-deliverix-500" />
              <p className="leading-normal">
                Pripremi ličnu kartu i, ukoliko voziš skuter ili automobil, vozačku dozvolu. Pomoći ćemo ti oko svega besplatno!
              </p>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Prijava uspešno zabeležena!</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Hvala ti na prijavi! Trenutno u gradu <span className="font-extrabold text-deliverix-600">{submittedCity}</span> još uvek nemamo aktivnu saradnju sa kurirskim platformama, ali je tvoja prijava sačuvana u našoj bazi kandidata. Čim se otvori saradnja ili slobodno mesto za tvoj grad, odmah ćemo te kontaktirati!
            </p>
            <div className="bg-amber-50/50 text-amber-800 text-xs p-4 rounded-xl max-w-sm mx-auto flex items-start gap-3 text-left border border-amber-100/50">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <p className="leading-normal">
                Tvoj kontakt je uspešno sačuvan. Bićeš među prvima koje ćemo pozvati kada Deliverix proširi poslovanje na tvoju regiju!
              </p>
            </div>
          </>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              onSuccess();
              if (onClose) onClose();
            }}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl transition cursor-pointer"
          >
            Zatvori prozor
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="candidate-registration-form">
      <div className="text-center pb-2 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900">Brza prijava za rad</h3>
        <p className="text-sm text-gray-500 mt-1">Popuni kratku formu i obezbedi mesto u svom gradu</p>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-800 p-3 rounded-lg text-sm font-medium border border-rose-100" id="form-error-msg">
          {error}
        </div>
      )}

      {/* Ime i Prezime */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <User className="w-4 h-4 text-deliverix-500" /> Ime i prezime
        </label>
        <div className="relative">
          <input
            id="input-fullname"
            type="text"
            required
            className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-deliverix-200 focus:border-deliverix-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-deliverix-200 focus-visible:border-deliverix-500 focus:bg-white text-gray-900 placeholder-gray-400 transition"
            placeholder="Petar Petrović"
            value={formData.ime}
            onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
          />
        </div>
      </div>

      {/* Telefon */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-deliverix-500" /> Telefon / Viber / WhatsApp
        </label>
        <div>
          <input
            id="input-phone"
            type="tel"
            required
            className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-deliverix-200 focus:border-deliverix-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-deliverix-200 focus-visible:border-deliverix-500 focus:bg-white text-gray-900 placeholder-gray-400 transition"
            placeholder="Npr. 061234567 ili +38161234567"
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
          />
          <p className="text-[11px] text-gray-400 mt-1">Bićemo u kontaktu radi dogovora.</p>
        </div>
      </div>

      {/* Grad */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-deliverix-500" /> Grad u kome želiš da radiš
        </label>
        <div className="space-y-3">
          <select
            id="select-city"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-deliverix-200 focus:border-deliverix-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-deliverix-200 focus-visible:border-deliverix-500 focus:bg-white text-gray-900 transition"
            value={formData.grad}
            onChange={(e) => setFormData({ ...formData, grad: e.target.value, customGrad: '' })}
          >
            <option value="">-- Izaberi grad --</option>
            {GRAD_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {formData.grad === 'Ostali gradovi u Srbiji' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <input
                id="input-custom-city"
                type="text"
                required
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-deliverix-200 focus:border-deliverix-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-deliverix-200 focus-visible:border-deliverix-500 focus:bg-white text-gray-900 placeholder-gray-400 transition"
                placeholder="Upiši svoj grad (npr. Zaječar, Kikinda...)"
                value={formData.customGrad}
                onChange={(e) => setFormData({ ...formData, customGrad: e.target.value })}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Vozilo */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-deliverix-500" /> Prevozno sredstvo za rad
        </label>
        <p className="text-xs text-gray-400 mb-2">Izaberi prevozno sredstvo koje planiraš da koristiš za vršenje dostava:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'bicikl', label: 'Bicikl / El. bicikl', sub: 'Dostava biciklom', icon: Bike },
            { id: 'skuter', label: 'Skuter / Motor', sub: 'Dostava skuterom', icon: ScooterIcon },
            { id: 'auto', label: 'Automobil', sub: 'Dostava automobilom', icon: Car }
          ].map((v) => {
            const Icon = v.icon;
            const isSelected = formData.vozilo === v.id;
            return (
              <button
                key={v.id}
                id={`btn-vehicle-${v.id}`}
                type="button"
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                  isSelected 
                    ? 'border-deliverix-500 bg-deliverix-50 text-deliverix-900 ring-4 ring-deliverix-200' 
                    : 'border-gray-150 bg-white hover:bg-gray-50/50 text-gray-700'
                }`}
                onClick={() => setFormData({ ...formData, vozilo: v.id })}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-deliverix-600' : 'text-gray-400'}`} />
                  <span className="text-[11px] sm:text-xs font-black">{v.label}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  {v.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        id="btn-submit-application"
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-deliverix-500 hover:bg-deliverix-600 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-deliverix-600/20 text-white rounded-xl font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-deliverix-500/20 active:translate-y-0.5 transition duration-200 disabled:opacity-50 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-deliverix-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Slanje prijave...
          </>
        ) : (
          <>
            Započni prijavu odmah (Traje 1 min) <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center">
        Pritiskom na dugme dajete saglasnost za kontakt u vezi posla. Vaši podaci su bezbedni i koristiće se isključivo u svrhu organizacije zaposlenja u partnerskoj agenciji. Bez spama i pritiska.
      </p>
    </form>
  );
}
