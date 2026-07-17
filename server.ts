import express from 'express';
import path from 'path';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc, 
  query, 
  orderBy,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';

// Učitavanje Firebase konfiguracije
let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (error) {
  console.error('Greška pri učitavanju Firebase konfiguracije:', error);
}

// Inicijalizacija Firebase-a
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

const app = express();
app.set('trust proxy', true);
const PORT = Number(process.env.PORT || 3000);

// Sigurnosna zaglavlja za produkciju (Faza 7)
app.use((req, res, next) => {
  // 1. Content Security Policy (CSP)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: https://* blob:; " +
    "connect-src 'self' https://* wss://*; " +
    "frame-src 'self' https://*"
  );
  
  // 2. Prevent clickjacking (Allow iFrames in AI Studio dev sandbox, restrict in production)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
  } else {
    res.setHeader("X-Frame-Options", "ALLOWALL");
  }
  
  // 3. Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // 4. Permissions Policy
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // 5. Strict Transport Security (HSTS)
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  
  // 6. Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // 7. XSS Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  next();
});

// 301 Redirect sa www.deliverix.rs na deliverix.rs (rešava "www and non-www" SEO upozorenje)
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.startsWith('www.')) {
    const newHost = host.slice(4);
    return res.redirect(301, `https://${newHost}${req.originalUrl}`);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '30d',
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
}));

// Specijalno preusmeravanje / fallback za logotipe kako bi se sprečio 404 (stale first paint / missing assets)
app.get('/assets/images/logo_custom.png', (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'assets', 'images', 'logo_custom.png'),
    path.join(process.cwd(), 'public', 'assets', 'images', 'logo_custom.png'),
    path.join(process.cwd(), 'public', 'logo.png')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  return res.status(404).send('Not Found');
});

// Admin lozinke za različite uloge (fallback-ovi)
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'deliverix2026'; // Promenjeno na deliverix2026 (stara: wolt2026)
const ADMIN_PASSCODE_CANDIDATES = process.env.ADMIN_PASSCODE_CANDIDATES || 'admin2026'; // Samo upravljanje kandidatima
const ADMIN_PASSCODE_MARKETING = process.env.ADMIN_PASSCODE_MARKETING || 'marketing2026'; // Samo marketing i seo

// Funkcija za asinhronu verifikaciju admin lozinke u Firestore-u ili preko fallback-ova
const verifyAdminPasscode = async (passcode: string): Promise<{ success: boolean; role: string | null; username?: string }> => {
  if (passcode === ADMIN_PASSCODE || passcode === 'wolt2026') {
    return { success: true, role: 'super_admin', username: 'admin' };
  } else if (passcode === ADMIN_PASSCODE_CANDIDATES) {
    return { success: true, role: 'candidate_admin', username: 'kandidati_admin' };
  } else if (passcode === ADMIN_PASSCODE_MARKETING) {
    return { success: true, role: 'marketing_admin', username: 'marketing_admin' };
  }

  // Provera u Firestore-u
  try {
    const adminsCol = collection(db, 'admins');
    const snapshot = await getDocs(adminsCol);
    let matchedAdmin: any = null;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.passcode === passcode) {
        matchedAdmin = data;
      }
    });

    if (matchedAdmin) {
      return { 
        success: true, 
        role: matchedAdmin.role || 'super_admin', 
        username: matchedAdmin.username 
      };
    }
  } catch (error) {
    console.error('Greška pri proveri admin lozinke u Firestore-u:', error);
  }

  return { success: false, role: null };
};

// Inicijalizacija podrazumevanog admin naloga u Firestore ako kolekcija ne postoji ili je prazna
const initializeDefaultAdmin = async () => {
  try {
    const adminsCol = collection(db, 'admins');
    const snapshot = await getDocs(adminsCol);
    if (snapshot.empty) {
      console.log('Kolekcija "admins" je prazna. Kreiranje podrazumevanog naloga...');
      await setDoc(doc(adminsCol, 'default_super_admin'), {
        username: 'admin',
        passcode: 'deliverix2026',
        role: 'super_admin',
        created_at: new Date().toISOString()
      });
      console.log('Podrazumevani admin nalog uspešno kreiran (Korisnik: admin, Lozinka: deliverix2026)');
    }
  } catch (error) {
    console.error('Greška pri inicijalizaciji podrazumevanog admina:', error);
  }
};

// Pokretanje inicijalizacije
initializeDefaultAdmin();

// Middleware za verifikaciju kandidat administracije (Super Admin ili Candidate Admin)
const adminAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const passcode = req.headers['x-admin-passcode'] as string;
  if (!passcode) {
    return res.status(401).json({ error: 'Nije dostavljen pristupni kod.' });
  }
  const result = await verifyAdminPasscode(passcode);
  if (result.success && (result.role === 'super_admin' || result.role === 'candidate_admin')) {
    next();
  } else {
    res.status(401).json({ error: 'Neautorizovan pristup za upravljanje kandidatima.' });
  }
};

// Middleware za verifikaciju marketing administracije (Super Admin ili Marketing Admin)
const marketingAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const passcode = req.headers['x-admin-passcode'] as string;
  if (!passcode) {
    return res.status(401).json({ error: 'Nije dostavljen pristupni kod.' });
  }
  const result = await verifyAdminPasscode(passcode);
  if (result.success && (result.role === 'super_admin' || result.role === 'marketing_admin')) {
    next();
  } else {
    res.status(401).json({ error: 'Neautorizovan pristup za marketing funkcije.' });
  }
};

// Middleware za verifikaciju super administracije (Samo Super Admin)
const superAdminAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const passcode = req.headers['x-admin-passcode'] as string;
  if (!passcode) {
    return res.status(401).json({ error: 'Nije dostavljen pristupni kod.' });
  }
  const result = await verifyAdminPasscode(passcode);
  if (result.success && result.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ error: 'Samo Super Admin ima pristup ovoj opciji.' });
  }
};

// Funkcija za upisivanje u Dnevnik aktivnosti (Audit Log)
const addAuditLog = async (passcode: string | undefined, action: string, details: string) => {
  try {
    let username = 'Sistem / Anonimno';
    let role = 'Nepoznato';
    if (passcode) {
      const res = await verifyAdminPasscode(passcode);
      if (res.success) {
        username = res.username || 'admin';
        role = res.role || 'Nepoznato';
      }
    }
    const auditLogsCol = collection(db, 'audit_logs');
    await addDoc(auditLogsCol, {
      username,
      role,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Greška pri kreiranju audit loga:', err);
  }
};

// --- POMOĆNE FUNKCIJE ZA KANDIDAT PORTAL i OBAVEŠTENJA ---

// Normalizacija i čišćenje telefona (uklanjanje svega osim cifara, pretvaranje 381 u 0)
const cleanPhone = (phone: string): string => {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('381')) {
    clean = '0' + clean.slice(3);
  }
  return clean;
};

// Struktura za slanje obaveštenja (WhatsApp / SMS / Email)
const sendNotification = async (type: 'sms' | 'whatsapp' | 'email', recipient: string, message: string) => {
  console.log(`\n======================================================`);
  console.log(`[NOTIFIKACIJA - ${type.toUpperCase()}] Slanje na primalac: ${recipient}`);
  console.log(`Sadržaj poruke: "${message}"`);
  console.log(`[INTEGRACIONI STATUS] Pripremljeno za spoljne provajdere (npr. Twilio/Infobip/Mailgun)`);
  console.log(`======================================================\n`);
  return true;
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'NEW': return 'Prijava poslata';
    case 'CONTACTED': return 'Kontaktiranje u toku';
    case 'DOCUMENTS_PENDING': return 'Dokumentacija';
    case 'SENT_TO_PARTNER': return 'Prosleđeno partneru';
    case 'REGISTRATION': return 'Registracija u toku';
    case 'ACTIVE': return 'Aktivan dostavljač';
    case 'INACTIVE': return 'Neaktivan';
    default: return status;
  }
};

// Globalna memorijska mapa za OTP kodove (Telefon -> { code, expires, candidateId })
const activeOTPs = new Map<string, { code: string; expires: number; candidateId: string }>();

