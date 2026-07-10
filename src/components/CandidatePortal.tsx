import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, 
  Car, 
  Smartphone, 
  Lock, 
  User, 
  MapPin, 
  Calendar, 
  LogOut, 
  RefreshCw, 
  FileCheck, 
  PhoneCall, 
  FileText, 
  Send, 
  UserCheck, 
  Check, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import ScooterIcon from './ScooterIcon';
import { Candidate, CandidateStatus } from '../types';

interface CandidatePortalProps {
  onBack: () => void;
}

const STATUS_STEPS = [
  { status: 'NEW', label: 'Prijava poslata', desc: 'Vaša prijava je uspešno zabeležena u sistemu.' },
  { status: 'CONTACTED', label: 'Kontaktiranje u toku', desc: 'Naš tim vas poziva radi kratkog razgovora i dogovora.' },
  { status: 'DOCUMENTS_PENDING', label: 'Dokumentacija', desc: 'Prikupljanje potrebnih dokumenata za zapošljavanje.' },
  { status: 'SENT_TO_PARTNER', label: 'Prosleđeno partneru', desc: 'Vaša prijava je prosleđena partnerskoj agenciji.' },
  { status: 'REGISTRATION', label: 'Registracija u toku', desc: 'Kreiranje vašeg Wolt dostavljačkog naloga.' },
  { status: 'ACTIVE', label: 'Aktivan dostavljač', desc: 'Čestitamo! Vaš nalog je aktivan i spremni ste za rad!' }
];

