import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Lock, ShieldCheck, Mail, Key, LayoutDashboard, Settings, FileText,
  Image as ImageIcon, Inbox, LogOut, Check, Trash2, Edit2, Plus, RefreshCw, Calendar, Eye
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../firebase';
import { Setting, Article, Activity, MisiRegistration, Message } from '../types';

interface CMSDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  setting: Setting;
  onSettingUpdate: (newSetting: Setting) => void;
  articles: Article[];
  activities: Activity[];
  misiRegistrations: MisiRegistration[];
  messages: Message[];
  onRefreshData: () => void;
}

export const CMSDashboard: React.FC<CMSDashboardProps> = ({
  isOpen,
  onClose,
  setting,
  onSettingUpdate,
  articles,
  activities,
  misiRegistrations,
  messages,
  onRefreshData
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'settings' | 'articles' | 'activities' | 'registrations' | 'messages'>('settings');
  const [settingsSubTab, setSettingsSubTab] = useState<'home' | 'sejarah' | 'struktur' | 'pembangunan' | 'misi' | 'alumni_service' | 'berkarya' | 'library' | 'contact' | 'theme'>('home');

  // Loader state for actions
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Setting Form State (initialized from props)
  const [heroTitle, setHeroTitle] = useState(setting.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(setting.heroSubtitle);
  const [visi, setVisi] = useState(setting.visi);
  const [misi, setMisi] = useState(setting.misi);
  const [address, setAddress] = useState(setting.address);
  const [contactEmail, setContactEmail] = useState(setting.email);
  const [contactPhone, setContactPhone] = useState(setting.phone);
  const [themeGreen, setThemeGreen] = useState(setting.themeGreen || '#10b981');
  const [themeGold, setThemeGold] = useState(setting.themeGold || '#f59e0b');
  const [themeName, setThemeName] = useState(setting.themeName || 'Hijau & Emas Cerah');

  // Home Page Stats
  const [statsAlumni, setStatsAlumni] = useState(setting.statsAlumni || '500+');
  const [statsCities, setStatsCities] = useState(setting.statsCities || '12+');
  const [statsMisi, setStatsMisi] = useState(setting.statsMisi || '10+');
  const [statsYears, setStatsYears] = useState(setting.statsYears || '20+');

  // Home Page Sections Visibility Toggles
  const [showPillars, setShowPillars] = useState(setting.showPillars !== false);
  const [showStats, setShowStats] = useState(setting.showStats !== false);
  const [showVisiMisi, setShowVisiMisi] = useState(setting.showVisiMisi !== false);
  const [showExplorerHub, setShowExplorerHub] = useState(setting.showExplorerHub !== false);
  const [showSupportInvitation, setShowSupportInvitation] = useState(setting.showSupportInvitation !== false);

  // About - Sejarah Singkat
  const [sejarahTitle, setSejarahTitle] = useState(setting.sejarahTitle || 'Perjalanan Iman & Pelayanan Kami');
  const [sejarahSection1Title, setSejarahSection1Title] = useState(setting.sejarahSection1Title || 'Berakar Pada Kerinduan Amanat Agung');
  const [sejarahSection1Text, setSejarahSection1Text] = useState(setting.sejarahSection1Text || 'Sejarah berdirinya Global Mission House - PA KMK USU tidak lepas dari kerinduan mendalam dari para alumni pendahulu untuk melestarikan api rohani yang menyala selama masa kuliah. Setelah menyelesaikan studi, tantangan dunia profesional dan sekuler seringkali menguji iman para lulusan.\n\nUntuk menjaga pertumbuhan rohani serta memfasilitasi panggilan misi pekabaran Injil secara global, dibentuklah Persekutuan Alumni (PA) KMK USU. Kami percaya bahwa setiap alumni dipanggil untuk menjadi garam dan terang di ladang profesionalisme masing-masing.');
  const [sejarahSection2Title, setSejarahSection2Title] = useState(setting.sejarahSection2Title || 'Pusat Pengutusan dan Pembinaan');
  const [sejarahSection2Text, setSejarahSection2Text] = useState(setting.sejarahSection2Text || 'Gagasan menghadirkan Global Mission House (GMH) timbul dari kebutuhan mendesak akan adanya pusat pelatihan fisik bagi para misionaris medis, guru pedalaman, dan relawan kemanusiaan. GMH juga difungsikan sebagai rumah pembinaan bagi mahasiswa Kristen aktif Universitas Sumatera Utara untuk memperlengkapi mereka sebelum diutus ke dunia kerja.\n\nMelalui bimbingan dan pendampingan dari para alumni senior, adik-adik mahasiswa diperkenalkan pada nilai-nilai integritas Kristiani, kepemimpinan transformasional, dan kesiapan rohani yang kokoh.');
  const [showSejarahTimeline, setShowSejarahTimeline] = useState(setting.showSejarahTimeline !== false);

  const [milestones, setMilestones] = useState<{ year: string; title: string; desc: string }[]>(() => {
    if (setting.milestonesJson) {
      try {
        const parsed = JSON.parse(setting.milestonesJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { year: '1998', title: 'Awal Mula Pergerakan', desc: 'Dimulai dari persekutuan doa kecil mahasiswa Kristen USU yang rindu melayani jiwa-jiwa pasca kampus dan melahirkan wadah berjejaring bagi alumni.' },
      { year: '2005', title: 'Peresmian Persekutuan Alumni (PA) KMK USU', desc: 'Deklarasi resmi pembentukan wadah alumni secara terstruktur untuk mengoordinasi pelayanan alumni di berbagai wilayah Indonesia, khususnya Sumatera Utara.' },
      { year: '2012', title: 'Gagasan Global Mission House (GMH)', desc: 'Lahirnya visi untuk membangun sebuah pusat misi fisik yang berfungsi sebagai pusat pembinaan mahasiswa Kristen aktif, sekretariat alumni, dan rumah singgah misionaris.' },
      { year: '2020 - Sekarang', title: 'Pengembangan Berkelanjutan', desc: 'Realisasi program misi pedesaan berkelanjutan, pembangunan rumah persekutuan, beasiswa pendidikan, dan digitalisasi pelayanan alumni.' }
    ];
  });

  // Struktur Yayasan
  const [strukturTitle, setStrukturTitle] = useState(setting.strukturTitle || 'Dewan Pengurus & Pelaksana Pelayanan');
  const [pembina, setPembina] = useState<{ name: string; role: string }[]>(() => {
    if (setting.pembinaJson) {
      try {
        const parsed = JSON.parse(setting.pembinaJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { name: 'Dr. John Wesley, M.Th.', role: 'Ketua Dewan Pembina' },
      { name: 'Ev. Yusuf Sembiring, S.E.', role: 'Anggota Pembina' },
      { name: 'Pdt. Ir. Saut Manurung', role: 'Anggota Pembina' }
    ];
  });

  const [pengawas, setPengawas] = useState<{ name: string; role: string }[]>(() => {
    if (setting.pengawasJson) {
      try {
        const parsed = JSON.parse(setting.pengawasJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { name: 'Ir. Richard Tambunan, M.M.', role: 'Ketua Dewan Pengawas' },
      { name: 'Sabar Pardede, S.H.', role: 'Anggota Pengawas' }
    ];
  });

  const [pengurusHarian, setPengurusHarian] = useState<{ name: string; role: string }[]>(() => {
    if (setting.pengurusHarianJson) {
      try {
        const parsed = JSON.parse(setting.pengurusHarianJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { name: 'Yusuf Raja Tamba, S.T.', role: 'Ketua Yayasan / Badan Pengurus' },
      { name: 'Ir. Daniel Simanjuntak', role: 'Wakil Ketua' },
      { name: 'Ruth Siregar, S.Kom.', role: 'Sekretaris Umum' },
      { name: 'Maria Hutapea, S.E.', role: 'Bendahara Umum' }
    ];
  });

  const [departemen, setDepartemen] = useState<{ name: string; dept: string }[]>(() => {
    if (setting.departemenJson) {
      try {
        const parsed = JSON.parse(setting.departemenJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { name: 'Ev. Markus Ginting, M.Div.', dept: 'Bidang Pembinaan & Spiritualitas' },
      { name: 'dr. Sarah Pangaribuan', dept: 'Bidang Pelayanan Medis & Misi Pedesaan' },
      { name: 'Toni Nababan, S.Pd.', dept: 'Bidang Pendidikan & Bimbingan Belajar' },
      { name: 'Grace Marbun, S.Ak.', dept: 'Bidang Hubungan Alumni & Media' }
    ];
  });

  // News - Pembangunan Rumah
  const [pembangunanTitle, setPembangunanTitle] = useState(setting.pembangunanTitle || 'Rumah Persekutuan GMH');
  const [pembangunanSubtitle, setPembangunanSubtitle] = useState(setting.pembangunanSubtitle || 'Membangun Masa Depan Pelayanan yang Kokoh');
  const [pembangunanText1, setPembangunanText1] = useState(setting.pembangunanText1 || 'Rumah Persekutuan Global Mission House dipersiapkan untuk menjadi pusat administrasi pelayanan alumni, asrama pembinaan sementara mahasiswa Kristen USU aktif, dan pusat latihan misi jangka pendek sebelum relawan diutus ke pedalaman.');
  const [pembangunanText2, setPembangunanText2] = useState(setting.pembangunanText2 || 'Dengan luas bangunan terencana sebesar 450 m², gedung ini akan dilengkapi dengan ruang ibadah, sekretariat bersama, perpustakaan teologi, serta kamar inap bagi misionaris tamu. Melalui dukungan dari seluruh alumni, kami rindu menyelesaikan pembangunan ini tepat waktu demi kemuliaan nama Tuhan.');
  const [pembangunanProgress, setPembangunanProgress] = useState<number>(setting.pembangunanProgress !== undefined ? setting.pembangunanProgress : 65);
  const [pembangunanTarget, setPembangunanTarget] = useState(setting.pembangunanTarget || 'Rp 1.500.000.000');
  const [pembangunanRaised, setPembangunanRaised] = useState(setting.pembangunanRaised || 'Rp 975.000.000');
  const [pembangunanImageUrl, setPembangunanImageUrl] = useState(setting.pembangunanImageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80');

  const [bankAccounts, setBankAccounts] = useState<{ bank: string; number: string; holder: string }[]>(() => {
    if (setting.bankAccountsJson) {
      try {
        const parsed = JSON.parse(setting.bankAccountsJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [
      { bank: 'Bank Mandiri', number: '111-00123-45678', holder: 'Yayasan Global Mission House' },
      { bank: 'Bank Central Asia (BCA)', number: '822-9876-5432', holder: 'Yusuf Raja Tamba (Qubil Pembangunan)' }
    ];
  });

  // Programs - Program Misi
  const [misiPageTitle, setMisiPageTitle] = useState(setting.misiPageTitle || 'Global Mission House Project (GMHP)');
  const [misiPageSubtitle, setMisiPageSubtitle] = useState(setting.misiPageSubtitle || 'Program Misi');
  const [misiPageText, setMisiPageText] = useState(setting.misiPageText || 'Melalui program GMHP, persekutuan alumni mengoordinasikan berbagai aksi nyata untuk melayani jiwa-jiwa di daerah terpencil dan melayani sesama secara holistik. Kami tidak hanya membagikan bantuan fisik, melainkan juga menanamkan pengharapan kekal di dalam Kristus.');

  // Programs - Pelayanan Alumni
  const [alumniPageTitle, setAlumniPageTitle] = useState(setting.alumniPageTitle || 'Pelayanan Alumni PA KMK USU');
  const [alumniPageSubtitle, setAlumniPageSubtitle] = useState(setting.alumniPageSubtitle || 'Pelayanan Alumni');
  const [alumniPageText, setAlumniPageText] = useState(setting.alumniPageText || 'Keluarga besar Alumni KMK USU senantiasa rindu untuk menjadi berkat di mana pun ditempatkan. Melalui jejaring pelayanan alumni, kami mempererat tali persaudaraan rohani, mendampingi adik-adik yang masih berkuliah, dan bersinergi melayani Tuhan di dunia profesional.');

  // Alumni Berkarya
  const [berkaryaTitle, setBerkaryaTitle] = useState(setting.berkaryaTitle || 'ALUMNI BERKARYA');
  const [berkaryaSubtitle, setBerkaryaSubtitle] = useState(setting.berkaryaSubtitle || '"Setiap talenta adalah anugerah dari Tuhan yang patut dibagikan. Mari bersama-sama menyatakan kasih dan kebenaran, karyamu menjadi berkat dan kesaksian yang menguatkan banyak jiwa."');

  // Library
  const [libraryTitle, setLibraryTitle] = useState(setting.libraryTitle || 'Perpustakaan & Sumber Belajar Digital');
  const [librarySubtitle, setLibrarySubtitle] = useState(setting.librarySubtitle || 'Resource Library');

  // Additional dynamic features (Logo, Background, Fokus Visi, Pillars, Steps, Alumni Services)
  const [logoUrl, setLogoUrl] = useState(setting.logoUrl || '');
  const [logoText, setLogoText] = useState(setting.logoText || 'G');
  const [heroBgUrl, setHeroBgUrl] = useState(setting.heroBgUrl || '');
  const [showHeroSection, setShowHeroSection] = useState(setting.showHeroSection !== false);
  const [homeVisiTitle, setHomeVisiTitle] = useState(setting.homeVisiTitle || 'Membangun Generasi Alumni Kristen Berintegritas');
  const [homeVisiDesc, setHomeVisiDesc] = useState(setting.homeVisiDesc || 'Global Mission House (GMH) hadir sebagai oase rohani dan wadah kolaboratif bagi seluruh lulusan KMK Universitas Sumatera Utara. Kami percaya alumni bukan sekadar mantan mahasiswa, melainkan utusan Kristus di bidang profesional masing-masing.');

  const [misiPilar1Title, setMisiPilar1Title] = useState(setting.misiPilar1Title || 'Misi Penginjilan & Doa');
  const [misiPilar1Desc, setMisiPilar1Desc] = useState(setting.misiPilar1Desc || 'Pelayanan pekabaran kabar baik rutin ke desa-desa binaan, kebaktian kebangunan rohani, serta dukungan doa syafaat rutin.');
  const [misiPilar2Title, setMisiPilar2Title] = useState(setting.misiPilar2Title || 'Misi Medis & Pelayanan Kesehatan');
  const [misiPilar2Desc, setMisiPilar2Desc] = useState(setting.misiPilar2Desc || 'Pemeriksaan kesehatan gratis, pengobatan massal, penyuluhan gizi buruk, dan pembagian vitamin bagi masyarakat prasejahtera.');
  const [misiPilar3Title, setMisiPilar3Title] = useState(setting.misiPilar3Title || 'Pemberdayaan Pendidikan Anak');
  const [misiPilar3Desc, setMisiPilar3Desc] = useState(setting.misiPilar3Desc || 'Bimbingan belajar gratis bagi anak-anak di pedalaman Sumatera Utara, penyediaan buku rohani, dan fasilitas kelas mini.');

  const [misiStep1Title, setMisiStep1Title] = useState(setting.misiStep1Title || 'Pilih Misi');
  const [misiStep1Desc, setMisiStep1Desc] = useState(setting.misiStep1Desc || 'Pilih jenis program misi sosial atau kerohanian yang ingin Anda dukung atau ikuti.');
  const [misiStep2Title, setMisiStep2Title] = useState(setting.misiStep2Title || 'Isi Formulir');
  const [misiStep2Desc, setMisiStep2Desc] = useState(setting.misiStep2Desc || 'Lengkapi formulir registrasi dengan data diri yang valid serta komitmen pelayanan Anda.');
  const [misiStep3Title, setMisiStep3Title] = useState(setting.misiStep3Title || 'Konfirmasi');
  const [misiStep3Desc, setMisiStep3Desc] = useState(setting.misiStep3Desc || 'Hubungi tim admin kami melalui WhatsApp atau konfirmasi email setelah mendaftar.');
  const [misiStep4Title, setMisiStep4Title] = useState(setting.misiStep4Title || 'Mulai Berbagi');
  const [misiStep4Desc, setMisiStep4Desc] = useState(setting.misiStep4Desc || 'Terjun langsung ke lapangan atau salurkan dukungan doa & donasi bersama tim misi.');

  const [alumniService1Title, setAlumniService1Title] = useState(setting.alumniService1Title || 'Persekutuan Alumni');
  const [alumniService1Desc, setAlumniService1Desc] = useState(setting.alumniService1Desc || 'Wadah ibadah, doa bersama, dan berbagi kesaksian hidup antar alumni KMK USU di berbagai daerah secara hibrida.');
  const [alumniService1Redirect, setAlumniService1Redirect] = useState(setting.alumniService1Redirect || 'contact');

  const [alumniService2Title, setAlumniService2Title] = useState(setting.alumniService2Title || 'Mentoring & Pembinaan');
  const [alumniService2Desc, setAlumniService2Desc] = useState(setting.alumniService2Desc || 'Alumni senior mendampingi adik-adik mahasiswa KMK USU aktif guna memberikan bimbingan spiritual, kepemimpinan, dan kesiapan akademik.');
  const [alumniService2Redirect, setAlumniService2Redirect] = useState(setting.alumniService2Redirect || 'about-visi-misi');

  const [alumniService3Title, setAlumniService3Title] = useState(setting.alumniService3Title || 'Aksi Sosial & Kasih');
  const [alumniService3Desc, setAlumniService3Desc] = useState(setting.alumniService3Desc || 'Penyaluran dana beasiswa pendidikan bagi adik-adik berprestasi yang terkendala biaya, serta respons cepat tanggap bencana alam.');
  const [alumniService3Redirect, setAlumniService3Redirect] = useState(setting.alumniService3Redirect || 'news-pembangunan');

  const [alumniService4Title, setAlumniService4Title] = useState(setting.alumniService4Title || 'Networking & Karier');
  const [alumniService4Desc, setAlumniService4Desc] = useState(setting.alumniService4Desc || 'Membangun jejaring kerja profesional untuk membagikan info lowongan pekerjaan, mentoring karier, dan kemitraan strategis.');
  const [alumniService4Redirect, setAlumniService4Redirect] = useState(setting.alumniService4Redirect || 'creation');

  // Temporary state for adding timeline milestones
  const [newMilestoneYear, setNewMilestoneYear] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  // Temporary state for adding Struktur Yayasan members
  const [newPembinaName, setNewPembinaName] = useState('');
  const [newPembinaRole, setNewPembinaRole] = useState('');

  const [newPengawasName, setNewPengawasName] = useState('');
  const [newPengawasRole, setNewPengawasRole] = useState('');

  const [newPengurusName, setNewPengurusName] = useState('');
  const [newPengurusRole, setNewPengurusRole] = useState('');

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptRole, setNewDeptRole] = useState('');

  // Temporary state for adding Pembangunan bank accounts
  const [newBankName, setNewBankName] = useState('');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankHolder, setNewBankHolder] = useState('');

  // Article Form State
  const [articleId, setArticleId] = useState<string | null>(null); // null means adding new
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articleCategory, setArticleCategory] = useState('Renungan');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleDocumentFile, setArticleDocumentFile] = useState('');
  const [articleDocumentFileName, setArticleDocumentFileName] = useState('');
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Activity Form State
  const [activityId, setActivityId] = useState<string | null>(null); // null means adding new
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityImageUrl, setActivityImageUrl] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityDocumentFile, setActivityDocumentFile] = useState('');
  const [activityDocumentFileName, setActivityDocumentFileName] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const checkUserSession = () => {
      const savedAdmin = localStorage.getItem('gmh_admin_user');
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          if (parsed && parsed.email) {
            setUser(parsed);
            setAuthLoading(false);
            return true;
          }
        } catch (e) {
          console.error(e);
        }
      }
      return false;
    };

    const hasSession = checkUserSession();
    if (hasSession) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const hasCustom = checkUserSession();
        if (!hasCustom) {
          setUser(null);
        }
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync setting values when setting prop loads
  useEffect(() => {
    setHeroTitle(setting.heroTitle);
    setHeroSubtitle(setting.heroSubtitle);
    setVisi(setting.visi);
    setMisi(setting.misi);
    setAddress(setting.address);
    setContactEmail(setting.email);
    setContactPhone(setting.phone);
    setThemeGreen(setting.themeGreen || '#10b981');
    setThemeGold(setting.themeGold || '#f59e0b');
    setThemeName(setting.themeName || 'Hijau & Emas Cerah');

    setStatsAlumni(setting.statsAlumni || '500+');
    setStatsCities(setting.statsCities || '12+');
    setStatsMisi(setting.statsMisi || '10+');
    setStatsYears(setting.statsYears || '20+');

    setShowPillars(setting.showPillars !== false);
    setShowStats(setting.showStats !== false);
    setShowVisiMisi(setting.showVisiMisi !== false);
    setShowExplorerHub(setting.showExplorerHub !== false);
    setShowSupportInvitation(setting.showSupportInvitation !== false);

    setSejarahTitle(setting.sejarahTitle || 'Perjalanan Iman & Pelayanan Kami');
    setSejarahSection1Title(setting.sejarahSection1Title || 'Berakar Pada Kerinduan Amanat Agung');
    setSejarahSection1Text(setting.sejarahSection1Text || 'Sejarah berdirinya Global Mission House - PA KMK USU tidak lepas dari kerinduan mendalam dari para alumni pendahulu untuk melestarikan api rohani yang menyala selama masa kuliah. Setelah menyelesaikan studi, tantangan dunia profesional dan sekuler seringkali menguji iman para lulusan.\n\nUntuk menjaga pertumbuhan rohani serta memfasilitasi panggilan misi pekabaran Injil secara global, dibentuklah Persekutuan Alumni (PA) KMK USU. Kami percaya bahwa setiap alumni dipanggil untuk menjadi garam dan terang di ladang profesionalisme masing-masing.');
    setSejarahSection2Title(setting.sejarahSection2Title || 'Pusat Pengutusan dan Pembinaan');
    setSejarahSection2Text(setting.sejarahSection2Text || 'Gagasan menghadirkan Global Mission House (GMH) timbul dari kebutuhan mendesak akan adanya pusat pelatihan fisik bagi para misionaris medis, guru pedalaman, dan relawan kemanusiaan. GMH juga difungsikan sebagai rumah pembinaan bagi mahasiswa Kristen aktif Universitas Sumatera Utara untuk memperlengkapi mereka sebelum diutus ke dunia kerja.\n\nMelalui bimbingan dan pendampingan dari para alumni senior, adik-adik mahasiswa diperkenalkan pada nilai-nilai integritas Kristiani, kepemimpinan transformasional, dan kesiapan rohani yang kokoh.');
    setShowSejarahTimeline(setting.showSejarahTimeline !== false);

    if (setting.milestonesJson) {
      try {
        const parsed = JSON.parse(setting.milestonesJson);
        if (Array.isArray(parsed)) setMilestones(parsed);
      } catch (e) { console.error(e); }
    }
    setStrukturTitle(setting.strukturTitle || 'Dewan Pengurus & Pelaksana Pelayanan');
    if (setting.pembinaJson) {
      try {
        const parsed = JSON.parse(setting.pembinaJson);
        if (Array.isArray(parsed)) setPembina(parsed);
      } catch (e) { console.error(e); }
    }
    if (setting.pengawasJson) {
      try {
        const parsed = JSON.parse(setting.pengawasJson);
        if (Array.isArray(parsed)) setPengawas(parsed);
      } catch (e) { console.error(e); }
    }
    if (setting.pengurusHarianJson) {
      try {
        const parsed = JSON.parse(setting.pengurusHarianJson);
        if (Array.isArray(parsed)) setPengurusHarian(parsed);
      } catch (e) { console.error(e); }
    }
    if (setting.departemenJson) {
      try {
        const parsed = JSON.parse(setting.departemenJson);
        if (Array.isArray(parsed)) setDepartemen(parsed);
      } catch (e) { console.error(e); }
    }

    setPembangunanTitle(setting.pembangunanTitle || 'Rumah Persekutuan GMH');
    setPembangunanSubtitle(setting.pembangunanSubtitle || 'Membangun Masa Depan Pelayanan yang Kokoh');
    setPembangunanText1(setting.pembangunanText1 || 'Rumah Persekutuan Global Mission House dipersiapkan untuk menjadi pusat administrasi pelayanan alumni, asrama pembinaan sementara mahasiswa Kristen USU aktif, dan pusat latihan misi jangka pendek sebelum relawan diutus ke pedalaman.');
    setPembangunanText2(setting.pembangunanText2 || 'Dengan luas bangunan terencana sebesar 450 m², gedung ini akan dilengkapi dengan ruang ibadah, sekretariat bersama, perpustakaan teologi, serta kamar inap bagi misionaris tamu. Melalui dukungan dari seluruh alumni, kami rindu menyelesaikan pembangunan ini tepat waktu demi kemuliaan nama Tuhan.');
    setPembangunanProgress(setting.pembangunanProgress !== undefined ? setting.pembangunanProgress : 65);
    setPembangunanTarget(setting.pembangunanTarget || 'Rp 1.500.000.000');
    setPembangunanRaised(setting.pembangunanRaised || 'Rp 975.000.000');
    setPembangunanImageUrl(setting.pembangunanImageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80');

    setMisiPageTitle(setting.misiPageTitle || 'Global Mission House Project (GMHP)');
    setMisiPageSubtitle(setting.misiPageSubtitle || 'Program Misi');
    setMisiPageText(setting.misiPageText || 'Melalui program GMHP, persekutuan alumni mengoordinasikan berbagai aksi nyata untuk melayani jiwa-jiwa di daerah terpencil dan melayani sesama secara holistik. Kami tidak hanya membagikan bantuan fisik, melainkan juga menanamkan pengharapan kekal di dalam Kristus.');

    setAlumniPageTitle(setting.alumniPageTitle || 'Pelayanan Alumni PA KMK USU');
    setAlumniPageSubtitle(setting.alumniPageSubtitle || 'Pelayanan Alumni');
    setAlumniPageText(setting.alumniPageText || 'Keluarga besar Alumni KMK USU senantiasa rindu untuk menjadi berkat di mana pun ditempatkan. Melalui jejaring pelayanan alumni, kami mempererat tali persaudaraan rohani, mendampingi adik-adik yang masih berkuliah, dan bersinergi melayani Tuhan di dunia profesional.');

    setBerkaryaTitle(setting.berkaryaTitle || 'ALUMNI BERKARYA');
    setBerkaryaSubtitle(setting.berkaryaSubtitle || '"Setiap talenta adalah anugerah dari Tuhan yang patut dibagikan. Mari bersama-sama menyatakan kasih dan kebenaran, karyamu menjadi berkat dan kesaksian yang menguatkan banyak jiwa."');

    setLibraryTitle(setting.libraryTitle || 'Perpustakaan & Sumber Belajar Digital');
    setLibrarySubtitle(setting.librarySubtitle || 'Resource Library');

    setLogoUrl(setting.logoUrl || '');
    setLogoText(setting.logoText || 'G');
    setHeroBgUrl(setting.heroBgUrl || '');
    setShowHeroSection(setting.showHeroSection !== false);
    setHomeVisiTitle(setting.homeVisiTitle || 'Membangun Generasi Alumni Kristen Berintegritas');
    setHomeVisiDesc(setting.homeVisiDesc || 'Global Mission House (GMH) hadir sebagai oase rohani dan wadah kolaboratif bagi seluruh lulusan KMK Universitas Sumatera Utara. Kami percaya alumni bukan sekadar mantan mahasiswa, melainkan utusan Kristus di bidang profesional masing-masing.');

    setMisiPilar1Title(setting.misiPilar1Title || 'Misi Penginjilan & Doa');
    setMisiPilar1Desc(setting.misiPilar1Desc || 'Pelayanan pekabaran kabar baik rutin ke desa-desa binaan, kebaktian kebangunan rohani, serta dukungan doa syafaat rutin.');
    setMisiPilar2Title(setting.misiPilar2Title || 'Misi Medis & Pelayanan Kesehatan');
    setMisiPilar2Desc(setting.misiPilar2Desc || 'Pemeriksaan kesehatan gratis, pengobatan massal, penyuluhan gizi buruk, dan pembagian vitamin bagi masyarakat prasejahtera.');
    setMisiPilar3Title(setting.misiPilar3Title || 'Pemberdayaan Pendidikan Anak');
    setMisiPilar3Desc(setting.misiPilar3Desc || 'Bimbingan belajar gratis bagi anak-anak di pedalaman Sumatera Utara, penyediaan buku rohani, dan fasilitas kelas mini.');

    setMisiStep1Title(setting.misiStep1Title || 'Pilih Misi');
    setMisiStep1Desc(setting.misiStep1Desc || 'Pilih jenis program misi sosial atau kerohanian yang ingin Anda dukung atau ikuti.');
    setMisiStep2Title(setting.misiStep2Title || 'Isi Formulir');
    setMisiStep2Desc(setting.misiStep2Desc || 'Lengkapi formulir registrasi dengan data diri yang valid serta komitmen pelayanan Anda.');
    setMisiStep3Title(setting.misiStep3Title || 'Konfirmasi');
    setMisiStep3Desc(setting.misiStep3Desc || 'Hubungi tim admin kami melalui WhatsApp atau konfirmasi email setelah mendaftar.');
    setMisiStep4Title(setting.misiStep4Title || 'Mulai Berbagi');
    setMisiStep4Desc(setting.misiStep4Desc || 'Terjun langsung ke lapangan atau salurkan dukungan doa & donasi bersama tim misi.');

    setAlumniService1Title(setting.alumniService1Title || 'Persekutuan Alumni');
    setAlumniService1Desc(setting.alumniService1Desc || 'Wadah ibadah, doa bersama, dan berbagi kesaksian hidup antar alumni KMK USU di berbagai daerah secara hibrida.');
    setAlumniService1Redirect(setting.alumniService1Redirect || 'contact');

    setAlumniService2Title(setting.alumniService2Title || 'Mentoring & Pembinaan');
    setAlumniService2Desc(setting.alumniService2Desc || 'Alumni senior mendampingi adik-adik mahasiswa KMK USU aktif guna memberikan bimbingan spiritual, kepemimpinan, dan kesiapan akademik.');
    setAlumniService2Redirect(setting.alumniService2Redirect || 'about-visi-misi');

    setAlumniService3Title(setting.alumniService3Title || 'Aksi Sosial & Kasih');
    setAlumniService3Desc(setting.alumniService3Desc || 'Penyaluran dana beasiswa pendidikan bagi adik-adik berprestasi yang terkendala biaya, serta respons cepat tanggap bencana alam.');
    setAlumniService3Redirect(setting.alumniService3Redirect || 'news-pembangunan');

    setAlumniService4Title(setting.alumniService4Title || 'Networking & Karier');
    setAlumniService4Desc(setting.alumniService4Desc || 'Membangun jejaring kerja profesional untuk membagikan info lowongan pekerjaan, mentoring karier, dan kemitraan strategis.');
    setAlumniService4Redirect(setting.alumniService4Redirect || 'creation');

    if (setting.bankAccountsJson) {
      try {
        const parsed = JSON.parse(setting.bankAccountsJson);
        if (Array.isArray(parsed)) setBankAccounts(parsed);
      } catch (e) { console.error(e); }
    }
  }, [setting]);

  // Handle Auth submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!email || !password) {
      setAuthError('Harap lengkapi semua kolom.');
      return;
    }

    try {
      if (isSignUp) {
        // Sign up a custom admin in the 'admins' collection
        const adminData = {
          email: email.toLowerCase(),
          username: email.split('@')[0],
          password: password,
          fullName: 'Administrator',
          role: 'admin',
          createdAt: new Date().toISOString()
        };

        // Check if admin already exists
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        let exists = false;
        adminsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
            exists = true;
          }
        });

        if (exists) {
          setAuthError('Akun admin dengan email tersebut sudah terdaftar.');
          return;
        }

        await addDoc(collection(db, 'admins'), adminData);
        setAuthSuccess('Pendaftaran berhasil! Akun administrator telah dibuat di database.');
        setIsSignUp(false);
      } else {
        // Authenticate using custom database credentials
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        let foundAdmin: any = null;

        adminsSnapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;
          const matchEmail = data.email && data.email.toLowerCase() === email.toLowerCase();
          const matchUsername = data.username && data.username.toLowerCase() === email.toLowerCase();
          
          if ((matchEmail || matchUsername) && data.password === password) {
            foundAdmin = { id: docId, ...data };
          }
        });

        if (foundAdmin) {
          // Save session to localStorage
          localStorage.setItem('gmh_admin_user', JSON.stringify(foundAdmin));
          setUser(foundAdmin);
          setAuthSuccess('Login berhasil!');
          
          // Trigger data refresh in parent to load restricted lists
          onRefreshData();
        } else {
          setAuthError('Email/Username atau Password salah.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError('Terjadi kesalahan saat otentikasi: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('gmh_admin_user');
    setUser(null);
    setAuthSuccess(null);
    onRefreshData();
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const updated: Setting = {
        id: 'main',
        heroTitle,
        heroSubtitle,
        visi,
        misi,
        address,
        email: contactEmail,
        phone: contactPhone,
        themeGreen,
        themeGold,
        themeName,

        statsAlumni,
        statsCities,
        statsMisi,
        statsYears,
        showPillars,
        showStats,
        showVisiMisi,
        showExplorerHub,
        showSupportInvitation,

        sejarahTitle,
        sejarahSection1Title,
        sejarahSection1Text,
        sejarahSection2Title,
        sejarahSection2Text,
        milestonesJson: JSON.stringify(milestones),
        showSejarahTimeline,

        strukturTitle,
        pembinaJson: JSON.stringify(pembina),
        pengawasJson: JSON.stringify(pengawas),
        pengurusHarianJson: JSON.stringify(pengurusHarian),
        departemenJson: JSON.stringify(departemen),

        pembangunanTitle,
        pembangunanSubtitle,
        pembangunanText1,
        pembangunanText2,
        pembangunanProgress,
        pembangunanTarget,
        pembangunanRaised,
        pembangunanImageUrl,
        bankAccountsJson: JSON.stringify(bankAccounts),

        // Programs & Other Pages Content
        misiPageTitle,
        misiPageSubtitle,
        misiPageText,
        alumniPageTitle,
        alumniPageSubtitle,
        alumniPageText,
        berkaryaTitle,
        berkaryaSubtitle,
        libraryTitle,
        librarySubtitle,

        logoUrl,
        logoText,
        heroBgUrl,
        showHeroSection,
        homeVisiTitle,
        homeVisiDesc,

        misiPilar1Title,
        misiPilar1Desc,
        misiPilar2Title,
        misiPilar2Desc,
        misiPilar3Title,
        misiPilar3Desc,

        misiStep1Title,
        misiStep1Desc,
        misiStep2Title,
        misiStep2Desc,
        misiStep3Title,
        misiStep3Desc,
        misiStep4Title,
        misiStep4Desc,

        alumniService1Title,
        alumniService1Desc,
        alumniService1Redirect,
        alumniService2Title,
        alumniService2Desc,
        alumniService2Redirect,
        alumniService3Title,
        alumniService3Desc,
        alumniService3Redirect,
        alumniService4Title,
        alumniService4Desc,
        alumniService4Redirect
      };

      try {
        await setDoc(doc(db, 'settings', 'main'), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'settings/main');
      }
      onSettingUpdate(updated);
      setFeedbackMsg({ type: 'success', text: 'Konfigurasi website berhasil disimpan!' });
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Gagal menyimpan konfigurasi: ' + err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for uploading files, automatically compressing images, and converting to base64
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setBase64: (val: string) => void,
    setFileName?: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // It's an image: automatically compress and resize it down to maximum 1024x1024
      try {
        const compressedBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const maxWidth = 1024;
              const maxHeight = 1024;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(event.target?.result as string);
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              // Convert to jpeg with 75% quality to save space dramatically (usually ~30KB to 90KB)
              const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
              resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
            img.src = event.target?.result as string;
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        setBase64(compressedBase64);
        if (setFileName) {
          setFileName(file.name);
        }
      } catch (err) {
        console.error('Error compressing image:', err);
        alert('Gagal memproses gambar. Silakan coba gambar lain.');
      }
    } else {
      // It's a document (PDF, DOCX, XLSX, etc.)
      // Firestore has a strict 1MB limit per document. Base64 adds ~33% size overhead.
      // So, the raw file must be under 700 KB.
      if (file.size > 700 * 1024) {
        alert("Ukuran dokumen terlalu besar! Silakan pilih file dengan ukuran di bawah 700 KB agar dapat disimpan langsung ke database.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBase64(reader.result);
          if (setFileName) {
            setFileName(file.name);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    // Reset input target value so selecting the same file again triggers onChange
    e.target.value = '';
  };

  // Handle Save Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const articleData: any = {
        title: articleTitle,
        author: articleAuthor,
        category: articleCategory,
        imageUrl: articleImageUrl,
        content: articleContent,
        createdAt: new Date().toISOString()
      };

      if (articleDocumentFile) {
        articleData.documentFile = articleDocumentFile;
        articleData.documentFileName = articleDocumentFileName;
      } else {
        articleData.documentFile = '';
        articleData.documentFileName = '';
      }

      if (articleId) {
        // Edit Mode
        try {
          await updateDoc(doc(db, 'articles', articleId), articleData);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `articles/${articleId}`);
        }
        setFeedbackMsg({ type: 'success', text: 'Artikel berhasil diperbarui!' });
      } else {
        // Create Mode
        try {
          await addDoc(collection(db, 'articles'), articleData);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'articles');
        }
        setFeedbackMsg({ type: 'success', text: 'Artikel baru berhasil diterbitkan!' });
      }

      // Close Form & Refresh
      setShowArticleForm(false);
      resetArticleForm();
      onRefreshData();
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Gagal menyimpan artikel: ' + err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const resetArticleForm = () => {
    setArticleId(null);
    setArticleTitle('');
    setArticleAuthor('');
    setArticleCategory('Renungan');
    setArticleImageUrl('');
    setArticleContent('');
    setArticleDocumentFile('');
    setArticleDocumentFileName('');
  };

  const handleEditArticle = (art: Article) => {
    setArticleId(art.id);
    setArticleTitle(art.title);
    setArticleAuthor(art.author);
    setArticleCategory(art.category);
    setArticleImageUrl(art.imageUrl || '');
    setArticleContent(art.content);
    setArticleDocumentFile(art.documentFile || '');
    setArticleDocumentFileName(art.documentFileName || '');
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `articles/${id}`);
      }
      setFeedbackMsg({ type: 'success', text: 'Artikel berhasil dihapus!' });
      onRefreshData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Gagal menghapus artikel: ' + err.message });
    }
  };

  // Handle Save Activity
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const activityData: any = {
        title: activityTitle,
        date: activityDate,
        imageUrl: activityImageUrl,
        description: activityDescription
      };

      if (activityDocumentFile) {
        activityData.documentFile = activityDocumentFile;
        activityData.documentFileName = activityDocumentFileName;
      } else {
        activityData.documentFile = '';
        activityData.documentFileName = '';
      }

      if (activityId) {
        // Edit Mode
        try {
          await updateDoc(doc(db, 'activities', activityId), activityData);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `activities/${activityId}`);
        }
        setFeedbackMsg({ type: 'success', text: 'Kegiatan berhasil diperbarui!' });
      } else {
        // Create Mode
        try {
          await addDoc(collection(db, 'activities'), activityData);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'activities');
        }
        setFeedbackMsg({ type: 'success', text: 'Kegiatan baru berhasil diterbitkan!' });
      }

      // Close Form & Refresh
      setShowActivityForm(false);
      resetActivityForm();
      onRefreshData();
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Gagal menyimpan kegiatan: ' + err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const resetActivityForm = () => {
    setActivityId(null);
    setActivityTitle('');
    setActivityDate('');
    setActivityImageUrl('');
    setActivityDescription('');
    setActivityDocumentFile('');
    setActivityDocumentFileName('');
  };

  const handleEditActivity = (act: Activity) => {
    setActivityId(act.id);
    setActivityTitle(act.title);
    setActivityDate(act.date);
    setActivityImageUrl(act.imageUrl);
    setActivityDescription(act.description);
    setActivityDocumentFile(act.documentFile || '');
    setActivityDocumentFileName(act.documentFileName || '');
    setShowActivityForm(true);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'activities', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `activities/${id}`);
      }
      setFeedbackMsg({ type: 'success', text: 'Kegiatan berhasil dihapus!' });
      onRefreshData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Gagal menghapus kegiatan: ' + err.message });
    }
  };

  // Manage Misi Registrations Status
  const handleUpdateRegStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Approved' : currentStatus === 'Approved' ? 'Rejected' : 'Pending';
    try {
      try {
        await updateDoc(doc(db, 'misi_registrations', id), { status: nextStatus });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `misi_registrations/${id}`);
      }
      setFeedbackMsg({ type: 'success', text: `Status pendaftaran berhasil diubah menjadi ${nextStatus}!` });
      onRefreshData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Gagal memperbarui status: ' + err.message });
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'misi_registrations', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `misi_registrations/${id}`);
      }
      setFeedbackMsg({ type: 'success', text: 'Pendaftaran berhasil dihapus!' });
      onRefreshData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Gagal menghapus pendaftaran: ' + err.message });
    }
  };

  // Manage Messages
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `messages/${id}`);
      }
      setFeedbackMsg({ type: 'success', text: 'Pesan berhasil dihapus!' });
      onRefreshData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Gagal menghapus pesan: ' + err.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={onClose} />

      {/* Main CMS Card container */}
      <div className="relative w-full h-full sm:max-w-6xl sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <LayoutDashboard size={20} />
            </div>
            <div className="hidden sm:block">
              <h3 className="font-display font-bold text-lg leading-none">CMS Dashboard</h3>
              <p className="text-xs text-gray-400 mt-1">Sistem Manajemen Konten Global Mission House</p>
            </div>
            <div className="sm:hidden">
              <h3 className="font-display font-bold text-base leading-none">CMS Admin</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
                <div className="hidden md:block text-right">
                  <p className="text-[9px] font-semibold text-teal-400 uppercase tracking-widest leading-none mb-0.5">Administrator</p>
                  <p className="text-xs text-slate-300 font-mono truncate max-w-[150px]">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer flex items-center space-x-1 text-xs font-semibold"
                  title="Logout"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl text-gray-400 hover:text-white transition cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {authLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500">Memeriksa status login...</span>
          </div>
        ) : !user ? (
          /* LOGIN PANEL */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100">
                  <Lock size={22} />
                </div>
                <h4 className="font-display font-extrabold text-xl text-slate-900">Akses CMS Khusus Admin</h4>
                <p className="text-xs text-gray-400">Silakan login dengan akun admin yang telah didaftarkan</p>
              </div>

              {/* Success/Error Alerts */}
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-xl text-center">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Email Admin</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gmhpakmk.org"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition shadow-md cursor-pointer flex justify-center items-center"
                >
                  {isSignUp ? 'Daftar Akun Baru' : 'Masuk Dashboard'}
                </button>
              </form>

              {/* Sign Up / Sign In Toggle */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError(null);
                  }}
                  className="text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer underline"
                >
                  {isSignUp ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Buat akun di sini'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Top Level Horizontal Tabs */}
            <div className="bg-slate-900 border-b border-slate-850 px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 shrink-0 select-none">
              <div className="flex items-center space-x-1 sm:space-x-3 whitespace-nowrap py-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'border-teal-500 text-teal-400 font-bold bg-teal-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Settings size={15} />
                  <span>Atur Tampilan</span>
                </button>
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
                    activeTab === 'articles' 
                      ? 'border-teal-500 text-teal-400 font-bold bg-teal-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <FileText size={15} />
                  <span>Kelola Artikel</span>
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
                    activeTab === 'activities' 
                      ? 'border-teal-500 text-teal-400 font-bold bg-teal-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <ImageIcon size={15} />
                  <span>Kelola Galeri</span>
                </button>
                <button
                  onClick={() => setActiveTab('registrations')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 relative cursor-pointer ${
                    activeTab === 'registrations' 
                      ? 'border-teal-500 text-teal-400 font-bold bg-teal-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Inbox size={15} />
                  <span>Pendaftaran Misi</span>
                  {misiRegistrations.filter(r => r.status === 'Pending').length > 0 && (
                    <span className="absolute top-2 right-1 sm:right-2 px-1.5 py-0.5 text-[8px] bg-amber-500 text-slate-900 rounded-full font-extrabold animate-pulse">
                      {misiRegistrations.filter(r => r.status === 'Pending').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 relative cursor-pointer ${
                    activeTab === 'messages' 
                      ? 'border-teal-500 text-teal-400 font-bold bg-teal-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Inbox size={15} />
                  <span>Pesan Masuk</span>
                  {messages.length > 0 && (
                    <span className="absolute top-2 right-1 sm:right-2 px-1.5 py-0.5 text-[8px] bg-teal-500 text-slate-950 rounded-full font-extrabold">
                      {messages.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8">
              {/* Notifications */}
              {feedbackMsg && (
                <div
                  className={`p-4 border rounded-2xl mb-6 flex items-start space-x-3 text-sm font-medium shadow-xs ${
                    feedbackMsg.type === 'success'
                      ? 'bg-teal-50 border-teal-200 text-teal-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <Check size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              {/* RENDER ACTIVE TAB */}

              {/* 1. GENERAL SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Settings Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
                    <div>
                      <h4 className="font-display font-extrabold text-xl text-slate-900">Pengaturan & Konten Website</h4>
                      <p className="text-xs text-gray-500">Kelola konten dinamis untuk semua halaman di bawah ini.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl text-sm transition cursor-pointer flex items-center space-x-1.5 shadow-md self-end sm:self-auto"
                    >
                      {actionLoading && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />}
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>

                  {/* Settings Sub-Tabs Navigation */}
                  <div className="flex overflow-x-auto pb-2 border-b border-gray-100 gap-2 scrollbar-none">
                    {[
                      { id: 'home', label: 'Halaman Utama' },
                      { id: 'sejarah', label: 'Sejarah Singkat' },
                      { id: 'struktur', label: 'Struktur Yayasan' },
                      { id: 'pembangunan', label: 'Pembangunan GMH' },
                      { id: 'misi', label: 'Program Misi' },
                      { id: 'alumni_service', label: 'Pelayanan Alumni' },
                      { id: 'berkarya', label: 'Alumni Berkarya' },
                      { id: 'library', label: 'Perpustakaan' },
                      { id: 'contact', label: 'Kontak Resmi' },
                      { id: 'theme', label: 'Setelan Tema' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSettingsSubTab(tab.id as any)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                          settingsSubTab === tab.id
                            ? 'bg-teal-600 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* SUB-TAB 1: HOME PAGE */}
                  {settingsSubTab === 'home' && (
                    <div className="space-y-6">
                      {/* Hero Settings */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Identitas Brand & Hero Banner</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Logo Upload */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">Logo Yayasan/Instansi (Upload Gambar)</label>
                            <div className="flex flex-wrap items-center gap-3">
                              <label htmlFor="logo-upload-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                                <ImageIcon size={16} className="text-teal-600" />
                                <span className="text-xs font-semibold text-slate-700">Pilih File Logo</span>
                                <input
                                  id="logo-upload-file"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, setLogoUrl)}
                                  className="sr-only"
                                />
                              </label>
                              {logoUrl && (
                                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs">
                                  <span className="text-gray-600 truncate max-w-[120px]">Logo Terpilih</span>
                                  <button
                                    type="button"
                                    onClick={() => setLogoUrl('')}
                                    className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                                    title="Hapus Logo"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                            {logoUrl && (
                              <div className="mt-2 h-16 w-16 border border-slate-200 rounded-lg overflow-hidden bg-white p-1 flex items-center justify-center shadow-xs">
                                <img
                                  src={logoUrl}
                                  alt="Preview Logo"
                                  className="max-w-full max-h-full object-contain rounded-sm"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <span className="text-[10px] text-gray-400 block">Format ideal: PNG/JPEG transparan, rasio 1:1.</span>
                          </div>

                          {/* Fallback Initials */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">Inisial Logo (Fallback Teks)</label>
                            <input
                              type="text"
                              value={logoText}
                              onChange={(e) => setLogoText(e.target.value)}
                              maxLength={3}
                              placeholder="G"
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                            <span className="text-[10px] text-gray-400 block">Tampil jika tidak ada gambar logo yang diunggah.</span>
                          </div>

                          {/* Hero Background Upload */}
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">Background Hero Banner (Upload Gambar)</label>
                            <div className="flex flex-wrap items-center gap-3">
                              <label htmlFor="hero-bg-upload-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                                <ImageIcon size={16} className="text-teal-600" />
                                <span className="text-xs font-semibold text-slate-700">Pilih File Background</span>
                                <input
                                  id="hero-bg-upload-file"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, setHeroBgUrl)}
                                  className="sr-only"
                                />
                              </label>
                              {heroBgUrl && (
                                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs">
                                  <span className="text-gray-600 truncate max-w-[180px]">Background Terpilih</span>
                                  <button
                                    type="button"
                                    onClick={() => setHeroBgUrl('')}
                                    className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                                    title="Hapus Background"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                            {heroBgUrl && (
                              <div className="mt-2 max-w-sm h-32 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                                <img
                                  src={heroBgUrl}
                                  alt="Preview Background"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <span className="text-[10px] text-gray-400 block">Format ideal: gambar landscape (16:9). Otomatis dikompres & dikecilkan demi performa database.</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Utama Hero Banner</label>
                            <input
                              type="text"
                              required
                              value={heroTitle}
                              onChange={(e) => setHeroTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Sub-judul / Deskripsi</label>
                            <textarea
                              rows={2}
                              required
                              value={heroSubtitle}
                              onChange={(e) => setHeroSubtitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section Toggles */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Tampilkan/Sembunyikan Bagian (Section)</h5>
                        <p className="text-xs text-gray-500">Gunakan sakelar di bawah ini untuk mengontrol penayangan bagian tertentu di Beranda.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition">
                            <input
                              type="checkbox"
                              checked={showHeroSection}
                              onChange={(e) => setShowHeroSection(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Hero Banner</span>
                              <span className="text-[10px] text-gray-500">Menampilkan banner utama di atas halaman</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition">
                            <input
                              type="checkbox"
                              checked={showPillars}
                              onChange={(e) => setShowPillars(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Pilar Pelayanan</span>
                              <span className="text-[10px] text-gray-500">Menampilkan 4 pilar utama kegiatan</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition">
                            <input
                              type="checkbox"
                              checked={showStats}
                              onChange={(e) => setShowStats(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Statistik Pencapaian</span>
                              <span className="text-[10px] text-gray-500">Menampilkan angka-angka statistik alumni & misi</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition">
                            <input
                              type="checkbox"
                              checked={showVisiMisi}
                              onChange={(e) => setShowVisiMisi(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Visi & Misi</span>
                              <span className="text-[10px] text-gray-500">Menampilkan ringkasan visi misi yayasan</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition">
                            <input
                              type="checkbox"
                              checked={showExplorerHub}
                              onChange={(e) => setShowExplorerHub(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Explorer Hub</span>
                              <span className="text-[10px] text-gray-500">Menampilkan navigasi bento grid di Beranda</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition sm:col-span-2">
                            <input
                              type="checkbox"
                              checked={showSupportInvitation}
                              onChange={(e) => setShowSupportInvitation(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Undangan Dukungan</span>
                              <span className="text-[10px] text-gray-500">Menampilkan banner hijau ajakan mendukung & berpartisipasi</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Home Statistics */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Nilai Pencapaian / Statistik</h5>
                        <p className="text-xs text-gray-500">Angka ini akan tampil di bagian Statistics Tracker Halaman Utama (jika diaktifkan).</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Alumni Terdaftar</label>
                            <input
                              type="text"
                              required
                              value={statsAlumni}
                              onChange={(e) => setStatsAlumni(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Jangkauan Kota</label>
                            <input
                              type="text"
                              required
                              value={statsCities}
                              onChange={(e) => setStatsCities(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Misi Lapangan</label>
                            <input
                              type="text"
                              required
                              value={statsMisi}
                              onChange={(e) => setStatsMisi(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Tahun Pengalaman</label>
                            <input
                              type="text"
                              required
                              value={statsYears}
                              onChange={(e) => setStatsYears(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visi Misi Settings */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Konten Visi & Misi</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Teks Visi Kami</label>
                            <textarea
                              rows={4}
                              required
                              value={visi}
                              onChange={(e) => setVisi(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Teks Misi Kami</label>
                            <textarea
                              rows={4}
                              required
                              value={misi}
                              onChange={(e) => setMisi(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fokus Visi Strategis Settings */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Fokus Visi Strategis (Halaman Utama)</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Fokus Visi Strategis</label>
                            <input
                              type="text"
                              required
                              value={homeVisiTitle}
                              onChange={(e) => setHomeVisiTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Fokus Visi Strategis</label>
                            <textarea
                              rows={3}
                              required
                              value={homeVisiDesc}
                              onChange={(e) => setHomeVisiDesc(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: SEJARAH SINGKAT */}
                  {settingsSubTab === 'sejarah' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Konten & Narasi Sejarah</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Utama Halaman Sejarah</label>
                            <input
                              type="text"
                              required
                              value={sejarahTitle}
                              onChange={(e) => setSejarahTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Judul Narasi Kiri (Section 1)</label>
                                <input
                                  type="text"
                                  required
                                  value={sejarahSection1Title}
                                  onChange={(e) => setSejarahSection1Title(e.target.value)}
                                  className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-teal-600 transition"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Isi Narasi Kiri (Section 1)</label>
                                <textarea
                                  rows={10}
                                  required
                                  value={sejarahSection1Text}
                                  onChange={(e) => setSejarahSection1Text(e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-600 transition leading-relaxed"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Judul Narasi Kanan (Section 2)</label>
                                <input
                                  type="text"
                                  required
                                  value={sejarahSection2Title}
                                  onChange={(e) => setSejarahSection2Title(e.target.value)}
                                  className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-teal-600 transition"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Isi Narasi Kanan (Section 2)</label>
                                <textarea
                                  rows={10}
                                  required
                                  value={sejarahSection2Text}
                                  onChange={(e) => setSejarahSection2Text(e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-600 transition leading-relaxed"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Milestones timeline */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h5 className="font-display font-bold text-sm text-teal-800">Garis Waktu Sejarah (Timeline Milestones)</h5>
                          <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showSejarahTimeline}
                              onChange={(e) => setShowSejarahTimeline(e.target.checked)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded-sm focus:ring-teal-500"
                            />
                            <span>Tampilkan Garis Waktu</span>
                          </label>
                        </div>

                        {/* Existing Milestones List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                          {milestones.length === 0 ? (
                            <p className="text-xs text-gray-400 italic text-center py-4">Belum ada tonggak sejarah terdaftar.</p>
                          ) : (
                            milestones.map((m, idx) => (
                              <div key={idx} className="p-3 border border-gray-100 bg-slate-50/50 rounded-xl flex justify-between items-start text-xs">
                                <div className="space-y-1 pr-4">
                                  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">{m.year}</span>
                                  <h6 className="font-bold text-slate-800 text-sm">{m.title}</h6>
                                  <p className="text-gray-500 leading-normal">{m.desc}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))}
                                  className="text-rose-500 hover:text-rose-700 font-bold transition cursor-pointer p-1"
                                  title="Hapus"
                                >
                                  Hapus
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Milestone Form */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <h6 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Tambah Tonggak Sejarah Baru</h6>
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div className="sm:col-span-3">
                              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Tahun</label>
                              <input
                                type="text"
                                placeholder="Misal: 2015"
                                value={newMilestoneYear}
                                onChange={(e) => setNewMilestoneYear(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition font-semibold"
                              />
                            </div>
                            <div className="sm:col-span-9">
                              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Judul Peristiwa</label>
                              <input
                                type="text"
                                placeholder="Misal: Peresmian Kantor Sekretariat Baru"
                                value={newMilestoneTitle}
                                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div className="sm:col-span-12">
                              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Deskripsi Singkat</label>
                              <textarea
                                rows={2}
                                placeholder="Misal: Melalui patungan sukarela alumni, yayasan akhirnya melunasi pembelian gedung sekretariat permanen untuk menunjang kebutuhan administratif."
                                value={newMilestoneDesc}
                                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition leading-relaxed"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (newMilestoneYear && newMilestoneTitle) {
                                setMilestones([...milestones, { year: newMilestoneYear, title: newMilestoneTitle, desc: newMilestoneDesc }]);
                                setNewMilestoneYear('');
                                setNewMilestoneTitle('');
                                setNewMilestoneDesc('');
                              }
                            }}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer block"
                          >
                            + Masukkan ke Garis Waktu
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: STRUKTUR YAYASAN */}
                  {settingsSubTab === 'struktur' && (
                    <div className="space-y-6">
                      {/* Structure Title */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Judul Halaman Struktur</h5>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Judul Utama Halaman Struktur Yayasan</label>
                          <input
                            type="text"
                            required
                            value={strukturTitle}
                            onChange={(e) => setStrukturTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          />
                        </div>
                      </div>

                      {/* Dewan Pembina Manager */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Dewan Pembina</h5>
                        <div className="space-y-2">
                          {pembina.map((p, idx) => (
                            <div key={idx} className="p-2 border border-gray-50 bg-slate-50/50 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{p.name}</span>
                                <span className="text-gray-500 ml-2">({p.role})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPembina(pembina.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 transition font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <input
                            type="text"
                            placeholder="Nama Pembina"
                            value={newPembinaName}
                            onChange={(e) => setNewPembinaName(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Jabatan (cth: Anggota Pembina)"
                              value={newPembinaRole}
                              onChange={(e) => setNewPembinaRole(e.target.value)}
                              className="flex-grow px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newPembinaName && newPembinaRole) {
                                  setPembina([...pembina, { name: newPembinaName, role: newPembinaRole }]);
                                  setNewPembinaName('');
                                  setNewPembinaRole('');
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dewan Pengawas Manager */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Dewan Pengawas</h5>
                        <div className="space-y-2">
                          {pengawas.map((p, idx) => (
                            <div key={idx} className="p-2 border border-gray-50 bg-slate-50/50 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{p.name}</span>
                                <span className="text-gray-500 ml-2">({p.role})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPengawas(pengawas.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 transition font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <input
                            type="text"
                            placeholder="Nama Pengawas"
                            value={newPengawasName}
                            onChange={(e) => setNewPengawasName(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Jabatan (cth: Anggota Pengawas)"
                              value={newPengawasRole}
                              onChange={(e) => setNewPengawasRole(e.target.value)}
                              className="flex-grow px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newPengawasName && newPengawasRole) {
                                  setPengawas([...pengawas, { name: newPengawasName, role: newPengawasRole }]);
                                  setNewPengawasName('');
                                  setNewPengawasRole('');
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Pengurus Harian Manager */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Badan Pengurus Harian</h5>
                        <div className="space-y-2">
                          {pengurusHarian.map((p, idx) => (
                            <div key={idx} className="p-2 border border-gray-50 bg-slate-50/50 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{p.name}</span>
                                <span className="text-gray-500 ml-2">({p.role})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPengurusHarian(pengurusHarian.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 transition font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <input
                            type="text"
                            placeholder="Nama Pengurus"
                            value={newPengurusName}
                            onChange={(e) => setNewPengurusName(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Jabatan (cth: Ketua Umum / Bendahara)"
                              value={newPengurusRole}
                              onChange={(e) => setNewPengurusRole(e.target.value)}
                              className="flex-grow px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newPengurusName && newPengurusRole) {
                                  setPengurusHarian([...pengurusHarian, { name: newPengurusName, role: newPengurusRole }]);
                                  setNewPengurusName('');
                                  setNewPengurusRole('');
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Departemen / Bidang Manager */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Ketua Bidang / Pelaksana Pelayanan</h5>
                        <div className="space-y-2">
                          {departemen.map((p, idx) => (
                            <div key={idx} className="p-2 border border-gray-50 bg-slate-50/50 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{p.name}</span>
                                <span className="text-gray-500 ml-2">({p.dept})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDepartemen(departemen.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 transition font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <input
                            type="text"
                            placeholder="Nama Ketua Bidang"
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Nama Bidang (cth: Bidang Pendidikan)"
                              value={newDeptRole}
                              onChange={(e) => setNewDeptRole(e.target.value)}
                              className="flex-grow px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newDeptName && newDeptRole) {
                                  setDepartemen([...departemen, { name: newDeptName, dept: newDeptRole }]);
                                  setNewDeptName('');
                                  setNewDeptRole('');
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: PEMBANGUNAN RUMAH */}
                  {settingsSubTab === 'pembangunan' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Konten Proyek Pembangunan</h5>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Judul Utama Proyek</label>
                              <input
                                type="text"
                                required
                                value={pembangunanTitle}
                                onChange={(e) => setPembangunanTitle(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Subjudul / Tagline Proyek</label>
                              <input
                                type="text"
                                required
                                value={pembangunanSubtitle}
                                onChange={(e) => setPembangunanSubtitle(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Paragraf Narasi 1 (Utama)</label>
                              <textarea
                                rows={4}
                                required
                                value={pembangunanText1}
                                onChange={(e) => setPembangunanText1(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-600 transition leading-relaxed"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Paragraf Narasi 2 (Pendukung)</label>
                              <textarea
                                rows={4}
                                required
                                value={pembangunanText2}
                                onChange={(e) => setPembangunanText2(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-600 transition leading-relaxed"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Kemajuan / Progress (%)</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                required
                                value={pembangunanProgress}
                                onChange={(e) => setPembangunanProgress(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Target Dana</label>
                              <input
                                type="text"
                                required
                                value={pembangunanTarget}
                                onChange={(e) => setPembangunanTarget(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">Dana Terkumpul</label>
                              <input
                                type="text"
                                required
                                value={pembangunanRaised}
                                onChange={(e) => setPembangunanRaised(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">URL Foto Konstruksi (Unsplash / Base64)</label>
                            <input
                              type="text"
                              required
                              value={pembangunanImageUrl}
                              onChange={(e) => setPembangunanImageUrl(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bank Accounts Manager */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Nomor Rekening Dukungan Dana</h5>
                        <div className="space-y-2">
                          {bankAccounts.map((b, idx) => (
                            <div key={idx} className="p-3 border border-gray-50 bg-slate-50/50 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-teal-800 text-sm block">{b.bank}</span>
                                <span className="text-slate-700 font-mono text-xs">{b.number}</span>
                                <span className="text-gray-500 ml-2">a.n. {b.holder}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 transition font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          <input
                            type="text"
                            placeholder="Nama Bank (cth: Bank Mandiri)"
                            value={newBankName}
                            onChange={(e) => setNewBankName(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Nomor Rekening"
                            value={newBankNumber}
                            onChange={(e) => setNewBankNumber(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Atas Nama Pemilik"
                              value={newBankHolder}
                              onChange={(e) => setNewBankHolder(e.target.value)}
                              className="flex-grow px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newBankName && newBankNumber && newBankHolder) {
                                  setBankAccounts([...bankAccounts, { bank: newBankName, number: newBankNumber, holder: newBankHolder }]);
                                  setNewBankName('');
                                  setNewBankNumber('');
                                  setNewBankHolder('');
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 5: PROGRAM MISI */}
                  {settingsSubTab === 'misi' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Halaman Program Misi</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Kategori / Sub-title Halaman</label>
                            <input
                              type="text"
                              required
                              value={misiPageSubtitle}
                              onChange={(e) => setMisiPageSubtitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Halaman</label>
                            <input
                              type="text"
                              required
                              value={misiPageTitle}
                              onChange={(e) => setMisiPageTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Narasi Misi</label>
                            <textarea
                              rows={5}
                              required
                              value={misiPageText}
                              onChange={(e) => setMisiPageText(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition font-sans leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pillars Focus Misi */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Pilar Fokus Misi Kami (3 Pilar)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Pilar 1 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Pilar 01</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Pilar</label>
                              <input
                                type="text"
                                required
                                value={misiPilar1Title}
                                onChange={(e) => setMisiPilar1Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Pilar</label>
                              <textarea
                                rows={3}
                                required
                                value={misiPilar1Desc}
                                onChange={(e) => setMisiPilar1Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          {/* Pilar 2 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Pilar 02</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Pilar</label>
                              <input
                                type="text"
                                required
                                value={misiPilar2Title}
                                onChange={(e) => setMisiPilar2Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Pilar</label>
                              <textarea
                                rows={3}
                                required
                                value={misiPilar2Desc}
                                onChange={(e) => setMisiPilar2Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          {/* Pilar 3 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Pilar 03</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Pilar</label>
                              <input
                                type="text"
                                required
                                value={misiPilar3Title}
                                onChange={(e) => setMisiPilar3Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Pilar</label>
                              <textarea
                                rows={3}
                                required
                                value={misiPilar3Desc}
                                onChange={(e) => setMisiPilar3Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alur Langkah Misi */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Alur Keikutsertaan Pelayanan (4 Langkah)</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Step 1 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-amber-700 block">Langkah 01</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Langkah</label>
                              <input
                                type="text"
                                required
                                value={misiStep1Title}
                                onChange={(e) => setMisiStep1Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi</label>
                              <textarea
                                rows={3}
                                required
                                value={misiStep1Desc}
                                onChange={(e) => setMisiStep1Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-amber-700 block">Langkah 02</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Langkah</label>
                              <input
                                type="text"
                                required
                                value={misiStep2Title}
                                onChange={(e) => setMisiStep2Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi</label>
                              <textarea
                                rows={3}
                                required
                                value={misiStep2Desc}
                                onChange={(e) => setMisiStep2Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-amber-700 block">Langkah 03</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Langkah</label>
                              <input
                                type="text"
                                required
                                value={misiStep3Title}
                                onChange={(e) => setMisiStep3Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi</label>
                              <textarea
                                rows={3}
                                required
                                value={misiStep3Desc}
                                onChange={(e) => setMisiStep3Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-amber-700 block">Langkah 04</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Judul Langkah</label>
                              <input
                                type="text"
                                required
                                value={misiStep4Title}
                                onChange={(e) => setMisiStep4Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi</label>
                              <textarea
                                rows={3}
                                required
                                value={misiStep4Desc}
                                onChange={(e) => setMisiStep4Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 6: PELAYANAN ALUMNI */}
                  {settingsSubTab === 'alumni_service' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Halaman Pelayanan Alumni</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Kategori / Sub-title Halaman</label>
                            <input
                              type="text"
                              required
                              value={alumniPageSubtitle}
                              onChange={(e) => setAlumniPageSubtitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Halaman</label>
                            <input
                              type="text"
                              required
                              value={alumniPageTitle}
                              onChange={(e) => setAlumniPageTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Narasi Pelayanan</label>
                            <textarea
                              rows={5}
                              required
                              value={alumniPageText}
                              onChange={(e) => setAlumniPageText(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition font-sans leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alumni Services Cards Editing */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Daftar Layanan Alumni (4 Pelayanan)</h5>
                        <p className="text-xs text-gray-500">Masing-masing kartu pelayanan alumni dapat diatur judul, deskripsi, serta halaman tujuan (redirect) jika kartu di-klik oleh pengguna.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Service 1 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Layanan 01</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Nama Layanan</label>
                              <input
                                type="text"
                                required
                                value={alumniService1Title}
                                onChange={(e) => setAlumniService1Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Layanan</label>
                              <textarea
                                rows={3}
                                required
                                value={alumniService1Desc}
                                onChange={(e) => setAlumniService1Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Halaman Tujuan Klik (Redirect)</label>
                              <select
                                value={alumniService1Redirect}
                                onChange={(e) => setAlumniService1Redirect(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              >
                                <option value="about-sejarah">Tentang Kami - Sejarah</option>
                                <option value="about-visi-misi">Tentang Kami - Visi & Misi</option>
                                <option value="about-struktur">Tentang Kami - Struktur Organisasi</option>
                                <option value="program-misi">Program Kami - Program Misi</option>
                                <option value="program-alumni">Program Kami - Pelayanan Alumni</option>
                                <option value="creation">Alumni Berkarya</option>
                                <option value="library">Resource Library (Perpustakaan)</option>
                                <option value="pembangunan">Pembangunan GMH</option>
                                <option value="news-pembangunan">Berita / Aksi Pembangunan</option>
                                <option value="contact">Hubungi Kami (Kontak)</option>
                              </select>
                            </div>
                          </div>

                          {/* Service 2 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Layanan 02</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Nama Layanan</label>
                              <input
                                type="text"
                                required
                                value={alumniService2Title}
                                onChange={(e) => setAlumniService2Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Layanan</label>
                              <textarea
                                rows={3}
                                required
                                value={alumniService2Desc}
                                onChange={(e) => setAlumniService2Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Halaman Tujuan Klik (Redirect)</label>
                              <select
                                value={alumniService2Redirect}
                                onChange={(e) => setAlumniService2Redirect(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              >
                                <option value="about-sejarah">Tentang Kami - Sejarah</option>
                                <option value="about-visi-misi">Tentang Kami - Visi & Misi</option>
                                <option value="about-struktur">Tentang Kami - Struktur Organisasi</option>
                                <option value="program-misi">Program Kami - Program Misi</option>
                                <option value="program-alumni">Program Kami - Pelayanan Alumni</option>
                                <option value="creation">Alumni Berkarya</option>
                                <option value="library">Resource Library (Perpustakaan)</option>
                                <option value="pembangunan">Pembangunan GMH</option>
                                <option value="news-pembangunan">Berita / Aksi Pembangunan</option>
                                <option value="contact">Hubungi Kami (Kontak)</option>
                              </select>
                            </div>
                          </div>

                          {/* Service 3 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Layanan 03</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Nama Layanan</label>
                              <input
                                type="text"
                                required
                                value={alumniService3Title}
                                onChange={(e) => setAlumniService3Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Layanan</label>
                              <textarea
                                rows={3}
                                required
                                value={alumniService3Desc}
                                onChange={(e) => setAlumniService3Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Halaman Tujuan Klik (Redirect)</label>
                              <select
                                value={alumniService3Redirect}
                                onChange={(e) => setAlumniService3Redirect(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              >
                                <option value="about-sejarah">Tentang Kami - Sejarah</option>
                                <option value="about-visi-misi">Tentang Kami - Visi & Misi</option>
                                <option value="about-struktur">Tentang Kami - Struktur Organisasi</option>
                                <option value="program-misi">Program Kami - Program Misi</option>
                                <option value="program-alumni">Program Kami - Pelayanan Alumni</option>
                                <option value="creation">Alumni Berkarya</option>
                                <option value="library">Resource Library (Perpustakaan)</option>
                                <option value="pembangunan">Pembangunan GMH</option>
                                <option value="news-pembangunan">Berita / Aksi Pembangunan</option>
                                <option value="contact">Hubungi Kami (Kontak)</option>
                              </select>
                            </div>
                          </div>

                          {/* Service 4 */}
                          <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-teal-700 block">Layanan 04</span>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Nama Layanan</label>
                              <input
                                type="text"
                                required
                                value={alumniService4Title}
                                onChange={(e) => setAlumniService4Title(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Deskripsi Layanan</label>
                              <textarea
                                rows={3}
                                required
                                value={alumniService4Desc}
                                onChange={(e) => setAlumniService4Desc(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-700 block mb-1">Halaman Tujuan Klik (Redirect)</label>
                              <select
                                value={alumniService4Redirect}
                                onChange={(e) => setAlumniService4Redirect(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-teal-600 transition"
                              >
                                <option value="about-sejarah">Tentang Kami - Sejarah</option>
                                <option value="about-visi-misi">Tentang Kami - Visi & Misi</option>
                                <option value="about-struktur">Tentang Kami - Struktur Organisasi</option>
                                <option value="program-misi">Program Kami - Program Misi</option>
                                <option value="program-alumni">Program Kami - Pelayanan Alumni</option>
                                <option value="creation">Alumni Berkarya</option>
                                <option value="library">Resource Library (Perpustakaan)</option>
                                <option value="pembangunan">Pembangunan GMH</option>
                                <option value="news-pembangunan">Berita / Aksi Pembangunan</option>
                                <option value="contact">Hubungi Kami (Kontak)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 7: ALUMNI BERKARYA */}
                  {settingsSubTab === 'berkarya' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Halaman Alumni Berkarya</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Halaman</label>
                            <input
                              type="text"
                              required
                              value={berkaryaTitle}
                              onChange={(e) => setBerkaryaTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Sub-title / Kutipan Motivasi</label>
                            <textarea
                              rows={3}
                              required
                              value={berkaryaSubtitle}
                              onChange={(e) => setBerkaryaSubtitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition font-sans leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 8: PERPUSTAKAAN */}
                  {settingsSubTab === 'library' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Halaman Perpustakaan</h5>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Kategori / Sub-title Halaman</label>
                            <input
                              type="text"
                              required
                              value={librarySubtitle}
                              onChange={(e) => setLibrarySubtitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Halaman</label>
                            <input
                              type="text"
                              required
                              value={libraryTitle}
                              onChange={(e) => setLibraryTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 9: CONTACT INFO */}
                  {settingsSubTab === 'contact' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Kontak Resmi & Alamat Sekretariat</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Email Resmi</label>
                            <input
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">No. Telp / WhatsApp</label>
                            <input
                              type="text"
                              required
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Alamat Sekretariat</label>
                            <input
                              type="text"
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 10: THEME SETTINGS */}
                  {settingsSubTab === 'theme' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                        <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Tema & Skema Warna Website</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Pilih salah satu tema preset cerah di bawah ini, atau tentukan warna kustom Anda sendiri menggunakan pemilih warna (color picker). Warna yang Anda simpan akan langsung diterapkan di seluruh navigasi, tombol, dan ornamen website.
                        </p>

                        {/* Presets Grid */}
                        <div className="space-y-3 pt-2">
                          <label className="text-xs font-bold text-gray-700 block">Pilihan Tema Preset</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {[
                              { name: 'Hijau & Emas Cerah', primary: '#10b981', secondary: '#f59e0b', desc: 'Sangat cerah, modern, dan segar' },
                              { name: 'Teal & Jingga Modern', primary: '#0d9488', secondary: '#f97316', desc: 'Nuansa profesional kontemporer' },
                              { name: 'Biru Royal & Kuning', primary: '#1d4ed8', secondary: '#eab308', desc: 'Kombinasi klasik penuh energi' },
                              { name: 'Hijau Hutan Klasik', primary: '#1a4332', secondary: '#d4af37', desc: 'Warna asli GMH sebelumnya' },
                              { name: 'Slate & Cyan Minimalis', primary: '#475569', secondary: '#0ea5e9', desc: 'Elegan, tenang, dan bersih' }
                            ].map((preset) => {
                              const isActive = themeName === preset.name || (themeGreen.toLowerCase() === preset.primary.toLowerCase() && themeGold.toLowerCase() === preset.secondary.toLowerCase());
                              return (
                                <button
                                  type="button"
                                  key={preset.name}
                                  onClick={() => {
                                    setThemeName(preset.name);
                                    setThemeGreen(preset.primary);
                                    setThemeGold(preset.secondary);
                                  }}
                                  className={`p-3 text-left border rounded-xl transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer hover:border-teal-500 hover:shadow-xs ${
                                    isActive 
                                      ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600' 
                                      : 'border-gray-200 bg-slate-50/30'
                                  }`}
                                >
                                  <div>
                                    <span className="text-[11px] font-bold block text-gray-800 leading-none">{preset.name}</span>
                                    <span className="text-[9px] text-gray-500 mt-1 block leading-tight">{preset.desc}</span>
                                  </div>
                                  <div className="flex space-x-1.5 mt-2">
                                    <div className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: preset.primary }} title={`Utama: ${preset.primary}`} />
                                    <div className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: preset.secondary }} title={`Aksen: ${preset.secondary}`} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Color Pickers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">Warna Utama (Primary / Green)</label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={themeGreen}
                                onChange={(e) => {
                                  setThemeGreen(e.target.value);
                                  setThemeName('Kustom');
                                }}
                                className="w-12 h-10 p-0 border border-gray-200 rounded-lg cursor-pointer shadow-xs bg-transparent"
                              />
                              <input
                                type="text"
                                value={themeGreen}
                                onChange={(e) => {
                                  setThemeGreen(e.target.value);
                                  setThemeName('Kustom');
                                }}
                                placeholder="#10b981"
                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">Warna Aksen (Secondary / Gold)</label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={themeGold}
                                onChange={(e) => {
                                  setThemeGold(e.target.value);
                                  setThemeName('Kustom');
                                }}
                                className="w-12 h-10 p-0 border border-gray-200 rounded-lg cursor-pointer shadow-xs bg-transparent"
                              />
                              <input
                                type="text"
                                value={themeGold}
                                onChange={(e) => {
                                  setThemeGold(e.target.value);
                                  setThemeName('Kustom');
                                }}
                                placeholder="#f59e0b"
                                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:border-teal-600 transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* 2. MANAGE ARTICLES */}
              {activeTab === 'articles' && (
                <div className="space-y-6">
                  {showArticleForm ? (
                    /* ARTICLE CRUD FORM */
                    <form onSubmit={handleSaveArticle} className="bg-white border border-gray-100 p-6 rounded-2xl space-y-5 shadow-sm">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <h5 className="font-display font-bold text-teal-800 text-base">
                          {articleId ? 'Edit Artikel Alumni' : 'Buat Artikel Baru'}
                        </h5>
                        <button
                          type="button"
                          onClick={() => { setShowArticleForm(false); resetArticleForm(); }}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Judul Artikel *</label>
                          <input
                            type="text"
                            required
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            placeholder="Contoh: Meneladani Kristus di Kantor"
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Penulis *</label>
                          <input
                            type="text"
                            required
                            value={articleAuthor}
                            onChange={(e) => setArticleAuthor(e.target.value)}
                            placeholder="Contoh: dr. Maria Siahaan"
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Kategori *</label>
                          <select
                            value={articleCategory}
                            onChange={(e) => setArticleCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          >
                            <option value="Renungan">Renungan</option>
                            <option value="Kabar Alumni">Kabar Alumni</option>
                            <option value="Sosial & Misi">Sosial & Misi</option>
                            <option value="Pengumuman">Pengumuman</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Foto Cover (Upload ke Database)</label>
                          <div className="flex flex-wrap items-center gap-3">
                            <label htmlFor="article-cover-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                              <ImageIcon size={16} className="text-teal-600" />
                              <span className="text-xs font-semibold text-slate-700">Pilih Foto</span>
                              <input
                                id="article-cover-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, setArticleImageUrl)}
                                className="sr-only"
                              />
                            </label>
                            {articleImageUrl && (
                              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 max-w-[200px] truncate text-xs">
                                <span className="text-gray-600 truncate">Foto Cover Terpilih</span>
                                <button
                                  type="button"
                                  onClick={() => setArticleImageUrl('')}
                                  className="text-red-500 hover:text-red-700 font-bold ml-1"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          {articleImageUrl && articleImageUrl.startsWith('data:') && (
                            <div className="mt-2 h-16 w-16 border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                              <img src={articleImageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="mt-2">
                            <details className="text-[10px] text-gray-500 cursor-pointer">
                              <summary>Atau gunakan URL Gambar (opsional)</summary>
                              <input
                                type="url"
                                value={articleImageUrl}
                                onChange={(e) => setArticleImageUrl(e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                              />
                            </details>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Dokumen Lampiran / Brosur (Opsional - PDF, Doc, JPG, dll)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="article-doc-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                            <FileText size={16} className="text-teal-600" />
                            <span className="text-xs font-semibold text-slate-700">Pilih Dokumen</span>
                            <input
                              id="article-doc-file"
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                              onChange={(e) => handleFileUpload(e, setArticleDocumentFile, setArticleDocumentFileName)}
                              className="sr-only"
                            />
                          </label>
                          {articleDocumentFileName ? (
                            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs">
                              <span className="text-gray-700 font-medium truncate max-w-[250px]">{articleDocumentFileName}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setArticleDocumentFile('');
                                  setArticleDocumentFileName('');
                                }}
                                className="text-red-500 hover:text-red-700 font-bold ml-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Belum ada dokumen yang dilampirkan</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Ukuran file maksimal yang disarankan: 1.2 MB</p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Isi Konten Artikel *</label>
                        <textarea
                          rows={8}
                          required
                          value={articleContent}
                          onChange={(e) => setArticleContent(e.target.value)}
                          placeholder="Tuliskan isi artikel lengkap di sini..."
                          className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        {actionLoading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />}
                        <span>{articleId ? 'Perbarui Artikel' : 'Terbitkan Artikel'}</span>
                      </button>
                    </form>
                  ) : (
                    /* LIST ARTICLES */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <h4 className="font-display font-extrabold text-xl text-slate-900">Kelola Artikel Alumni</h4>
                        <button
                          onClick={() => setShowArticleForm(true)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Plus size={14} />
                          <span>Buat Artikel</span>
                        </button>
                      </div>

                      {articles.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-8 text-center rounded-2xl text-gray-400">
                          Belum ada artikel yang diposting di database. Silakan buat artikel pertama Anda!
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 border-b border-gray-100">
                                <th className="p-4 font-bold">Judul Artikel</th>
                                <th className="p-4 font-bold">Penulis</th>
                                <th className="p-4 font-bold">Kategori</th>
                                <th className="p-4 font-bold">Tgl Posting</th>
                                <th className="p-4 font-bold text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {articles.map((art) => (
                                <tr key={art.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                                  <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 flex-shrink-0">
                                        {art.imageUrl ? (
                                          <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <ImageIcon size={14} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-[280px]" title={art.title}>
                                        {art.title}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-gray-500">{art.author}</td>
                                  <td className="p-4">
                                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md font-bold text-[10px]">
                                      {art.category}
                                    </span>
                                  </td>
                                  <td className="p-4 text-gray-400">
                                    {new Date(art.createdAt).toLocaleDateString('id-ID')}
                                  </td>
                                  <td className="p-4 text-right flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleEditArticle(art)}
                                      className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteArticle(art.id)}
                                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. MANAGE ACTIVITIES */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  {showActivityForm ? (
                    /* ACTIVITY CRUD FORM */
                    <form onSubmit={handleSaveActivity} className="bg-white border border-gray-100 p-6 rounded-2xl space-y-5 shadow-sm">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <h5 className="font-display font-bold text-teal-800 text-base">
                          {activityId ? 'Edit Dokumentasi Kegiatan' : 'Buat Kegiatan Baru'}
                        </h5>
                        <button
                          type="button"
                          onClick={() => { setShowActivityForm(false); resetActivityForm(); }}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Nama Kegiatan *</label>
                          <input
                            type="text"
                            required
                            value={activityTitle}
                            onChange={(e) => setActivityTitle(e.target.value)}
                            placeholder="Contoh: Aksi Peduli Panti Asuhan 2026"
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Tanggal Kegiatan *</label>
                          <input
                            type="date"
                            required
                            value={activityDate}
                            onChange={(e) => setActivityDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Foto Dokumentasi (Upload ke Database) *</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="activity-cover-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                            <ImageIcon size={16} className="text-teal-600" />
                            <span className="text-xs font-semibold text-slate-700">Pilih Foto</span>
                            <input
                              id="activity-cover-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setActivityImageUrl)}
                              className="sr-only"
                            />
                          </label>
                          {activityImageUrl ? (
                            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 max-w-[200px] truncate text-xs">
                              <span className="text-gray-600 truncate">Foto Terpilih</span>
                              <button
                                type="button"
                                onClick={() => setActivityImageUrl('')}
                                className="text-red-500 hover:text-red-700 font-bold ml-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium">Silakan upload foto dokumentasi</span>
                          )}
                        </div>
                        {activityImageUrl && activityImageUrl.startsWith('data:') && (
                          <div className="mt-2 h-16 w-16 border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                            <img src={activityImageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="mt-2">
                          <details className="text-[10px] text-gray-500 cursor-pointer">
                            <summary>Atau gunakan URL Gambar (opsional)</summary>
                            <input
                              type="url"
                              value={activityImageUrl}
                              onChange={(e) => setActivityImageUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                            />
                          </details>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Dokumen Pendukung / Laporan Kegiatan (Opsional - PDF, Doc, dll)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="activity-doc-file" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition duration-200 text-sm">
                            <FileText size={16} className="text-teal-600" />
                            <span className="text-xs font-semibold text-slate-700">Pilih Laporan</span>
                            <input
                              id="activity-doc-file"
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                              onChange={(e) => handleFileUpload(e, setActivityDocumentFile, setActivityDocumentFileName)}
                              className="sr-only"
                            />
                          </label>
                          {activityDocumentFileName ? (
                            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs">
                              <span className="text-gray-700 font-medium truncate max-w-[250px]">{activityDocumentFileName}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setActivityDocumentFile('');
                                  setActivityDocumentFileName('');
                                }}
                                className="text-red-500 hover:text-red-700 font-bold ml-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Belum ada laporan kegiatan yang diupload</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Ukuran file maksimal yang disarankan: 1.2 MB</p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Singkat *</label>
                        <textarea
                          rows={4}
                          required
                          value={activityDescription}
                          onChange={(e) => setActivityDescription(e.target.value)}
                          placeholder="Berikan ringkasan aksi kegiatan yang dikerjakan..."
                          className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-teal-600 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        {actionLoading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />}
                        <span>{activityId ? 'Perbarui Kegiatan' : 'Terbitkan Kegiatan'}</span>
                      </button>
                    </form>
                  ) : (
                    /* LIST ACTIVITIES */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <h4 className="font-display font-extrabold text-xl text-slate-900">Kelola Galeri Kegiatan</h4>
                        <button
                          onClick={() => setShowActivityForm(true)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Plus size={14} />
                          <span>Tambah Kegiatan</span>
                        </button>
                      </div>

                      {activities.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-8 text-center rounded-2xl text-gray-400">
                          Belum ada dokumentasi kegiatan di database. Silakan tambah kegiatan pertama Anda!
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 border-b border-gray-100">
                                <th className="p-4 font-bold">Nama Kegiatan</th>
                                <th className="p-4 font-bold">Deskripsi</th>
                                <th className="p-4 font-bold">Tgl Aksi</th>
                                <th className="p-4 font-bold text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activities.map((act) => (
                                <tr key={act.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                                  <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 flex-shrink-0">
                                        {act.imageUrl ? (
                                          <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <ImageIcon size={14} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-[220px]" title={act.title}>
                                        {act.title}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-gray-500 truncate max-w-[250px]" title={act.description}>
                                    {act.description}
                                  </td>
                                  <td className="p-4 text-gray-400">
                                    {new Date(act.date).toLocaleDateString('id-ID')}
                                  </td>
                                  <td className="p-4 text-right flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleEditActivity(act)}
                                      className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteActivity(act.id)}
                                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 4. MISI REGISTRATIONS */}
              {activeTab === 'registrations' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h4 className="font-display font-extrabold text-xl text-slate-900">Pendaftaran Program Misi (GMHP)</h4>
                    <button
                      onClick={onRefreshData}
                      className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                      title="Refresh"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>

                  {misiRegistrations.length === 0 ? (
                    <div className="bg-white border border-gray-100 p-8 text-center rounded-2xl text-gray-400">
                      Belum ada pendaftar program misi masuk.
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 border-b border-gray-100">
                            <th className="p-4 font-bold">Pendaftar</th>
                            <th className="p-4 font-bold">Program</th>
                            <th className="p-4 font-bold">Pesan Kerinduan</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misiRegistrations.map((reg) => (
                            <tr key={reg.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <div className="font-semibold text-slate-900">{reg.fullName}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{reg.email}</div>
                                <div className="text-xs text-gray-400">{reg.phone}</div>
                              </td>
                              <td className="p-4 text-gray-600 font-medium">{reg.misiTitle}</td>
                              <td className="p-4 text-gray-500 max-w-[200px] truncate" title={reg.message}>
                                {reg.message || '-'}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleUpdateRegStatus(reg.id, reg.status)}
                                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border cursor-pointer transition-all ${
                                    reg.status === 'Approved'
                                      ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                                      : reg.status === 'Rejected'
                                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700'
                                      : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700'
                                  }`}
                                  title="Klik untuk ubah status"
                                >
                                  {reg.status}
                                </button>
                              </td>
                              <td className="p-4 text-right flex justify-end items-center h-full mt-4">
                                <button
                                  onClick={() => handleDeleteRegistration(reg.id)}
                                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 5. CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h4 className="font-display font-extrabold text-xl text-slate-900">Pesan Masuk (Hubungi Kami)</h4>
                    <button
                      onClick={onRefreshData}
                      className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                      title="Refresh"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="bg-white border border-gray-100 p-8 text-center rounded-2xl text-gray-400">
                      Belum ada pesan masuk dari pengunjung website.
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 border-b border-gray-100">
                            <th className="p-4 font-bold">Pengirim</th>
                            <th className="p-4 font-bold">Subjek</th>
                            <th className="p-4 font-bold">Isi Pesan</th>
                            <th className="p-4 font-bold">Tgl Kirim</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((msg) => (
                            <tr key={msg.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <div className="font-semibold text-slate-900">{msg.fullName}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{msg.email}</div>
                              </td>
                              <td className="p-4 text-gray-600 font-medium">{msg.subject}</td>
                              <td className="p-4 text-gray-500 max-w-[250px] truncate" title={msg.message}>
                                {msg.message}
                              </td>
                              <td className="p-4 text-gray-400">
                                {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                              </td>
                              <td className="p-4 text-right flex justify-end space-x-2">
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
