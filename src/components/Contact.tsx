import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, AlertTriangle, Compass, MessageSquare } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Setting } from '../types';

interface ContactProps {
  setting: Setting;
}

export const Contact: React.FC<ContactProps> = ({ setting }) => {
  const [activeForm, setActiveForm] = useState<'misi' | 'pesan'>('misi');

  // Program Misi Form State
  const [misiName, setMisiName] = useState('');
  const [misiEmail, setMisiEmail] = useState('');
  const [misiPhone, setMisiPhone] = useState('');
  const [misiProgram, setMisiProgram] = useState('Misi Pedesaan & Pelayanan Sosial');
  const [misiMessage, setMisiMessage] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMisiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!misiName || !misiEmail || !misiPhone) {
      setErrorMsg('Harap isi semua kolom wajib (Nama, Email, Telepon).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const docData = {
        misiTitle: misiProgram,
        fullName: misiName,
        email: misiEmail,
        phone: misiPhone,
        message: misiMessage,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'misi_registrations'), docData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'misi_registrations');
      }

      // Reset Form
      setMisiName('');
      setMisiEmail('');
      setMisiPhone('');
      setMisiMessage('');
      setSuccessMsg('Pendaftaran Program Misi berhasil dikirim! Tim kami akan segera menghubungi Anda.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal mengirim pendaftaran. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      setErrorMsg('Harap lengkapi semua kolom.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const docData = {
        fullName: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'messages'), docData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'messages');
      }

      // Reset Form
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setSuccessMsg('Pesan Hubungi Kami berhasil dikirim! Terima kasih atas masukan Anda.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#faf9f6] border-t border-church-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Info and Address */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Hubungi Kami</h2>
              <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
                Mari Terhubung dan Bersinergi
              </p>
              <div className="h-0.5 w-16 bg-church-gold mt-4" />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Global Mission House - PA KMK USU terbuka untuk menerima kunjungan, kerja sama pelayanan, donasi misi, maupun masukan dari seluruh rekan-rekan alumni dan jemaat sekalian.
            </p>

            {/* Address Details Block */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-gold/10 text-church-green border border-church-gold/25 rounded-none flex-shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">Alamat Sekretariat</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{setting.address || 'Jln. Bunga Teratai Gg. Bunga Teratai II Medan Selayang'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-gold/10 text-church-green border border-church-gold/25 rounded-none flex-shrink-0 mt-1">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">Email Resmi</h4>
                  <a href={`mailto:${setting.email || 'pakmkusumdn@gmail.com'}`} className="text-gray-500 text-xs hover:text-church-green transition mt-1.5 block">
                    {setting.email || 'pakmkusumdn@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-gold/10 text-church-green border border-church-gold/25 rounded-none flex-shrink-0 mt-1">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">No. Telepon / WhatsApp</h4>
                  <a href={`https://wa.me/${(setting.phone || '+62 822-7636-3241').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-church-green transition mt-1.5 block">
                    {setting.phone || '+62 822-7636-3241'}
                  </a>
                </div>
              </div>

              {/* Work Hours */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-church-gold/10 text-church-green border border-church-gold/25 rounded-none flex-shrink-0 mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">Waktu Operasional</h4>
                  <p className="text-gray-500 text-xs mt-1.5">Senin - Sabtu: 09:00 - 17:00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Box */}
          <div className="lg:col-span-7 bg-white border border-church-gold/15 p-8 sm:p-10 rounded-none shadow-lg">
            {/* Form Type Tab Toggles */}
            <div className="flex border-b border-church-gold/10 pb-4 mb-8 space-x-6">
              <button
                onClick={() => {
                  setActiveForm('misi');
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`flex items-center space-x-2 pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeForm === 'misi'
                    ? 'text-church-green border-b-2 border-church-green'
                    : 'text-gray-400 hover:text-church-green'
                }`}
              >
                <Compass size={14} />
                <span>Registrasi Misi (GMHP)</span>
              </button>
              <button
                onClick={() => {
                  setActiveForm('pesan');
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`flex items-center space-x-2 pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeForm === 'pesan'
                    ? 'text-church-green border-b-2 border-church-green'
                    : 'text-gray-400 hover:text-church-green'
                }`}
              >
                <MessageSquare size={14} />
                <span>Hubungi Kami (Saran)</span>
              </button>
            </div>

            {/* Success and Error Alerts */}
            <AnimatePresence mode="wait">
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-church-gold/10 border border-church-gold/20 text-church-green rounded-none mb-6 flex items-start space-x-3 text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  <CheckCircle2 size={16} className="text-church-gold flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-none mb-6 flex items-start space-x-3 text-xs font-bold uppercase tracking-wider"
                >
                  <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Render Forms */}
            <AnimatePresence mode="wait">
              {activeForm === 'misi' ? (
                <motion.form
                  key="misi-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleMisiSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={misiName}
                      onChange={(e) => setMisiName(e.target.value)}
                      placeholder="Contoh: Yusuf Siregar, S.T."
                      className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={misiEmail}
                        onChange={(e) => setMisiEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">No. Handphone / WA *</label>
                      <input
                        type="tel"
                        required
                        value={misiPhone}
                        onChange={(e) => setMisiPhone(e.target.value)}
                        placeholder="+62 8xx xxxx xxxx"
                        className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Program Misi Pilihan</label>
                    <select
                      value={misiProgram}
                      onChange={(e) => setMisiProgram(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                    >
                      <option value="Misi Pedesaan & Pelayanan Sosial">Misi Pedesaan & Pelayanan Sosial</option>
                      <option value="Bimbingan Belajar Anak Pedalaman">Bimbingan Belajar Anak Pedalaman</option>
                      <option value="Ibadah Doa & Pendalaman Alkitab">Ibadah Doa & Pendalaman Alkitab</option>
                      <option value="Aksi Kasih Sembako & Kemanusiaan">Aksi Kasih Sembako & Kemanusiaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Pesan Tambahan / Kerinduan Pelayanan</label>
                    <textarea
                      rows={4}
                      value={misiMessage}
                      onChange={(e) => setMisiMessage(e.target.value)}
                      placeholder="Tuliskan kerinduan atau pesan Anda bergabung dalam misi ini..."
                      className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-church-gold hover:bg-church-green hover:text-white disabled:bg-church-gold/50 text-white border border-church-gold font-bold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center space-x-2 cursor-pointer rounded-none"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Kirim Pendaftaran Misi</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="pesan-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleContactSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Yusuf Siregar"
                        className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Subjek Pesan *</label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Contoh: Kerja Sama Pelayanan / Pertanyaan Donor"
                      className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Isi Pesan / Saran *</label>
                    <textarea
                      rows={5}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tuliskan pesan Anda secara jelas di sini..."
                      className="w-full px-4 py-3 bg-white border border-church-gold/20 rounded-none text-xs focus:outline-hidden focus:ring-1 focus:ring-church-gold/30 focus:border-church-green transition animate-fadeIn"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-church-gold hover:bg-church-green hover:text-white disabled:bg-church-gold/50 text-white border border-church-gold font-bold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center space-x-2 cursor-pointer rounded-none"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
