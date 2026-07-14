import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX,
  FileText,
  PhoneCall, 
  Send, 
  Search, 
  Filter, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  CheckCircle, 
  Check,
  AlertCircle,  
  ChevronDown, 
  X, 
  Copy, 
  ExternalLink,
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  Loader2,
  Trash2,
  Lock,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  MapPin,
  Bike,
  Car,
  Compass,
  Globe,
  BarChart3,
  Newspaper,
  Calendar,
  Settings,
  Edit,
  Sparkles,
  Upload,
  Image,
  ClipboardList,
  RotateCw
} from 'lucide-react';
import ScooterIcon from './ScooterIcon';
import { Candidate, CandidateStatus, DashboardStats } from '../types';
import { DeliverixLogo } from './DeliverixLogo';
import { SeoTabForm, HeroTabForm, HomepageSectionsTabForm, FaqTabForm } from './AdminSeoSubtabs';

interface AdminDashboardProps {
  appUrl: string;
  onLogoChange?: (style: 'flow' | 'neon' | 'urban' | 'custom', url: string, blendMode?: 'normal' | 'multiply') => void;
  onFooterLogoChange?: (style: 'flow' | 'neon' | 'urban' | 'custom', url: string, blendMode?: 'normal' | 'multiply') => void;
  onLogout?: () => void;
}

