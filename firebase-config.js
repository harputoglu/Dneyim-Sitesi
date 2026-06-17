// ╔═══════════════════════════════════════════════════════════════════╗
// ║  firebase-config.js  —  Kültür Sanat ve Yaşam Sözlüğü           ║
// ║                                                                   ║
// ║  Firebase burada başlatılır. Herhangi bir hata (unauthorized      ║
// ║  domain, ağ, SDK sorunu) yakalanır; app.js localStorage auth'a  ║
// ║  otomatik geri döner. Site her zaman çalışır.                    ║
// ╚═══════════════════════════════════════════════════════════════════╝

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDV0shGW677JTUxdos34gOT4PulWkuGf_4",
  authDomain:        "deneyim-sitesi.firebaseapp.com",
  projectId:         "deneyim-sitesi",
  storageBucket:     "deneyim-sitesi.firebasestorage.app",
  messagingSenderId: "351144223072",
  appId:             "1:351144223072:web:befbd8561b03fb913afe05",
  measurementId:     "G-Z3691E8GGK",
};

// Safe globals — will be null if Firebase fails to initialise
let fbAuth   = null;
let fbGoogle = null;

try {
  if (typeof firebase !== 'undefined') {
    // Only init if not already initialised
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    fbAuth   = firebase.auth();
    fbGoogle = new firebase.auth.GoogleAuthProvider();
    fbGoogle.setCustomParameters({ prompt: 'select_account' });
    console.log('✅ Firebase başlatıldı.');
  }
} catch (e) {
  console.warn('⚠️ Firebase başlatılamadı, localStorage auth kullanılacak:', e.message);
  fbAuth   = null;
  fbGoogle = null;
}
