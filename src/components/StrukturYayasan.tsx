import React from 'react';
import { motion } from 'motion/react';
import { Users, Shield, User, Landmark, Layers } from 'lucide-react';
import { Setting } from '../types';

interface StrukturYayasanProps {
  setting: Setting;
}

export const StrukturYayasan: React.FC<StrukturYayasanProps> = ({ setting }) => {
  let pembina = [
    { name: 'Dr. John Wesley, M.Th.', role: 'Ketua Dewan Pembina' },
    { name: 'Ev. Yusuf Sembiring, S.E.', role: 'Anggota Pembina' },
    { name: 'Pdt. Ir. Saut Manurung', role: 'Anggota Pembina' }
  ];

  let pengawas = [
    { name: 'Ir. Richard Tambunan, M.M.', role: 'Ketua Dewan Pengawas' },
    { name: 'Sabar Pardede, S.H.', role: 'Anggota Pengawas' }
  ];

  let pengurusHarian = [
    { name: 'Yusuf Raja Tamba, S.T.', role: 'Ketua Yayasan / Badan Pengurus' },
    { name: 'Ir. Daniel Simanjuntak', role: 'Wakil Ketua' },
    { name: 'Ruth Siregar, S.Kom.', role: 'Sekretaris Umum' },
    { name: 'Maria Hutapea, S.E.', role: 'Bendahara Umum' }
  ];

  let departemen = [
    { name: 'Ev. Markus Ginting, M.Div.', dept: 'Bidang Pembinaan & Spiritualitas' },
    { name: 'dr. Sarah Pangaribuan', dept: 'Bidang Pelayanan Medis & Misi Pedesaan' },
    { name: 'Toni Nababan, S.Pd.', dept: 'Bidang Pendidikan & Bimbingan Belajar' },
    { name: 'Grace Marbun, S.Ak.', dept: 'Bidang Hubungan Alumni & Media' }
  ];

  if (setting.pembinaJson) {
    try {
      const parsed = JSON.parse(setting.pembinaJson);
      if (Array.isArray(parsed)) pembina = parsed;
    } catch (e) { console.error('Error parsing pembinaJson', e); }
  }
  if (setting.pengawasJson) {
    try {
      const parsed = JSON.parse(setting.pengawasJson);
      if (Array.isArray(parsed)) pengawas = parsed;
    } catch (e) { console.error('Error parsing pengawasJson', e); }
  }
  if (setting.pengurusHarianJson) {
    try {
      const parsed = JSON.parse(setting.pengurusHarianJson);
      if (Array.isArray(parsed)) pengurusHarian = parsed;
    } catch (e) { console.error('Error parsing pengurusHarianJson', e); }
  }
  if (setting.departemenJson) {
    try {
      const parsed = JSON.parse(setting.departemenJson);
      if (Array.isArray(parsed)) departemen = parsed;
    } catch (e) { console.error('Error parsing departemenJson', e); }
  }

  const strukturTitle = setting.strukturTitle || 'Dewan Pengurus & Pelaksana Pelayanan';

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Struktur Yayasan</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            {strukturTitle}
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Level 1: Dewan Pembina & Pengawas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Pembina */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-church-gold/20 p-6 shadow-md relative"
          >
            <div className="flex items-center space-x-3 border-b border-church-gold/10 pb-4 mb-4">
              <Landmark size={20} className="text-church-gold" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-church-green">Dewan Pembina Yayasan</h3>
            </div>
            <div className="space-y-4">
              {pembina.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#faf9f6] p-3 border border-church-gold/10">
                  <span className="font-sans font-bold text-xs text-slate-900">{p.name}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-church-gold font-bold">{p.role}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pengawas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-church-gold/20 p-6 shadow-md relative"
          >
            <div className="flex items-center space-x-3 border-b border-church-gold/10 pb-4 mb-4">
              <Shield size={20} className="text-church-gold" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-church-green">Dewan Pengawas Yayasan</h3>
            </div>
            <div className="space-y-4">
              {pengawas.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#faf9f6] p-3 border border-church-gold/10">
                  <span className="font-sans font-bold text-xs text-slate-900">{p.name}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-church-gold font-bold">{p.role}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Connector Line decoration */}
        <div className="hidden md:flex flex-col items-center justify-center mb-8">
          <div className="h-8 w-0.5 bg-church-gold/30" />
          <div className="px-6 py-1 border border-church-gold/30 text-church-gold font-bold text-[9px] uppercase tracking-widest bg-white">
            Pelaksana Harian (Executif)
          </div>
          <div className="h-8 w-0.5 bg-church-gold/30" />
        </div>

        {/* Level 2: Pengurus Harian */}
        <div className="bg-white border border-church-gold/20 p-8 shadow-lg mb-16 relative">
          <div className="flex items-center space-x-3 border-b border-church-gold/10 pb-4 mb-6">
            <Users size={20} className="text-church-green" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-church-green">Badan Pengurus Harian (BPH)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {pengurusHarian.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#faf9f6] border border-church-gold/15 p-4 text-center flex flex-col justify-between"
              >
                <div className="w-10 h-10 bg-church-green/10 text-church-green flex items-center justify-center border border-church-green/10 mx-auto mb-3">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-900">{p.name}</h4>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-church-gold font-bold mt-1.5">{p.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Level 3: Bidang Pelayanan */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <div className="px-6 py-1 border border-church-gold/30 text-church-gold font-bold text-[9px] uppercase tracking-widest bg-white flex items-center space-x-2">
              <Layers size={11} />
              <span>Bidang-Bidang Pelayanan</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {departemen.map((d, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white border-l-4 border-church-green border-y border-r border-church-gold/15 p-5 flex justify-between items-center"
              >
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-widest text-church-gold font-bold mb-1">{d.dept}</p>
                  <p className="font-sans font-bold text-xs text-slate-900">{d.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