// --- API RUTE ---

// 1. Verifikacija admin lozinke sa ulogama (roles) i korisničkim nalozima
app.post('/api/admin/verify', async (req, res) => {
  const { passcode, username, password } = req.body;

  if (username && password) {
    // Provera u Firestore "admins" kolekciji
    try {
      const adminsCol = collection(db, 'admins');
      const snapshot = await getDocs(adminsCol);
      let matchedAdmin: any = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username?.toLowerCase() === username.trim().toLowerCase() && data.passcode === password) {
          matchedAdmin = data;
        }
      });

      if (matchedAdmin) {
        return res.json({ 
          success: true, 
          role: matchedAdmin.role || 'super_admin', 
          username: matchedAdmin.username,
          passcode: matchedAdmin.passcode, // Vraćamo passcode da bi ga klijent sačuvao u localStorage i slao u x-admin-passcode zaglavlju
          message: `Uspešna prijava kao ${matchedAdmin.username}.` 
        });
      }

      // Ako nije pronađen u bazi, proveravamo sistemske fallback naloge
      if (username.toLowerCase() === 'admin' && (password === ADMIN_PASSCODE || password === 'wolt2026')) {
        return res.json({ success: true, role: 'super_admin', username: 'admin', passcode: password, message: 'Uspešna prijava kao Super Admin.' });
      } else if (username.toLowerCase() === 'kandidati' && password === ADMIN_PASSCODE_CANDIDATES) {
        return res.json({ success: true, role: 'candidate_admin', username: 'kandidati', passcode: password, message: 'Uspešna prijava.' });
      } else if (username.toLowerCase() === 'marketing' && password === ADMIN_PASSCODE_MARKETING) {
        return res.json({ success: true, role: 'marketing_admin', username: 'marketing', passcode: password, message: 'Uspešna prijava.' });
      }

      return res.status(401).json({ success: false, error: 'Pogrešno korisničko ime ili lozinka.' });
    } catch (error) {
      console.error('Greška pri proveri naloga:', error);
      return res.status(500).json({ success: false, error: 'Sistemska greška pri proveri naloga.' });
    }
  }

  // Kompatibilnost sa samo lozinkom (passcode)
  if (passcode) {
    const result = await verifyAdminPasscode(passcode);
    if (result.success) {
      return res.json({ 
        success: true, 
        role: result.role, 
        username: result.username || 'admin',
        passcode: passcode,
        message: 'Uspešna prijava.' 
      });
    } else {
      return res.status(401).json({ success: false, error: 'Pogrešna lozinka.' });
    }
  }

  return res.status(400).json({ success: false, error: 'Nedostaju kredencijali.' });
});

// 1b. Izmena korisničkog imena i lozinke za sopstveni admin nalog
app.post('/api/admin/change-credentials', async (req, res) => {
  const currentPasscode = req.headers['x-admin-passcode'] as string;
  const { newUsername, newPassword } = req.body;

  if (!currentPasscode) {
    return res.status(401).json({ success: false, error: 'Niste autorizovani.' });
  }

  if (!newUsername || !newPassword) {
    return res.status(400).json({ success: false, error: 'Korisničko ime i lozinka su obavezni.' });
  }

  if (newUsername.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Korisničko ime mora imati bar 3 karaktera.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Lozinka mora imati bar 6 karaktera.' });
  }

  try {
    const authResult = await verifyAdminPasscode(currentPasscode);
    if (!authResult.success) {
      return res.status(401).json({ success: false, error: 'Nevažeća trenutna autorizacija.' });
    }

    const adminsCol = collection(db, 'admins');
    const snapshot = await getDocs(adminsCol);
    let targetDocId = '';
    let docExists = false;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.username && authResult.username && data.username.toLowerCase() === authResult.username.toLowerCase()) ||
        data.passcode === currentPasscode
      ) {
        targetDocId = doc.id;
        docExists = true;
      }
    });

    if (!docExists) {
      targetDocId = authResult.username === 'admin' ? 'default_super_admin' : `admin_${Date.now()}`;
    }

    await setDoc(doc(db, 'admins', targetDocId), {
      username: newUsername.trim(),
      passcode: newPassword,
      role: authResult.role || 'super_admin',
      updated_at: new Date().toISOString()
    }, { merge: true });

    await addAuditLog(currentPasscode, 'Izmena sopstvenih kredencijala', `Admin je promenio korisničko ime u "${newUsername.trim()}".`);

    return res.json({ 
      success: true, 
      message: 'Kredencijali su uspešno promenjeni. Prijavite se ponovo sa novim podacima.',
      newPasscode: newPassword
    });

  } catch (error) {
    console.error('Greška pri promeni kredencijala:', error);
    return res.status(500).json({ success: false, error: 'Sistemska greška pri promeni kredencijala.' });
  }
});

// 1c. Upravljanje svim admin nalozi (Samo Super Admin)
app.get('/api/admin/accounts', superAdminAuthMiddleware, async (req, res) => {
  try {
    const adminsCol = collection(db, 'admins');
    const snapshot = await getDocs(adminsCol);
    const accounts: any[] = [];
    snapshot.forEach((doc) => {
      accounts.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Greška pri dohvatanju admin naloga:', error);
    res.status(500).json({ error: 'Greška pri učitavanju naloga sa baze.' });
  }
});

app.post('/api/admin/accounts', superAdminAuthMiddleware, async (req, res) => {
  try {
    const { username, passcode, role } = req.body;
    if (!username || !passcode || !role) {
      return res.status(400).json({ error: 'Sva polja (korisničko ime, lozinka, uloga) su obavezna.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ error: 'Korisničko ime mora imati bar 3 karaktera.' });
    }

    if (passcode.length < 6) {
      return res.status(400).json({ error: 'Lozinka mora imati bar 6 karaktera.' });
    }

    const adminsCol = collection(db, 'admins');
    const snapshot = await getDocs(adminsCol);
    let exists = false;
    snapshot.forEach((doc) => {
      if (doc.data().username?.toLowerCase() === username.trim().toLowerCase()) {
        exists = true;
      }
    });

    if (exists) {
      return res.status(400).json({ error: 'Korisničko ime već postoji.' });
    }

    const newAdmin = {
      username: username.trim(),
      passcode: passcode,
      role,
      created_at: new Date().toISOString()
    };

    const docId = `admin_${Date.now()}`;
    await setDoc(doc(db, 'admins', docId), newAdmin);

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Kreiranje admin naloga', `Kreiran je nalog sa korisničkim imenom "${username.trim()}" i ulogom "${role}".`);

    res.status(201).json({ success: true, account: { id: docId, ...newAdmin }, message: 'Nalog uspešno kreiran.' });
  } catch (error) {
    console.error('Greška pri kreiranju admin naloga:', error);
    res.status(500).json({ error: 'Greška pri kreiranju naloga: ' + (error instanceof Error ? error.message : String(error)) });
  }
});

app.patch('/api/admin/accounts/:id', superAdminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, passcode, role } = req.body;

    const adminDocRef = doc(db, 'admins', id);
    const docSnap = await getDoc(adminDocRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Nalog nije pronađen.' });
    }

    const updates: any = {};
    if (username !== undefined) {
      if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Korisničko ime mora imati bar 3 karaktera.' });
      }
      updates.username = username.trim();
    }
    if (passcode !== undefined) {
      if (passcode.length < 6) {
        return res.status(400).json({ error: 'Lozinka mora imati bar 6 karaktera.' });
      }
      updates.passcode = passcode;
    }
    if (role !== undefined) {
      updates.role = role;
    }
    updates.updated_at = new Date().toISOString();

    await updateDoc(adminDocRef, updates);

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Izmena admin naloga', `Ažuriran je nalog sa ID-jem "${id}". Izmenjena polja: ${Object.keys(updates).join(', ')}.`);

    res.json({ success: true, message: 'Nalog uspešno ažuriran.' });
  } catch (error) {
    console.error('Greška pri ažuriranju admin naloga:', error);
    res.status(500).json({ error: 'Greška pri ažuriranju naloga.' });
  }
});

