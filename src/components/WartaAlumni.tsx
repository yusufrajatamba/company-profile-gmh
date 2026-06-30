import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Bell, ChevronRight, FileText, ArrowUpRight } from 'lucide-react';

export const WartaAlumni: React.FC = () => {
  const wartaList = [
    {
      title: 'Ibadah Syukur Awal Tahun & Temu Ramah Alumni 2026',
      date: '10 Januari 2026',
      category: 'Ibadah & Persekutuan',
      desc: 'Mengundang seluruh alumni KMK USU lintas angkatan untuk hadir dalam ibadah syukur awal tahun yang akan dilaksanakan di Aula Global Mission House Medan secara hibrida.'
    },
    {
      title: 'Aksi Kasih Natal & Pemberian Beasiswa Semester Genap',
      date: '18 Desember 2025',
      category: 'Aksi Sosial',
      desc: 'Panitia Aksi Kasih Natal mengumumkan penyaluran bantuan dana pendidikan tahap kedua kepada 15 mahasiswa aktif KMK USU berprestasi yang berhak menerima.'
    },
    {
      title: 'Pembukaan Pendaftaran Relawan Tim Misi Medis Pedesaan',
      date: '05 November 2025',
      category: 'Pengumuman Misi',
      desc: 'Dibutuhkan dokter, perawat, apoteker, serta relawan non-medis untuk mendukung aksi pelayanan kesehatan massal di desa binaan Kabupaten Dairi.'
    }
  ];

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Warta Alumni</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Informasi & Warta Terkini
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Warta Cards */}
        <div className="space-y-6">
          {wartaList.map((warta, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white border border-church-gold/15 p-6 hover:shadow-md transition group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <span className="px-2.5 py-0.5 bg-church-green/10 text-church-green font-bold text-[9px] uppercase tracking-wider">
                    {warta.category}
                  </span>
                  <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <Calendar size={11} className="mr-1.5" />
                    <span>{warta.date}</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-church-gold/10 text-church-green flex items-center justify-center border border-church-gold/20 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight size={12} />
                </div>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-church-green transition mb-2">
                {warta.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">
                {warta.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Informative Side Card */}
        <div className="bg-white border border-church-gold/20 p-8 text-center mt-12 max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-church-gold/10 text-church-gold flex items-center justify-center border border-church-gold/25 mx-auto">
            <Bell size={20} className="animate-swing" />
          </div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-church-green">Punya Warta yang Ingin Dibagikan?</h4>
          <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
            Jika Anda memiliki informasi mengenai lowongan pekerjaan, kedukaan, pernikahan, atau info persekutuan doa wilayah yang ingin diterbitkan di portal Warta Alumni, hubungi tim Humas melalui menu Kontak.
          </p>
        </div>
      </div>
    </div>
  );
};
