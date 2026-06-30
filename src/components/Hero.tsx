import React from 'react';
import { motion } from 'motion/react';
import { Compass, Users, ArrowRight } from 'lucide-react';
import { Setting } from '../types';

interface HeroProps {
  setting: Setting;
  onStartMisi: () => void;
  onViewAlumni: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setting, onStartMisi, onViewAlumni }) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white pt-20">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80"
          alt="Global Mission House Fellowship"
          className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Welcome Tagline */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-church-gold serif-italic text-lg sm:text-xl md:text-2xl mb-4 block tracking-wide"
        >
          Selamat Datang di Portal Resmi
        </motion.span>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-wider uppercase leading-tight max-w-4xl mx-auto mb-6 text-white"
        >
          {setting.heroTitle}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg text-white/80 font-light max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {setting.heroSubtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button
            onClick={onStartMisi}
            className="w-full sm:w-auto px-8 py-4 bg-church-gold hover:bg-white hover:text-church-green text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <Compass size={16} />
              <span>Gabung Program Misi</span>
              <ArrowRight size={14} />
            </span>
          </button>
          <button
            onClick={onViewAlumni}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            <span className="flex items-center justify-center space-x-2">
              <Users size={16} />
              <span>Pelayanan Alumni</span>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