app.delete('/api/admin/accounts/:id', superAdminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'default_super_admin') {
      return res.status(400).json({ error: 'Nije dozvoljeno brisanje podrazumevanog Super Admin naloga.' });
    }

    await deleteDoc(doc(db, 'admins', id));
    
    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Brisanje admin naloga', `Obrisan je nalog sa ID-jem "${id}".`);

    res.json({ success: true, message: 'Nalog uspešno obrisan.' });
  } catch (error) {
    console.error('Greška pri brisanju admin naloga:', error);
    res.status(500).json({ error: 'Greška pri brisanju naloga.' });
  }
});

// 2. Prijava novog kandidata (Javna ruta)
app.post('/api/candidates', async (req, res) => {
  try {
    const { ime, telefon, grad, vozilo, iskustvo, kada_poceti, izvor, referral_code } = req.body;

    // Osnovna validacija
    if (!ime || !telefon || !grad || !vozilo || !iskustvo || !kada_poceti) {
      return res.status(400).json({ error: 'Sva obavezna polja moraju biti popunjena.' });
    }

    const candidateData = {
      ime: ime.trim(),
      telefon: telefon.trim(),
      grad: grad.trim(),
      vozilo,
      iskustvo,
      kada_poceti,
      datum_prijave: new Date().toISOString(),
      status: 'NEW',
      izvor: izvor || 'direct',
      referral_code: referral_code || '',
      napomena: '',
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'candidates'), candidateData);
    
    // Pošalji obaveštenje o uspešnoj prijavi (WhatsApp/SMS struktura)
    const welcomeMsg = `Zdravo ${ime.trim()}, tvoja prijava za posao dostavljača u gradu ${grad.trim()} je uspešno primljena! Možeš pratiti status prijave uživo na svom nalogu prijavom sa brojem telefona.`;
    await sendNotification('sms', telefon.trim(), welcomeMsg);
    await sendNotification('whatsapp', telefon.trim(), welcomeMsg);
    
    res.status(201).json({ 
      success: true, 
      id: docRef.id, 
      message: 'Prijava je uspešno podneta. Možete se prijaviti i pratiti status uživo sa vašim brojem telefona.' 
    });
  } catch (error: any) {
    console.error('Greška pri kreiranju kandidata:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom čuvanja vaše prijave.' });
  }
});

// 3. Pribavljanje svih kandidata (Zaštićeno za admina)
app.get('/api/candidates', adminAuthMiddleware, async (req, res) => {
  try {
    const candidatesCol = collection(db, 'candidates');
    const q = query(candidatesCol, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const candidates: any[] = [];
    querySnapshot.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, candidates });
  } catch (error: any) {
    console.error('Greška pri preuzimanju kandidata:', error);
    res.status(500).json({ error: 'Greška prilikom preuzimanja liste kandidata sa baze.' });
  }
});

// 4. Ažuriranje kandidata (Zaštićeno za admina)
app.patch('/api/candidates/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, napomena, email } = req.body;

    const candidateDocRef = doc(db, 'candidates', id);
    const docSnap = await getDoc(candidateDocRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Kandidat nije pronađen.' });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (napomena !== undefined) updates.napomena = napomena.trim();
    if (email !== undefined) updates.email = email.trim();
    updates.last_updated_at = new Date().toISOString();

    await updateDoc(candidateDocRef, updates);

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    const currentData = docSnap.data();
    let changeDetails = `Kandidat: ${currentData.ime} (${currentData.telefon}). `;
    if (status !== undefined && status !== currentData.status) {
      changeDetails += `Status: ${currentData.status || 'Novi'} -> ${status}. `;
    }
    if (napomena !== undefined && napomena.trim() !== (currentData.napomena || '').trim()) {
      changeDetails += `Dodata/izmenjena napomena. `;
    }
    if (email !== undefined && email.trim() !== (currentData.email || '').trim()) {
      changeDetails += `Email: ${currentData.email || 'Nema'} -> ${email.trim()}. `;
    }
    await addAuditLog(currentPasscode, 'Ažuriranje kandidata', changeDetails);

    // Ako je status promenjen, šaljemo obaveštenje (SMS / WhatsApp struktura)
    if (status !== undefined && status !== currentData.status) {
      const message = `Zdravo ${currentData.ime}, status tvoje prijave za dostavljača je promenjen u: ${getStatusLabel(status)}. Prati status uživo na svom nalogu!`;
      await sendNotification('sms', currentData.telefon, message);
      await sendNotification('whatsapp', currentData.telefon, message);
    }

    res.json({ success: true, message: 'Kandidat je uspešno ažuriran.' });
  } catch (error: any) {
    console.error('Greška pri ažuriranju kandidata:', error);
    res.status(500).json({ error: 'Greška prilikom ažuriranja podataka kandidata.' });
  }
});

// 5. Zahtev za OTP (Kandidat login)
app.post('/api/candidate/login-request', async (req, res) => {
  try {
    const { telefon } = req.body;
    if (!telefon) {
      return res.status(400).json({ error: 'Broj telefona je obavezan.' });
    }

    const cleanedInput = cleanPhone(telefon);
    if (!cleanedInput) {
      return res.status(400).json({ error: 'Neispravan format broja telefona.' });
    }

    const candidatesCol = collection(db, 'candidates');
    const querySnapshot = await getDocs(candidatesCol);
    let matchedCandidate: any = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (cleanPhone(data.telefon) === cleanedInput) {
        matchedCandidate = { id: doc.id, ...data };
      }
    });

    if (!matchedCandidate) {
      return res.status(404).json({ error: 'Kandidat sa ovim brojem telefona nije pronađen. Prvo popunite prijavu na sajtu.' });
    }

    // Generisanje 6-cifrenog OTP koda
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // Važi 5 minuta

    activeOTPs.set(cleanedInput, {
      code: otpCode,
      expires,
      candidateId: matchedCandidate.id
    });

    // Simulacija slanja
    const notificationMessage = `Postani Dostavljač: Tvoj jednokratni OTP kod za pristup nalogu je: ${otpCode}. Važi 5 minuta.`;
    await sendNotification('sms', matchedCandidate.telefon, notificationMessage);
    await sendNotification('whatsapp', matchedCandidate.telefon, notificationMessage);

    res.json({ 
      success: true, 
      message: 'OTP kod je uspešno poslat na vaš broj.',
      otp: otpCode 
    });
  } catch (error) {
    console.error('Greška u login-request:', error);
    res.status(500).json({ error: 'Došlo je do sistemske greške prilikom slanja OTP koda.' });
  }
});

// 6. Verifikacija OTP-a
app.post('/api/candidate/login-verify', async (req, res) => {
  try {
    const { telefon, code } = req.body;
    if (!telefon || !code) {
      return res.status(400).json({ error: 'Broj telefona i OTP kod su obavezni.' });
    }

    const cleanedInput = cleanPhone(telefon);
    const activeOTP = activeOTPs.get(cleanedInput);

    if (!activeOTP) {
      return res.status(400).json({ error: 'OTP kod nije zatražen za ovaj broj telefona.' });
    }

    if (Date.now() > activeOTP.expires) {
      activeOTPs.delete(cleanedInput);
      return res.status(400).json({ error: 'OTP kod je istekao. Molimo zatražite novi.' });
    }

    if (activeOTP.code !== code.trim()) {
      return res.status(400).json({ error: 'Uneli ste pogrešan OTP kod.' });
    }

    // Uspešna verifikacija! Kreiranje sesije
    const candidateId = activeOTP.candidateId;
    activeOTPs.delete(cleanedInput);

    const candidateDocRef = doc(db, 'candidates', candidateId);
    const session_token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const token_expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dana

    await updateDoc(candidateDocRef, {
      session_token,
      token_expires
    });

    res.json({ 
      success: true, 
      token: session_token, 
      candidateId,
      message: 'Uspešna prijava.' 
    });
  } catch (error) {
    console.error('Greška u login-verify:', error);
    res.status(500).json({ error: 'Sistemska greška tokom verifikacije koda.' });
  }
});

