import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Share2, Award, Heart, CheckCircle2 } from 'lucide-react';
import { Setting } from '../types';

interface AlumniBerkaryaProps {
  setting?: Setting;
}

export const AlumniBerkarya: React.FC<AlumniBerkaryaProps> = ({ setting }) => {
  const works = [
    {
      title: 'Buku: Berakar Di Dunia Sekuler',
      author: 'Ir. Saut Manurung',
      year: '2023',
      category: 'Literatur / Buku',
      desc: 'Sebuah tulisan teologis praktis yang memandu profesional muda Kristen untuk mempertahankan integritas dan nilai-nilai kerajaan Allah di lingkungan perkantoran moderen.'
    },
    {
      title: 'Seni Lukis: Kedamaian Sejati (The Dove of Peace)',
      author: 'Ruth Margaretha, S.S.',
      year: '2024',
      category: 'Seni Visual',
      desc: 'Karya lukisan abstrak cat minyak bertema kelepasan dan kebebasan dalam Kristus, yang terinspirasi dari ayat Alkitab Yesaya 40:31.'
    },
    {
      title: 'Artikel Jurnal: Etika Medis Kristiani di Pedesaan',
      author: 'dr. Sarah Pangaribuan',
      year: '2022',
      category: 'Akademik & Jurnal',
      desc: 'Kajian empiris mengenai tantangan moral dan implementasi etika kasih dalam melayani pasien prasejahtera di daerah terpencil Sumatera Utara.'
    }
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Hero Banner Area for Creation (The visual shown in Image 4) */}
      <div 
        className="relative bg-slate-900 text-white py-32 px-4 text-center overflow-hidden flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 36, 29, 0.75), rgba(18, 36, 29, 0.9)), url("https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80")'
        }}
      >
        {/* Subtle decorative circles mimicking warm lights/bokeh */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-church-gold/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl sm:text-6xl text-white tracking-widest uppercase"
          >
            {setting?.berkaryaTitle || 'ALUMNI BERKARYA'}
          </motion.h1>
          <div className="h-0.5 w-24 bg-church-gold mx-auto" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm sm:text-base text-church-gold/90 max-w-3xl mx-auto font-sans leading-relaxed whitespace-pre-line"
          >
            {setting?.berkaryaSubtitle || `"Setiap talenta adalah anugerah dari Tuhan yang patut dibagikan. Mari bersama-sama menyatakan kasih dan kebenaran, karyamu menjadi berkat dan kesaksian yang menguatkan banyak jiwa."`}
          </motion.p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-2">Etalase Karya</h2>
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 uppercase">Apresiasi Karya Kreatif & Pelayanan Alumni</h3>
          <div className="h-0.5 w-12 bg-church-gold mx-auto mt-3" />
        </div>

        {/* Works List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {works.map((work, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white border border-church-gold/15 p-6 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-church-gold border-b border-church-gold/10 pb-2">
                  <span>{work.category}</span>
                  <span>{work.year}</span>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900 line-clamp-2">
                  {work.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {work.desc}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Karya Oleh:</span>
                <span className="text-xs font-bold text-church-green">{work.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action card */}
        <div className="bg-[#12241d] text-white p-8 border border-church-gold/25 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-church-gold flex items-center space-x-2">
              <Lightbulb size={18} />
              <span>Bagikan Karyamu untuk Kemuliaan-Nya</span>
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Apakah Anda telah menerbitkan tulisan, merilis karya musik rohani, menulis artikel jurnal, atau menciptakan karya seni visual yang menginspirasi? Kirimkan portofolio karya Anda kepada tim Humas melalui menu Kontak agar dapat kami publikasikan di etalase ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
