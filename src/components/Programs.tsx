import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Users, ArrowRight, ClipboardList, CheckCircle2, Heart, Award, ShieldAlert } from 'lucide-react';

export const Programs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'misi' | 'alumni'>('misi');

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

  const alumniServices = [
    {
      icon: <Users className="text-church-green" size={24} />,
      title: 'Persekutuan Alumni',
      description: 'Wadah ibadah, doa bersama, dan berbagi kesaksian hidup antar alumni KMK USU di berbagai daerah.'
    },
    {
      icon: <Award className="text-church-green" size={24} />,
      title: 'Mentoring & Pembinaan',
      description: 'Alumni mendampingi adik-adik mahasiswa KMK USU yang aktif, membantu membimbing rohani dan akademik.'
    },
    {
      icon: <Heart className="text-church-green" size={24} />,
      title: 'Aksi Sosial & Kasih',
      description: 'Penyaluran bantuan dana pendidikan bagi mahasiswa berprestasi yang membutuhkan atau aksi bencana alam.'
    },
    {
      icon: <Compass className="text-church-green" size={24} />,
      title: 'Networking & Karier',
      description: 'Membangun sinergi profesional antar alumni untuk berbagi lowongan kerja, bimbingan bisnis, dan kolaborasi.'
    }
  ];

  return (
    <section id="programs" className="py-24 bg-white border-t border-church-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Layanan & Program</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Bagaimana Kami Melayani Bersama
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-white border border-church-gold/20 p-1 rounded-none shadow-sm flex space-x-1">
            <button
              onClick={() => setActiveTab('misi')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition cursor-pointer ${
                activeTab === 'misi'
                  ? 'bg-church-green text-church-gold shadow-md border border-church-gold/30'
                  : 'text-gray-600 hover:text-church-green'
              }`}
            >
              <Compass size={14} />
              <span>Program Misi (GMHP)</span>
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition cursor-pointer ${
                activeTab === 'alumni'
                  ? 'bg-church-green text-church-gold shadow-md border border-church-gold/30'
                  : 'text-gray-600 hover:text-church-green'
              }`}
            >
              <Users size={14} />
              <span>Pelayanan Alumni (PA KMK)</span>
            </button>
          </div>
        </div>

        {/* Tab Content with Animation */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'misi' ? (
              <motion.div
                key="misi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* Introduction */}
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider text-church-green mb-4">
                    Alur Keikutsertaan Program Misi
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Setiap alumni dan simpatisan diajak untuk berkontribusi nyata dalam berbagai program misi global yang kami koordinasikan di bawah nama <strong className="text-church-green">Global Mission House Project (GMHP)</strong>. Berikut langkah mudah untuk bergabung:
                  </p>
                </div>

                {/* Steps Process */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-[#faf9f6] border border-church-gold/15 p-8 rounded-none shadow-xs hover:shadow-lg hover:border-church-gold/40 transition relative group overflow-hidden"
                    >
                      {/* Step index background watermark */}
                      <span className="absolute -right-4 -bottom-6 font-display font-black text-8xl text-church-gold/5 group-hover:text-church-gold/10 transition pointer-events-none select-none">
                        {step.number}
                      </span>
                      <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-none bg-church-gold/10 text-church-green flex items-center justify-center font-display font-bold text-sm border border-church-gold/20">
                          {step.number}
                        </div>
                        <h4 className="font-display font-bold text-base uppercase tracking-wider text-slate-900">{step.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Callout */}
                <div className="max-w-3xl mx-auto bg-church-green/5 border border-church-gold/25 p-5 rounded-none flex items-start space-x-4">
                  <div className="p-2 bg-church-gold/10 text-church-green rounded-none flex-shrink-0 border border-church-gold/20">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm uppercase tracking-wider text-church-green mb-1.5">Butuh Informasi Misi Terkini?</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Kami memiliki berbagai program misi rutin seperti misi pedesaan, bantuan medis, bimbingan belajar anak pedalaman, serta persekutuan doa berkala. Silakan mendaftar melalui form di bagian bawah halaman ini untuk mendapatkan info lengkap.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="alumni"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* Introduction */}
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider text-church-green mb-4">
                    Sinergi & Pelayanan Persekutuan Alumni
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Keluarga besar Alumni KMK USU senantiasa menjaga hubungan persaudaraan yang kokoh dan saling melengkapi. Berbagai program di bawah ini dirancang untuk mewujudkan pelayanan alumni yang holistik:
                  </p>
                </div>

                {/* Grid Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {alumniServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-[#faf9f6] border border-church-gold/15 p-8 rounded-none shadow-xs flex items-start space-x-5 hover:shadow-lg hover:border-church-gold/40 transition"
                    >
                      <div className="p-4 bg-church-green/5 text-church-green rounded-none border border-church-gold/20 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-display font-bold text-base uppercase tracking-wider text-slate-900">{service.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