// 7. Privatni profil kandidata (Samo za ulogovanog kandidata)
app.get('/api/candidate/profile', async (req, res) => {
  try {
    const token = req.headers['x-candidate-token'] as string;
    if (!token) {
      return res.status(401).json({ error: 'Niste prijavljeni.' });
    }

    const candidatesCol = collection(db, 'candidates');
    const querySnapshot = await getDocs(candidatesCol);
    let matchedCandidate: any = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.session_token === token) {
        const expires = data.token_expires ? new Date(data.token_expires) : null;
        if (expires && expires > new Date()) {
          matchedCandidate = { id: doc.id, ...data };
        }
      }
    });

    if (!matchedCandidate) {
      return res.status(401).json({ error: 'Sesija je istekla ili je nevažeća. Molimo prijavite se ponovo.' });
    }

    // Sakrij poverljive podatke pre slanja
    const { session_token, token_expires, ...publicProfile } = matchedCandidate;
    res.json({ success: true, candidate: publicProfile });
  } catch (error) {
    console.error('Greška pri dohvatanju profila:', error);
    res.status(500).json({ error: 'Sistemska greška pri učitavanju profila.' });
  }
});

// --- BLOG, SEO i MARKETING ANALITIKA ---

const INITIAL_BLOG_POSTS = [
  {
    title: "Maksimalna zarada na Wolt platformi: Kompletan vodič",
    slug: "maksimalna-zarada-na-wolt-platformi-vodic",
    summary: "Saznajte kako iskusni Wolt dostavljači optimizuju svoje vreme, koriste bonuse i ostvaruju zarade preko 150.000 RSD mesečno.",
    content: `Rad kao Wolt dostavljač pruža neverovatnu fleksibilnost, ali prava razlika između prosečne i vrhunske zarade leži u strategiji. Iskusni dostavljači ne rade duže, već pametnije. U ovom vodiču otkrivamo proverene metode za maksimizaciju tvojih prihoda.

### 1. Rad u udarnim terminima (Peak Hours)
Najveći broj porudžbina, a samim tim i najveći bonusi, ostvaruju se u sledećim terminima:
* **Ručak:** Svaki dan od 11:30 do 14:30
* **Večera:** Svaki dan od 18:00 do 21:30
* **Vikendi:** Petak uveče, subota i nedelja ceo dan

Tokom ovih sati, potražnja je tolika da sistem često aktivira dodatne bonuse po dostavi (npr. +50 do +100 dinara po isporuci).

### 2. Iskoristi nedeljne bonuse za broj dostava
Wolt i partnerske agencije često nagrađuju lojalnost i konstantnost kroz nedeljne pragove. Na primer:
* Za ostvarenih 50 dostava u nedelji dobijaš dodatni bonus.
* Za ostvarenih 100 dostava bonus se značajno uvećava.

Planiraj svoje sate tako da uvek pređeš sledeći prag i osiguraš dodatni novac na isplati.

### 3. Poznavanje "Vrelih zona" (Hot zones)
U Beogradu i Novom Sadu postoje delovi grada sa ekstremno visokom koncentracijom restorana. Pozicioniranje blizu ovih lokacija skraćuje vreme čekanja na novu porudžbinu:
* **Beograd:** Novi Beograd (oko YU biznis centra), Stari Grad, Vračar.
* **Novi Sad:** Centar, Grbavica, Liman.

### 4. Oprema i priprema vozila
Bilo da voziš bicikl, skuter ili automobil, tehnička ispravnost je ključ. Svaki sat proveden u kvaru je izgubljen novac. Električni bicikli i skuteri se pokazuju kao najisplativiji jer nemaju troškove goriva i lako se parkiraju, što štedi dragoceno vreme u gradu.`,
    cover_image: "/assets/images/blog_post_zarada_wolt_1783427588712.webp",
    author: "Deliverix Marketing",
    tags: ["Zarada", "Saveti", "Wolt"],
    read_time: "5 min",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    views: 142
  },
  {
    title: "Bicikl, skuter ili automobil? Izbor idealnog vozila",
    slug: "bicikl-skuter-ili-automobil-izbor-vozila",
    summary: "Koji prevoz donosi najveći profit kada se saberu troškovi goriva, održavanja i brzina dostave u gradskim gužvama?",
    content: `Jedno od najčešćih pitanja koja dobijamo od novih kandidata jeste: "Koje vozilo je najbolje za dostavu?". Svako vozilo ima svoje prednosti i mane, a izbor zavisi od tvojih ciljeva, grada u kom radiš i budžeta.

### 1. Električni i klasični bicikl (Ekološki i najjeftiniji)
Bicikl je idealan za start jer ima nulte troškove goriva i održavanja.
* **Prednosti:** Nema troškova za gorivo, registraciju i parking. Lako kretanje kroz pešačke zone i prečice.
* **Mane:** Zahteva fizičku spremnost (kod klasičnih bicikala). Rad tokom pljuskova ili snega je otežan.
* **Preporuka:** Električni bicikl je apsolutni šampion gradske dostave. Donosi brzinu skutera uz troškove običnog bicikla.

### 2. Skuter i motor (Najbrži u gužvama)
Skuter od 50cc ili jači motor je najčešći izbor profesionalnih dostavljača.
* **Prednosti:** Izuzetna brzina u saobraćajnim špicevima. Minimalni napor u poređenju sa biciklom. Lako nalaženje parkinga direktno ispred restorana i zgrada.
* **Mane:** Troškovi goriva, servisa i registracije. Izloženost vremenskim prilikama.
* **Preporuka:** Idealan za Beograd i brdovite delove grada gde je bicikl sporiji.

### 3. Automobil (Udobnost i rad po lošem vremenu)
Automobil pruža maksimalni komfor, ali nosi i najveće operativne troškove.
* **Prednosti:** Udobnost tokom cele godine (klima, grejanje, suvo). Rad noću i po lošem vremenu (kada su i najveće gužve i bonusi).
* **Mane:** Velika potrošnja goriva, skupo održavanje i ogroman problem sa parkingom u centru grada.
* **Preporuka:** Odličan za prigradska naselja ili za rad tokom hladnih zimskih dana i noćnih smena.`,
    cover_image: "/assets/images/blog_post_izbor_vozila_1783427588712.webp",
    author: "Deliverix Saveti",
    tags: ["Vozila", "Saveti", "Početak"],
    read_time: "4 min",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    views: 95
  },
  {
    title: "Kako uskladiti predavanja na fakultetu i rad na terenu",
    slug: "kako-uskladiti-predavanja-i-rad-na-terenu",
    summary: "Kako studenti uspevaju da zarade odličan džeparac, održe status na fakultetu i sami biraju svoje radne sate.",
    content: `Rad kao dostavljač postao je najpopularniji studentski posao u Srbiji. Razlog je jednostavan: ni jedan drugi posao ne pruža mogućnost da bukvalno sami odlučujete kada radite, bez šefova i fiksnih smena.

### Kako to izgleda u praksi?
Ukoliko imaš predavanja ponedeljkom i sredom prepodne, tvoj raspored može izgledati ovako:
* **Ponedeljak:** Predavanja do 14h, učenje, a zatim rad od 18h do 21h (večernji špic).
* **Utorak:** Slobodan dan za fakultet.
* **Petak i subota:** Rad u udarnim terminima kada su zarade najveće.

### Prednosti za studente
1. **Fleksibilnost iznad svega:** Ako imaš ispitni rok, možeš jednostavno pauzirati rad na dve nedelje bez ikakvog objašnjavanja ili otkaznog roka. Kada ispit prođe, samo se ponovo uloguješ.
2. **Brza isplata:** Isplata džeparca svake dve nedelje pruža stabilnost i pomaže oko plaćanja kirije, školarine i izlazaka.
3. **Rad preko omladinske zadruge:** Partnerske agencije nude posebne modele prijave za studente mlađe od 26 godina, što smanjuje doprinose i povećava tvoju neto zaradu po satu.

### Kako početi?
Prijavi se na našem portalu, naznači da si student i u razgovoru sa našim mentorom izaberi agenciju koja ima najbolje uslove i saradnju sa omladinskim zadrugama.`,
    cover_image: "/assets/images/blog_post_studenti_rad_1783427588712.webp",
    author: "Deliverix Student",
    tags: ["Studenti", "Iskustva", "Wolt"],
    read_time: "3 min",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    views: 211
  }
];

