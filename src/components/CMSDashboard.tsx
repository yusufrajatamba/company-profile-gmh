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
        phone: contactPhone
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
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h4 className="font-display font-extrabold text-xl text-slate-900">Atur Tampilan Halaman Utama</h4>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl text-sm transition cursor-pointer flex items-center space-x-1.5 shadow-md"
                    >
                      {actionLoading && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />}
                      <span>Simpan Setelan</span>
                    </button>
                  </div>

                  {/* Hero Settings */}
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                    <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Pengaturan Hero Banner</h5>
                    <div className="space-y-4">
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
                        <label className="text-xs font-bold text-gray-700 block mb-1">Sub-judul / Deskripsi Singkat</label>
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

                  {/* Visi Misi Settings */}
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                    <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Pengaturan Visi & Misi</h5>
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

                  {/* Contact Info Settings */}
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4 shadow-2xs">
                    <h5 className="font-display font-bold text-sm text-teal-800 border-b border-gray-100 pb-2">Pengaturan Kontak & Sekretariat</h5>
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
