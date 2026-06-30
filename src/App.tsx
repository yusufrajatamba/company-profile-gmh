import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { Setting, Article, Activity, MisiRegistration, Message } from './types';

// Import Modular Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Programs } from './components/Programs';
import { Activities } from './components/Activities';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { CMSDashboard } from './components/CMSDashboard';

// Import New Dropdown & Feature Components
import { SejarahSingkat } from './components/SejarahSingkat';
import { VisiMisi } from './components/VisiMisi';
import { StrukturYayasan } from './components/StrukturYayasan';
import { ProgramMisi } from './components/ProgramMisi';
import { PelayananAlumni } from './components/PelayananAlumni';
import { WartaAlumni } from './components/WartaAlumni';
import { PembangunanRumah } from './components/PembangunanRumah';
import { AlumniBerkarya } from './components/AlumniBerkarya';
import { Library } from './components/Library';

// Default Setting Object as fallback & database seed
const DEFAULT_SETTING: Setting = {
  id: 'main',
  heroTitle: 'GLOBAL MISSION HOUSE',
  heroSubtitle: 'Pusat Pelayanan, Pembinaan, dan Pengutusan Alumni Keluarga Mahasiswa Kristen (KMK) Universitas Sumatera Utara',
  visi: 'Menjadi wadah persekutuan, pembinaan, dan pengutusan alumni Keluarga Mahasiswa Kristen (KMK) USU serta pusat misi global yang dinamis dan berakar kuat di dalam iman.',
  misi: '• Melayani alumni dalam pembinaan iman, pertumbuhan spiritual, serta pengembangan karier profesional.\n• Membina dan mendampingi adik-adik mahasiswa aktif KMK USU agar siap menghadapi tantangan dunia kerja sekuler.\n• Mendukung, memfasilitasi, dan mengoordinasikan aksi misi pekabaran Injil serta pelayanan sosial kemanusiaan secara berkala.',
  address: 'Jln. Bunga Teratai Gg. Bunga Teratai II Medan Selayang',
  email: 'pakmkusumdn@gmail.com',
  phone: '+62 822-7636-3241'
};

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Firestore Data State
  const [setting, setSetting] = useState<Setting>(DEFAULT_SETTING);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [misiRegistrations, setMisiRegistrations] = useState<MisiRegistration[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initial Load and Seed Function
  const loadInitialData = async () => {
    // 1. Load Settings
    try {
      let settingDoc;
      try {
        settingDoc = await getDoc(doc(db, 'settings', 'main'));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'settings/main');
      }

      if (settingDoc && settingDoc.exists()) {
        setSetting(settingDoc.data() as Setting);
      } else {
        // Seed Firestore if empty
        try {
          await setDoc(doc(db, 'settings', 'main'), DEFAULT_SETTING);
        } catch (seedError) {
          // If seeding fails, we just log a warn (no error thrown to break loading)
          console.warn('Seeding skipped or failed (likely unauthenticated):', seedError);
        }
        setSetting(DEFAULT_SETTING);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSetting(DEFAULT_SETTING);
    }

    // 1.1 Seed Default Admin if empty
    try {
      const adminsSnap = await getDocs(collection(db, 'admins'));
      if (adminsSnap.empty) {
        await setDoc(doc(db, 'admins', 'superadmin'), {
          email: 'admin@gmh.org',
          username: 'admin',
          password: 'superadmin123',
          fullName: 'Super Admin GMH',
          role: 'superadmin',
          createdAt: new Date().toISOString()
        });
        console.log('Seeded default superadmin account!');
      }
    } catch (adminError) {
      console.warn('Error seeding default admin:', adminError);
    }

    // 2. Load Articles
    try {
      let articlesSnap;
      try {
        const articlesQuery = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        articlesSnap = await getDocs(articlesQuery);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'articles');
      }

      if (articlesSnap) {
        const loadedArticles: Article[] = [];
        articlesSnap.forEach((doc) => {
          loadedArticles.push({ id: doc.id, ...doc.data() } as Article);
        });
        setArticles(loadedArticles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    }

    // 3. Load Activities
    try {
      let activitiesSnap;
      try {
        activitiesSnap = await getDocs(collection(db, 'activities'));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'activities');
      }

      if (activitiesSnap) {
        const loadedActivities: Activity[] = [];
        activitiesSnap.forEach((doc) => {
          loadedActivities.push({ id: doc.id, ...doc.data() } as Activity);
        });
        setActivities(loadedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Admin Data Load Function (Misi registrations and Message logs)
  const loadAdminData = async () => {
    // Load Misi registrations
    try {
      let regSnap;
      try {
        regSnap = await getDocs(collection(db, 'misi_registrations'));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'misi_registrations');
      }

      if (regSnap) {
        const loadedRegs: MisiRegistration[] = [];
        regSnap.forEach((doc) => {
          loadedRegs.push({ id: doc.id, ...doc.data() } as MisiRegistration);
        });
        loadedRegs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMisiRegistrations(loadedRegs);
      }
    } catch (error) {
      console.error('Error loading misi_registrations:', error);
    }

    // Load Messages
    try {
      let msgSnap;
      try {
        msgSnap = await getDocs(collection(db, 'messages'));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'messages');
      }

      if (msgSnap) {
        const loadedMsgs: Message[] = [];
        msgSnap.forEach((doc) => {
          loadedMsgs.push({ id: doc.id, ...doc.data() } as Message);
        });
        loadedMsgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(loadedMsgs);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Listen to Auth state and load data accordingly
  useEffect(() => {
    loadInitialData();

    // Check for custom database login session
    const savedAdmin = localStorage.getItem('gmh_admin_user');
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        if (parsed && parsed.email) {
          setIsAdminLoggedIn(true);
          loadAdminData();
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved admin session:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        loadAdminData();
      } else {
        // Only set false if there is no custom local storage session either
        if (!localStorage.getItem('gmh_admin_user')) {
          setIsAdminLoggedIn(false);
          setMisiRegistrations([]);
          setMessages([]);
        }
      }
    });

    return unsubscribe;
  }, []);

  // Refresh handler to pass down to CMS
  const handleRefreshData = () => {
    // Sync login state from localStorage
    const savedAdmin = localStorage.getItem('gmh_admin_user');
    if (savedAdmin) {
      setIsAdminLoggedIn(true);
      loadAdminData();
    } else if (!auth.currentUser) {
      setIsAdminLoggedIn(false);
    }
    loadInitialData();
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('gmh_admin_user');
    setIsAdminLoggedIn(false);
    setIsCmsOpen(false);
  };

  // Dynamic Section / Page Content Renderer
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <Hero
            setting={setting}
            onStartMisi={() => setActiveSection('contact')}
            onViewAlumni={() => setActiveSection('program-alumni')}
          />
        );
      case 'about-sejarah':
        return <SejarahSingkat />;
      case 'about-visi-misi':
        return <VisiMisi setting={setting} />;
      case 'about-struktur':
        return <StrukturYayasan />;
      case 'program-misi':
        return <ProgramMisi />;
      case 'program-alumni':
        return <PelayananAlumni />;
      case 'news-gallery':
        return <Activities activities={activities} />;
      case 'news-warta':
        return <WartaAlumni />;
      case 'news-artikel':
        return <Blog articles={articles} />;
      case 'news-pembangunan':
        return <PembangunanRumah />;
      case 'creation':
        return <AlumniBerkarya />;
      case 'library':
        return <Library />;
      case 'contact':
        return <Contact setting={setting} />;
      default:
        return (
          <Hero
            setting={setting}
            onStartMisi={() => setActiveSection('contact')}
            onViewAlumni={() => setActiveSection('program-alumni')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f6]">
      {/* Navbar Navigation */}
      <Navbar
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => setIsCmsOpen(true)}
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-[#12241d] text-church-gold/75 py-12 border-t border-church-gold/20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-base tracking-widest uppercase">
              GLOBAL MISSION HOUSE
            </h4>
            <p className="text-xs text-church-gold font-bold tracking-widest uppercase">
              PERSEKUTUAN ALUMNI KMK USU
            </p>
            <div className="h-0.5 w-8 bg-church-gold mx-auto mt-2" />
          </div>
          <div className="text-[10px] text-white/50 leading-relaxed max-w-xl mx-auto font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} Global Mission House - PA KMK USU. Semua Hak Cipta Dilindungi.
            <br />
            <span className="text-church-gold">Menjadi saksi Kristus yang berintegritas dan profesional di mana pun kita diutus.</span>
          </div>
          {/* Subtle Admin Link */}
          <div>
            <button
              onClick={() => setIsCmsOpen(true)}
              className="text-[10px] font-bold uppercase tracking-wider text-church-gold hover:text-white transition cursor-pointer underline decoration-church-gold/40 hover:decoration-white"
            >
              Portal Administrasi Website (CMS)
            </button>
          </div>
        </div>
      </footer>

      {/* CMS Dashboard Modal Overlay */}
      <CMSDashboard
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        setting={setting}
        onSettingUpdate={(newSetting) => setSetting(newSetting)}
        articles={articles}
        activities={activities}
        misiRegistrations={misiRegistrations}
        messages={messages}
        onRefreshData={handleRefreshData}
      />
    </div>
  );
}