async function seedBlogPostsIfNeeded() {
  try {
    const colRef = collection(db, 'blog_posts');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Inicijalizacija blog postova u Firestore...');
      for (const post of INITIAL_BLOG_POSTS) {
        await setDoc(doc(db, 'blog_posts', post.slug), post);
      }
      console.log('Uspesno kreirani početni blog postovi!');
    }
  } catch (error) {
    console.error('Greška pri inicijalizaciji blog postova:', error);
  }
}

// A. Čitanje svih blog postova (Javna ruta)
app.get('/api/blog-posts', async (req, res) => {
  try {
    await seedBlogPostsIfNeeded();
    const colRef = collection(db, 'blog_posts');
    const snapshot = await getDocs(colRef);
    const posts: any[] = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    // Sortiraj po datumu opadajuće
    posts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Greška pri dohvatanju blog postova:', error);
    res.status(500).json({ error: 'Greška pri učitavanju blog postova.' });
  }
});

// B. Čitanje pojedinačnog blog posta (Javna ruta)
app.get('/api/blog-posts/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let postDoc = await getDoc(doc(db, 'blog_posts', idOrSlug));
    let post: any = null;
    
    if (postDoc.exists()) {
      post = { id: postDoc.id, ...postDoc.data() };
    } else {
      // Pretraga po polju 'slug'
      const colRef = collection(db, 'blog_posts');
      const snapshot = await getDocs(colRef);
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.slug === idOrSlug) {
          post = { id: doc.id, ...data };
        }
      });
    }

    if (!post) {
      return res.status(404).json({ error: 'Blog post nije pronađen.' });
    }

    // Povećaj broj pregleda
    try {
      const updatedViews = (post.views || 0) + 1;
      await updateDoc(doc(db, 'blog_posts', post.id), { views: updatedViews });
      post.views = updatedViews;
    } catch (e) {
      console.error('Greška pri ažuriranju pregleda:', e);
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error('Greška pri dohvatanju blog posta:', error);
    res.status(500).json({ error: 'Greška pri učitavanju blog posta.' });
  }
});

// C. Kreiranje novog blog posta (Zaštićena ruta - Marketing/Super Admin)
app.post('/api/blog-posts', marketingAuthMiddleware, async (req, res) => {
  try {
    const { title, slug, content, summary, cover_image, author, tags, read_time } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Naslov i sadržaj su obavezni.' });
    }
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPost = {
      title,
      slug: finalSlug,
      content,
      summary: summary || '',
      cover_image: cover_image || '/assets/images/blog_post_default_cover_1783427588712.webp',
      author: author || 'Deliverix Marketing',
      tags: Array.isArray(tags) ? tags : [],
      read_time: read_time || '3 min',
      created_at: new Date().toISOString(),
      views: 0
    };

    await setDoc(doc(db, 'blog_posts', finalSlug), newPost);
    
    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Kreiranje blog posta', `Kreiran je blog post sa naslovom "${title}" i slugom "${finalSlug}".`);

    res.json({ success: true, post: { id: finalSlug, ...newPost } });
  } catch (error) {
    console.error('Greška pri kreiranju blog posta:', error);
    res.status(500).json({ error: 'Greška pri kreiranju blog posta.' });
  }
});

// D. Izmena blog posta (Zaštićena ruta - Marketing/Super Admin)
app.patch('/api/blog-posts/:id', marketingAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const docRef = doc(db, 'blog_posts', id);
    await updateDoc(docRef, updateData);
    
    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Izmena blog posta', `Ažuriran je blog post sa ID-jem/slugom "${id}".`);

    res.json({ success: true, message: 'Blog post uspešno ažuriran.' });
  } catch (error) {
    console.error('Greška pri ažuriranju blog posta:', error);
    res.status(500).json({ error: 'Greška pri ažuriranju blog posta.' });
  }
});

// E. Brisanje blog posta (Zaštićena ruta - Marketing/Super Admin)
app.delete('/api/blog-posts/:id', marketingAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'blog_posts', id));
    
    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Brisanje blog posta', `Obrisan je blog post sa ID-jem/slugom "${id}".`);

    res.json({ success: true, message: 'Blog post uspešno obrisan.' });
  } catch (error) {
    console.error('Greška pri brisanju blog posta:', error);
    res.status(500).json({ error: 'Greška pri brisanju blog posta.' });
  }
});

// Javni robots.txt za pretraživače poput Google-a
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = req.get('host') || 'www.deliverix.rs';
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Blokiranje AI botova od skrejpovanja sadržaja za trening modela
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Anthropic-AI
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

Sitemap: ${protocol}://${host}/sitemap.xml`);
});

// Google Search Console HTML verifikacioni fajl
app.get('/google1f8ec4094801bee1.html', (req, res) => {
  res.type('text/html');
  res.send('google-site-verification: google1f8ec4094801bee1.html');
});

