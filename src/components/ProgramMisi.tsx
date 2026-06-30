import React from 'react';
import { motion } from 'motion/react';
import { Compass, ClipboardList, BookOpen, Heart, Activity } from 'lucide-react';

export const ProgramMisi: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pilih Misi',
      description: 'Pilih jenis program misi sosial atau kerohanian yang ingin Anda dukung atau ikuti.'
    },
    {
      number: '02',
      title: 'Isi Formulir',
      description: 'Lengkapi formulir registrasi dengan data diri yang valid serta komitmen pelayanan Anda.'
    },
    {
      number: '03',
      title: 'Konfirmasi',
      description: 'Hubungi tim admin kami melalui WhatsApp atau konfirmasi email setelah mendaftar.'
    },
    {
      number: '04',
      title: 'Mulai Berbagi',
      description: 'Terjun langsung ke lapangan atau salurkan dukungan doa & donasi bersama tim misi.'
    }
  ];

  const typesOfMissions = [
    {
      icon: <BookOpen className="text-church-green" size={20} />,
      title: 'Misi Penginjilan & Doa',
      desc: 'Pelayanan pekabaran kabar baik rutin ke desa-desa binaan, kebaktian kebangunan rohani, serta dukungan doa syafaat rutin.'
    },
    {
      icon: <Activity className="text-church-green" size={20} />,
      title: 'Misi Medis & Pelayanan Kesehatan',
      desc: 'Pemeriksaan kesehatan gratis, pengobatan massal, penyuluhan gizi buruk, dan pembagian vitamin bagi masyarakat prasejahtera.'
    },
    {
      icon: <Heart className="text-church-green" size={20} />,
      title: 'Pemberdayaan Pendidikan Anak',
      desc: 'Bimbingan belajar gratis bagi anak-anak di pedalaman Sumatera Utara, penyediaan buku rohani, dan fasilitas kelas mini.'
    }
  ];

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Program Misi</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Global Mission House Project (GMHP)
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Narrative & Mission Focus */}
        <div className="bg-white border border-church-gold/15 p-8 shadow-sm mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">
              Melangkah Bersama Menjangkau yang Terlupakan
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Melalui program <strong className="text-church-green">GMHP</strong>, persekutuan alumni mengoordinasikan berbagai aksi nyata untuk melayani jiwa-jiwa di daerah terpencil dan melayani sesama secara holistik. Kami tidak hanya membagikan bantuan fisik, melainkan juga menanamkan pengharapan kekal di dalam Kristus.
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
        <div className="bg-church-green/5 border border-church-gold/25 p-6 mt-16 flex items-start space-x-4">
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
      </div>
    </div>
  );
};
