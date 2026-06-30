import React from 'react';
import { motion } from 'motion/react';
import { Target, HeartHandshake, ShieldCheck, Compass, Lightbulb, UserCheck } from 'lucide-react';
import { Setting } from '../types';

interface VisiMisiProps {
  setting: Setting;
}

export const VisiMisi: React.FC<VisiMisiProps> = ({ setting }) => {
  const coreValues = [
    {
      icon: <ShieldCheck size={20} />,
      title: 'Integritas Alkitabiah',
      desc: 'Menjungjung tinggi kebenaran firman Tuhan dalam setiap aspek kehidupan, kejujuran karakter, dan keteladanan moral.'
    },
    {
      icon: <UserCheck size={20} />,
      title: 'Profesionalisme Unggul',
      desc: 'Bekerja dan melayani dengan standar kompetensi tinggi, disiplin yang kokoh, dan dedikasi prima di bidang keahlian.'
    },
    {
      icon: <HeartHandshake size={20} />,
      title: 'Kasih yang Berorientasi Sosial',
      desc: 'Menunjukkan belas kasih Kristus yang nyata lewat pelayanan sosial kemanusiaan, aksi medis, dan bantuan pendidikan.'
    },
    {
      icon: <Compass size={20} />,
      title: 'Ketaatan Terhadap Amanat Agung',
      desc: 'Melakukan misi pemberitaan kabar baik secara proaktif, mengutus pemberita Injil, dan menjangkau suku-suku terpencil.'
    }
  ];

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Visi & Misi</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Arah & Landasan Pelayanan Kami
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Visi */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-church-gold/20 p-8 sm:p-10 shadow-lg relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-church-gold/10 text-church-gold flex items-center justify-center border border-church-gold/25 mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green mb-4">Visi Kami</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {setting.visi}
              </p>
            </div>
            <div className="h-1 bg-church-gold w-1/4 mt-8" />
          </motion.div>

          {/* Misi */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-church-gold/20 p-8 sm:p-10 shadow-lg relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-church-green/10 text-church-green flex items-center justify-center border border-church-green/20 mb-6">
                <HeartHandshake size={24} />
              </div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green mb-4">Misi Kami</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {setting.misi}
              </p>
            </div>
            <div className="h-1 bg-church-green w-1/4 mt-8" />
          </motion.div>
        </div>

        {/* Nilai-Nilai Inti (Core Values) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-display font-bold text-base uppercase tracking-wider text-slate-900">Nilai-Nilai Inti (Core Values)</h3>
            <p className="text-gray-500 text-xs mt-1">Prinsip dasar yang menopang seluruh roda kepemimpinan dan aksi nyata kami</p>
            <div className="h-0.5 w-10 bg-church-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-church-gold/15 p-6 hover:shadow-md transition flex items-start space-x-4"
              >
                <div className="p-2.5 bg-church-gold/10 text-church-green border border-church-gold/20">
                  {val.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5">{val.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