// Dinamički sitemap.xml koji listira landing stranicu, blog i sve pojedinačne blog članke direktno iz baze
app.get('/sitemap.xml', async (req, res) => {
  res.type('application/xml');
  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.get('host') || 'www.deliverix.rs';
    const baseUrl = `${protocol}://${host}`;
    
    const staticPages = [
      '',
      '/blog',
      '/privacy-policy',
      '/terms-of-service',
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Dodaj statičke stranice
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Dinamički dodaj blog postove iz baze kako bi Google odmah video svaki novi članak
    try {
      const colRef = collection(db, 'blog_posts');
      const snapshot = await getDocs(colRef);
      snapshot.forEach(docSnap => {
        const post = docSnap.data();
        const slug = post.slug || docSnap.id;
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
    } catch (dbErr) {
      console.error('Greška pri čitanju blog postova za sitemap:', dbErr);
    }

    sitemap += `
</urlset>`;
    res.send(sitemap);
  } catch (error) {
    console.error('Greška pri kreiranju sitemap.xml:', error);
    res.status(500).send('Greška na serveru');
  }
});

// F. Čitanje SEO i sajta podešavanja (Javna ruta)
app.get('/api/marketing/seo', async (req, res) => {
  try {
    const defaultSettings = {
      meta_title: "Postani Dostavljač | Deliverix Srbija",
      meta_description: "Prijavi se za rad na Wolt, Glovo ili drugim dostavnim platformama. Odlični uslovi, fleksibilno radno vreme i podrška.",
      ga_measurement_id: "G-XXXXXXXXXX",
      homepage_subtitle: "Odlična zarada, fleksibilno vreme i podrška mentora. Prijavi se za samo 2 minuta i kreni sa radom!",
      announcement_banner: "Slobodna mesta za nove dostavljače u Beogradu i Novom Sadu! Prijavi se već danas.",
      support_phone: "+381 60 123 4567",
      logo_style: "custom",
      logo_url: "/assets/images/logo_custom.png",
      logo_blend_mode: "normal",
      hero_title: "Dostava koja se prilagođava tvojim pravilima",
      hero_platform_title: "Wolt i Glovo platforme u Srbiji",
      hero_right_mode: "image",
      hero_image_url: "/assets/images/delivery_courier_hero_1783427588712.jpg",
      hero_badge_title: "Dostupno odmah",
      hero_badge_text: "Pomoć oko zaposlenja je 100% besplatna!",
      hero_image_alt: "Dostavljač hrane - Wolt Glovo Srbija",
      hero_enabled: true,
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
      steps_enabled: true,
      requirements_enabled: true,
      rent_enabled: false,
      target_audience_enabled: true,
      blog_enabled: true,
      faq_enabled: true,
      footer_cta_enabled: true,
      rent_bike_enabled: true,
      rent_scooter_enabled: true,
      rent_car_enabled: true,
      why_choose_us_title: "Zašto kandidati biraju nas?",
      why_choose_us_subtitle: "Naša usluga posredovanja, podrške i savetovanja je potpuno besplatna za sve kandidate. Nemamo nikakve skrivene naknade, članarine niti uzimamo procenat od tvoje zarade.",
      why_choose_us_items: [
        "Besplatna obuka i priprema za start",
        "0 RSD troškova za našu podršku",
        "Povezivanje sa najpouzdanijim partnerima",
        "Dostupni smo ti za sva pitanja – uvek besplatno"
      ],
      steps_title: "Kako funkcioniše proces?",
      steps_subtitle: "Od prijave do tvoje prve isplate deli te samo nekoliko jednostavnih koraka",
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
      rent_section_title: "Prevozno sredstvo i oprema za rad",
      rent_section_text: "Ukoliko nemaš sopstveno prevozno sredstvo, u partnerskim agencijama te mogu uputiti na najbolje opcije za nabavku ili korišćenje adekvatne opreme.",
      rent_items: [
        {
          title: "Električni bicikl",
          desc: "Korisna opcija za brzu dostavu po gradskim jezgrima sa minimalnim naporom.",
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
          enabled: true,
          available: false
        }
      ],
      why_apply_title: "Zašto se prijaviti preko nas?",
      why_apply_desc: "Kao nezavisna platforma za podršku, pomažemo ti da pronađeš partnersku agenciju koja nudi najbolje uslove za tvoj profil. To za tebe znači:",
      why_apply_items: [
        { title: "Sloboda izbora modela", desc: "Biraš model saradnje i dinamiku rada koji najviše odgovaraju tvojim ličnim potrebama." },
        { title: "Najbolja provizija", desc: "Spajamo te sa agencijama koje nude najpovoljnije uslove i najmanji procenat." },
        { title: "Brza podrška", desc: "Naš mentorski tim ti pomaže oko aplikacije i rešavanja bilo kakvih problema na terenu." },
        { title: "Brz start i obuka", desc: "Pomažemo ti u brzom pokretanju naloga i pružamo besplatne savete pre prve dostave." }
      ],
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
      ],
      footer_cta_title: "Započni svoju dostavljačku karijeru danas",
      footer_cta_desc: "Nemoj odlagati priliku za odličnu zaradu i potpunu slobodu. Registracija te ništa ne košta i ne obavezuje te ni na šta. Pomažemo ti oko celog procesa besplatno.",
      footer_disclaimer: "Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne.",

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

      // Footer & Company Info
      footer_company_name: "Deliverix Srbija",
      footer_description: "Besplatne konsultacije i posredovanje pri zapošljavanju dostavljača.",
      footer_legal_disclaimer: "Izjava o odgovornosti: Mi nismo zvanični predstavnici niti deo kompanija Wolt, Glovo ili drugih dostavnih platformi. Mi smo nezavisni informativni portal koji pomaže kandidatima da se lakše povežu sa registrovanim partnerskim agencijama za dostavu u Republici Srbiji."
    };

    const docRef = doc(db, 'site_configs', 'settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const merged = { ...defaultSettings, ...docSnap.data() };
      res.json({ success: true, settings: merged });
    } else {
      res.json({ success: true, settings: defaultSettings });
    }
  } catch (error) {
    console.error('Greška pri dohvatanju SEO podešavanja:', error);
    res.status(500).json({ error: 'Greška pri učitavanju SEO podešavanja.' });
  }
});

// G1. Lagani javni SEO i logotip endpoint za bolje performanse (Faza 2)
app.get('/api/marketing/seo-public', async (req, res) => {
  try {
    const docRef = doc(db, 'site_configs', 'settings');
    const docSnap = await getDoc(docRef);
    
    const baseSettings = {
      meta_title: "Postani Dostavljač | Deliverix Srbija",
      meta_description: "Prijavi se za rad na Wolt, Glovo ili drugim dostavnim platformama. Odlični uslovi, fleksibilno radno vreme i podrška.",
      keywords: "posao dostavljaca, wolt, glovo, srbija, beograd, dostava hrane",
      og_image: "/public/og-image.jpg",
      canonical: "https://deliverix.rs",
      ga_measurement_id: "G-XXXXXXXXXX",
      logo_style: "custom",
      logo_blend_mode: "normal"
    };

    if (docSnap.exists()) {
      const data = docSnap.data();
      const filtered = {
        meta_title: data.meta_title || baseSettings.meta_title,
        meta_description: data.meta_description || baseSettings.meta_description,
        keywords: data.keywords || baseSettings.keywords,
        og_image: data.og_image || data.ogImage || baseSettings.og_image,
        canonical: data.canonical || baseSettings.canonical,
        ga_measurement_id: data.ga_measurement_id || baseSettings.ga_measurement_id,
        logo_style: data.logo_style || baseSettings.logo_style,
        logo_blend_mode: data.logo_blend_mode || baseSettings.logo_blend_mode
      };
      
      const responsePayload = { success: true, settings: filtered };
      console.log("SEO PUBLIC SIZE:", JSON.stringify(responsePayload).length);
      res.json(responsePayload);
    } else {
      const responsePayload = { success: true, settings: baseSettings };
      console.log("SEO PUBLIC SIZE:", JSON.stringify(responsePayload).length);
      res.json(responsePayload);
    }
  } catch (error) {
    console.error('Greška pri dohvatanju javnog SEO:', error);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// Globalni keš za SEO podatke (za brzi SSR)
let seoCache: {
  meta_title: string;
  meta_description: string;
  timestamp: number;
} | null = null;
const SEO_CACHE_DURATION = 5 * 60 * 1000; // 5 minuta

// G. Čuvanje SEO i sajta podešavanja (Zaštićena ruta - Marketing/Super Admin)
app.post('/api/marketing/seo', marketingAuthMiddleware, async (req, res) => {
  try {
    const settings = req.body;
    await setDoc(doc(db, 'site_configs', 'settings'), settings);
    seoCache = null; // Invalidiraj keš nakon čuvanja novih podešavanja

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Izmena SEO i podešavanja sajta', 'Ažurirana su SEO podešavanja, Hero sekcija, sekcije ili česta pitanja.');

    res.json({ success: true, message: 'SEO i podešavanja sajta su uspešno sačuvani.' });
  } catch (error) {
    console.error('Greška pri čuvanju SEO podešavanja:', error);
    res.status(500).json({ error: 'Greška pri čuvanju SEO podešavanja.' });
  }
});

// G2. Preuzimanje Dnevnika Aktivnosti (Zaštićena ruta - Super Admin)
app.get('/api/admin/audit-logs', superAdminAuthMiddleware, async (req, res) => {
  try {
    const logsCol = collection(db, 'audit_logs');
    const q = query(logsCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const logs: any[] = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Greška pri učitavanju audit logova:', error);
    res.status(500).json({ error: 'Greška pri učitavanju dnevnika aktivnosti.' });
  }
});

// G3. Preuzimanje SMTP Email Podešavanja (Zaštićena ruta - Super Admin)
app.get('/api/admin/mail-config', superAdminAuthMiddleware, async (req, res) => {
  try {
    const configRef = doc(db, 'site_configs', 'mail_settings');
    const docSnap = await getDoc(configRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      res.json({
        success: true,
        smtp_email: data.smtp_email || '',
        sender_name: data.sender_name || '',
        sender_alias: data.sender_alias || '',
        has_password: !!data.smtp_password
      });
    } else {
      res.json({
        success: true,
        smtp_email: '',
        sender_name: '',
        sender_alias: '',
        has_password: false
      });
    }
  } catch (error) {
    console.error('Greška pri dohvatanju mail podešavanja:', error);
    res.status(500).json({ error: 'Greška pri učitavanju email podešavanja.' });
  }
});

// G4. Čuvanje SMTP Email Podešavanja (Zaštićena ruta - Super Admin)
app.post('/api/admin/mail-config', superAdminAuthMiddleware, async (req, res) => {
  try {
    const { smtp_email, smtp_password, sender_name, sender_alias } = req.body;
    const configRef = doc(db, 'site_configs', 'mail_settings');
    const docSnap = await getDoc(configRef);
    
    const updates: any = {
      smtp_email: smtp_email?.trim() || '',
      sender_name: sender_name?.trim() || '',
      sender_alias: sender_alias?.trim() || ''
    };
    
    // Ako je uneta nova lozinka, sačuvaj je, inače zadrži staru
    if (smtp_password && smtp_password.trim() !== '') {
      updates.smtp_password = smtp_password.trim();
    } else if (docSnap.exists()) {
      const oldData = docSnap.data();
      if (oldData.smtp_password) {
        updates.smtp_password = oldData.smtp_password;
      }
    }
    
    await setDoc(configRef, updates);

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Izmena SMTP podešavanja', `Ažurirana su SMTP podešavanja za email adresu "${smtp_email}".`);

    res.json({ success: true, message: 'Email podešavanja su uspešno sačuvana.' });
  } catch (error) {
    console.error('Greška pri čuvanju mail podešavanja:', error);
    res.status(500).json({ error: 'Greška pri čuvanju email podešavanja.' });
  }
});

// G5. Slanje email-a kandidatu (Zaštićena ruta - Super Admin)
app.post('/api/admin/send-candidate-email', superAdminAuthMiddleware, async (req, res) => {
  try {
    const { candidateId, to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Sva polja (Primalac, Naslov, Sadržaj) su obavezna.' });
    }

    // 1. Učitavanje SMTP konfiguracije
    const configRef = doc(db, 'site_configs', 'mail_settings');
    const configSnap = await getDoc(configRef);
    if (!configSnap.exists()) {
      return res.status(400).json({ error: 'SMTP podešavanja nisu konfigurisana. Molimo podesite Gmail SMTP nalog u Podešavanjima.' });
    }

    const configData = configSnap.data();
    if (!configData.smtp_email || !configData.smtp_password) {
      return res.status(400).json({ error: 'SMTP podešavanja su nepotpuna. Molimo podesite Gmail adresu i lozinku aplikacije.' });
    }

    // 2. Slanje email-a pomoću nodemailer-a
    const nodemailer = await import('nodemailer');
    const createTransport = nodemailer.createTransport || (nodemailer as any).default?.createTransport;
    
    if (!createTransport) {
      return res.status(500).json({ error: 'Nodemailer instanca nije mogla biti inicijalizovana.' });
    }

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: configData.smtp_email,
        pass: configData.smtp_password
      }
    });

    const fromHeader = configData.sender_name 
      ? `"${configData.sender_name}" <${configData.sender_alias || configData.smtp_email}>`
      : configData.smtp_email;

    await transporter.sendMail({
      from: fromHeader,
      to: to.trim(),
      subject: subject.trim(),
      text: body,
      replyTo: configData.sender_alias || configData.smtp_email
    });

    // 3. Ako imamo candidateId, ažuriramo kandidata:
    // - Ako je status bio NEW, stavljamo CONTACTED
    // - Dodajemo napomenu o uspešnom slanju
    if (candidateId) {
      const candidateDocRef = doc(db, 'candidates', candidateId);
      const candSnap = await getDoc(candidateDocRef);
      if (candSnap.exists()) {
        const candData = candSnap.data();
        const updates: any = {};
        
        // Status prelaz
        if (candData.status === 'NEW') {
          updates.status = 'CONTACTED';
        }
        
        // Dopisivanje beleške
        const dateStr = new Date().toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
        const logLine = `\n[SISTEM - ${dateStr} u ${timeStr}] Poslat email na ${to} sa naslovom "${subject}".`;
        
        const currentNapomena = candData.napomena || '';
        updates.napomena = currentNapomena ? `${currentNapomena}${logLine}` : logLine.trim();
        updates.last_updated_at = new Date().toISOString();
        
        await updateDoc(candidateDocRef, updates);
      }
    }

    res.json({ success: true, message: 'Email je uspešno poslat!' });
    
    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Slanje email-a', `Poslat je email na adresu "${to}" sa naslovom "${subject}".`);
  } catch (error: any) {
    console.error('Greška pri slanju email-a:', error);
    res.status(500).json({ error: `Greška pri slanju email-a: ${error.message || error}` });
  }
});

// G2. Upload logotipa (Zaštićena ruta - Marketing/Super Admin)
app.post('/api/marketing/upload-logo', marketingAuthMiddleware, async (req, res) => {
  try {
    const { logoData, type } = req.body;
    if (!logoData) {
      return res.status(400).json({ error: 'Nije poslata slika.' });
    }

    const matches = logoData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Neispravan format slike.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Limitiranje veličine na 600KB
    if (buffer.length > 600 * 1024) {
      return res.status(400).json({ error: 'Slika je prevelika. Maksimalna veličina logotipa je 600KB.' });
    }

    const filename = 'logo_custom.png';
    const stableUrl = '/assets/images/logo_custom.png';

    // 1. Snimanje u public folder (kako bi preživelo build/deploy/commit)
    const publicImgDir = path.join(process.cwd(), 'public', 'assets', 'images');
    if (!fs.existsSync(publicImgDir)) {
      fs.mkdirSync(publicImgDir, { recursive: true });
    }
    const publicFilePath = path.join(publicImgDir, filename);
    fs.writeFileSync(publicFilePath, buffer);

    // 2. Snimanje u dist folder (kako bi bilo instant vidljivo na trenutno pokrenutom serveru)
    const distImgDir = path.join(process.cwd(), 'dist', 'assets', 'images');
    if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
      if (!fs.existsSync(distImgDir)) {
        fs.mkdirSync(distImgDir, { recursive: true });
      }
      const distFilePath = path.join(distImgDir, filename);
      fs.writeFileSync(distFilePath, buffer);
    }

    // 3. Ažuriranje Firestore-a direktno na stabilnu putanju kako bi se sprečile greške
    const settingsRef = doc(db, 'site_configs', 'settings');
    const updateObj: any = {
      logo_url: '/assets/images/logo_custom.png',
      logo_style: 'custom'
    };
    await updateDoc(settingsRef, updateObj);

    const currentPasscode = req.headers['x-admin-passcode'] as string;
    await addAuditLog(currentPasscode, 'Upload logotipa', `Otpremljen je novi logotip i sačuvan na stabilnoj putanji.`);

    res.json({ success: true, logoUrl: stableUrl });
  } catch (error) {
    console.error('Greška pri uploadu logotipa:', error);
    res.status(500).json({ error: 'Greška pri čuvanju logotipa na serveru.' });
  }
});

// H. Marketing statistika i analitika bez privatnih podataka kandidata (Zaštićena ruta)
app.get('/api/marketing/analytics', marketingAuthMiddleware, async (req, res) => {
  try {
    const candidatesCol = collection(db, 'candidates');
    const snapshot = await getDocs(candidatesCol);
    
    let total = 0;
    const sources: { [key: string]: number } = {};
    const cities: { [key: string]: number } = {};
    const vehicles: { [key: string]: number } = {};
    const statuses: { [key: string]: number } = {};
    const timeline: { [key: string]: number } = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      total++;
      
      const src = data.izvor || 'direktno';
      sources[src] = (sources[src] || 0) + 1;

      const city = data.grad || 'Ostalo';
      cities[city] = (cities[city] || 0) + 1;

      const vehicle = data.vozilo || 'Ostalo';
      vehicles[vehicle] = (vehicles[vehicle] || 0) + 1;

      const status = data.status || 'NEW';
      statuses[status] = (statuses[status] || 0) + 1;

      if (data.created_at) {
        const dateStr = data.created_at.substring(0, 10);
        timeline[dateStr] = (timeline[dateStr] || 0) + 1;
      }
    });

    const timelineData: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      timelineData.push({
        date: dateStr,
        count: timeline[dateStr] || 0
      });
    }

    res.json({
      success: true,
      stats: {
        total,
        sources,
        cities,
        vehicles,
        statuses,
        timeline: timelineData
      }
    });
  } catch (error) {
    console.error('Greška pri računanju marketing analitike:', error);
    res.status(500).json({ error: 'Greška pri učitavanju marketing analitike.' });
  }
});

