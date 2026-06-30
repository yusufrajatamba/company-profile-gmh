import React from 'react';
import { motion } from 'motion/react';
import { Target, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Setting } from '../types';

interface AboutProps {
  setting: Setting;
}

export const About: React.FC<AboutProps> = ({ setting }) => {
  return (
    <section id="about" className="py-24 bg-[#faf9f6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Tentang Kami</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Menghubungkan Alumni, Memperluas Dampak Misi
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-4"
            >
              <p className="text-lg">
                <strong className="serif-italic text-church-green text-xl block mb-2">Global Mission House - PA KMK USU</strong> merupakan wadah persekutuan, pembinaan, dan pengutusan bagi seluruh alumni Keluarga Mahasiswa Kristen (KMK) Universitas Sumatera Utara. 
              </p>
              <p className="text-sm text-gray-600">
                Sebagai pusat pelayanan misi global, kami berkomitmen untuk melahirkan para pelayan yang berintegritas, profesional, dan berdedikasi tinggi untuk melayani sesama baik di gereja, dunia profesi, maupun kancah misi sosial kemanusiaan.
              </p>
            </motion.div>

            {/* Visi Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-white border-l-4 border-church-gold shadow-xs rounded-none"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-gold/10 text-church-gold rounded-xs">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-church-green mb-2">Visi Kami</h3>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{setting.visi}</p>
                </div>
              </div>
            </motion.div>

            {/* Misi Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-white border-l-4 border-church-green shadow-xs rounded-none"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-green/10 text-church-green rounded-xs">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-church-green mb-2">Misi Kami</h3>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{setting.misi}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-4/3 sm:aspect-square border border-church-gold/40 p-2 bg-white rounded-none shadow-xl relative">
              <div className="w-full h-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80"
                  alt="Alumni KMK Fellowship"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-church-green/10 mix-blend-multiply" />
              </div>
            </div>

            {/* Floating stats badge */}
            <div className="absolute -bottom-6 -left-6 bg-white border border-church-gold/20 p-5 rounded-none shadow-xl max-w-xs flex items-center space-x-4 animate-bounce-slow">
              <div className="p-3 bg-church-green/5 text-church-green rounded-xs">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-church-green leading-none">20+</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">Tahun Pengabdian & Pelayanan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
