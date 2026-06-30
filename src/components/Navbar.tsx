import React, { useState } from 'react';
import { Menu, X, ShieldAlert, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { Setting } from '../types';

interface NavbarProps {
  setting?: Setting;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setting,
  isAdminLoggedIn,
  onAdminClick,
  onLogout,
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dropdown states for mobile and desktop click fallbacks
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsOpen(false);
    setAboutOpen(false);
    setProgramOpen(false);
    setNewsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const aboutSubMenu = [
    { id: 'about-sejarah', label: 'Sejarah Singkat' },
    { id: 'about-visi-misi', label: 'Visi dan Misi' },
    { id: 'about-struktur', label: 'Struktur Yayasan' }
  ];

  const programSubMenu = [
    { id: 'program-misi', label: 'Program Misi (GMHP)' },
    { id: 'program-alumni', label: 'Pelayanan Alumni (PA KMK)' }
  ];

  const newsSubMenu = [
    { id: 'news-gallery', label: 'Galery Alumni' },
    { id: 'news-warta', label: 'Warta Alumni' },
    { id: 'news-artikel', label: 'Artikel Alumni' },
    { id: 'news-pembangunan', label: 'Pembangunan Rumah Persekutuan' }
  ];

  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 bg-church-green text-white border-b border-church-green/30 shadow-lg font-sans">
      <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-inner mr-3 flex-shrink-0 overflow-hidden">
              {setting?.logoUrl ? (
                <img
                  src={setting.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full border border-church-green rounded-full flex items-center justify-center">
                  <span className="text-church-green font-extrabold text-base">
                    {setting?.logoText || 'G'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 flex flex-col justify-center">
              <span className="font-display font-bold text-sm sm:text-base text-white tracking-widest leading-none uppercase">
                GLOBAL MISSION HOUSE
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-church-gold tracking-widest uppercase mt-1">
                PA KMK USU • MEDAN
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                activeSection === 'home'
                  ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                  : 'text-white/80 hover:text-church-gold'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div 
              className="relative py-5"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className={`flex items-center space-x-1 text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                  activeSection.startsWith('about')
                    ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                    : 'text-white/80 hover:text-church-gold'
                }`}
              >
                <span>About</span>
                <ChevronDown size={12} className={`transition duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Box */}
              <div className={`absolute top-full left-0 w-52 bg-white text-slate-900 border border-gray-100 shadow-xl transition-all duration-200 z-50 ${
                aboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="h-1 bg-church-green w-full" />
                <div className="py-2">
                  {aboutSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 hover:text-church-green transition ${
                        activeSection === sub.id ? 'text-church-green bg-church-green/5' : 'text-gray-700'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Dropdown */}
            <div 
              className="relative py-5"
              onMouseEnter={() => setProgramOpen(true)}
              onMouseLeave={() => setProgramOpen(false)}
            >
              <button
                onClick={() => setProgramOpen(!programOpen)}
                className={`flex items-center space-x-1 text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                  activeSection.startsWith('program')
                    ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                    : 'text-white/80 hover:text-church-gold'
                }`}
              >
                <span>Program</span>
                <ChevronDown size={12} className={`transition duration-200 ${programOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full left-0 w-60 bg-white text-slate-900 border border-gray-100 shadow-xl transition-all duration-200 z-50 ${
                programOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="h-1 bg-church-green w-full" />
                <div className="py-2">
                  {programSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 hover:text-church-green transition ${
                        activeSection === sub.id ? 'text-church-green bg-church-green/5' : 'text-gray-700'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* News Dropdown */}
            <div 
              className="relative py-5"
              onMouseEnter={() => setNewsOpen(true)}
              onMouseLeave={() => setNewsOpen(false)}
            >
              <button
                onClick={() => setNewsOpen(!newsOpen)}
                className={`flex items-center space-x-1 text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                  activeSection.startsWith('news')
                    ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                    : 'text-white/80 hover:text-church-gold'
                }`}
              >
                <span>News</span>
                <ChevronDown size={12} className={`transition duration-200 ${newsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full left-0 w-64 bg-white text-slate-900 border border-gray-100 shadow-xl transition-all duration-200 z-50 ${
                newsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="h-1 bg-church-green w-full" />
                <div className="py-2">
                  {newsSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 hover:text-church-green transition ${
                        activeSection === sub.id ? 'text-church-green bg-church-green/5' : 'text-gray-700'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Creation */}
            <button
              onClick={() => handleNavClick('creation')}
              className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                activeSection === 'creation'
                  ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                  : 'text-white/80 hover:text-church-gold'
              }`}
            >
              Creation
            </button>

            {/* Library */}
            <button
              onClick={() => handleNavClick('library')}
              className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                activeSection === 'library'
                  ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                  : 'text-white/80 hover:text-church-gold'
              }`}
            >
              Library
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-[11px] lg:text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                activeSection === 'contact'
                  ? 'text-church-gold border-b-2 border-church-gold pb-1 mt-1'
                  : 'text-white/80 hover:text-church-gold'
              }`}
            >
              Contact
            </button>

            {/* CMS / Admin Button */}
            <div className="border-l border-white/20 pl-4 flex items-center space-x-2">
              {isAdminLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-church-gold text-white hover:bg-white hover:text-church-green rounded-md text-xs font-semibold transition cursor-pointer border border-church-gold"
                  >
                    <LayoutDashboard size={14} />
                    <span>CMS Panel</span>
                  </button>
                  <button
                    onClick={onLogout}
                    title="Logout"
                    className="p-1.5 text-white/80 hover:text-rose-400 hover:bg-white/10 rounded-md transition cursor-pointer border border-transparent"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdminClick}
                  className="flex items-center space-x-1 px-4 py-1.5 border border-white/30 rounded-full hover:bg-white hover:text-church-green text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                >
                  <ShieldAlert size={14} />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-church-gold hover:bg-white/10 transition"
              aria-expanded="false"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-church-green border-b border-church-green/40 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                activeSection === 'home' ? 'bg-white/10 text-church-gold' : 'text-white/80'
              }`}
            >
              Home
            </button>

            {/* About Mobile Dropdown / Accordion */}
            <div className="border-b border-white/5 pb-1">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80"
              >
                <span>About</span>
                <ChevronDown size={14} className={`transform transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="pl-6 space-y-1 bg-white/5 py-1">
                  {aboutSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-3 py-2 text-xs font-bold transition ${
                        activeSection === sub.id ? 'text-church-gold' : 'text-white/60'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Program Mobile Dropdown / Accordion */}
            <div className="border-b border-white/5 pb-1">
              <button
                onClick={() => setProgramOpen(!programOpen)}
                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80"
              >
                <span>Program</span>
                <ChevronDown size={14} className={`transform transition-transform ${programOpen ? 'rotate-180' : ''}`} />
              </button>
              {programOpen && (
                <div className="pl-6 space-y-1 bg-white/5 py-1">
                  {programSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-3 py-2 text-xs font-bold transition ${
                        activeSection === sub.id ? 'text-church-gold' : 'text-white/60'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* News Mobile Dropdown / Accordion */}
            <div className="border-b border-white/5 pb-1">
              <button
                onClick={() => setNewsOpen(!newsOpen)}
                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80"
              >
                <span>News</span>
                <ChevronDown size={14} className={`transform transition-transform ${newsOpen ? 'rotate-180' : ''}`} />
              </button>
              {newsOpen && (
                <div className="pl-6 space-y-1 bg-white/5 py-1">
                  {newsSubMenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`block w-full text-left px-3 py-2 text-xs font-bold transition ${
                        activeSection === sub.id ? 'text-church-gold' : 'text-white/60'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Creation */}
            <button
              onClick={() => handleNavClick('creation')}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                activeSection === 'creation' ? 'bg-white/10 text-church-gold' : 'text-white/80'
              }`}
            >
              Creation
            </button>

            {/* Library */}
            <button
              onClick={() => handleNavClick('library')}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                activeSection === 'library' ? 'bg-white/10 text-church-gold' : 'text-white/80'
              }`}
            >
              Library
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                activeSection === 'contact' ? 'bg-white/10 text-church-gold' : 'text-white/80'
              }`}
            >
              Contact
            </button>

            <div className="border-t border-white/10 pt-3 mt-3 px-3 flex flex-col space-y-2">
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onAdminClick();
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-church-gold text-white rounded-md text-xs font-bold uppercase tracking-widest shadow-xs"
                  >
                    <LayoutDashboard size={16} />
                    <span>CMS Panel</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-md text-xs font-bold uppercase tracking-widest"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAdminClick();
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 bg-church-gold text-white border border-church-gold rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-church-green"
                >
                  <ShieldAlert size={16} />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
