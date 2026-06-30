import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Users, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Heart, 
  MapPin, 
  Sparkles, 
  Clock, 
  MessageSquare,
  Images
} from 'lucide-react';
import { Setting } from '../types';

interface HeroProps {
  setting: Setting;
  onStartMisi: () => void;
  onViewAlumni: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  setting, 
  onStartMisi, 
  onViewAlumni,
  onNavigateToSection 
}) => {
  // Quick navigation helper
  const handleJump = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. Main Hero Banner */}
      {setting.showHeroSection !== false && (
        <section id="hero-banner" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white pt-12">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={setting.heroBgUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80"}
              alt="Global Mission House Fellowship"
              className="w-full h-full object-cover opacity-25 select-none pointer-events-none scale-105 animate-pulse"
              style={{ animationDuration: '10s' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-slate-900/90 to-slate-900/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            {/* Welcome Tagline */}
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-church-gold serif-italic text-lg sm:text-xl md:text-2xl mb-4 block tracking-wide font-medium"
            >
              Selamat Datang di Portal Resmi
            </motion.span>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-wider uppercase leading-tight max-w-4xl mx-auto mb-6 text-white drop-shadow-md"
            >
              {setting.heroTitle}
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-white/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed font-sans"
            >
              {setting.heroSubtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none"
            >
              <button
                onClick={onStartMisi}
                className="w-full sm:w-auto px-8 py-4 bg-church-green hover:bg-church-gold text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-0.5 border border-church-green"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Compass size={16} />
                  <span>Gabung Program Misi</span>
                  <ArrowRight size={14} />
                </span>
              </button>
              <button
                onClick={onViewAlumni}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Users size={16} />
                  <span>Pelayanan Alumni</span>
                </span>
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* 2. Pillars of Service / Pilar Utama */}
      {setting.showPillars !== false && (
        <section className="py-20 bg-white border-t border-church-gold/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3 block">Pilar Pelayanan</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-wider uppercase leading-tight">
                Tiga Nilai Inti Gerakan GMH
              </h2>
              <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#faf9f6] border border-church-gold/15 p-8 transition-all duration-300 text-center flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-church-green/10 text-church-green rounded-full flex items-center justify-center mx-auto border border-church-green/20">
                    <Users size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 uppercase tracking-wider">Persekutuan</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Menjadi wadah kekeluargaan rohani yang kokoh bagi seluruh alumni KMK USU lintas angkatan untuk saling menguatkan, mendoakan, dan bertumbuh bersama di dalam iman Kristus.
                  </p>
                </div>
                <button 
                  onClick={() => handleJump('program-alumni')}
                  className="mt-6 text-[10px] font-bold uppercase tracking-wider text-church-green hover:text-church-gold transition inline-flex items-center justify-center space-x-1"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight size={12} />
                </button>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#faf9f6] border border-church-gold/15 p-8 transition-all duration-300 text-center flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-church-green/10 text-church-green rounded-full flex items-center justify-center mx-auto border border-church-green/20">
                    <Award size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 uppercase tracking-wider">Pembinaan</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Mempersiapkan alumni muda dan mendampingi adik-adik mahasiswa aktif dalam penguasaan kompetensi profesional, integritas Kristen di dunia kerja, serta bimbingan karier terstruktur.
                  </p>
                </div>
                <button 
                  onClick={() => handleJump('about-visi-misi')}
                  className="mt-6 text-[10px] font-bold uppercase tracking-wider text-church-green hover:text-church-gold transition inline-flex items-center justify-center space-x-1"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight size={12} />
                </button>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#faf9f6] border border-church-gold/15 p-8 transition-all duration-300 text-center flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-church-green/10 text-church-green rounded-full flex items-center justify-center mx-auto border border-church-green/20">
                    <Compass size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 uppercase tracking-wider">Pengutusan</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Mengoordinasikan dan mendukung aksi misi pekabaran Injil, pembukaan pos pelayanan baru, serta aksi sosial kemanusiaan nyata untuk membawa berkat Kristus ke berbagai penjuru.
                  </p>
                </div>
                <button 
                  onClick={() => handleJump('program-misi')}
                  className="mt-6 text-[10px] font-bold uppercase tracking-wider text-church-green hover:text-church-gold transition inline-flex items-center justify-center space-x-1"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight size={12} />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Statistics Tracker */}
      {setting.showStats !== false && (
        <section className="py-16 bg-church-green text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <p className="font-display font-black text-4xl sm:text-5xl text-church-gold">{setting.statsAlumni || '500+'}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300">Alumni Terhubung</p>
              </div>
              <div className="space-y-2">
                <p className="font-display font-black text-4xl sm:text-5xl text-church-gold">{setting.statsCities || '12+'}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300">Kota Sebaran Alumni</p>
              </div>
              <div className="space-y-2">
                <p className="font-display font-black text-4xl sm:text-5xl text-church-gold">{setting.statsMisi || '10+'}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300">Pos Pelayanan Misi</p>
              </div>
              <div className="space-y-2">
                <p className="font-display font-black text-4xl sm:text-5xl text-church-gold">{setting.statsYears || '20+'}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300">Tahun Dedikasi</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Visi & Misi Overview */}
      {setting.showVisiMisi !== false && (
        <section className="py-20 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-church-gold/20 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center">
              {/* Visual Block */}
              <div className="w-full md:w-1/2 space-y-6">
                <span className="text-xs font-bold text-church-gold tracking-widest uppercase block">Fokus Visi Strategis</span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-wider uppercase leading-tight">
                  {setting.homeVisiTitle || 'Membangun Generasi Alumni Kristen Berintegritas'}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {setting.homeVisiDesc || 'Global Mission House (GMH) hadir sebagai oase rohani dan wadah kolaboratif bagi seluruh lulusan KMK Universitas Sumatera Utara. Kami percaya alumni bukan sekadar mantan mahasiswa, melainkan utusan Kristus di bidang profesional masing-masing.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleJump('about-visi-misi')}
                    className="px-5 py-2.5 bg-church-green hover:bg-church-gold text-white text-[10px] font-bold uppercase tracking-widest transition"
                  >
                    Lihat Visi Misi Lengkap
                  </button>
                  <button 
                    onClick={() => handleJump('about-sejarah')}
                    className="px-5 py-2.5 border border-church-gold/30 hover:border-church-gold text-slate-800 text-[10px] font-bold uppercase tracking-widest transition"
                  >
                    Sejarah Singkat
                  </button>
                </div>
              </div>

              {/* Text details / Quotes */}
              <div className="w-full md:w-1/2 bg-[#faf9f6] border border-church-gold/10 p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-church-green mb-2">Visi Kami</h4>
                  <p className="text-slate-800 font-serif italic text-xs leading-relaxed">
                    "{setting.visi}"
                  </p>
                </div>
                <div className="h-[1px] bg-church-gold/15" />
                <div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-church-green mb-2">Misi Utama Kami</h4>
                  <div className="text-xs text-gray-600 leading-relaxed space-y-2 whitespace-pre-wrap">
                    {setting.misi}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Explorer Hub - Portal Navigation */}
      {setting.showExplorerHub !== false && (
        <section className="py-20 bg-white border-t border-church-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3 block">Pusat Informasi</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-wider uppercase leading-tight">
                Jelajahi Berbagai Rubrik Portal
              </h2>
              <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Artikel */}
              <div 
                onClick={() => handleJump('news-artikel')}
                className="bg-[#faf9f6] border border-church-gold/15 p-6 hover:shadow-lg hover:border-church-gold/40 transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <BookOpen size={20} className="text-church-green" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 group-hover:text-church-green transition">
                    Artikel & Renungan
                  </h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Kumpulan tulisan inspiratif, renungan rohani, kabar alumni, dan ulasan teologi praktis dari para alumni.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-church-gold uppercase tracking-wider">
                  <span>Baca Artikel</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Card 2: Galeri Kegiatan */}
              <div 
                onClick={() => handleJump('news-gallery')}
                className="bg-[#faf9f6] border border-church-gold/15 p-6 hover:shadow-lg hover:border-church-gold/40 transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Images size={20} className="text-church-green" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 group-hover:text-church-green transition">
                    Dokumentasi Aksi
                  </h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Galeri foto dan dokumentasi kegiatan aksi sosial, ibadah alumni, mentoring, serta penjangkauan misi.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-church-gold uppercase tracking-wider">
                  <span>Lihat Galeri</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Card 3: Alumni Berkarya */}
              <div 
                onClick={() => handleJump('creation')}
                className="bg-[#faf9f6] border border-church-gold/15 p-6 hover:shadow-lg hover:border-church-gold/40 transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Sparkles size={20} className="text-church-green" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 group-hover:text-church-green transition">
                    Alumni Berkarya
                  </h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Eksplorasi karya tulis, publikasi, buku, usaha mandiri, dan pencapaian profesional dari para alumni.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-church-gold uppercase tracking-wider">
                  <span>Lihat Karya</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Card 4: Library */}
              <div 
                onClick={() => handleJump('library')}
                className="bg-[#faf9f6] border border-church-gold/15 p-6 hover:shadow-lg hover:border-church-gold/40 transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <BookOpen size={20} className="text-church-green" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 group-hover:text-church-green transition">
                    Perpustakaan Buku
                  </h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Daftar koleksi buku-buku teologia, pertumbuhan rohani, dan literatur kepemimpinan Kristen di GMH.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-church-gold uppercase tracking-wider">
                  <span>Cari Buku</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Friendly Support Invitation / Ajakan Berpartisipasi */}
      {setting.showSupportInvitation !== false && (
        <section className="py-20 bg-[#faf9f6] border-t border-church-gold/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-church-gold tracking-widest uppercase block">Mari Bergabung</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 uppercase tracking-wide">
                Menjadi Bagian dari Gerakan Kasih
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Dukung pelayanan GMH baik melalui keikutsertaan program misi, keterlibatan sebagai mentor rohani bagi mahasiswa aktif, ataupun melalui dukungan doa serta donasi sukarela.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => handleJump('contact')}
                className="px-6 py-3.5 bg-church-green hover:bg-church-gold text-white text-xs font-bold uppercase tracking-widest transition shadow-md"
              >
                Hubungi Sekretariat GMH
              </button>
              <button 
                onClick={() => handleJump('news-pembangunan')}
                className="px-6 py-3.5 border border-church-green text-church-green hover:bg-church-green hover:text-white text-xs font-bold uppercase tracking-widest transition"
              >
                Dukung Pembangunan Rumah Persekutuan
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
