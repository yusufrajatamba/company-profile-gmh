import React from 'react';
import { motion } from 'motion/react';
import { Compass, ClipboardList, BookOpen, Heart, Activity } from 'lucide-react';
import { Setting } from '../types';

interface ProgramMisiProps {
  setting?: Setting;
  onNavigateToSection?: (sectionId: string) => void;
}

export const ProgramMisi: React.FC<ProgramMisiProps> = ({ setting, onNavigateToSection }) => {
  const steps = [
    {
      number: '01',
      title: setting?.misiStep1Title || 'Pilih Misi',
      description: setting?.misiStep1Desc || 'Pilih jenis program misi sosial atau kerohanian yang ingin Anda dukung atau ikuti.'
    },
    {
      number: '02',
      title: setting?.misiStep2Title || 'Isi Formulir',
      description: setting?.misiStep2Desc || 'Lengkapi formulir registrasi dengan data diri yang valid serta komitmen pelayanan Anda.'
    },
    {
      number: '03',
      title: setting?.misiStep3Title || 'Konfirmasi',
      description: setting?.misiStep3Desc || 'Hubungi tim admin kami melalui WhatsApp atau konfirmasi email setelah mendaftar.'
    },
    {
      number: '04',
      title: setting?.misiStep4Title || 'Mulai Berbagi',
      description: setting?.misiStep4Desc || 'Terjun langsung ke lapangan atau salurkan dukungan doa & donasi bersama tim misi.'
    }
  ];

  const typesOfMissions = [
    {
      icon: <BookOpen className="text-church-green" size={20} />,
      title: setting?.misiPilar1Title || 'Misi Penginjilan & Doa',
      desc: setting?.misiPilar1Desc || 'Pelayanan pekabaran kabar baik rutin ke desa-desa binaan, kebaktian kebangunan rohani, serta dukungan doa syafaat rutin.'
    },
    {
      icon: <Activity className="text-church-green" size={20} />,
      title: setting?.misiPilar2Title || 'Misi Medis & Pelayanan Kesehatan',
      desc: setting?.misiPilar2Desc || 'Pemeriksaan kesehatan gratis, pengobatan massal, penyuluhan gizi buruk, dan pembagian vitamin bagi masyarakat prasejahtera.'
    },
    {
      icon: <Heart className="text-church-green" size={20} />,
      title: setting?.misiPilar3Title || 'Pemberdayaan Pendidikan Anak',
      desc: setting?.misiPilar3Desc || 'Bimbingan belajar gratis bagi anak-anak di pedalaman Sumatera Utara, penyediaan buku rohani, dan fasilitas kelas mini.'
    }
  ];

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">
            {setting?.misiPageSubtitle || 'Program Misi'}
          </h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            {setting?.misiPageTitle || 'Global Mission House Project (GMHP)'}
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Narrative & Mission Focus */}
        <div className="bg-white border border-church-gold/15 p-8 shadow-sm mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">
              Melangkah Bersama Menjangkau yang Terlupakan
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {setting?.misiPageText || `Melalui program GMHP, persekutuan alumni mengoordinasikan various aksi nyata untuk melayani jiwa-jiwa di daerah terpencil dan melayani sesama secara holistik. Kami tidak hanya membagikan bantuan fisik, melainkan juga menanamkan pengharapan kekal di dalam Kristus.`}
            </p>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">Pilar Fokus Misi Kami</h4>
            <div className="h-0.5 w-8 bg-church-gold mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {typesOfMissions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-church-gold/15 p-6 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-church-green/5 text-church-green border border-church-gold/20 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h5 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">{item.title}</h5>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps Process */}
        <div className="space-y-10">
          <div className="text-center">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">Alur Keikutsertaan Pelayanan</h4>
            <div className="h-0.5 w-8 bg-church-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white border border-church-gold/15 p-6 relative group overflow-hidden"
              >
                <span className="absolute -right-4 -bottom-6 font-display font-black text-7xl text-church-gold/5 group-hover:text-church-gold/10 transition pointer-events-none select-none">
                  {step.number}
                </span>
                <div className="relative z-10 space-y-3">
                  <div className="w-8 h-8 bg-church-gold/10 text-church-green flex items-center justify-center font-display font-bold text-xs border border-church-gold/20">
                    {step.number}
                  </div>
                  <h5 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">{step.title}</h5>
                  <p className="text-gray-500 text-[11px] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Callout */}
        <div className="bg-church-green/5 border border-church-gold/25 p-6 mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-2.5 bg-church-gold/10 text-church-green border border-church-gold/20 flex-shrink-0">
              <ClipboardList size={18} />
            </div>
            <div>
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-church-green mb-1.5">Siap Berpartisipasi?</h5>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Anda dapat mendaftarkan diri secara langsung pada tab <strong className="text-church-green">Contact</strong> menggunakan Formulir Pendaftaran Misi yang tersedia. Tim kami akan segera memproses data diri Anda dan mengirimkan informasi pemberitahuan jadwal pembekalan.
              </p>
            </div>
          </div>
          {onNavigateToSection && (
            <button
              onClick={() => onNavigateToSection('contact')}
              className="px-5 py-2.5 bg-church-green hover:bg-church-gold text-white text-[10px] font-bold uppercase tracking-widest transition self-start sm:self-center flex-shrink-0 cursor-pointer"
            >
              Hubungi Kontak & Daftar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
