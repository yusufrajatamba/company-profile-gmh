import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Download, Search, FileText, Compass, ExternalLink } from 'lucide-react';
import { Setting } from '../types';

interface LibraryProps {
  setting?: Setting;
}

export const Library: React.FC<LibraryProps> = ({ setting }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Panduan Studi', 'Teologi', 'Misi Global', 'Karier & Profesi'];

  const materials = [
    {
      title: 'Buku Panduan Pemuridan Pribadi (SCD)',
      category: 'Panduan Studi',
      type: 'PDF',
      size: '2.4 MB',
      desc: 'Materi pembinaan dasar rohani bagi mahasiswa Kristen aktif KMK USU, berfokus pada kedewasaan karakter Kristiani.'
    },
    {
      title: 'Kajian Hermeneutika Alkitab Terapan',
      category: 'Teologi',
      type: 'PDF',
      size: '4.1 MB',
      desc: 'Modul pengajaran mendalam mengenai metode penafsiran teks Alkitab secara sehat untuk kelompok sel rohani.'
    },
    {
      title: 'Panduan Misi Pedesaan Berkelanjutan',
      category: 'Misi Global',
      type: 'PDF',
      size: '1.8 MB',
      desc: 'Langkah praktis mengorganisasi misi sosial kemanusiaan, aksi medis harian, dan pembinaan anak di daerah pelosok.'
    },
    {
      title: 'Etika Kerja Kristen & Kepemimpinan Transformasional',
      category: 'Karier & Profesi',
      type: 'PDF',
      size: '3.0 MB',
      desc: 'Kumpulan seminar kesiapan dunia kerja yang ditulis oleh gabungan alumni senior PA KMK USU.'
    }
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">
            {setting?.librarySubtitle || 'Resource Library'}
          </h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            {setting?.libraryTitle || 'Perpustakaan & Sumber Belajar Digital'}
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-church-gold/15 p-6 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-church-green text-church-gold border-church-gold'
                    : 'bg-[#faf9f6] text-gray-600 border-church-gold/10 hover:border-church-gold/30 hover:text-church-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf9f6] border border-church-gold/15 px-4 py-2 pl-10 text-xs focus:outline-none focus:border-church-gold transition"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMaterials.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-church-gold/15 p-6 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-church-green/5 text-church-green border border-church-gold/15 font-bold text-[9px] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {item.type} • {item.size}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Simulated Download button */}
                <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end">
                  <button
                    onClick={() => alert(`Mengunduh berkas: ${item.title}`)}
                    className="flex items-center space-x-1.5 text-church-green hover:text-church-gold text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Unduh Berkas</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-church-gold/10">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Tidak ditemukan berkas materi yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
};
