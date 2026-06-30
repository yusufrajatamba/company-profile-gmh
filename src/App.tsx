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
  phone: '+62 822-7636-3241',
  themeGreen: '#10b981',
  themeGold: '#f59e0b',
  themeName: 'Hijau & Emas Cerah',

  // Program Misi Defaults
  misiPageTitle: 'Global Mission House Project (GMHP)',
  misiPageSubtitle: 'Program Misi',
  misiPageText: 'Melalui program GMHP, persekutuan alumni mengoordinasikan berbagai aksi nyata untuk melayani jiwa-jiwa di daerah terpencil dan melayani sesama secara holistik. Kami tidak hanya membagikan bantuan fisik, melainkan juga menanamkan pengharapan kekal di dalam Kristus.',

  // Pelayanan Alumni Defaults
  alumniPageTitle: 'Pelayanan Alumni PA KMK USU',
  alumniPageSubtitle: 'Pelayanan Alumni',
  alumniPageText: 'Keluarga besar Alumni KMK USU senantiasa rindu untuk menjadi berkat di mana pun ditempatkan. Melalui jejaring pelayanan alumni, kami mempererat tali persaudaraan rohani, mendampingi adik-adik yang masih berkuliah, dan bersinergi melayani Tuhan di dunia profesional.',

  // Alumni Berkarya Defaults
  berkaryaTitle: 'ALUMNI BERKARYA',
  berkaryaSubtitle: '"Setiap talenta adalah anugerah dari Tuhan yang patut dibagikan. Mari bersama-sama menyatakan kasih dan kebenaran, karyamu menjadi berkat dan kesaksian yang menguatkan banyak jiwa."',

  // Library Defaults
  libraryTitle: 'Perpustakaan & Sumber Belajar Digital',
  librarySubtitle: 'Resource Library',

  // Logo & Home Hero Background Defaults
  logoUrl: '',
  logoText: 'G',
  heroBgUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
  showHeroSection: true,

  // Fokus Visi Strategis Home Section Defaults
  homeVisiTitle: 'Membangun Generasi Alumni Kristen Berintegritas',
  homeVisiDesc: 'Global Mission House (GMH) hadir sebagai oase rohani dan wadah kolaboratif bagi seluruh lulusan KMK Universitas Sumatera Utara. Kami percaya alumni bukan sekadar mantan mahasiswa, melainkan utusan Kristus di bidang profesional masing-masing.',

  // Program Misi - 3 Focus Pillars Defaults
  misiPilar1Title: 'Misi Penginjilan & Doa',
  misiPilar1Desc: 'Pelayanan pekabaran kabar baik rutin ke desa-desa binaan, kebaktian kebangunan rohani, serta dukungan doa syafaat rutin.',
  misiPilar2Title: 'Misi Medis & Pelayanan Kesehatan',
  misiPilar2Desc: 'Pemeriksaan kesehatan gratis, pengobatan massal, penyuluhan gizi buruk, dan pembagian vitamin bagi masyarakat prasejahtera.',
  misiPilar3Title: 'Pemberdayaan Pendidikan Anak',
  misiPilar3Desc: 'Bimbingan belajar gratis bagi anak-anak di pedalaman Sumatera Utara, penyediaan buku rohani, dan fasilitas kelas mini.',

  // Program Misi - 4 Steps process Defaults
  misiStep1Title: 'Pilih Misi',
  misiStep1Desc: 'Pilih jenis program misi sosial atau kerohanian yang ingin Anda dukung atau ikuti.',
  misiStep2Title: 'Isi Formulir',
  misiStep2Desc: 'Lengkapi formulir registrasi dengan data diri yang valid serta komitmen pelayanan Anda.',
  misiStep3Title: 'Konfirmasi',
  misiStep3Desc: 'Hubungi tim admin kami melalui WhatsApp atau konfirmasi email setelah mendaftar.',
  misiStep4Title: 'Mulai Berbagi',
  misiStep4Desc: 'Terjun langsung ke lapangan atau salurkan dukungan doa & donasi bersama tim misi.',

  // Pelayanan Alumni - 4 Service Items Defaults
  alumniService1Title: 'Persekutuan Alumni',
  alumniService1Desc: 'Wadah ibadah, doa bersama, dan berbagi kesaksian hidup antar alumni KMK USU di berbagai daerah secara hibrida.',
  alumniService1Redirect: 'contact',
  alumniService2Title: 'Mentoring & Pembinaan',
  alumniService2Desc: 'Alumni senior mendampingi adik-adik mahasiswa KMK USU aktif guna memberikan bimbingan spiritual, kepemimpinan, dan kesiapan akademik.',
  alumniService2Redirect: 'about-visi-misi',
  alumniService3Title: 'Aksi Sosial & Kasih',
  alumniService3Desc: 'Penyaluran dana beasiswa pendidikan bagi adik-adik berprestasi yang terkendala biaya, serta respons cepat tanggap bencana alam.',
  alumniService3Redirect: 'news-pembangunan',
  alumniService4Title: 'Networking & Karier',
  alumniService4Desc: 'Membangun jejaring kerja profesional untuk membagikan info lowongan pekerjaan, mentoring karier, dan kemitraan strategis.',
  alumniService4Redirect: 'creation'
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
            onNavigateToSection={(sectionId) => setActiveSection(sectionId)}
          />
        );
      case 'about-sejarah':
        return <SejarahSingkat setting={setting} />;
      case 'about-visi-misi':
        return <VisiMisi setting={setting} />;
      case 'about-struktur':
        return <StrukturYayasan setting={setting} />;
      case 'program-misi':
        return <ProgramMisi setting={setting} onNavigateToSection={(sectionId) => setActiveSection(sectionId)} />;
      case 'program-alumni':
        return <PelayananAlumni setting={setting} onNavigateToSection={(sectionId) => setActiveSection(sectionId)} />;
      case 'news-gallery':
        return <Activities activities={activities} />;
      case 'news-warta':
        return <WartaAlumni />;
      case 'news-artikel':
        return <Blog articles={articles} />;
      case 'news-pembangunan':
        return <PembangunanRumah setting={setting} />;
      case 'creation':
        return <AlumniBerkarya setting={setting} />;
      case 'library':
        return <Library setting={setting} />;
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
      {/* Dynamic Theme Color Injection */}
      <style>{`
        :root {
          --color-church-green: ${setting.themeGreen || '#10b981'} !important;
          --color-church-gold: ${setting.themeGold || '#f59e0b'} !important;
        }
      `}</style>

      {/* Navbar Navigation */}
      <Navbar
        setting={setting}
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
