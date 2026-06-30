import React from 'react';
import { motion } from 'motion/react';
import { History } from 'lucide-react';
import { Setting } from '../types';

interface SejarahSingkatProps {
  setting: Setting;
}

export const SejarahSingkat: React.FC<SejarahSingkatProps> = ({ setting }) => {
  let milestones = [
    {
      year: '1998',
      title: 'Awal Mula Pergerakan',
      desc: 'Dimulai dari persekutuan doa kecil mahasiswa Kristen USU yang rindu melayani jiwa-jiwa pasca kampus dan melahirkan wadah berjejaring bagi alumni.'
    },
    {
      year: '2005',
      title: 'Peresmian Persekutuan Alumni (PA) KMK USU',
      desc: 'Deklarasi resmi pembentukan wadah alumni secara terstruktur untuk mengoordinasi pelayanan alumni di berbagai wilayah Indonesia, khususnya Sumatera Utara.'
    },
    {
      year: '2012',
      title: 'Gagasan Global Mission House (GMH)',
      desc: 'Lahirnya visi untuk membangun sebuah pusat misi fisik yang berfungsi sebagai pusat pembinaan mahasiswa Kristen aktif, sekretariat alumni, dan rumah singgah misionaris.'
    },
    {
      year: '2020 - Sekarang',
      title: 'Pengembangan Berkelanjutan',
      desc: 'Realisasi program misi pedesaan berkelanjutan, pembangunan rumah persekutuan, beasiswa pendidikan, dan digitalisasi pelayanan alumni.'
    }
  ];

  if (setting.milestonesJson) {
    try {
      const parsed = JSON.parse(setting.milestonesJson);
      if (Array.isArray(parsed)) {
        milestones = parsed;
      }
    } catch (e) {
      console.error('Error parsing milestonesJson', e);
    }
  }

  const sejarahTitle = setting.sejarahTitle || 'Perjalanan Iman & Pelayanan Kami';
  const section1Title = setting.sejarahSection1Title || 'Berakar Pada Kerinduan Amanat Agung';
  const section1Text = setting.sejarahSection1Text || 'Sejarah berdirinya Global Mission House - PA KMK USU tidak lepas dari kerinduan mendalam dari para alumni pendahulu untuk melestarikan api rohani yang menyala selama masa kuliah. Setelah menyelesaikan studi, tantangan dunia profesional dan sekuler seringkali menguji iman para lulusan.\n\nUntuk menjaga pertumbuhan rohani serta memfasilitasi panggilan misi pekabaran Injil secara global, dibentuklah Persekutuan Alumni (PA) KMK USU. Kami percaya bahwa setiap alumni dipanggil untuk menjadi garam dan terang di ladang profesionalisme masing-masing.';
  const section2Title = setting.sejarahSection2Title || 'Pusat Pengutusan dan Pembinaan';
  const section2Text = setting.sejarahSection2Text || 'Gagasan menghadirkan Global Mission House (GMH) timbul dari kebutuhan mendesak akan adanya pusat pelatihan fisik bagi para misionaris medis, guru pedalaman, dan relawan kemanusiaan. GMH juga difungsikan sebagai rumah pembinaan bagi mahasiswa Kristen aktif Universitas Sumatera Utara untuk memperlengkapi mereka sebelum diutus ke dunia kerja.\n\nMelalui bimbingan dan pendampingan dari para alumni senior, adik-adik mahasiswa diperkenalkan pada nilai-nilai integritas Kristiani, kepemimpinan transformasional, dan kesiapan rohani yang kokoh.';

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Sejarah Singkat</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            {sejarahTitle}
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20">
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">{section1Title}</h3>
            <p>{section1Text}</p>
          </div>
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed border-l-2 border-church-gold/20 pl-6 md:pl-10 whitespace-pre-wrap">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">{section2Title}</h3>
            <p>{section2Text}</p>
          </div>
        </div>

        {/* Timeline Visual */}
        {setting.showSejarahTimeline !== false && (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-church-gold/20">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-start md:items-center`}
              >
                {/* Point Indicator */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-church-gold flex items-center justify-center z-10">
                  <History size={14} className="text-church-green" />
                </div>

                {/* Card Spacer / Container */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <div className="bg-white border border-church-gold/15 p-6 shadow-xs hover:shadow-lg hover:border-church-gold/40 transition duration-300">
                    <span className="text-xs font-extrabold text-church-gold uppercase tracking-widest block mb-1">
                      Tahun {m.year}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-church-green mb-2">
                      {m.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
