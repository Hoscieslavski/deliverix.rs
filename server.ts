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
const PORT = Number(process.env.PORT || 3000);

// 301 Redirect sa www.deliverix.rs na deliverix.rs (rešava "www and non-www" SEO upozorenje)
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.startsWith('www.')) {
    const newHost = host.slice(4);
    return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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
    const { status, napomena } = req.body;

    const candidateDocRef = doc(db, 'candidates', id);
    const docSnap = await getDoc(candidateDocRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Kandidat nije pronađen.' });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (napomena !== undefined) updates.napomena = napomena.trim();
    updates.last_updated_at = new Date().toISOString();

    await updateDoc(candidateDocRef, updates);

    // Ako je status promenjen, šaljemo obaveštenje (SMS / WhatsApp struktura)
    const currentData = docSnap.data();
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
    cover_image: "https://images.unsplash.com/photo-1585759057420-5313b061a3ee?auto=format&fit=crop&w=800&q=80",
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
    cover_image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
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
    cover_image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
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
      cover_image: cover_image || 'https://images.unsplash.com/photo-1585759057420-5313b061a3ee?auto=format&fit=crop&w=800&q=80',
      author: author || 'Deliverix Marketing',
      tags: Array.isArray(tags) ? tags : [],
      read_time: read_time || '3 min',
      created_at: new Date().toISOString(),
      views: 0
    };

    await setDoc(doc(db, 'blog_posts', finalSlug), newPost);
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
      logo_style: "flow",
      logo_url: "",
      logo_blend_mode: "normal",
      footer_logo_style: "flow",
      footer_logo_url: "",
      footer_logo_blend_mode: "normal",
      hero_title: "Dostava koja se prilagođava tvojim pravilima",
      hero_platform_title: "Wolt i Glovo platforme u Srbiji",
      hero_right_mode: "image",
      hero_image_url: "/src/assets/images/delivery_courier_hero_1783427588712.jpg",
      hero_badge_title: "Dostupno odmah",
      hero_badge_text: "Pomoć oko zaposlenja je 100% besplatna!",
      hero_image_alt: "Dostavljač hrane - Wolt Glovo Srbija",
      hero_enabled: true,
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
      target_audience_title: "Za koga je ovaj posao?",
      target_audience_desc: "Dostava hrane i pošiljaka je idealna za sve koji cene slobodu i samostalnost u radu. Naš stručni tim ti pruža sigurnost, besplatne savete i brze odgovore u svakom trenutku.",
      target_audience_items: [
        "Osobe koje žele odličnu zaradu i stabilan prihod uz potpunu kontrolu nad svojim vremenom",
        "Studente koji žele da rade samo vikendom ili par sati dnevno",
        "Zaposlene koji traže dodatni izvor prihoda nakon radnog vremena",
        "Osobe bez ikakvog prethodnog iskustva u dostavi ili prodaji"
      ],
      why_apply_title: "Zašto se prijaviti preko nas?",
      why_apply_desc: "Kao nezavisna platforma za podršku, pomažemo ti da pronađeš partnersku agenciju koja nudi najbolje uslove za tvoj profil. To za tebe znači:",
      why_apply_items: [
        { title: "Sloboda izbora modela", desc: "Biraš model saradnje i dinamiku rada koji najviše odgovaraju tvojim ličnim potrebama." },
        { title: "Najbolja provizija", desc: "Spajamo te sa agencijama koje nude najpovoljnije uslove i najmanji procenat." },
        { title: "Brza podrška", desc: "Naš mentorski tim ti pomaže oko aplikacije i rešavanja bilo kakvih problema na terenu." },
        { title: "Brz start i obuka", desc: "Pomažemo ti u brzom pokretanju naloga i pružamo besplatne savete pre prve dostave." }
      ],
      footer_cta_title: "Započni svoju dostavljačku karijeru danas",
      footer_cta_desc: "Nemoj odlagati priliku za odličnu zaradu i potpunu slobodu. Registracija te ništa ne košta i ne obavezuje te ni na šta. Pomažemo ti oko celog procesa besplatno.",
      footer_disclaimer: "Napomena: Mi nismo deo ni jedne dostavne mreže (Wolt, Glovo, itd.) već nezavisni posrednik za podršku, informacije i brzu regrutaciju u Srbiji. Sve informacije su neutralne i tačne."
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

// G. Čuvanje SEO i sajta podešavanja (Zaštićena ruta - Marketing/Super Admin)
app.post('/api/marketing/seo', marketingAuthMiddleware, async (req, res) => {
  try {
    const settings = req.body;
    await setDoc(doc(db, 'site_configs', 'settings'), settings);
    res.json({ success: true, message: 'SEO i podešavanja sajta su uspešno sačuvani.' });
  } catch (error) {
    console.error('Greška pri čuvanju SEO podešavanja:', error);
    res.status(500).json({ error: 'Greška pri čuvanju SEO podešavanja.' });
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

    // Limitiranje veličine na 600KB radi skladištenja u Firestore bazu
    if (buffer.length > 600 * 1024) {
      return res.status(400).json({ error: 'Slika je prevelika. Maksimalna veličina logotipa je 600KB.' });
    }

    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      ext = 'jpg';
    } else if (mimeType.includes('svg')) {
      ext = 'svg';
    } else if (mimeType.includes('webp')) {
      ext = 'webp';
    } else if (mimeType.includes('gif')) {
      ext = 'gif';
    }

    // Uklanjanje starih logotipa kako se ne bi gomilali
    const baseFileName = type === 'footer' ? 'custom_footer_logo' : 'custom_logo';
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file.startsWith(baseFileName)) {
          try {
            fs.unlinkSync(path.join(uploadsDir, file));
          } catch (err) {
            console.error('Greška pri brisanju starog logotipa:', err);
          }
        }
      }
    }

    const fileName = `${baseFileName}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Vraćamo base64 string direktno kako bi se trajno sačuvao u Firestore bazi i preživeo restarte kontejnera
    res.json({ success: true, logoUrl: logoData });
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

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server pokrenut na http://0.0.0.0:${PORT}`);
  });
}

startServer();
