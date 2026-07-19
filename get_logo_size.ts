import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const settingsRef = doc(db, 'site_configs', 'settings');
  const settingsSnap = await getDoc(settingsRef);
  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    const logoUrl = data.logo_url || '';
    const footerLogoUrl = data.footer_logo_url || '';
    
    console.log('Logo URL starts with:', logoUrl.substring(0, 50));
    console.log('Logo URL length:', logoUrl.length, 'characters');
    console.log('Footer Logo URL starts with:', footerLogoUrl.substring(0, 50));
    console.log('Footer Logo URL length:', footerLogoUrl.length, 'characters');
    
    // Estimate JSON payload size of entire document
    const fullJsonSize = JSON.stringify(data).length;
    console.log('Full document JSON size:', fullJsonSize, 'bytes');
  } else {
    console.log('No settings found');
  }
  process.exit(0);
}
run().catch(err => {
  console.error(err);
  process.exit(1);
});
