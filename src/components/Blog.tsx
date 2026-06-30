import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Tag, ArrowRight, X, Eye, ZoomIn } from 'lucide-react';
import { Article } from '../types';

interface BlogProps {
  articles: Article[];
}

export const Blog: React.FC<BlogProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const defaultArticles: Article[] = [
    {
      id: 'default-art-1',
      title: 'Menghidupi Panggilan Misi di Tengah Karier Modern',
      content: `Banyak profesional Kristen beranggapan bahwa pelayanan misi hanya bisa dikerjakan secara purna waktu oleh para penginjil di pedalaman. Namun, Alkitab mengajarkan bahwa profesi sekuler kita adalah mimbar tempat kita memancarkan terang Kristus.\n\nDi kantor, di rumah sakit, di sekolah, kita dipanggil untuk mengimplementasikan integritas, kejujuran, dan kasih yang tulus. Menjadi saksi Kristus melalui kompetensi profesional dan kepemimpinan Kristen adalah misi utama alumni KMK USU di era modern ini.\n\nMari kita jadikan tempat kerja kita sebagai kebun pelayanan tempat kita menabur kebaikan, keadilan, dan kesaksian hidup yang memuliakan Tuhan. Melalui integritas kerja kita, orang lain akan melihat buah-buah Kristus dalam hidup kita.`,
      author: 'Pdt. Dr. John Siregar, M.Th.',
      category: 'Renungan',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-06-10T10:00:00Z'
    },
    {
      id: 'default-art-2',
      title: 'Peran Alumni KMK USU Mendampingi Mahasiswa Aktif',
      content: `Perjalanan iman di bangku kuliah penuh dengan pergumulan akademis, pergaulan, dan pencarian jati diri. Oleh sebab itu, kehadiran alumni sebagai mentor rohani sangatlah penting bagi adik-adik mahasiswa aktif.\n\nMelalui bimbingan langsung, persekutuan alumni, dan dukungan moral, kita dapat menuntun mereka agar tidak tersesat dalam arus zaman yang kian menantang. Komitmen ini bukan sekadar melestarikan organisasi, melainkan melahirkan generasi pemimpin Kristen masa depan yang tangguh dan setia.\n\nMari kita investasikan sebagian waktu, tenaga, dan pengalaman hidup kita untuk mendampingi adik-adik di KMK USU agar kelak mereka juga dapat bersinar di tengah bangsa dan negara.`,
      author: 'dr. Maria Siahaan, Sp.A.',
      category: 'Kabar Alumni',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-06-25T14:30:00Z'
    }
  ];

  const itemsToRender = articles.length > 0 ? articles : defaultArticles;

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="blog" className="py-24 bg-white border-t border-church-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Artikel & Kabar Alumni</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Tulisan Inspiratif & Berita Terbaru
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {itemsToRender.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#faf9f6] border border-church-gold/15 rounded-none p-5 sm:p-7 shadow-xs hover:shadow-lg hover:border-church-gold/40 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group"
            >
              {/* Optional Image with Zoom on Hover */}
              {article.imageUrl && (
                <div className="w-full sm:w-36 h-36 rounded-none border border-church-gold/20 p-1 bg-white flex-shrink-0 relative overflow-hidden group/img cursor-pointer"
                  onClick={() => setLightboxImage({ url: article.imageUrl, title: article.title })}
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-2 bg-white text-church-green shadow-md border border-church-gold/30">
                      <ZoomIn size={14} className="text-church-green" />
                    </div>
                  </div>
                </div>
              )}

              {/* Text Info */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap gap-3 items-center text-xs">
                  {/* Category */}
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-church-gold/10 text-church-green rounded-none border border-church-gold/20 font-bold text-[10px] uppercase tracking-wider">
                    <Tag size={10} />
                    <span>{article.category}</span>
                  </span>
                  {/* Date */}
                  <span className="text-church-gold flex items-center space-x-1 font-bold text-[10px] uppercase tracking-wider">
                    <Calendar size={11} />
                    <span>{formatDate(article.createdAt)}</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-base text-slate-900 uppercase tracking-wider hover:text-church-green transition duration-200 cursor-pointer line-clamp-2" onClick={() => setSelectedArticle(article)}>
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {article.content}
                  </p>
                </div>

                {/* Author & CTA */}
                <div className="flex items-center justify-between border-t border-church-gold/10 pt-3 mt-1">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <User size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{article.author}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="flex items-center space-x-1 text-[10px] font-bold text-church-gold hover:text-church-green uppercase tracking-widest transition cursor-pointer"
                  >
                    <span>Baca</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reader Modal Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-church-green/75 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#faf9f6] border border-church-gold/40 rounded-none shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh] p-2"
            >
              <div className="bg-white border border-church-gold/20 flex flex-col h-full overflow-hidden">
                {/* Header Details */}
                <div className="p-6 sm:p-8 border-b border-church-gold/10 flex justify-between items-start shrink-0">
                  <div className="space-y-3">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-church-gold/15 text-church-green rounded-none border border-church-gold/25 font-bold text-[10px] uppercase tracking-wider">
                      <Tag size={11} />
                      <span>{selectedArticle.category}</span>
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider text-slate-900 leading-tight">
                      {selectedArticle.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-church-gold font-bold uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{selectedArticle.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(selectedArticle.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 border border-church-gold/25 text-church-gold hover:text-white hover:bg-church-green transition cursor-pointer flex-shrink-0 ml-4 rounded-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-gray-700 leading-relaxed text-sm space-y-4 whitespace-pre-wrap">
                  {selectedArticle.imageUrl && (
                    <div className="aspect-video w-full rounded-none border border-church-gold/20 p-1 bg-white mb-6 relative overflow-hidden group cursor-pointer"
                      title="Klik untuk memperbesar gambar"
                      onClick={() => setLightboxImage({ url: selectedArticle.imageUrl || '', title: selectedArticle.title })}
                    >
                      <img
                        src={selectedArticle.imageUrl}
                        alt={selectedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/75 text-white text-[9px] font-bold tracking-widest px-2 py-1 uppercase border border-white/20">
                        Perbesar Foto
                      </div>
                    </div>
                  )}
                  {selectedArticle.content}

                  {selectedArticle.documentFile && (
                    <div className="mt-6 p-4 border border-church-gold/25 bg-church-gold/5 flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2 bg-church-gold/10 text-church-green flex-shrink-0">
                          <svg className="w-5 h-5 text-church-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dokumen Lampiran</p>
                          <p className="text-[10px] text-gray-500 font-mono truncate max-w-[200px] sm:max-w-xs">{selectedArticle.documentFileName || 'lampiran'}</p>
                        </div>
                      </div>
                      <a
                        href={selectedArticle.documentFile}
                        download={selectedArticle.documentFileName || "lampiran"}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-church-green text-church-gold border border-church-gold/25 font-bold text-[10px] uppercase tracking-wider hover:bg-church-gold hover:text-white transition whitespace-nowrap"
                      >
                        <span>Unduh</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 bg-white border-t border-church-gold/10 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-3 bg-church-green text-church-gold border border-church-gold font-bold text-xs uppercase tracking-widest transition cursor-pointer hover:bg-white hover:text-church-green"
                  >
                    Tutup Bacaan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen Immersive Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-full text-gray-400 hover:text-white hover:bg-slate-800 transition z-10 cursor-pointer"
            >
              <X size={22} />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="max-w-4xl max-h-[80vh] flex flex-col justify-center items-center relative overflow-hidden"
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain border border-church-gold/30 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="bg-slate-950/85 px-4 py-2 border border-slate-800 mt-4 text-center">
                <p className="text-white text-xs font-semibold tracking-wider uppercase font-display">{lightboxImage.title}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
