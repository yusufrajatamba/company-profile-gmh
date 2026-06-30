import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Eye, X, ZoomIn, Download, FileText } from 'lucide-react';
import { Activity } from '../types';

interface ActivitiesProps {
  activities: Activity[];
}

export const Activities: React.FC<ActivitiesProps> = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Safe fallback if database is empty
  const defaultActivities: Activity[] = [
    {
      id: 'default-1',
      title: 'Ibadah Bersama Alumni & Mahasiswa',
      description: 'Ibadah rutin gabungan persekutuan alumni bersama mahasiswa aktif KMK USU guna mempererat relasi spiritual dan membina kesatuan tubuh Kristus.\n\nKegiatan ini dihadiri oleh puluhan alumni dari berbagai angkatan dan mahasiswa aktif dari berbagai program studi. Melalui persekutuan yang akrab, doa bersama, dan pembagian firman Tuhan, kami saling menguatkan di tengah kesibukan profesi dan studi masing-masing.',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
      date: '2026-04-12'
    },
    {
      id: 'default-2',
      title: 'Aksi Sosial Pembagian Sembako',
      description: 'Pemberian paket sembako dan bantuan tunai kepada warga pra-sejahtera di sekitar daerah Medan Selayang sebagai wujud nyata kepedulian kasih Kristus.\n\nDalam aksi sosial ini, alumni dan mahasiswa bergotong-royong membagikan sembako sehat serta memberikan edukasi singkat tentang kesehatan lingkungan. Kami berharap aksi kecil ini dapat meringankan beban hidup sesama dan mendatangkan sukacita sejahtera.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      date: '2026-05-20'
    },
    {
      id: 'default-3',
      title: 'Mentoring & Pembekalan Karier',
      description: 'Sesi mentoring interaktif di mana para alumni senior membagikan pengalaman profesional, kiat dunia kerja, dan tips kepemimpinan kepada alumni muda dan mahasiswa tingkat akhir.\n\nAcara dikemas dalam bentuk bincang santai dan FGD (Focus Group Discussion). Topik-topik yang dibahas mencakup integritas Kristen di tempat kerja, mempersiapkan CV yang berdaya saing, serta strategi menghadapi wawancara kerja.',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
      date: '2026-06-15'
    }
  ];

  const itemsToRender = activities.length > 0 ? activities : defaultActivities;

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="activities" className="py-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Galeri Kegiatan</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            Dokumentasi & Aksi Nyata Kami
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itemsToRender.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-church-gold/15 rounded-none overflow-hidden shadow-xs hover:shadow-xl hover:border-church-gold/40 transition-all duration-300 flex flex-col group p-2 cursor-pointer"
              onClick={() => setSelectedActivity(activity)}
            >
              {/* Image with zoom effect */}
              <div className="aspect-16/10 overflow-hidden relative border border-church-gold/10">
                <img
                  src={activity.imageUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white text-church-green shadow-md border border-church-gold/30 flex items-center space-x-1">
                    <ZoomIn size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Detail</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Date Badge */}
                  <div className="flex items-center space-x-1.5 text-[10px] text-church-gold font-bold tracking-wider uppercase">
                    <Calendar size={12} className="text-church-gold" />
                    <span>{formatDate(activity.date)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-slate-900 group-hover:text-church-green transition-colors line-clamp-1">
                    {activity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {activity.description}
                  </p>

                  {/* Document Attachment Download Link if present */}
                  {activity.documentFile && (
                    <div className="pt-3 mt-1 border-t border-church-gold/10 flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()} // Prevent clicking parent card trigger
                    >
                      <span className="text-[10px] text-gray-500 font-medium truncate max-w-[140px] flex items-center space-x-1">
                        <FileText size={13} className="text-church-green flex-shrink-0" />
                        <span className="truncate" title={activity.documentFileName}>{activity.documentFileName || 'Laporan'}</span>
                      </span>
                      <a
                        href={activity.documentFile}
                        download={activity.documentFileName || "laporan"}
                        className="text-[10px] font-bold text-church-gold hover:text-church-green tracking-widest uppercase transition flex items-center space-x-1"
                      >
                        <Download size={10} />
                        <span>Unduh</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
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
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs text-church-gold font-bold tracking-wider uppercase">
                      <Calendar size={13} />
                      <span>{formatDate(selectedActivity.date)}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider text-slate-900 leading-tight">
                      {selectedActivity.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="p-1.5 border border-church-gold/25 text-church-gold hover:text-white hover:bg-church-green transition cursor-pointer flex-shrink-0 ml-4 rounded-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-gray-700 leading-relaxed text-sm space-y-4">
                  {selectedActivity.imageUrl && (
                    <div className="aspect-16/10 w-full rounded-none border border-church-gold/20 p-1 bg-white mb-6 relative overflow-hidden group cursor-pointer"
                      title="Klik untuk memperbesar gambar"
                      onClick={() => setLightboxImage({ url: selectedActivity.imageUrl || '', title: selectedActivity.title })}
                    >
                      <img
                        src={selectedActivity.imageUrl}
                        alt={selectedActivity.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/75 text-white text-[9px] font-bold tracking-widest px-2 py-1 uppercase border border-white/20">
                        Perbesar Foto
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-line text-gray-600 text-sm">
                    {selectedActivity.description}
                  </div>

                  {selectedActivity.documentFile && (
                    <div className="mt-6 p-4 border border-church-gold/25 bg-church-gold/5 flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2 bg-church-gold/10 text-church-green flex-shrink-0">
                          <FileText size={18} className="text-church-green" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Laporan Lampiran</p>
                          <p className="text-[10px] text-gray-500 font-mono truncate max-w-[200px] sm:max-w-xs">{selectedActivity.documentFileName || 'laporan'}</p>
                        </div>
                      </div>
                      <a
                        href={selectedActivity.documentFile}
                        download={selectedActivity.documentFileName || "laporan"}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-church-green text-church-gold border border-church-gold/25 font-bold text-[10px] uppercase tracking-wider hover:bg-church-gold hover:text-white transition whitespace-nowrap"
                      >
                        <Download size={12} />
                        <span>Unduh</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 bg-white border-t border-church-gold/10 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="px-6 py-3 bg-church-green text-church-gold border border-church-gold font-bold text-xs uppercase tracking-widest transition cursor-pointer hover:bg-white hover:text-church-green"
                  >
                    Tutup Dokumentasi
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
