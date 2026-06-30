import React from 'react';
import { motion } from 'motion/react';
import { Landmark, CreditCard, MailCheck } from 'lucide-react';
import { Setting } from '../types';

interface PembangunanRumahProps {
  setting: Setting;
}

export const PembangunanRumah: React.FC<PembangunanRumahProps> = ({ setting }) => {
  const currentProgress = setting.pembangunanProgress !== undefined ? setting.pembangunanProgress : 65; // %
  const targetAmount = setting.pembangunanTarget || 'Rp 1.500.000.000';
  const raisedAmount = setting.pembangunanRaised || 'Rp 975.000.000';

  let accounts = [
    {
      bank: 'Bank Mandiri',
      number: '111-00123-45678',
      holder: 'Yayasan Global Mission House'
    },
    {
      bank: 'Bank Central Asia (BCA)',
      number: '822-9876-5432',
      holder: 'Yusuf Raja Tamba (Qubil Pembangunan)'
    }
  ];

  if (setting.bankAccountsJson) {
    try {
      const parsed = JSON.parse(setting.bankAccountsJson);
      if (Array.isArray(parsed)) {
        accounts = parsed;
      }
    } catch (e) {
      console.error('Error parsing bankAccountsJson', e);
    }
  }

  const pembangunanTitle = setting.pembangunanTitle || 'Rumah Persekutuan GMH';
  const pembangunanSubtitle = setting.pembangunanSubtitle || 'Membangun Masa Depan Pelayanan yang Kokoh';
  const text1 = setting.pembangunanText1 || 'Rumah Persekutuan Global Mission House dipersiapkan untuk menjadi pusat administrasi pelayanan alumni, asrama pembinaan sementara mahasiswa Kristen USU aktif, dan pusat latihan misi jangka pendek sebelum relawan diutus ke pedalaman.';
  const text2 = setting.pembangunanText2 || 'Dengan luas bangunan terencana sebesar 450 m², gedung ini akan dilengkapi dengan ruang ibadah, sekretariat bersama, perpustakaan teologi, serta kamar inap bagi misionaris tamu. Melalui dukungan dari seluruh alumni, kami rindu menyelesaikan pembangunan ini tepat waktu demi kemuliaan nama Tuhan.';
  const imageUrl = setting.pembangunanImageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="py-24 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-church-gold tracking-widest uppercase mb-3">Proyek Pembangunan</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-wider uppercase leading-tight">
            {pembangunanTitle}
          </p>
          <div className="h-0.5 w-16 bg-church-gold mx-auto mt-4" />
        </div>

        {/* Narrative & Image Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-church-green">
              {pembangunanSubtitle}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {text1}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {text2}
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-video sm:aspect-square border border-church-gold/30 p-2 bg-white shadow-lg">
              <img
                src={imageUrl}
                alt="Construction of GMH House"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white border border-church-gold/20 p-8 shadow-md mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <Landmark size={20} className="text-church-green" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">Status Pendanaan Gedung</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Target Total Biaya</p>
              <p className="text-2xl font-extrabold text-slate-900">{targetAmount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Dana Terkumpul</p>
              <p className="text-2xl font-extrabold text-church-green">{raisedAmount}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-church-gold uppercase tracking-widest">Progress Pembangunan</span>
              <span className="text-church-green">{currentProgress}% Selesai</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 border border-gray-200">
              <div
                className="h-full bg-church-green transition-all duration-1000"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Donation Accounts Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">Panduan Dukungan & Donasi</h3>
            <div className="h-0.5 w-8 bg-church-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {accounts.map((acc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-church-gold/15 p-6 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-church-gold/10 pb-3">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-church-green">{acc.bank}</span>
                    <CreditCard size={16} className="text-church-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-mono font-bold text-slate-900 tracking-wider mb-1">
                      {acc.number}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      a.n. {acc.holder}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Confirmation note */}
          <div className="bg-church-green/5 border border-church-gold/25 p-5 mt-8 flex items-start space-x-4 max-w-3xl mx-auto">
            <div className="p-2 bg-church-gold/10 text-church-green border border-church-gold/20 flex-shrink-0">
              <MailCheck size={18} />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-church-green mb-1">Konfirmasi Transfer Donasi</h4>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Untuk transparansi audit keuangan panitia pembangunan, mohon berkenan mengirimkan foto struk bukti pengiriman donasi Anda melalui WhatsApp atau formulir pesan di menu Kontak. Terima kasih atas kedermawanan Anda. Tuhan Yesus memberkati!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