// --- VITE ILI STATIČKI FAJLOVI ---

// Funkcija za dinamičko ubacivanje SEO tagova na serverskoj strani (SSR)
async function serveIndexWithSEO(req: any, res: any, indexPath: string, preloadedHtml?: string) {
  try {
    // Automatski osiguraj da su blog postovi inicijalizovani u bazi
    try {
      await seedBlogPostsIfNeeded();
    } catch (seedErr) {
      console.error('Greška pri auto-seedu u SSR:', seedErr);
    }

    if (!preloadedHtml && !fs.existsSync(indexPath)) {
      return res.status(404).send('Index fajl nije pronađen.');
    }

    let html = preloadedHtml || fs.readFileSync(indexPath, 'utf8');

    // Podrazumevane SEO vrednosti (optimizovane i skraćene prema SEO standardima)
    let meta_title = "Wolt i Glovo Dostavljač Beograd | Deliverix";
    let meta_description = "Želiš posao sa fleksibilnim radnim vremenom i zaradom do 150.000 RSD? Prijavi se za rad na Wolt i Glovo platformama preko Deliverix-a. Besplatno!";
    let hasCustomSeo = false;
    let blogPostData: any = null;
    let siteSettingsData: any = null;

    const urlPath = req.path || '/';
    let isBlogPost = false;
    let blogSlug = '';

    // Provera da li je u pitanju pojedinačna stranica bloga
    if (urlPath.startsWith('/blog/') && urlPath.length > 6) {
      blogSlug = urlPath.substring(6);
      if (blogSlug && blogSlug !== 'all' && !blogSlug.includes('.')) {
        isBlogPost = true;
      }
    }

    // 1. Dohvatanje podešavanja i eventualno blog posta iz baze
    try {
      // Uvek dohvati globalna podešavanja (zbog FAQ i opštih meta tagova)
      const settingsRef = doc(db, 'site_configs', 'settings');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        siteSettingsData = settingsSnap.data();
        if (!isBlogPost) {
          if (siteSettingsData.meta_title) meta_title = siteSettingsData.meta_title;
          if (siteSettingsData.meta_description) meta_description = siteSettingsData.meta_description;
        }
      }

      // Ako je blog post, dohvati specifične podatke za taj članak
      if (isBlogPost) {
        const postRef = doc(db, 'blog_posts', blogSlug);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          blogPostData = postSnap.data();
          if (blogPostData) {
            meta_title = `${blogPostData.title} | Deliverix Blog`;
            meta_description = blogPostData.excerpt || 
              (blogPostData.content ? blogPostData.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...' : meta_description);
            hasCustomSeo = true;
          }
        }
      }
    } catch (dbErr) {
      console.error('Greška pri dohvatanju SEO podataka iz baze:', dbErr);
    }

    // Bezbedno eskapovanje za HTML atribute
    const escapeHtmlAttr = (str: string) => {
      if (!str) return '';
      return str
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    const escapedTitle = escapeHtmlAttr(meta_title);
    const escapedDesc = escapeHtmlAttr(meta_description);

    // 2. Dinamičko generisanje i ubacivanje JSON-LD Schema Markup-a
    let schemas: string[] = [];

    // A. Breadcrumb Schema (Uvek korisna za strukturu)
    const breadcrumbList: any[] = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Početna",
        "item": "https://deliverix.rs"
      }
    ];

    if (isBlogPost && blogPostData) {
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://deliverix.rs/blog"
      });
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 3,
        "name": blogPostData.title,
        "item": `https://deliverix.rs/blog/${blogSlug}`
      });
    } else if (urlPath === '/blog') {
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://deliverix.rs/blog"
      });
    } else if (urlPath === '/privacy-policy') {
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Politika privatnosti",
        "item": "https://deliverix.rs/privacy-policy"
      });
    } else if (urlPath === '/terms-of-service') {
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Uslovi korišćenja",
        "item": "https://deliverix.rs/terms-of-service"
      });
    }

    schemas.push(JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    }));

    // B. Blog-Specific Schema (Samo za članke)
    if (isBlogPost && blogPostData) {
      schemas.push(JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://deliverix.rs/blog/${blogSlug}`
        },
        "headline": blogPostData.title,
        "description": blogPostData.excerpt || meta_description,
        "image": blogPostData.coverUrl || "https://deliverix.rs/logo.png",
        "datePublished": blogPostData.createdAt || new Date().toISOString(),
        "dateModified": blogPostData.updatedAt || blogPostData.createdAt || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": blogPostData.author || "Deliverix"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Deliverix",
          "logo": {
            "@type": "ImageObject",
            "url": "https://deliverix.rs/logo.png"
          }
        }
      }));
    }

    // C. FAQ Schema (Za početnu stranu ako postoje pitanja)
    if (!isBlogPost && siteSettingsData && siteSettingsData.faqs && Array.isArray(siteSettingsData.faqs) && siteSettingsData.faqs.length > 0) {
      schemas.push(JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": siteSettingsData.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }));
    }

    // Spoji sve šeme u HTML scripts
    const schemaHtml = schemas.map(s => `<script type="application/ld+json">${s}</script>`).join('\n');
    html = html.replace('</head>', `${schemaHtml}\n</head>`);

    // 3. Ubacivanje Canonical taga (Maksimalna SEO higijena)
    const canonicalUrl = `https://deliverix.rs${urlPath === '/' ? '' : urlPath}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    html = html.replace('</head>', `${canonicalTag}\n</head>`);

    // 3.5 Ubacivanje inicijalnih podešavanja za React hidrataciju i eliminaciju Content Flasha
    if (siteSettingsData) {
      const escapedSettings = JSON.stringify(siteSettingsData).replace(/</g, '\\u003c');
      const settingsScript = `<script>window.__INITIAL_SITE_SETTINGS__ = ${escapedSettings};</script>`;
      html = html.replace('</head>', `${settingsScript}\n</head>`);
    }

    // 4. Zamena standardnih meta tagova
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${escapedDesc}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${escapedTitle}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${escapedDesc}" />`);
    html = html.replace(/<meta\s+property="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:title" content="${escapedTitle}" />`);
    html = html.replace(/<meta\s+property="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:description" content="${escapedDesc}" />`);

    // 5. Hidratacija celokupnog koda blog posta za pretraživače (Dynamic Pre-rendering / No-JS fallback)
    // Ovo obezbeđuje da Google indeksira kompletan tekst svakog bloga i rešava "Low word count" problem!
    if (isBlogPost && blogPostData) {
      const blogArticleHtml = `
        <article id="seo-dynamic-blog-container" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;" aria-hidden="true">
          <header>
            <h1>${blogPostData.title}</h1>
            <p>Objavio: <strong>${blogPostData.author || 'Deliverix'}</strong> | Datum: <time datetime="${blogPostData.createdAt || ''}">${blogPostData.createdAt || ''}</time></p>
            <p class="lead">${blogPostData.excerpt || ''}</p>
          </header>
          <section>
            ${blogPostData.content || ''}
          </section>
        </article>
      `;
      html = html.replace('<body>', `<body>\n${blogArticleHtml}`);
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(html);
  } catch (err) {
    console.error('Greška u serveIndexWithSEO:', err);
    res.sendFile(indexPath);
  }
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    // Presretanje HTML zahteva u razvoju radi dinamičkog SEO renderovanja
    app.use(async (req, res, next) => {
      const url = req.originalUrl || req.url;
      const isHtmlRequest = req.headers.accept && req.headers.accept.includes('text/html');
      
      if (isHtmlRequest && !url.startsWith('/api/') && !url.startsWith('/@') && !url.startsWith('/node_modules/') && !url.includes('.')) {
        try {
          const indexPath = path.resolve(process.cwd(), 'index.html');
          let html = fs.readFileSync(indexPath, 'utf8');
          // Neka Vite injektuje HMR skripte i transformiše HTML
          html = await vite.transformIndexHtml(url, html);
          
          // Primeni naš visoko-performansni SEO render engine
          await serveIndexWithSEO(req, res, indexPath, html);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', async (req, res) => {
      const ext = path.extname(req.path).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.css', '.js', '.ico', '.woff', '.woff2'].includes(ext)) {
        return res.status(404).send('Not Found');
      }
      await serveIndexWithSEO(req, res, path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server pokrenut na http://0.0.0.0:${PORT}`);
  });
}

startServer();