export default function AdminDashboard({ appUrl, onLogoChange, onFooterLogoChange, onLogout }: AdminDashboardProps) {
  const [passcode, setPasscode] = useState('');
  const [username, setUsername] = useState('admin');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);
  const [changeError, setChangeError] = useState<string | null>(null);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState<'super_admin' | 'candidate_admin' | 'marketing_admin' | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'candidates' | 'seo_and_blog' | 'design' | 'marketing_analitika' | 'access_management'>('candidates');
  const [activeMarketingSubTab, setActiveMarketingSubTab] = useState<'analytics' | 'blog' | 'seo' | 'link-gen' | 'account'>('analytics');
  
  // Novi subtabovi za visoku organizovanost
  const [candidateSubTab, setCandidateSubTab] = useState<'all' | 'active' | 'completed' | 'stats'>('all');
  const [seoSubTab, setSeoSubTab] = useState<'seo' | 'blog'>('seo');
  const [designSubTab, setDesignSubTab] = useState<'hero' | 'sections' | 'faq'>('hero');
  const [accessSubTab, setAccessSubTab] = useState<'users' | 'teams' | 'email' | 'audit'>('users');

  // Dnevnik aktivnosti (Audit Log) stanje
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [auditLogsError, setAuditLogsError] = useState<string | null>(null);

  const fetchAuditLogs = async (code = passcode) => {
    setLoadingAuditLogs(true);
    setAuditLogsError(null);
    try {
      const response = await fetch('/api/admin/audit-logs', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await response.json();
      if (data.success) {
        setAuditLogs(data.logs || []);
      } else {
        setAuditLogsError(data.error || 'Greška pri učitavanju dnevnika aktivnosti.');
      }
    } catch (err) {
      setAuditLogsError('Došlo je do mrežne greške pri učitavanju dnevnika.');
    } finally {
      setLoadingAuditLogs(false);
    }
  };
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    documentsPendingCount: 0,
    sentToPartnerCount: 0,
    registrationCount: 0,
    activeCount: 0,
    inactiveCount: 0
  });

  // SEO i marketing podešavanja sajta
  const [siteSettings, setSiteSettings] = useState({
    meta_title: '',
    meta_description: '',
    ga_measurement_id: '',
    homepage_subtitle: '',
    announcement_banner: '',
    support_phone: '',
    logo_style: 'flow',
    logo_url: '',
    logo_blend_mode: 'normal',
    footer_logo_style: 'flow',
    footer_logo_url: '',
    footer_logo_blend_mode: 'normal',
    hero_right_mode: 'image',
    hero_image_url: '/src/assets/images/delivery_courier_hero_1783427588712.webp',
    hero_slider_images: [] as string[],
    hero_slider_slides: [] as { image: string; badge_title: string; badge_text: string }[],
    hero_badge_title: 'Dostupno odmah',
    hero_badge_text: 'Pomoć oko zaposlenja je 100% besplatna!',
    hero_image_alt: 'Dostavljač hrane - Wolt Glovo Srbija',
    about_enabled: true,
    about_title: '',
    about_intro: '',
    about_paragraph1: '',
    about_paragraph2: '',
    about_tags: [] as string[],
    rent_bike_enabled: true,
    rent_scooter_enabled: true,
    rent_car_enabled: true,
    hero_title: '',
    hero_platform_title: '',
    why_choose_us_title: '',
    why_choose_us_subtitle: '',
    why_choose_us_items: [] as string[],
    steps_title: '',
    steps_subtitle: '',
    steps: [] as { number: string; title: string; desc: string }[],
    requirements_title: '',
    requirements_subtitle: '',
    requirements: [] as { title: string; desc: string; icon: string }[],
    rent_section_title: '',
    rent_section_text: '',
    faqs: [] as { q: string; a: string }[]
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const [isUploadingHeroSlide, setIsUploadingHeroSlide] = useState(false);
  const [isUploadingBlogImage, setIsUploadingBlogImage] = useState(false);

  // Blog postovi
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null); // null = novi
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: '',
    cover_image: '/assets/images/blog_post_default_cover_1783427588712.webp',
    read_time: '3 min',
    author: 'Deliverix Marketing'
  });

  // Marketing statistika (Anonični pregledi)
  const [marketingStats, setMarketingStats] = useState({
    totalRegistrations: 0,
    byCity: {} as Record<string, number>,
    byVehicle: {} as Record<string, number>,
    bySource: {} as Record<string, number>
  });

  // Filteri
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Detalji o kandidatu / Selektovan kandidat za izmenu napomene
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [noteText, setNoteText] = useState('');
  const [candidateEmailInput, setCandidateEmailInput] = useState('');
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);

  // Upravljanje admin nalozima (Samo za Super Admin)
  const [adminAccounts, setAdminAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState({
    username: '',
    passcode: '',
    role: 'candidate_admin' as 'super_admin' | 'candidate_admin' | 'marketing_admin'
  });
  const [saveAccountLoading, setSaveAccountLoading] = useState(false);
  const [saveAccountError, setSaveAccountError] = useState<string | null>(null);
  const [isSelfSettingsModalOpen, setIsSelfSettingsModalOpen] = useState(false);

  // Email SMTP i slanje države
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'email'>('account');
  const [mailConfig, setMailConfig] = useState({
    smtp_email: '',
    sender_name: '',
    sender_alias: '',
    has_password: false
  });
  const [mailConfigPassword, setMailConfigPassword] = useState('');
  const [saveMailLoading, setSaveMailLoading] = useState(false);
  const [saveMailError, setSaveMailError] = useState<string | null>(null);
  const [saveMailSuccess, setSaveMailSuccess] = useState<string | null>(null);

  // Modal za slanje email-a
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailCandidateSaveEmail, setEmailCandidateSaveEmail] = useState(true); // da li da ažuriramo kandidatov email u bazi
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendEmailError, setSendEmailError] = useState<string | null>(null);
  const [sendEmailSuccess, setSendEmailSuccess] = useState<string | null>(null);

  // Link generator
  const [genSource, setGenSource] = useState('facebook');
  const [genRef, setGenRef] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const fetchAdminAccounts = async (code = passcode) => {
    if (!code) return;
    setAccountsLoading(true);
    setAccountsError(null);
    try {
      const response = await fetch('/api/admin/accounts', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminAccounts(data.accounts || []);
      } else {
        setAccountsError(data.error || 'Greška pri učitavanju admin naloga.');
      }
    } catch (err) {
      setAccountsError('Greška u komunikaciji sa serverom.');
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchMailConfig = async (code = passcode) => {
    if (!code) return;
    try {
      const response = await fetch('/api/admin/mail-config', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMailConfig({
          smtp_email: data.smtp_email || '',
          sender_name: data.sender_name || '',
          sender_alias: data.sender_alias || '',
          has_password: data.has_password || false
        });
      }
    } catch (err) {
      console.error('Greška pri dohvatanju email podešavanja:', err);
    }
  };

  const handleSaveMailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMailLoading(true);
    setSaveMailError(null);
    setSaveMailSuccess(null);
    try {
      const response = await fetch('/api/admin/mail-config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          smtp_email: mailConfig.smtp_email,
          smtp_password: mailConfigPassword,
          sender_name: mailConfig.sender_name,
          sender_alias: mailConfig.sender_alias
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSaveMailSuccess('Email podešavanja su uspešno sačuvana!');
        setMailConfigPassword(''); // očisti lozinku nakon čuvanja
        fetchMailConfig(passcode); // osveži status
      } else {
        setSaveMailError(data.error || 'Greška pri čuvanju email podešavanja.');
      }
    } catch (err) {
      setSaveMailError('Sistemska greška pri čuvanju email podešavanja.');
    } finally {
      setSaveMailLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo || !emailSubject || !emailBody) {
      setSendEmailError('Sva polja su obavezna.');
      return;
    }
    setIsSendingEmail(true);
    setSendEmailError(null);
    setSendEmailSuccess(null);
    try {
      const response = await fetch('/api/admin/send-candidate-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          candidateId: emailCandidate?.id,
          to: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSendEmailSuccess('Email je uspešno poslat kandidatu!');
        
        // Ako je označeno "Ažuriraj email u profilu", pošalji i PATCH zahtev za email
        if (emailCandidate && emailCandidateSaveEmail && emailTo !== emailCandidate.email) {
          await fetch(`/api/candidates/${emailCandidate.id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-passcode': passcode
            },
            body: JSON.stringify({
              email: emailTo
            })
          });
        }
        
        // Lokalno osvežavanje stanja kandidata
        const updatedList = candidates.map(c => {
          if (c.id === emailCandidate?.id) {
            const dateStr = new Date().toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
            const logLine = `\n[SISTEM - ${dateStr} u ${timeStr}] Poslat email na ${emailTo} sa naslovom "${emailSubject}".`;
            const currentNapomena = c.napomena || '';
            return {
              ...c,
              email: emailCandidateSaveEmail ? emailTo : (c.email || ''),
              status: c.status === CandidateStatus.NEW ? CandidateStatus.CONTACTED : c.status,
              napomena: currentNapomena ? `${currentNapomena}${logLine}` : logLine.trim()
            };
          }
          return c;
        });
        setCandidates(updatedList);
        calculateStats(updatedList);

        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailCandidate(null);
          setSendEmailSuccess(null);
        }, 1500);
      } else {
        setSendEmailError(data.error || 'Greška pri slanju email-a.');
      }
    } catch (err) {
      setSendEmailError('Sistemska greška pri slanju email-a.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Provera da li je lozinka već sačuvana u localStorage
  useEffect(() => {
    const savedPasscode = localStorage.getItem('admin_passcode');
    const savedUsername = localStorage.getItem('admin_username') || 'admin';
    if (savedPasscode) {
      setPasscode(savedPasscode);
      setUsername(savedUsername);
      verifyPasscodeWithCredentials(savedUsername, savedPasscode);
    }
  }, []);

  const verifyPasscodeWithCredentials = async (user: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload = user ? { username: user, password: pass } : { passcode: pass };
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthorized(true);
        setAdminRole(data.role);
        
        const codeToVerify = data.passcode || pass;
        setPasscode(codeToVerify);
        localStorage.setItem('admin_passcode', codeToVerify);
        
        if (data.username) {
          setUsername(data.username);
          setNewUsername(data.username);
          localStorage.setItem('admin_username', data.username);
        }
        setNewPassword(codeToVerify);

        // Postavi podrazumevani tab na osnovu uloge
        if (data.role === 'marketing_admin') {
          setActiveAdminTab('seo_and_blog');
        } else {
          setActiveAdminTab('candidates');
        }

        // Dohvati podatke na osnovu uloge
        if (data.role !== 'marketing_admin') {
          fetchCandidates(codeToVerify);
        }
        if (data.role === 'super_admin' || data.role === 'marketing_admin') {
          fetchSeoSettings(codeToVerify);
          fetchBlogPosts(codeToVerify);
          fetchMarketingAnalytics(codeToVerify);
        }
        if (data.role === 'super_admin') {
          fetchAdminAccounts(codeToVerify);
          fetchMailConfig(codeToVerify);
          fetchAuditLogs(codeToVerify);
        }
      } else {
        setError(data.error || 'Pogrešna lozinka.');
        setIsAuthorized(false);
        setAdminRole(null);
        localStorage.removeItem('admin_passcode');
        localStorage.removeItem('admin_username');
      }
    } catch (err) {
      setError('Sistemska greška pri autorizaciji.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Lozinka je obavezna.');
      return;
    }
    verifyPasscodeWithCredentials(username, passcode);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setAdminRole(null);
    setPasscode('');
    localStorage.removeItem('admin_passcode');
    localStorage.removeItem('admin_username');
    setCandidates([]);
    if (onLogout) {
      onLogout();
    }
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      setChangeError('Korisničko ime i lozinka su obavezni.');
      return;
    }
    setChangeLoading(true);
    setChangeError(null);
    setChangeSuccess(null);
    try {
      const response = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ newUsername, newPassword })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setChangeSuccess('Kredencijali su uspešno promenjeni! Za 3 sekunde ćete biti odjavljeni kako biste se ponovo prijavili sa novim podacima.');
        setPasscode(data.newPasscode);
        localStorage.setItem('admin_passcode', data.newPasscode);
        localStorage.setItem('admin_username', newUsername);
        setTimeout(() => {
          handleLogout();
          setChangeSuccess(null);
        }, 3000);
      } else {
        setChangeError(data.error || 'Greška pri promeni kredencijala.');
      }
    } catch (err) {
      setChangeError('Sistemska greška pri komunikaciji sa serverom.');
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSaveAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.username || !accountForm.passcode || !accountForm.role) {
      setSaveAccountError('Sva polja su obavezna.');
      return;
    }
    setSaveAccountLoading(true);
    setSaveAccountError(null);
    try {
      const url = editingAccountId 
        ? `/api/admin/accounts/${editingAccountId}` 
        : '/api/admin/accounts';
      const method = editingAccountId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify(accountForm)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsAccountModalOpen(false);
        setEditingAccountId(null);
        setAccountForm({ username: '', passcode: '', role: 'candidate_admin' });
        fetchAdminAccounts(); // Ponovo učitaj listu
      } else {
        setSaveAccountError(data.error || 'Greška pri čuvanju naloga.');
      }
    } catch (err) {
      setSaveAccountError('Sistemska greška u komunikaciji sa serverom.');
    } finally {
      setSaveAccountLoading(false);
    }
  };

  const handleDeleteAdminAccount = async (id: string) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj administratorski nalog?')) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchAdminAccounts(); // Ponovo učitaj listu
      } else {
        alert(data.error || 'Greška pri brisanju naloga.');
      }
    } catch (err) {
      alert('Sistemska greška pri brisanju naloga.');
    }
  };

  const handleOpenCreateAccount = () => {
    setEditingAccountId(null);
    setAccountForm({ username: '', passcode: '', role: 'candidate_admin' });
    setSaveAccountError(null);
    setIsAccountModalOpen(true);
  };

  const handleOpenEditAccount = (acc: any) => {
    setEditingAccountId(acc.id);
    setAccountForm({
      username: acc.username || '',
      passcode: acc.passcode || '',
      role: acc.role || 'candidate_admin'
    });
    setSaveAccountError(null);
    setIsAccountModalOpen(true);
  };

  const fetchSeoSettings = async (code = passcode) => {
    try {
      const res = await fetch('/api/marketing/seo', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSiteSettings({
          meta_title: data.settings.meta_title || '',
          meta_description: data.settings.meta_description || '',
          ga_measurement_id: data.settings.ga_measurement_id || '',
          homepage_subtitle: data.settings.homepage_subtitle || '',
          announcement_banner: data.settings.announcement_banner || '',
          support_phone: data.settings.support_phone || '',
          logo_style: data.settings.logo_style || 'flow',
          logo_url: data.settings.logo_url || '',
          logo_blend_mode: data.settings.logo_blend_mode || 'normal',
          footer_logo_style: data.settings.footer_logo_style || 'flow',
          footer_logo_url: data.settings.footer_logo_url || '',
          footer_logo_blend_mode: data.settings.footer_logo_blend_mode || 'normal',
          hero_right_mode: data.settings.hero_right_mode || 'image',
          hero_image_url: data.settings.hero_image_url || '/src/assets/images/delivery_courier_hero_1783427588712.webp',
          hero_slider_images: data.settings.hero_slider_images || [],
          hero_slider_slides: data.settings.hero_slider_slides || (data.settings.hero_slider_images || []).map((img: string) => ({
            image: img,
            badge_title: data.settings.hero_badge_title || 'Dostupno odmah',
            badge_text: data.settings.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
          })),
          hero_badge_title: data.settings.hero_badge_title || 'Dostupno odmah',
          hero_badge_text: data.settings.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!',
          hero_image_alt: data.settings.hero_image_alt || 'Dostavljač hrane - Wolt Glovo Srbija',
          rent_bike_enabled: data.settings.rent_bike_enabled !== false,
          rent_scooter_enabled: data.settings.rent_scooter_enabled !== false,
          rent_car_enabled: data.settings.rent_car_enabled !== false,
          hero_title: data.settings.hero_title || '',
          hero_platform_title: data.settings.hero_platform_title || '',
          why_choose_us_title: data.settings.why_choose_us_title || '',
          why_choose_us_subtitle: data.settings.why_choose_us_subtitle || '',
          why_choose_us_items: data.settings.why_choose_us_items || [],
          steps_title: data.settings.steps_title || '',
          steps_subtitle: data.settings.steps_subtitle || '',
          steps: data.settings.steps || [],
          requirements_title: data.settings.requirements_title || '',
          requirements_subtitle: data.settings.requirements_subtitle || '',
          requirements: data.settings.requirements || [],
          rent_section_title: data.settings.rent_section_title || '',
          rent_section_text: data.settings.rent_section_text || '',
          faqs: data.settings.faqs || []
        });
      }
    } catch (err) {
      console.error('Greška pri preuzimanju SEO:', err);
    }
  };

  const fetchBlogPosts = async (code = passcode) => {
    try {
      const res = await fetch('/api/blog-posts', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setBlogPosts(data.posts);
      }
    } catch (err) {
      console.error('Greška pri preuzimanju blogova:', err);
    }
  };

  const fetchMarketingAnalytics = async (code = passcode) => {
    try {
      const res = await fetch('/api/marketing/analytics', {
        headers: { 'x-admin-passcode': code }
      });
      const data = await res.json();
      if (data.success && data.analytics) {
        setMarketingStats(data.analytics);
      }
    } catch (err) {
      console.error('Greška pri preuzimanju analitike:', err);
    }
  };

  const fetchCandidates = async (code = passcode) => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidates', {
        method: 'GET',
        headers: { 'x-admin-passcode': code }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const fetchedCandidates: Candidate[] = data.candidates || [];
        setCandidates(fetchedCandidates);
        calculateStats(fetchedCandidates);
      } else {
        setError(data.error || 'Greška pri učitavanju kandidata.');
      }
    } catch (err) {
      setError('Nije moguće uspostaviti vezu sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list: Candidate[]) => {
    const total = list.length;
    const newCount = list.filter(c => c.status === CandidateStatus.NEW).length;
    const contactedCount = list.filter(c => c.status === CandidateStatus.CONTACTED).length;
    const documentsPendingCount = list.filter(c => c.status === CandidateStatus.DOCUMENTS_PENDING).length;
    const sentToPartnerCount = list.filter(c => c.status === CandidateStatus.SENT_TO_PARTNER).length;
    const registrationCount = list.filter(c => c.status === CandidateStatus.REGISTRATION).length;
    const activeCount = list.filter(c => c.status === CandidateStatus.ACTIVE).length;
    const inactiveCount = list.filter(c => c.status === CandidateStatus.INACTIVE).length;

    setStats({
      total,
      newCount,
      contactedCount,
      documentsPendingCount,
      sentToPartnerCount,
      registrationCount,
      activeCount,
      inactiveCount
    });
  };

  const updateCandidate = async (id: string, newStatus?: CandidateStatus, newNapomena?: string, newEmail?: string) => {
    setUpdatingCandidateId(id);
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          status: newStatus,
          napomena: newNapomena,
          email: newEmail
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Lokalno ažuriranje kandidata za brz UI odgovor
        const updatedList = candidates.map(c => {
          if (c.id === id) {
            return {
              ...c,
              ...(newStatus !== undefined && { status: newStatus }),
              ...(newNapomena !== undefined && { napomena: newNapomena }),
              ...(newEmail !== undefined && { email: newEmail })
            };
          }
          return c;
        });
        setCandidates(updatedList);
        calculateStats(updatedList);
        
        if (selectedCandidate && selectedCandidate.id === id) {
          setSelectedCandidate({
            ...selectedCandidate,
            ...(newStatus !== undefined && { status: newStatus }),
            ...(newNapomena !== undefined && { napomena: newNapomena }),
            ...(newEmail !== undefined && { email: newEmail })
          });
        }
      } else {
        alert(data.error || 'Greška pri ažuriranju kandidata.');
      }
    } catch (err) {
      alert('Sistemska greška pri povezivanju sa serverom.');
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  // Generisanje linka za praćenje
  useEffect(() => {
    const base = appUrl || window.location.origin;
    let url = `${base}?source=${encodeURIComponent(genSource)}`;
    if (genRef) {
      url += `&ref=${encodeURIComponent(genRef)}`;
    }
    setGeneratedLink(url);
    setLinkCopied(false);
  }, [genSource, genRef, appUrl]);

  const copyGeneratedLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingPostId;
      const endpoint = isEdit ? `/api/blog-posts/${editingPostId}` : '/api/blog-posts';
      const method = isEdit ? 'PATCH' : 'POST';

      const parsedTags = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean);

      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode 
        },
        body: JSON.stringify({
          title: blogForm.title,
          slug: blogForm.slug || undefined,
          summary: blogForm.summary,
          content: blogForm.content,
          tags: parsedTags,
          cover_image: blogForm.cover_image,
          read_time: blogForm.read_time,
          author: blogForm.author
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsBlogModalOpen(false);
        setEditingPostId(null);
        setBlogForm({
          title: '',
          slug: '',
          summary: '',
          content: '',
          tags: '',
          cover_image: '/assets/images/blog_post_default_cover_1783427588712.webp',
          read_time: '3 min',
          author: 'Deliverix Marketing'
        });
        fetchBlogPosts();
      } else {
        alert(data.error || 'Greška pri čuvanju članka.');
      }
    } catch (err) {
      alert('Sistemska greška pri čuvanju članka.');
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj članak?')) return;
    try {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchBlogPosts();
      } else {
        alert(data.error || 'Greška pri brisanju članka.');
      }
    } catch (err) {
      alert('Sistemska greška pri brisanju članka.');
    }
  };

  const handleEditBlogPostClick = (post: any) => {
    setEditingPostId(post.id);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      cover_image: post.cover_image,
      read_time: post.read_time || '3 min',
      author: post.author || 'Deliverix Marketing'
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveSeoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/marketing/seo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode 
        },
        body: JSON.stringify(siteSettings)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Podešavanja su uspešno sačuvana!');
        if (onLogoChange) {
          onLogoChange((siteSettings.logo_style as any) || 'flow', siteSettings.logo_url || '', (siteSettings.logo_blend_mode as any) || 'normal');
        }
        if (onFooterLogoChange) {
          onFooterLogoChange((siteSettings.footer_logo_style as any) || 'flow', siteSettings.footer_logo_url || '', (siteSettings.footer_logo_blend_mode as any) || 'normal');
        }
      } else {
        alert(data.error || 'Greška pri čuvanju podešavanja.');
      }
    } catch (err) {
      alert('Sistemska greška pri čuvanju podešavanja.');
    }
  };

  const resizeImage = (
    base64Str: string,
    maxDimension: number = 600,
    format: string = 'image/png',
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(format, format === 'image/png' ? undefined : quality));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      let base64String = reader.result as string;
      try {
        // Automatska kompresija i promena veličine slike na klijentskoj strani
        base64String = await resizeImage(base64String, 600);

        const response = await fetch('/api/marketing/upload-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-passcode': passcode
          },
          body: JSON.stringify({ logoData: base64String })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSiteSettings(prev => ({ ...prev, logo_url: data.logoUrl }));
          if (onLogoChange) {
            onLogoChange('custom', data.logoUrl, (siteSettings.logo_blend_mode as any) || 'normal');
          }
        } else {
          alert(data.error || 'Greška pri otpremanju slike.');
        }
      } catch (err) {
        console.error('Greška pri uploadu:', err);
        alert('Došlo je do greške prilikom povezivanja sa serverom.');
      } finally {
        setIsUploadingLogo(false);
      }
    };
    reader.onerror = () => {
      alert('Greška pri čitanju fajla.');
      setIsUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFooterLogo(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      let base64String = reader.result as string;
      try {
        // Automatska kompresija i promena veličine slike na klijentskoj strani
        base64String = await resizeImage(base64String, 600);

        const response = await fetch('/api/marketing/upload-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-passcode': passcode
          },
          body: JSON.stringify({ logoData: base64String, type: 'footer' })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSiteSettings(prev => ({ ...prev, footer_logo_url: data.logoUrl }));
          if (onFooterLogoChange) {
            onFooterLogoChange('custom', data.logoUrl, (siteSettings.footer_logo_blend_mode as any) || 'normal');
          }
        } else {
          alert(data.error || 'Greška pri otpremanju slike za podnožje.');
        }
      } catch (err) {
        console.error('Greška pri uploadu logotipa za podnožje:', err);
        alert('Došlo je do greške prilikom povezivanja sa serverom.');
      } finally {
        setIsUploadingFooterLogo(false);
      }
    };
    reader.onerror = () => {
      alert('Greška pri čitanju fajla.');
      setIsUploadingFooterLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      let base64String = reader.result as string;
      try {
        base64String = await resizeImage(base64String, 1600, 'image/jpeg', 0.85);
        setSiteSettings(prev => ({ ...prev, hero_image_url: base64String }));
      } catch (err) {
        console.error('Greška pri uploadu hero slike:', err);
        alert('Došlo je do greške prilikom obrade slike.');
      } finally {
        setIsUploadingHeroImage(false);
      }
    };
    reader.onerror = () => {
      alert('Greška pri čitanju fajla.');
      setIsUploadingHeroImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroSlide(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      let base64String = reader.result as string;
      try {
        base64String = await resizeImage(base64String, 1600, 'image/jpeg', 0.85);
        setSiteSettings(prev => {
          const currentSlides = prev.hero_slider_slides && prev.hero_slider_slides.length > 0
            ? [...prev.hero_slider_slides]
            : (prev.hero_slider_images || []).map(img => ({
                image: img,
                badge_title: prev.hero_badge_title || 'Dostupno odmah',
                badge_text: prev.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
              }));

          const newSlide = {
            image: base64String,
            badge_title: prev.hero_badge_title || 'Dostupno odmah',
            badge_text: prev.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
          };

          const updatedSlides = [...currentSlides, newSlide];
          return {
            ...prev,
            hero_slider_images: updatedSlides.map(s => s.image),
            hero_slider_slides: updatedSlides
          };
        });
      } catch (err) {
        console.error('Greška pri uploadu slajda:', err);
        alert('Došlo je do greške prilikom obrade slike.');
      } finally {
        setIsUploadingHeroSlide(false);
      }
    };
    reader.onerror = () => {
      alert('Greška pri čitanju fajla.');
      setIsUploadingHeroSlide(false);
    };
    reader.readAsDataURL(file);
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBlogImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      let base64String = reader.result as string;
      try {
        base64String = await resizeImage(base64String, 1200, 'image/jpeg', 0.85);
        setBlogForm(prev => ({ ...prev, cover_image: base64String }));
      } catch (err) {
        console.error('Greška pri uploadu slike za blog:', err);
        alert('Došlo je do greške prilikom obrade slike.');
      } finally {
        setIsUploadingBlogImage(false);
      }
    };
    reader.onerror = () => {
      alert('Greška pri čitanju fajla.');
      setIsUploadingBlogImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveHeroSlide = (index: number) => {
    setSiteSettings(prev => {
      const remainingImages = (prev.hero_slider_images || []).filter((_, i) => i !== index);
      const remainingSlides = (prev.hero_slider_slides || []).filter((_, i) => i !== index);
      return {
        ...prev,
        hero_slider_images: remainingImages,
        hero_slider_slides: remainingSlides
      };
    });
  };

  const handleUpdateSlideText = (idx: number, field: 'badge_title' | 'badge_text', value: string) => {
    setSiteSettings(prev => {
      const currentSlides = prev.hero_slider_slides && prev.hero_slider_slides.length > 0
        ? [...prev.hero_slider_slides]
        : (prev.hero_slider_images || []).map(img => ({
            image: img,
            badge_title: prev.hero_badge_title || 'Dostupno odmah',
            badge_text: prev.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
          }));

      if (!currentSlides[idx]) {
        currentSlides[idx] = {
          image: prev.hero_slider_images?.[idx] || '',
          badge_title: prev.hero_badge_title || 'Dostupno odmah',
          badge_text: prev.hero_badge_text || 'Pomoć oko zaposlenja je 100% besplatna!'
        };
      }
      currentSlides[idx] = {
        ...currentSlides[idx],
        [field]: value
      };
      return {
        ...prev,
        hero_slider_slides: currentSlides
      };
    });
  };

  // Generisanje predefinisane WhatsApp poruke
  const getWhatsAppLink = (candidate: Candidate) => {
    // Čišćenje telefona
    let cleanedPhone = candidate.telefon.replace(/[\s\-\+\/]/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '381' + cleanedPhone.substring(1);
    } else if (!cleanedPhone.startsWith('381') && cleanedPhone.length === 9) {
      cleanedPhone = '381' + cleanedPhone;
    }

    const tipVozila = candidate.vozilo === 'bicikl' ? 'biciklom' : (candidate.vozilo === 'skuter' ? 'skuterom' : 'automobilom');
    const iskustvoTekst = candidate.iskustvo === 'da' ? 'sa iskustvom' : 'bez prethodnog iskustva';

    const poruka = `Zdravo ${candidate.ime}, kontaktiramo te u vezi sa tvojom prijavom za posao dostavljača u gradu ${candidate.grad}. Prijavio si se sa vozilom: ${candidate.vozilo.toUpperCase()}.

Želimo da ti poželimo dobrodošlicu i pomognemo ti da brzo kreneš sa radom. Kada bismo mogli da se čujemo danas za kratke informacije (par minuta)? 😊`;

    return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(poruka)}`;
  };

  const getEmailCopy = (candidate: Candidate) => {
    return `Subject: Prijava za posao dostavljača - ${candidate.ime}

Zdravo ${candidate.ime},

Hvala na prijavi za posao dostavljača u gradu ${candidate.grad} (${candidate.vozilo}).

Mi smo nezavisni portal Postani Dostavljač i obezbedićemo ti besplatno vođenje kroz ceo proces, podršku pri registraciji i povezivanje sa partnerskom agencijom radi početka rada.

Napiši nam kada ti odgovara da se čujemo danas na kratko, ili nam odgovori na ovaj mail sa potvrdom.

Srdačan pozdrav,
Postani Dostavljač Podrška`;
  };

  const getCandidateEmailTemplate = (candidate: Candidate) => {
    const subject = `Prijava za posao dostavljača - ${candidate.ime}`;
    const body = `Zdravo ${candidate.ime},

Hvala na prijavi za posao dostavljača u gradu ${candidate.grad} (${candidate.vozilo}).

Mi smo nezavisni portal Postani Dostavljač i obezbedićemo ti besplatno vođenje kroz ceo proces, podršku pri registraciji i povezivanje sa partnerskom agencijom radi početka rada.

Napiši nam kada ti odgovara da se čujemo danas na kratko, ili nam odgovori na ovaj mail sa potvrdom.

Srdačan pozdrav,
Postani Dostavljač Podrška`;

    return { subject, body };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Sadržaj je kopiran u privremenu memoriju (clipboard).');
  };

  // Eksport podataka u CSV format
  const exportToTSV = () => {
    if (candidates.length === 0) return;
    
    const headers = ['Ime i prezime', 'Telefon', 'Grad', 'Vozilo', 'Iskustvo', 'Kada počinje', 'Datum prijave', 'Status', 'Izvor', 'Referral Code', 'Napomena'];
    const rows = filteredCandidates.map(c => [
      c.ime,
      c.telefon,
      c.grad,
      c.vozilo,
      c.iskustvo,
      c.kada_poceti,
      new Date(c.datum_prijave).toLocaleDateString('sr-RS'),
      c.status,
      c.izvor,
      c.referral_code || '',
      c.napomena || ''
    ]);

    const tsvContent = [
      headers.join('\t'),
      ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join('\t'))
    ].join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dostava_kandidati_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filterovani kandidati
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.ime.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.telefon.includes(searchTerm) || 
                          (c.referral_code && c.referral_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = cityFilter ? c.grad === cityFilter : true;
    const matchesVehicle = vehicleFilter ? c.vozilo === vehicleFilter : true;
    const matchesStatus = statusFilter ? c.status === statusFilter : true;

    // Subtab filtriranje
    let matchesSubTab = true;
    if (candidateSubTab === 'active') {
      matchesSubTab = [
        CandidateStatus.NEW,
        CandidateStatus.CONTACTED,
        CandidateStatus.DOCUMENTS_PENDING,
        CandidateStatus.SENT_TO_PARTNER,
        CandidateStatus.REGISTRATION
      ].includes(c.status);
    } else if (candidateSubTab === 'completed') {
      matchesSubTab = [
        CandidateStatus.ACTIVE,
        CandidateStatus.INACTIVE
      ].includes(c.status);
    }

    return matchesSearch && matchesCity && matchesVehicle && matchesStatus && matchesSubTab;
  });

  // Jedinstveni gradovi iz kandidata radi filtriranja
  const uniqueCities = Array.from(new Set(candidates.map(c => c.grad))).sort();

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12" id="admin-auth-panel">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-sans">Admin Portal</h2>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Prijavite se na Vaš administratorski nalog ili upišite pristupni kod
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Korisničko ime</label>
              <input
                id="admin-username-input"
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-gray-900 text-center font-semibold transition text-sm"
                placeholder="npr. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 text-center">Ukoliko se prijavljujete samo preko lozinke/koda, ostavite polje na "admin".</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Lozinka / Pristupni Kod</label>
              <input
                id="admin-passcode-input"
                type="password"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-gray-900 text-center text-lg font-mono transition"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/10 active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Prijavi se'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 font-mono">
            Ukoliko nemate kredencijale, kontaktirajte tehničku podršku.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin-dashboard-container">
      {/* Gornji panel / Zaglavlje */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Autorizovan</span>
            <span className="text-xs text-gray-400 font-mono uppercase">Uloga: {adminRole === 'super_admin' ? 'Super Admin' : adminRole === 'marketing_admin' ? 'Marketing' : 'Kandidati'}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-1">
            {adminRole === 'marketing_admin' 
              ? 'Službeni Marketing & SEO Panel' 
              : adminRole === 'candidate_admin'
              ? 'Sistem za Upravljanje Kandidatima'
              : 'Deliverix Super-Admin Konzola'}
          </h2>
          <p className="text-gray-500 text-sm">
            {adminRole === 'marketing_admin'
              ? 'Upravljajte SEO podešavanjima, pisanjem bloga, Google analitikom i generisanjem partnerskih linkova.'
              : adminRole === 'candidate_admin'
              ? 'Pratite prijave, ažurirajte statuse i komunicirajte sa dostavljačima.'
              : 'Potpuni pristup bazi kandidata i svim naprednim marketing i SEO opcijama.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {adminRole !== 'marketing_admin' && (
            <>
              <button
                id="admin-refresh-btn"
                onClick={() => fetchCandidates()}
                disabled={loading}
                className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition cursor-pointer flex items-center justify-center disabled:opacity-50"
                title="Osveži bazu"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> : <RefreshCw className="w-5 h-5" />}
              </button>
              <button
                id="admin-export-btn"
                onClick={exportToTSV}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl transition cursor-pointer flex items-center gap-2 text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Izvezi u Excel
              </button>
            </>
          )}
          <button
            onClick={() => {
              setNewUsername(username);
              setNewPassword('');
              setChangeError(null);
              setChangeSuccess(null);
              setIsSelfSettingsModalOpen(true);
            }}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition cursor-pointer flex items-center justify-center"
            title="Podešavanje mog naloga"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-4 py-2.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold rounded-xl text-sm transition cursor-pointer"
          >
            Odjavi se
          </button>
        </div>
      </div>

      {/* Tabovi za prebacivanje između sekcija */}
      {(adminRole === 'super_admin' || adminRole === 'marketing_admin') && (
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl shadow-xs border border-gray-100 gap-2">
          {adminRole === 'super_admin' && (
            <button
              onClick={() => setActiveAdminTab('candidates')}
              className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeAdminTab === 'candidates'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" /> Upravljanje Kandidatima
            </button>
          )}
          <button
            onClick={() => {
              setActiveAdminTab('seo_and_blog');
              setSeoSubTab('seo');
            }}
            className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'seo_and_blog'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Globe className="w-4 h-4" /> SEO
          </button>
          <button
            onClick={() => {
              setActiveAdminTab('design');
              setDesignSubTab('hero');
            }}
            className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'design'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Dizajn
          </button>
          <button
            onClick={() => {
              setActiveAdminTab('marketing_analitika');
              setActiveMarketingSubTab('analytics');
            }}
            className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'marketing_analitika'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Marketing & Analitika
          </button>
          {adminRole === 'super_admin' && (
            <button
              onClick={() => {
                setActiveAdminTab('access_management');
                setAccessSubTab('users');
              }}
              className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeAdminTab === 'access_management'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Upravljanje Pristupom
            </button>
          )}
        </div>
      )}

      {/* KANDIDATI VIEW */}
      {activeAdminTab === 'candidates' && adminRole !== 'marketing_admin' && (
        <>
          {/* Statistika - Brojači */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {[
              { label: 'Novi', count: stats.newCount, color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Users, status: CandidateStatus.NEW },
              { label: 'Kontaktirani', count: stats.contactedCount, color: 'bg-amber-50 text-amber-600 border-amber-100', icon: PhoneCall, status: CandidateStatus.CONTACTED },
              { label: 'Dokumentacija', count: stats.documentsPendingCount, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: FileText, status: CandidateStatus.DOCUMENTS_PENDING },
              { label: 'Poslato', count: stats.sentToPartnerCount, color: 'bg-purple-50 text-purple-600 border-purple-100', icon: Send, status: CandidateStatus.SENT_TO_PARTNER },
              { label: 'Registracija', count: stats.registrationCount, color: 'bg-orange-50 text-orange-600 border-orange-100', icon: Smartphone, status: CandidateStatus.REGISTRATION },
              { label: 'Aktivni', count: stats.activeCount, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: UserCheck, status: CandidateStatus.ACTIVE },
              { label: 'Neaktivni', count: stats.inactiveCount, color: 'bg-rose-50 text-rose-600 border-rose-100', icon: UserX, status: CandidateStatus.INACTIVE },
              { label: 'Ukupno', count: stats.total, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Compass, status: '' }
            ].map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <button
                  key={idx}
                  id={`stat-card-${idx}`}
                  onClick={() => setStatusFilter(card.status)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover:shadow-md ${card.color} ${
                    statusFilter === card.status ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{card.label}</span>
                    <CardIcon className="w-5 h-5 opacity-60" />
                  </div>
                  <p className="text-3xl font-black mt-2">{card.count}</p>
                </button>
              );
            })}
          </div>

          {/* Organizator kandidata subtabovi */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 mt-6 gap-2 w-full shadow-xs">
            {[
              { id: 'all', label: 'Sve Prijave', count: candidates.length, icon: Users },
              { id: 'active', label: 'Aktivni Tok (Novi -> Registracija)', count: candidates.filter(c => ['NEW', 'CONTACTED', 'DOCUMENTS_PENDING', 'SENT_TO_PARTNER', 'REGISTRATION'].includes(c.status)).length, icon: UserCheck },
              { id: 'completed', label: 'Završeni (Aktivni & Neaktivni)', count: candidates.filter(c => ['ACTIVE', 'INACTIVE'].includes(c.status)).length, icon: UserX },
              { id: 'stats', label: 'Statistika i Analitika', count: null, icon: TrendingUp }
            ].map((subTab) => {
              const SubTabIcon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setCandidateSubTab(subTab.id as any);
                    setStatusFilter('');
                  }}
                  className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                    candidateSubTab === subTab.id
                      ? 'bg-white text-sky-600 shadow-md shadow-gray-200/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <SubTabIcon className="w-4 h-4" />
                  <span>{subTab.label}</span>
                  {subTab.count !== null && (
                    <span className="px-2.5 py-0.5 text-xs font-black bg-gray-200 rounded-full text-gray-800">
                      {subTab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {candidateSubTab === 'stats' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fade-in animate-duration-300 w-full" id="candidate-stats-dashboard">
              {/* Card 1: Stopa uspešnosti */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Stopa uspeha zapošljavanja</h4>
                  <p className="text-xs text-gray-400 mt-1">Procenat kandidata koji su uspešno postali aktivni dostavljači.</p>
                </div>
                <div className="my-6 text-center">
                  <span className="text-5xl font-black text-emerald-500 font-sans">
                    {candidates.length > 0 ? ((stats.activeCount / candidates.length) * 100).toFixed(1) : 0}%
                  </span>
                  <div className="w-full bg-gray-100 h-3 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${candidates.length > 0 ? ((stats.activeCount / candidates.length) * 100).toFixed(1) : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span>Ukupno prijava: <strong>{candidates.length}</strong></span>
                  <span>Aktivni dostavljači: <strong>{stats.activeCount}</strong></span>
                </div>
              </div>

              {/* Card 2: Vozila */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Prijave po tipu vozila</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Automobil', count: candidates.filter(c => c.vozilo === 'automobil').length, color: 'bg-blue-500', icon: Car },
                    { label: 'Skuter', count: candidates.filter(c => c.vozilo === 'skuter').length, color: 'bg-amber-500', icon: ScooterIcon || Bike },
                    { label: 'Bicikl', count: candidates.filter(c => c.vozilo === 'bicikl').length, color: 'bg-emerald-500', icon: Bike }
                  ].map((v, i) => {
                    const pct = candidates.length > 0 ? ((v.count / candidates.length) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm font-bold text-gray-700">
                          <span className="flex items-center gap-2">
                            {v.label}
                          </span>
                          <span>{v.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${v.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Gradovi */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Geografska raspodela (Gradovi)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {uniqueCities.map((city, idx) => {
                    const count = candidates.filter(c => c.grad === city).length;
                    const pct = candidates.length > 0 ? ((count / candidates.length) * 100).toFixed(1) : 0;
                    return (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800 text-sm">{city}</span>
                          <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-md">{count} prijava</span>
                        </div>
                        <div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{pct}% od ukupnog broja</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Radno iskustvo i izvori */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Prethodno iskustvo dostavljača</h4>
                <div className="flex gap-4 items-center justify-around h-32">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-sky-500 block">
                      {candidates.filter(c => c.iskustvo === 'da').length}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Sa iskustvom (DA)</span>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-gray-400 block">
                      {candidates.filter(c => c.iskustvo === 'ne').length}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Bez iskustva (NE)</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Izvor prijave (Kanal) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Izvori prijava</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Direktno na sajtu', count: candidates.filter(c => !c.referral_code).length, color: 'bg-indigo-500' },
                    { label: 'Referral kod (Preko preporuke)', count: candidates.filter(c => c.referral_code).length, color: 'bg-emerald-500' }
                  ].map((src, i) => {
                    const pct = candidates.length > 0 ? ((src.count / candidates.length) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-600">
                          <span>{src.label}</span>
                          <span>{src.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${src.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Srednji panel: Filteri */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 w-full">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-sky-500" /> Pretraga i filtriranje kandidata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Pretraga po imenu */}
              <div className="relative md:col-span-2">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Pretraži po imenu, telefonu ili referral kodu..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter po gradu */}
              <select
                id="filter-city"
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-700 font-bold"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">Svi gradovi</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Filter po vozilu */}
              <select
                id="filter-vehicle"
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-700 font-bold"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="">Sva vozila</option>
                <option value="bicikl">Bicikl</option>
                <option value="skuter">Skuter</option>
                <option value="automobil">Automobil</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50">
              <div className="flex gap-2">
                {statusFilter && (
                  <span className="bg-sky-50 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('')} className="hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {cityFilter && (
                  <span className="bg-sky-50 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Grad: {cityFilter}
                    <button onClick={() => setCityFilter('')} className="hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {vehicleFilter && (
                  <span className="bg-sky-50 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Vozilo: {vehicleFilter}
                    <button onClick={() => setVehicleFilter('')} className="hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-sky-50 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Pretraga: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 font-bold">Prikazano: <strong>{filteredCandidates.length}</strong> od ukupno {candidates.length}</p>
            </div>
          </div>

      {/* Glavna lista kandidata */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="candidates-table-card">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-extrabold text-gray-900">Spisak Prijavljenih Kandidata ({filteredCandidates.length})</h2>
          <span className="text-xs text-gray-400">Poredano po datumu (najnovije prvo)</span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium">Nema kandidata koji odgovaraju kriterijumima.</p>
            <button 
              onClick={() => { setSearchTerm(''); setCityFilter(''); setVehicleFilter(''); setStatusFilter(''); }} 
              className="text-sky-500 text-sm underline font-bold mt-1 hover:text-sky-600"
            >
              Poništi sve filtere
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100/30 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Kandidat / Telefon</th>
                  <th className="py-3.5 px-4">Grad / Vozilo</th>
                  <th className="py-3.5 px-4">Iskustvo / Kada može</th>
                  <th className="py-3.5 px-4">Izvor / Ref</th>
                  <th className="py-3.5 px-4">Datum Prijave</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredCandidates.map((candidate) => {
                  const isUpdating = updatingCandidateId === candidate.id;
                  
                  return (
                    <tr 
                      key={candidate.id} 
                      className={`hover:bg-sky-50/30 transition ${
                        selectedCandidate?.id === candidate.id ? 'bg-sky-50/50' : ''
                      }`}
                    >
                      {/* Kandidat */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">{candidate.ime}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{candidate.telefon}</div>
                        {candidate.email ? (
                          <div className="text-[11px] text-sky-600 font-mono mt-0.5 break-all max-w-[200px] flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                            {candidate.email}
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic mt-0.5">Nema email</div>
                        )}
                      </td>

                      {/* Grad i Vozilo */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {candidate.grad}
                        </div>
                        <div className="text-xs text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                          {candidate.vozilo === 'automobil' ? (
                            <Car className="w-3.5 h-3.5 text-sky-500" />
                          ) : candidate.vozilo === 'skuter' ? (
                            <ScooterIcon className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <Bike className="w-3.5 h-3.5 text-sky-500" />
                          )}
                          {candidate.vozilo}
                        </div>
                      </td>

                      {/* Iskustvo */}
                      <td className="py-4 px-4">
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            candidate.iskustvo === 'da' ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {candidate.iskustvo === 'da' ? 'Iskusan' : 'Bez iskustva'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Početak: <strong className="text-gray-700">{candidate.kada_poceti.replace('_', ' ')}</strong></div>
                      </td>

                      {/* Izvor */}
                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-gray-800 capitalize">{candidate.izvor}</div>
                        {candidate.referral_code && (
                          <div className="text-[10px] text-sky-600 font-bold font-mono mt-0.5">Ref: {candidate.referral_code}</div>
                        )}
                      </td>

                      {/* Datum */}
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {new Date(candidate.datum_prijave).toLocaleDateString('sr-RS', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <select
                          id={`status-select-${candidate.id}`}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            candidate.status === CandidateStatus.NEW ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            candidate.status === CandidateStatus.CONTACTED ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            candidate.status === CandidateStatus.DOCUMENTS_PENDING ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            candidate.status === CandidateStatus.SENT_TO_PARTNER ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            candidate.status === CandidateStatus.REGISTRATION ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            candidate.status === CandidateStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                          value={candidate.status}
                          onChange={(e) => updateCandidate(candidate.id, e.target.value as CandidateStatus)}
                          disabled={isUpdating}
                        >
                          <option value="NEW">NOVI (NEW)</option>
                          <option value="CONTACTED">KONTAKTIRAN (CONTACTED)</option>
                          <option value="DOCUMENTS_PENDING">DOKUMENTACIJA (DOCS)</option>
                          <option value="SENT_TO_PARTNER">POSLAT AGENCIJI (SENT)</option>
                          <option value="REGISTRATION">REGISTRACIJA (REG)</option>
                          <option value="ACTIVE">AKTIVAN (ACTIVE)</option>
                          <option value="INACTIVE">NEAKTIVAN (INACTIVE)</option>
                        </select>
                      </td>

                      {/* Akcije */}
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* WhatsApp dugme */}
                        <a
                          id={`btn-wa-candidate-${candidate.id}`}
                          href={getWhatsAppLink(candidate)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (candidate.status === CandidateStatus.NEW) {
                              updateCandidate(candidate.id, CandidateStatus.CONTACTED);
                            }
                          }}
                          className="inline-flex p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-100 transition"
                          title="Pošalji WhatsApp Poruku"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Email dugme */}
                        {adminRole === 'super_admin' && (
                          <button
                            id={`btn-mail-candidate-${candidate.id}`}
                            onClick={() => {
                              const { subject, body } = getCandidateEmailTemplate(candidate);
                              setEmailCandidate(candidate);
                              setEmailTo(candidate.email || '');
                              setEmailSubject(subject);
                              setEmailBody(body);
                              setEmailCandidateSaveEmail(true);
                              setIsEmailModalOpen(true);
                              setSendEmailError(null);
                              setSendEmailSuccess(null);
                            }}
                            className="inline-flex p-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl border border-sky-100 transition"
                            title="Pošalji Email sa sajta"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}

                        {/* Napomene / Uređivanje */}
                        <button
                          id={`btn-note-candidate-${candidate.id}`}
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setNoteText(candidate.napomena || '');
                            setCandidateEmailInput(candidate.email || '');
                          }}
                          className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            candidate.napomena 
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {candidate.napomena ? 'Uredi napomenu' : '+ Napomena'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}
    </>
  )}

  {/* UPRAVLJANJE PRISTUPOM VIEW (Samo za Super Admin) */}
  {activeAdminTab === 'access_management' && adminRole === 'super_admin' && (
    <div className="space-y-6 animate-fade-in w-full" id="access-management-root">
      
      {/* Sub-tabs za Upravljanje Pristupom */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-full border border-gray-200 shadow-xs">
        {[
          { id: 'users', label: 'Korisnici', icon: ShieldCheck },
          { id: 'teams', label: 'Timovi', icon: Users },
          { id: 'email', label: 'Podešavanja za mail', icon: Mail },
          { id: 'audit', label: 'Dnevnik aktivnosti (Audit Log)', icon: ClipboardList }
        ].map(subTab => {
          const Icon = subTab.icon;
          return (
            <button
              key={subTab.id}
              onClick={() => {
                setAccessSubTab(subTab.id as any);
                setSaveMailError(null);
                setSaveMailSuccess(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                accessSubTab === subTab.id
                  ? 'bg-white text-sky-600 shadow-md shadow-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. KORISNICI */}
      {accessSubTab === 'users' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sky-500" /> Korisnički Nalozi (Uloge i pristupi)
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Kreirajte i upravljajte nalozima za marketing, administraciju kandidata ili dodajte nove Super Admin-e.
              </p>
            </div>
            <button
              onClick={handleOpenCreateAccount}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-sky-500/10"
            >
              <Plus className="w-4 h-4" /> Kreiraj novi nalog
            </button>
          </div>

          {accountsError && (
            <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-semibold border border-rose-100">
              {accountsError}
            </div>
          )}

          {accountsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Korisničko Ime</th>
                      <th className="py-4 px-6">Lozinka / Pristupni kod</th>
                      <th className="py-4 px-6">Uloga (Role)</th>
                      <th className="py-4 px-6">Kreiran</th>
                      <th className="py-4 px-6 text-right">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {adminAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400 text-sm font-medium">
                          Nema dodatnih administratorskih naloga u bazi. Podrazumevani nalog je uvek dostupan.
                        </td>
                      </tr>
                    ) : (
                      adminAccounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2">
                            {acc.username}
                            {acc.id === 'default_super_admin' && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-black">SISTEMSKI</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-mono text-sm text-gray-600">{acc.passcode}</td>
                          <td className="py-4 px-6">
                            {acc.role === 'super_admin' ? (
                              <span className="bg-purple-50 text-purple-700 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-100">
                                Super Admin
                              </span>
                            ) : acc.role === 'marketing_admin' ? (
                              <span className="bg-orange-50 text-orange-700 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-100">
                                Marketing
                              </span>
                            ) : (
                              <span className="bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                Administrator
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-500">
                            {acc.created_at ? new Date(acc.created_at).toLocaleDateString('sr-RS', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditAccount(acc)}
                              className="inline-flex p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-100 transition cursor-pointer"
                              title="Izmeni nalog"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdminAccount(acc.id)}
                              disabled={acc.id === 'default_super_admin'}
                              className={`inline-flex p-2 rounded-xl border transition ${
                                acc.id === 'default_super_admin'
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100 cursor-pointer'
                              }`}
                              title="Obriši nalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. TIMOVI */}
      {accessSubTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in w-full" id="teams-subtab-view">
          {[
            {
              name: 'Super Admin Tim',
              desc: 'Najviši nivo pristupa. Upravljanje pristupom, konfiguracija e-maila, uvid u dnevnike aktivnosti i puna prava nad svim podacima.',
              role: 'super_admin',
              color: 'border-purple-100 bg-purple-50/20 text-purple-700',
              icon: ShieldCheck,
              users: adminAccounts.filter(a => a.role === 'super_admin')
            },
            {
              name: 'Kandidati & Operacije',
              desc: 'Fokus na regrutaciju. Kompletan rad sa prijavama kandidata, ažuriranje statusa, upisivanje napomena i slanje e-mailova kandidatima.',
              role: 'candidate_admin',
              color: 'border-sky-100 bg-sky-50/20 text-sky-700',
              icon: Users,
              users: adminAccounts.filter(a => a.role === 'candidate_admin')
            },
            {
              name: 'Marketing & Dizajn',
              desc: 'Fokus na vidljivost. Uređivanje SEO metapodataka, ažuriranje Hero slajdova i sadržaja na sajtu, pisanje blog članaka i analitika.',
              role: 'marketing_admin',
              color: 'border-amber-100 bg-amber-50/20 text-amber-700',
              icon: TrendingUp,
              users: adminAccounts.filter(a => a.role === 'marketing_admin')
            }
          ].map((team, idx) => {
            const TeamIcon = team.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${team.color} flex items-center gap-1.5`}>
                      <TeamIcon className="w-4 h-4" />
                      {team.name}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{team.users.length} član(a)</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {team.desc}
                  </p>
                  
                  <div className="space-y-2 border-t border-gray-50 pt-4">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Članovi tima:</h4>
                    {team.users.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Trenutno nema korisnika u ovom timu.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {team.users.map((user) => (
                          <div key={user.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <span className="text-xs font-bold text-gray-800">{user.username}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Aktivan</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MAIL CONFIGURATION */}
      {accessSubTab === 'email' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 w-full animate-fade-in" id="mail-subtab-view">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-500" /> Integracija i Podešavanje SMTP Mail-a
            </h3>
            <p className="text-xs text-gray-400 mt-1">Povežite vaš poslovni email nalog kako biste slali email poruke direktno kandidatima sa panela.</p>
          </div>

          {saveMailSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{saveMailSuccess}</span>
            </div>
          )}

          {saveMailError && (
            <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{saveMailError}</span>
            </div>
          )}

          <div className="bg-sky-50 text-sky-800 p-4 rounded-xl text-xs border border-sky-100 space-y-2 leading-relaxed font-medium">
            <p className="font-bold flex items-center gap-1.5 text-sky-950">
              <Sparkles className="w-4 h-4 text-sky-600" /> Kako funkcioniše slanje u ime info@deliverix.rs?
            </p>
            <p>Da biste slali email-ove kandidatima pod brendom <strong className="text-sky-950 font-mono text-[11px]">info@deliverix.rs</strong>, iskoristite Gmail SMTP sa lozinkom aplikacije:</p>
            <ol className="list-decimal pl-4 space-y-1 text-sky-900">
              <li>Uključite <strong>Verifikaciju u 2 koraka</strong> na vašem Google nalogu.</li>
              <li>Generišite 16-cifrenu <strong>Lozinku za aplikacije</strong> (App Password).</li>
              <li>Unesite te podatke dole kako bi sistem automatski koristio bezbednu vezu za slanje.</li>
            </ol>
          </div>

          <form onSubmit={handleSaveMailConfig} className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Vaša Gmail adresa</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  placeholder="npr. daniel.hoscieslavski@gmail.com"
                  value={mailConfig.smtp_email}
                  onChange={e => setMailConfig({ ...mailConfig, smtp_email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Lozinka aplikacije (App Password)</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                  placeholder={mailConfig.has_password ? "•••••••••••••••• (Sačuvana lozinka)" : "Unesite 16-cifrenu šifru aplikacije"}
                  value={mailConfigPassword}
                  onChange={e => setMailConfigPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ime pošiljaoca</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  placeholder="npr. Deliverix Podrška"
                  value={mailConfig.sender_name}
                  onChange={e => setMailConfig({ ...mailConfig, sender_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email pošiljaoca (Alias)</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium font-mono"
                  placeholder="npr. info@deliverix.rs"
                  value={mailConfig.sender_alias}
                  onChange={e => setMailConfig({ ...mailConfig, sender_alias: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
              <button
                type="submit"
                disabled={saveMailLoading}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-sky-500/10 disabled:opacity-50"
              >
                {saveMailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sačuvaj podešavanja mail-a'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. DNEVNIK AKTIVNOSTI (AUDIT LOG) */}
      {accessSubTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 w-full animate-fade-in" id="audit-subtab-view">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-500" /> Dnevnik Aktivnosti (Audit Log)
              </h3>
              <p className="text-xs text-gray-400 mt-1">Hronološki zapis svih izmena i akcija koje su administratori izvršili u sistemu.</p>
            </div>
            <button
              onClick={() => fetchAuditLogs()}
              disabled={loadingAuditLogs}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loadingAuditLogs ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <RotateCw className="w-4 h-4 text-gray-500" />
              )}
              Osveži zapisnik
            </button>
          </div>

          {auditLogsError && (
            <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-semibold border border-rose-100">
              {auditLogsError}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Administrator</th>
                  <th className="py-3.5 px-4">Akcija</th>
                  <th className="py-3.5 px-6">Detalji izmene</th>
                  <th className="py-3.5 px-6">Vreme akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400 text-sm font-medium">
                      <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      Nema zabeleženih aktivnosti u sistemu.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, idx) => {
                    // Detektuj tip akcije za stil bedža
                    const isDelete = log.action.toLowerCase().includes('obrisan') || log.action.toLowerCase().includes('brisanje') || log.action.toLowerCase().includes('delete');
                    const isCreate = log.action.toLowerCase().includes('kreiran') || log.action.toLowerCase().includes('novi') || log.action.toLowerCase().includes('dodat');
                    const isEdit = !isDelete && !isCreate;

                    return (
                      <tr key={log.id || idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{log.username}</span>
                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mt-0.5">{log.role || 'Super Admin'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${
                            isDelete 
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : isCreate
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-600 max-w-md break-words font-medium leading-relaxed">
                          {log.details || '-'}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-400 font-medium whitespace-nowrap">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString('sr-RS', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }) : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )}

  {/* SEO, DIZAJN & MARKETING VIEWS */}
  {(activeAdminTab === 'seo_and_blog' || activeAdminTab === 'design' || activeAdminTab === 'marketing_analitika') && (adminRole === 'super_admin' || adminRole === 'marketing_admin') && (
    <div className="space-y-6 animate-fade-in w-full" id="marketing-panel-root">
      
      {/* Sub Tabovi za SEO */}
      {activeAdminTab === 'seo_and_blog' && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-full border border-gray-200 shadow-xs">
          {[
            { id: 'seo', label: 'Opšta & SEO podešavanja', icon: Globe },
            { id: 'blog', label: 'Uređivanje Bloga', icon: Newspaper }
          ].map(subTab => {
            const Icon = subTab.icon;
            return (
              <button
                key={subTab.id}
                onClick={() => setSeoSubTab(subTab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  seoSubTab === subTab.id
                    ? 'bg-white text-sky-600 shadow-md shadow-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sub Tabovi za DIZAJN */}
      {activeAdminTab === 'design' && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-full border border-gray-200 shadow-xs">
          {[
            { id: 'hero', label: 'Hero Sekcija', icon: Sparkles },
            { id: 'sections', label: 'Delovi Sajta', icon: Compass },
            { id: 'faq', label: 'Česta Pitanja (FAQ)', icon: HelpCircle }
          ].map(subTab => {
            const Icon = subTab.icon;
            return (
              <button
                key={subTab.id}
                onClick={() => setDesignSubTab(subTab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  designSubTab === subTab.id
                    ? 'bg-white text-sky-600 shadow-md shadow-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sub Tabovi za MARKETING */}
      {activeAdminTab === 'marketing_analitika' && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-full border border-gray-200 shadow-xs">
          {[
            { id: 'analytics', label: 'Google & Facebook Analitika', icon: BarChart3 },
            { id: 'link-gen', label: 'Generator Linkova', icon: ExternalLink }
          ].map(subTab => {
            const Icon = subTab.icon;
            return (
              <button
                key={subTab.id}
                onClick={() => setActiveMarketingSubTab(subTab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeMarketingSubTab === subTab.id
                    ? 'bg-white text-sky-600 shadow-md shadow-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sub Tab Sadržaj */}
      {activeAdminTab === 'marketing_analitika' && activeMarketingSubTab === 'analytics' && (
        <div className="space-y-6" id="marketing-subtab-analytics">
          {/* Statistika */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ukupno Prijava</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{marketingStats.totalRegistrations || 0}</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center">↑ 14% ove nedelje</span>
              </div>
              <p className="text-[10px] text-gray-400">Izmereno preko Deliverix backend-a</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Najaktivniji Grad</span>
              <div className="text-2xl font-black text-gray-900 leading-tight">
                {Object.keys(marketingStats.byCity || {}).length > 0 
                  ? Object.entries(marketingStats.byCity).sort((a: any, b: any) => b[1] - a[1])[0][0]
                  : 'Nema podataka'}
              </div>
              <p className="text-[10px] text-gray-400">Najveći fokus marketinških kampanja</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Najčešće Vozilo</span>
              <div className="text-2xl font-black text-gray-900 leading-tight uppercase">
                {Object.keys(marketingStats.byVehicle || {}).length > 0 
                  ? Object.entries(marketingStats.byVehicle).sort((a: any, b: any) => b[1] - a[1])[0][0]
                  : 'Nema podataka'}
              </div>
              <p className="text-[10px] text-gray-400">Korisno za targetiranje oglasa</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Google Analytics ID</span>
              <div className="text-lg font-mono font-bold text-sky-600">
                {siteSettings.ga_measurement_id || 'Nije konfigurisan'}
              </div>
              <p className="text-[10px] text-gray-400">Merenje eksternog saobraćaja aktivno</p>
            </div>
          </div>

          {/* Grafikoni performansi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kanali akvizicije (UTM Source) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-gray-900 flex items-center gap-1.5 text-sm uppercase tracking-wider text-gray-500">
                <TrendingUp className="w-4 h-4 text-sky-500" /> Kanali akvizicije (UTM Source)
              </h4>
              <p className="text-xs text-gray-400">Udeo pojedinačnih oglasnih kampanja u ukupnom broju prijava:</p>
              
              <div className="space-y-3 pt-2">
                {Object.keys(marketingStats.bySource || {}).length > 0 ? (
                  Object.entries(marketingStats.bySource).map(([src, count]: any) => {
                    const pct = Math.round((count / (marketingStats.totalRegistrations || 1)) * 100);
                    return (
                      <div key={src} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span className="capitalize">{src === 'partner_ref' ? 'Partnerska Preporuka' : src === 'direct' ? 'Direktno / Organski' : src}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic">Nema zabeleženih UTM izvora.</p>
                )}
              </div>
            </div>

            {/* Raspodela po gradovima */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-gray-900 flex items-center gap-1.5 text-sm uppercase tracking-wider text-gray-500">
                <MapPin className="w-4 h-4 text-sky-500" /> Geografska struktura
              </h4>
              <p className="text-xs text-gray-400">Gradovi sa najviše novih registrovanih dostavljača:</p>
              
              <div className="space-y-3 pt-2">
                {Object.keys(marketingStats.byCity || {}).length > 0 ? (
                  Object.entries(marketingStats.byCity).map(([city, count]: any) => {
                    const pct = Math.round((count / (marketingStats.totalRegistrations || 1)) * 100);
                    return (
                      <div key={city} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{city}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic">Nema zabeleženih lokacija.</p>
                )}
              </div>
            </div>

            {/* Struktura po vozilima */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-gray-900 flex items-center gap-1.5 text-sm uppercase tracking-wider text-gray-500">
                <Bike className="w-4 h-4 text-sky-500" /> Tip prevoza
              </h4>
              <p className="text-xs text-gray-400">Vozila koja kandidati planiraju da koriste za rad:</p>
              
              <div className="space-y-3 pt-2">
                {Object.keys(marketingStats.byVehicle || {}).length > 0 ? (
                  Object.entries(marketingStats.byVehicle).map(([veh, count]: any) => {
                    const pct = Math.round((count / (marketingStats.totalRegistrations || 1)) * 100);
                    return (
                      <div key={veh} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span className="capitalize">{veh}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic">Nema zabeleženih prevoznih sredstava.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeAdminTab === 'marketing_analitika' && activeMarketingSubTab === 'link-gen' && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5 w-full" id="marketing-subtab-linkgen">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" /> Generator linkova za oglase
            </h3>
            <p className="text-xs text-gray-400 mt-1">Kreirajte unikatne partnerske linkove sa UTM parametrima kako biste tačno znali odakle dolaze vaši najkvalitetniji kandidati.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Izvor kampanje (Source)</label>
              <select
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={genSource}
                onChange={(e) => setGenSource(e.target.value)}
              >
                <option value="direct">Direktno / Organski</option>
                <option value="facebook">Facebook Ads</option>
                <option value="instagram">Instagram Ads</option>
                <option value="tiktok">TikTok Video</option>
                <option value="viber">Viber grupa</option>
                <option value="partner_ref">Partnerska preporuka</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Kod preporučioca / Referent</label>
              <input
                type="text"
                placeholder="npr. petar123"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={genRef}
                onChange={(e) => setGenRef(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">Generisani URL Link za praćenje</span>
              <p className="text-xs font-mono break-all text-gray-700 font-bold">{generatedLink}</p>
            </div>
            <button
              onClick={copyGeneratedLink}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer w-full ${
                linkCopied ? 'bg-emerald-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
              }`}
            >
              {linkCopied ? 'Link uspešno kopiran!' : <><Copy className="w-4 h-4" /> Kopiraj link za kampanje</>}
            </button>
          </div>
        </div>
      )}

      {activeAdminTab === 'seo_and_blog' && seoSubTab === 'seo' && (
        <div className="space-y-6 w-full">
          <SeoTabForm
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            onSave={handleSaveSeoSettings}
            isUploadingLogo={isUploadingLogo}
            isUploadingFooterLogo={isUploadingFooterLogo}
            handleLogoUpload={handleLogoUpload}
            handleFooterLogoUpload={handleFooterLogoUpload}
          />

          {/* Google SERP Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="google-serp-preview">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-500" /> Google Search Preview (Izgled u pretrazi)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ovako će vaš sajt izgledati kada ga korisnici pronađu putem Google pretrage. Dobar naslov i opis privlače više kandidata.
            </p>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 max-w-2xl font-sans space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">Adresa</span>
                <span className="font-mono text-gray-500 text-[11px]">https://www.deliverix.rs</span>
              </div>
              <h5 className="text-xl text-blue-800 hover:underline cursor-pointer font-medium leading-snug">
                {siteSettings.meta_title || 'Deliverix.rs | Postani dostavljač - Wolt, Glovo, Mister D'}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                {siteSettings.meta_description || 'Prijavi se za posao dostavljača na Wolt, Glovo ili Mister D platformi. Odlična zarada, fleksibilno radno vreme i podrška 24/7.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'design' && designSubTab === 'hero' && (
        <HeroTabForm
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          onSave={handleSaveSeoSettings}
          isUploadingHeroImage={isUploadingHeroImage}
          isUploadingHeroSlide={isUploadingHeroSlide}
          handleHeroImageUpload={handleHeroImageUpload}
          handleHeroSlideUpload={handleHeroSlideUpload}
          handleRemoveHeroSlide={handleRemoveHeroSlide}
          handleUpdateSlideText={handleUpdateSlideText}
        />
      )}

      {activeAdminTab === 'design' && designSubTab === 'sections' && (
        <HomepageSectionsTabForm
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          onSave={handleSaveSeoSettings}
        />
      )}

      {activeAdminTab === 'design' && designSubTab === 'faq' && (
        <FaqTabForm
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          onSave={handleSaveSeoSettings}
        />
      )}

      {activeAdminTab === 'seo_and_blog' && seoSubTab === 'blog' && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="marketing-subtab-blog">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Upravljanje Blog Člancima</h3>
              <p className="text-xs text-gray-400 mt-1">Kreirajte, menjajte i brišite članke koji se prikazuju kandidatima na sajtu.</p>
            </div>
            <button
              onClick={() => {
                setEditingPostId(null);
                setBlogForm({
                  title: '',
                  slug: '',
                  summary: '',
                  content: '',
                  tags: '',
                  cover_image: '/assets/images/blog_post_default_cover_1783427588712.webp',
                  read_time: '3 min',
                  author: 'Deliverix Marketing'
                });
                setIsBlogModalOpen(true);
              }}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Novi članak
            </button>
          </div>

          {blogPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 border-collapse">
                <thead className="bg-gray-50/70 text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Slika</th>
                    <th className="px-6 py-3.5">Naslov</th>
                    <th className="px-6 py-3.5">Oznake</th>
                    <th className="px-6 py-3.5">Pregledi</th>
                    <th className="px-6 py-3.5">Kreirano</th>
                    <th className="px-6 py-3.5 text-right">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogPosts.map((post: any) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-12 h-8 object-cover rounded-lg border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-md text-[10px] font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">
                        {post.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {new Date(post.created_at).toLocaleDateString('sr-RS')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditBlogPostClick(post)}
                            className="p-1.5 hover:bg-sky-50 text-sky-500 hover:text-sky-600 rounded-lg transition cursor-pointer"
                            title="Uredi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Obriši"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 space-y-2 border border-dashed border-gray-200 rounded-2xl">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-bold text-gray-700">Nema kreiranih blog članaka</p>
              <p className="text-xs text-gray-400">Kliknite na dugme "Novi članak" kako biste objavili prvi post na sajtu.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )}

  {/* Modal za Blog Članak */}
  {isBlogModalOpen && (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="blog-editor-modal">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 border border-gray-100 space-y-4 my-8"
      >
        <div className="flex justify-between items-start border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-gray-900">{editingPostId ? 'Uređivanje Članka' : 'Novi Blog Članak'}</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Kreirajte bogat sadržaj koristeći standardni Markdown format za naslove, liste i stilove.</p>
          </div>
          <button onClick={() => setIsBlogModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSaveBlogPost} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Naslov članka</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                placeholder="npr. Kako zaraditi više kao dostavljač"
                value={blogForm.title}
                onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Slug (URL putanja - opciono)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                placeholder="npr. kako-zaraditi-vise"
                value={blogForm.slug}
                onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Autor</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                value={blogForm.author}
                onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Vreme čitanja</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                placeholder="npr. 5 min"
                value={blogForm.read_time}
                onChange={e => setBlogForm({ ...blogForm, read_time: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Oznake (Tagovi - odvojeni zarezom)</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                placeholder="saveti, zarada, wolt"
                value={blogForm.tags}
                onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <Image className="w-4 h-4 text-sky-500" /> Naslovna slika
              </label>
              <span className="text-[10px] text-gray-400 font-bold">
                (Preporučene dimenzije slike za blog: 1200x630 px ili razmera 16:9)
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">URL Slike</span>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                  placeholder="Zalepite URL slike ili je otpremite desno"
                  value={blogForm.cover_image}
                  onChange={e => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Otpremi sa računara</span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploadingBlogImage}
                  />
                  <button
                    type="button"
                    className="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-sky-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {isUploadingBlogImage ? (
                      <>
                        <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        Obrada...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Izaberi sliku
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {blogForm.cover_image && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-3">
                <img 
                  src={blogForm.cover_image} 
                  alt="Pregled naslovne slike" 
                  className="w-16 h-10 object-cover rounded-lg border border-gray-100 bg-white"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="text-[10px] text-gray-400">
                  <p className="font-bold text-gray-500">Pregled slike uspešan</p>
                  <p className="truncate max-w-[200px]">{blogForm.cover_image}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Kratak sažetak (Summary)</label>
            <textarea
              rows={2}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              placeholder="Kratak opis članka koji se prikazuje na listi..."
              value={blogForm.summary}
              onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
              <span>Sadržaj članka (Markdown)</span>
              <span className="text-[10px] text-gray-400 lowercase">Podržava: # H1, ## H2, **Bold**, * List</span>
            </label>
            <textarea
              rows={6}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
              placeholder="Napišite ceo članak..."
              value={blogForm.content}
              onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsBlogModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-sky-500/10 transition cursor-pointer"
            >
              {editingPostId ? 'Sačuvaj izmene' : 'Objavi članak'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )}

      {/* Modal / Slider za napomene */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="notes-modal">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Uređivanje Napomene</h3>
                <p className="text-xs text-gray-500">Kandidat: <strong className="text-gray-700">{selectedCandidate.ime}</strong></p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)} 
                className="p-1.5 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Email adresa kandidata</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900 placeholder-gray-400 font-mono"
                placeholder="npr. ime@primer.com"
                value={candidateEmailInput}
                onChange={(e) => setCandidateEmailInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Interna zabeleška</label>
              <textarea
                id="notes-textarea"
                rows={4}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900 placeholder-gray-400"
                placeholder="Upišite detalje razgovora, nivo spremnosti, provere i sl."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                id="notes-cancel-btn"
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Otkaži
              </button>
              <button
                id="notes-save-btn"
                type="button"
                onClick={() => {
                  updateCandidate(selectedCandidate.id, undefined, noteText, candidateEmailInput);
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/15 transition cursor-pointer"
              >
                Sačuvaj izmene
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal za slanje email-a */}
      {isEmailModalOpen && emailCandidate && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="send-email-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-500" /> Pošalji Email Kandidatu
                </h3>
                <p className="text-xs text-gray-400">Kandidat: <strong className="text-gray-700">{emailCandidate.ime}</strong> ({emailCandidate.telefon})</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailCandidate(null);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {sendEmailSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{sendEmailSuccess}</span>
              </div>
            )}

            {sendEmailError && (
              <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{sendEmailError}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Primalac (Email)</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                  placeholder="npr. klijent@primer.com"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                />
                {!emailCandidate.email && (
                  <div className="bg-amber-50 text-amber-800 p-2.5 rounded-lg text-xs border border-amber-100 space-y-1 mt-1 font-medium">
                    <p className="flex items-center gap-1.5 text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Kandidat trenutno nema sačuvanu email adresu u bazi!
                    </p>
                    <label className="flex items-center gap-2 text-amber-900 cursor-pointer pt-1 select-none">
                      <input
                        type="checkbox"
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                        checked={emailCandidateSaveEmail}
                        onChange={e => setEmailCandidateSaveEmail(e.target.checked)}
                      />
                      Sačuvaj unetu adresu u profilu ovog kandidata
                    </label>
                  </div>
                )}
                {emailCandidate.email && emailTo !== emailCandidate.email && (
                  <div className="bg-sky-50 text-sky-800 p-2.5 rounded-lg text-xs border border-sky-100 space-y-1 mt-1 font-medium">
                    <label className="flex items-center gap-2 text-sky-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-sky-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                        checked={emailCandidateSaveEmail}
                        onChange={e => setEmailCandidateSaveEmail(e.target.checked)}
                      />
                      Ažuriraj email u profilu sa novom adresom ({emailTo})
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Naslov (Subject)</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  placeholder="Naslov email poruke"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Sadržaj Email-a (Samo običan tekst)</label>
                <textarea
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  placeholder="Ovde ide sadržaj šablona..."
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                />
              </div>

              {!mailConfig.smtp_email && (
                <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs border border-rose-100 font-medium">
                  <strong>⚠️ Pažnja:</strong> Email SMTP server nije konfigurisan u podešavanjima naloga. Kliknite na ikonicu zupčanika (Gore Desno) da biste povezali svoj Gmail nalog. Ipak možete kopirati tekst kako biste poslali ručno.
                </div>
              )}

              <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
                    navigator.clipboard.writeText(fullText);
                    alert('Sadržaj je kopiran u privremenu memoriju (clipboard)!');
                    if (emailCandidate.status === 'NEW') {
                      updateCandidate(emailCandidate.id, 'CONTACTED' as any);
                    }
                    setIsEmailModalOpen(false);
                    setEmailCandidate(null);
                  }}
                  className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 border border-gray-200"
                >
                  <Copy className="w-3.5 h-3.5" /> Kopiraj u Clipboard
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail || !mailConfig.smtp_email}
                  className={`px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/15 transition cursor-pointer flex items-center gap-1.5`}
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Šaljem email...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Pošalji Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal za kreiranje / izmenu admin naloga */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="account-crud-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingAccountId ? 'Izmeni Admin Nalog' : 'Kreiraj Novi Admin Nalog'}
                </h3>
                <p className="text-xs text-gray-400">Kreirajte pristup za marketing, podršku ili superviziju.</p>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {saveAccountError && (
              <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs font-semibold border border-rose-100">
                {saveAccountError}
              </div>
            )}

            <form onSubmit={handleSaveAdminAccount} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Korisničko ime</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  placeholder="npr. petar_marketing"
                  value={accountForm.username}
                  onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Lozinka / Pristupni kod</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                  placeholder="Napišite sigurnu lozinku (min. 6 karaktera)"
                  value={accountForm.passcode}
                  onChange={(e) => setAccountForm({ ...accountForm, passcode: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Uloga naloza (Role)</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                  value={accountForm.role}
                  onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value as any })}
                >
                  <option value="super_admin">Super Admin (Puni pristup)</option>
                  <option value="candidate_admin">Administrator (Samo upravljanje kandidatima)</option>
                  <option value="marketing_admin">Marketing (Samo SEO, blog, analitika)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  disabled={saveAccountLoading}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saveAccountLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    editingAccountId ? 'Sačuvaj izmene' : 'Kreiraj nalog'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal za izmenu SOPSTVENIH kredencijala (Change My Own Password) */}
      {isSelfSettingsModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="self-settings-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-sky-500" /> Podešavanje Mog Naloga
                </h3>
                <p className="text-xs text-gray-400">Podesite pristupne parametre i integraciju za email.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSelfSettingsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tabovi unutar podešavanja (Samo za Super Admina) */}
            {adminRole === 'super_admin' && (
              <div className="flex border-b border-gray-100 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSettingsTab('account')}
                  className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                    activeSettingsTab === 'account'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Kredencijali Naloga
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSettingsTab('email');
                    setSaveMailError(null);
                    setSaveMailSuccess(null);
                  }}
                  className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                    activeSettingsTab === 'email'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Slanje Email-a (Gmail SMTP)
                </button>
              </div>
            )}

            {adminRole !== 'super_admin' || activeSettingsTab === 'account' ? (
              <>
                {changeSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{changeSuccess}</span>
                  </div>
                )}

                {changeError && (
                  <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{changeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangeCredentials} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Korisničko ime</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                      placeholder="npr. admin"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nova Lozinka</label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400">Lozinka mora imati najmanje 6 karaktera.</p>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsSelfSettingsModalOpen(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Otkaži
                    </button>
                    <button
                      type="submit"
                      disabled={changeLoading}
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-sky-500/10 disabled:opacity-50"
                    >
                      {changeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sačuvaj izmene'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {saveMailSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{saveMailSuccess}</span>
                  </div>
                )}

                {saveMailError && (
                  <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{saveMailError}</span>
                  </div>
                )}

                <div className="bg-sky-50 text-sky-800 p-3.5 rounded-xl text-xs border border-sky-100 space-y-1.5 leading-relaxed font-medium">
                  <p className="font-bold flex items-center gap-1.5 text-sky-950">
                    <Sparkles className="w-4 h-4 text-sky-600" /> Kako podesiti Gmail slanje?
                  </p>
                  <p>Da biste slali email-ove sa sajta u ime adrese <strong className="text-sky-950 font-mono text-[11px]">info@deliverix.rs</strong>, povežite svoj Gmail nalog:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-sky-900">
                    <li>Idite na podešavanja vašeg Google naloga (<a href="https://myaccount.google.com" target="_blank" rel="noreferrer" className="underline font-bold hover:text-sky-950">myaccount.google.com</a>)</li>
                    <li>Uključite <strong>Verifikaciju u 2 koraka</strong> u sekciji "Sigurnost"</li>
                    <li>U pretrazi naloga potražite <strong>Lozinke za aplikacije</strong> (App Passwords) i kreirajte novu (npr. unesite naziv "Sajt Deliverix")</li>
                    <li>Kopirajte generisanu šifru od 16 karaktera i unesite je u polje ispod</li>
                  </ol>
                </div>

                <form onSubmit={handleSaveMailConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Vaša Gmail adresa</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                        placeholder="npr. daniel.hoscieslavski@gmail.com"
                        value={mailConfig.smtp_email}
                        onChange={e => setMailConfig({ ...mailConfig, smtp_email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Lozinka aplikacije (App Password)</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                        placeholder={mailConfig.has_password ? "•••••••••••••••• (Sačuvana lozinka)" : "Unesite 16-cifrenu šifru aplikacije"}
                        value={mailConfigPassword}
                        onChange={e => setMailConfigPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ime pošiljaoca</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                        placeholder="npr. Deliverix Podrška"
                        value={mailConfig.sender_name}
                        onChange={e => setMailConfig({ ...mailConfig, sender_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email pošiljaoca (Alias)</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium font-mono"
                        placeholder="npr. info@deliverix.rs"
                        value={mailConfig.sender_alias}
                        onChange={e => setMailConfig({ ...mailConfig, sender_alias: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsSelfSettingsModalOpen(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Zatvori
                    </button>
                    <button
                      type="submit"
                      disabled={saveMailLoading}
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-sky-500/10 disabled:opacity-50"
                    >
                      {saveMailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sačuvaj podešavanja'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
