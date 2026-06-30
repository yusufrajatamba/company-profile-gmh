import React from 'react';
import { motion } from 'motion/react';
import { Users, Award, Heart, Compass, MessageSquare, Briefcase } from 'lucide-react';

export const PelayananAlumni: React.FC = () => {
  const services = [
    {
      icon: <Users className="text-church-green" size={24} />,
      title: 'Persekutuan Alumni',
      description: 'Wadah ibadah, doa bersama, dan berbagi kesaksian hidup antar alumni KMK USU di berbagai daerah secara hibrida.'
    },
    {
      icon: <Award className="text-church-green" size={24} />,
      title: 'Mentoring & Pembinaan',
      description: 'Alumni senior mendampingi adik-adik mahasiswa KMK USU aktif guna memberikan bimbingan spiritual, kepemimpinan, dan kesiapan akademik.'
    },
    {
      icon: <Heart className="text-church-green" size={24} />,
      title: 'Aksi Sosial & Kasih',
      description: 'Penyaluran dana beasiswa pendidikan bagi adik-adik berprestasi yang terkendala biaya, serta respons cepat tanggap bencana alam.'
    },
    {
      icon: <Compass className="text-church-green" size={24} />,
      title: 'Networking & Karier',
      description: 'Membangun jejaring kerja profesional untuk membagikan info lowongan pekerjaan, mentoring karier, dan kemitraan strategis.'
    }
  ];

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Pelayanan Alumni</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Pelayanan Alumni PA KMK USU
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Narrative */}
        <div className="bg-white border border-church-gold/15 p-8 shadow-sm mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">
              Sinergi Saling Menguatkan & Bertumbuh Bersama
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Keluarga besar <strong className="text-church-green">Alumni KMK USU</strong> senantiasa rindu untuk menjadi berkat di mana pun ditempatkan. Melalui jejaring pelayanan alumni, kami mempererat tali persaudaraan rohani, mendampingi adik-adik yang masih berkuliah, dan bersinergi melayani Tuhan di dunia profesional.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border border-church-gold/15 p-6 hover:shadow-lg transition duration-300 flex items-start space-x-4"
            >
              <div className="p-3 bg-church-green/5 text-church-green border border-church-gold/20 flex-shrink-0">
                {service.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">{service.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-church-green text-white p-8 border border-church-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-church-gold">Hubungkan Potensi Anda Bersama Kami</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Apakah Anda alumni KMK USU yang baru lulus atau sudah lama berkiprah di dunia luar? Mari bergabung dalam database dan persekutuan alumni untuk terus menjaga ikatan pelayanan.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-church-gold text-church-green font-bold text-[10px] uppercase tracking-widest border border-church-gold">
              <Briefcase size={12} />
              <span>Sinergi Profesional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