export default function CandidatePortal({ onBack }: CandidatePortalProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'dashboard'>('phone');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Simulator state za lakše testiranje OTP-a
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  
  // Profil kandidata
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Provera sesije pri učitavanju
  useEffect(() => {
    const token = localStorage.getItem('candidate_token');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  // Automatsko osvežavanje statusa na 15 sekundi ako je korisnik na dashboardu
  useEffect(() => {
    if (step === 'dashboard') {
      const interval = setInterval(() => {
        const token = localStorage.getItem('candidate_token');
        if (token) {
          silentRefresh(token);
        }
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Učitavanje profila sa servera
  const fetchProfile = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/candidate/profile', {
        headers: {
          'x-candidate-token': token
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfile(data.candidate);
        setStep('dashboard');
      } else {
        localStorage.removeItem('candidate_token');
        setStep('phone');
      }
    } catch (err) {
      setError('Greška pri učitavanju vašeg profila.');
    } finally {
      setLoading(false);
    }
  };

  // Tiho osvežavanje u pozadini bez punog loading spinner-a
  const silentRefresh = async (token: string) => {
    try {
      const response = await fetch('/api/candidate/profile', {
        headers: {
          'x-candidate-token': token
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfile(data.candidate);
      }
    } catch (err) {
      console.error('Silent refresh failed', err);
    }
  };

  // Ručno osvežavanje statusa sa vizuelnim fidbekom
  const handleManualRefresh = async () => {
    const token = localStorage.getItem('candidate_token');
    if (!token) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch('/api/candidate/profile', {
        headers: {
          'x-candidate-token': token
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfile(data.candidate);
        setSuccessMsg('Status prijave je ažuriran!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError('Nije moguće osvežiti podatke.');
      }
    } catch (err) {
      setError('Mrežna greška pri osvežavanju.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Slanje zahteva za OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Molimo unesite broj telefona.');
      return;
    }
    setLoading(true);
    setError(null);
    setSimulatedOtp(null);

    try {
      const response = await fetch('/api/candidate/login-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telefon: phone })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStep('otp');
        if (data.otp) {
          setSimulatedOtp(data.otp);
        }
      } else {
        setError(data.error || 'Došlo je do greške.');
      }
    } catch (err) {
      setError('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  // Verifikacija OTP koda
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Molimo unesite OTP kod.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/candidate/login-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telefon: phone, code: otp })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('candidate_token', data.token);
        fetchProfile(data.token);
      } else {
        setError(data.error || 'Netačan ili istekao OTP kod.');
      }
    } catch (err) {
      setError('Greška prilikom verifikacije koda.');
    } finally {
      setLoading(false);
    }
  };

  // Odjava
  const handleLogout = () => {
    localStorage.removeItem('candidate_token');
    setProfile(null);
    setPhone('');
    setOtp('');
    setSimulatedOtp(null);
    setStep('phone');
  };

  // Određivanje indeksa trenutnog statusa u koracima timeline-a
  const getActiveStepIndex = (status: string) => {
    if (status === 'INACTIVE') return -1;
    return STATUS_STEPS.findIndex(step => step.status === status);
  };

  const activeStepIdx = profile ? getActiveStepIndex(profile.status) : -1;

  // Renderovanje odgovarajuće ikone za vozilo
  const renderVehicleIcon = (vozilo: string, className = "w-5 h-5") => {
    switch (vozilo) {
      case 'automobil': return <Car className={`${className} text-sky-500`} />;
      case 'skuter': return <ScooterIcon className={`${className} text-sky-500`} />;
      default: return <Bike className={`${className} text-sky-500`} />;
    }
  };

  // Renderovanje ikone za korak na timeline-u
  const renderStepIcon = (idx: number, stepStatus: string) => {
    const isCompleted = idx < activeStepIdx;
    const isActive = idx === activeStepIdx;

    if (isCompleted) {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      );
    }

    if (isActive) {
      return (
        <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 z-10 animate-pulse">
          {stepStatus === 'NEW' && <FileCheck className="w-4 h-4" />}
          {stepStatus === 'CONTACTED' && <PhoneCall className="w-4 h-4" />}
          {stepStatus === 'DOCUMENTS_PENDING' && <FileText className="w-4 h-4" />}
          {stepStatus === 'SENT_TO_PARTNER' && <Send className="w-4 h-4" />}
          {stepStatus === 'REGISTRATION' && <Smartphone className="w-4 h-4" />}
          {stepStatus === 'ACTIVE' && <UserCheck className="w-4 h-4" />}
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border border-gray-200 z-10 text-xs font-bold">
        {idx + 1}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4" id="candidate-portal-root">
      
      {/* Zaglavlje / Nazad Akcija */}
      <div className="flex justify-between items-center" id="portal-header">
        <button 
          id="btn-portal-back"
          onClick={onBack}
          className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 rounded-xl transition cursor-pointer flex items-center gap-2"
        >
          &larr; Nazad na početnu
        </button>

        {step === 'dashboard' && (
          <button 
            id="btn-portal-logout"
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Odjavi se
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Unos broja telefona */}
        {step === 'phone' && (
          <motion.div 
            key="phone"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6"
            id="portal-login-phone-card"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Kandidat Portal</h2>
              <p className="text-sm text-gray-500">Unesite broj telefona sa kojim ste se prijavili kako biste pratili status vaše prijave.</p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Broj telefona</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    id="login-phone-input"
                    type="tel" 
                    placeholder="npr. +381 60 1234567" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <button
                id="btn-request-otp"
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white font-black rounded-2xl shadow-lg shadow-sky-500/20 text-center cursor-pointer transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Slanje koda...</span>
                  </>
                ) : (
                  <>
                    <span>Pošalji OTP kod</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: Unos OTP koda */}
        {step === 'otp' && (
          <motion.div 
            key="otp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6"
            id="portal-login-otp-card"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Potvrdite vaš identitet</h2>
              <p className="text-sm text-gray-500">
                Poslat vam je jednokratni OTP kod na broj <strong className="text-gray-800">{phone}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* INTEGRACIONI OTP SIMULATOR - Izuzetno za lakše testiranje u AI Studio */}
            {simulatedOtp && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl space-y-1">
                <p className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-amber-700">
                  <HelpCircle className="w-4 h-4 text-amber-500" /> OTP Simulator (AI Studio)
                </p>
                <p className="text-sm">
                  Simulirani SMS/WhatsApp kod poslat na vaš telefon je: <strong className="text-xl tracking-widest font-mono text-amber-950 font-black block mt-1">{simulatedOtp}</strong>
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Unesite OTP kod</label>
                <input 
                  id="login-otp-input"
                  type="text" 
                  maxLength={6}
                  placeholder="------" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  id="btn-otp-back"
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError(null);
                    setSimulatedOtp(null);
                  }}
                  className="w-1/3 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl text-center cursor-pointer transition text-sm"
                >
                  Nazad
                </button>
                <button
                  id="btn-verify-otp"
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white font-black rounded-2xl shadow-lg shadow-sky-500/20 text-center cursor-pointer transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Potvrdi i uđi</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: Korisnički nalog / Moj status prijave */}
        {step === 'dashboard' && profile && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
            id="portal-dashboard-layout"
          >
            {/* Header i Detalji */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center shadow-xs">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{profile.ime}</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Korisnički nalog kandidata</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Grad</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                      {profile.grad}
                    </span>
                  </div>
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Vozilo</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-0.5 capitalize">
                      {renderVehicleIcon(profile.vozilo, "w-4 h-4 shrink-0")}
                      {profile.vozilo}
                    </span>
                  </div>
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 col-span-2 sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Datum prijave</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                      {new Date(profile.datum_prijave).toLocaleDateString('sr-RS', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status osvežavanja i brze akcije */}
              <div className="flex flex-row md:flex-col justify-between md:justify-center items-end gap-3 shrink-0 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                <button
                  id="btn-portal-refresh"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 disabled:opacity-50 text-sky-700 font-bold rounded-xl transition cursor-pointer flex items-center gap-2 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Osveži status
                </button>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Automatski osvežava</span>
              </div>
            </div>

            {/* Bander za neaktivnog kandidata */}
            {profile.status === CandidateStatus.INACTIVE && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-5 rounded-3xl flex gap-4 items-start shadow-sm animate-fade-in" id="portal-inactive-banner">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-rose-900">Nalog je trenutno neaktivan</p>
                  <p className="text-sm text-rose-700 leading-relaxed">
                    Vaša prijava je arhivirana ili je nalog privremeno deaktiviran. Molimo vas da kontaktirate našu korisničku podršku kako biste dobili detaljnije informacije o sledećim koracima.
                  </p>
                </div>
              </div>
            )}

            {/* Success alert */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2.5 text-sm animate-pulse">
                <Check className="w-4 h-4 stroke-[3] text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Dvodelni raspored: Timeline & Sledeći Koraci */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="portal-dashboard-details">
              
              {/* Levo: Vremenska linija statusa */}
              <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-sky-500" /> Moj Status Prijave
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Pratite trenutnu fazu vaše prijave u realnom vremenu.</p>
                </div>

                {/* TIMELINE RENDER */}
                {profile.status !== CandidateStatus.INACTIVE ? (
                  <div className="relative pl-2 space-y-8 py-2">
                    
                    {/* Linija u pozadini */}
                    <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-gray-100" />

                    {STATUS_STEPS.map((step, idx) => {
                      const isActive = step.status === profile.status;
                      const isCompleted = idx < activeStepIdx;
                      
                      return (
                        <div key={idx} className="flex gap-4 relative">
                          {/* Ikona koraka */}
                          <div className="relative flex justify-center items-start pt-1 shrink-0">
                            {renderStepIcon(idx, step.status)}
                          </div>

                          {/* Sadržaj koraka */}
                          <div className={`space-y-1 rounded-2xl p-4 transition-all duration-300 w-full ${
                            isActive ? 'bg-sky-50/60 border border-sky-100 shadow-xs' : 
                            isCompleted ? 'bg-emerald-50/10' : 'opacity-60'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className={`text-base font-black ${
                                isActive ? 'text-sky-900' :
                                isCompleted ? 'text-emerald-700 font-extrabold' : 'text-gray-500 font-bold'
                              }`}>
                                {step.label}
                              </span>
                              {isActive && (
                                <span className="bg-sky-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                                  Trenutno
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                                  Završeno <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 space-y-2">
                    <AlertCircle className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="font-bold text-gray-500">Istorija statusa nije dostupna</p>
                    <p className="text-xs">Nalog je označen kao neaktivan od strane admina.</p>
                  </div>
                )}
              </div>

              {/* Desno: Dinamični saveti i korisna uputstva na osnovu statusa */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Kartica sa informacijom o trenutnom koraku */}
                <div className="bg-gradient-to-tr from-sky-500 to-sky-600 rounded-3xl p-6 text-white shadow-lg shadow-sky-500/10 space-y-4">
                  <h4 className="font-black text-lg tracking-tight">Korisne informacije</h4>
                  
                  {profile.status === 'NEW' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Zahvaljujemo se na prijavi! Naš tim za podršku vrši inicijalnu proveru prijava. Uskoro ćemo vas kontaktirati na navedeni broj telefona. Držite telefon u blizini.
                    </p>
                  )}
                  {profile.status === 'CONTACTED' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Razgovarali smo ili ćemo vas uskoro pozvati! Pripremite se za sledeću fazu u kojoj ćemo vam objasniti potrebnu dokumentaciju i agencijske uslove.
                    </p>
                  )}
                  {profile.status === 'DOCUMENTS_PENDING' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Potrebno je poslati dokumente kako bismo vas uspešno registrovali. Molimo vas da obezbedite važeću ličnu kartu (min. 18 godina) i vozačku dozvolu (ukoliko vozite automobil ili motor).
                    </p>
                  )}
                  {profile.status === 'SENT_TO_PARTNER' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Vaša prijava je uspešno prosleđena našoj partnerskoj agenciji. Oni će obaviti ugovornu dokumentaciju i pomoći vam oko isplate na svakih 15 dana.
                    </p>
                  )}
                  {profile.status === 'REGISTRATION' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Kreiranje vašeg Wolt naloga je u toku! Dobićete SMS poruku od Wolt-a sa uputstvima za aktivaciju i preuzimanje dostavljačke torbe i opreme u vašem gradu.
                    </p>
                  )}
                  {profile.status === 'ACTIVE' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Nalog je aktivan i oprema je spremna! Možete pokrenuti aplikaciju, izabrati sopstveno radno vreme i početi sa dostavama već danas! Srećan rad!
                    </p>
                  )}
                  {profile.status === 'INACTIVE' && (
                    <p className="text-sm text-sky-50 leading-relaxed">
                      Vaša prijava je privremeno stopirana ili deaktivirana. Ukoliko imate bilo kakvih pitanja, kontaktirajte naš tim za podršku.
                    </p>
                  )}

                  <div className="border-t border-white/20 pt-4 text-xs text-sky-100 flex items-center gap-1">
                    <span>Zadnje ažuriranje:</span>
                    <strong className="text-white">
                      {profile.last_updated_at ? new Date(profile.last_updated_at).toLocaleDateString('sr-RS') : 'Uskoro'}
                    </strong>
                  </div>
                </div>

                {/* FAQ i brza podrška za kandidate */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-4">
                  <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">Brza Podrška</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <p className="text-gray-600 leading-normal">
                        Nema potrebe za stalnim slanjem poruka - čim admin promeni status, on je odmah vidljiv ovde.
                      </p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <p className="text-gray-600 leading-normal">
                        OTP SMS verifikacija štiti vaše podatke od drugih kandidata.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
