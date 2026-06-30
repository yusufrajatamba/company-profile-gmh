export interface Setting {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  visi: string;
  misi: string;
  address: string;
  email: string;
  phone: string;
  themeGreen?: string;
  themeGold?: string;
  themeName?: string;

  // Home Stats & Sections Toggles
  statsAlumni?: string;
  statsCities?: string;
  statsMisi?: string;
  statsYears?: string;
  showPillars?: boolean;
  showStats?: boolean;
  showVisiMisi?: boolean;
  showExplorerHub?: boolean;
  showSupportInvitation?: boolean;

  // About - Sejarah Singkat
  sejarahTitle?: string;
  sejarahSection1Title?: string;
  sejarahSection1Text?: string;
  sejarahSection2Title?: string;
  sejarahSection2Text?: string;
  milestonesJson?: string; // Stored as serialized JSON for compatibility with simple key-value settings, or as fields
  showSejarahTimeline?: boolean;

  // About - Struktur Yayasan
  strukturTitle?: string;
  pembinaJson?: string;
  pengawasJson?: string;
  pengurusHarianJson?: string;
  departemenJson?: string;

  // News - Pembangunan Rumah
  pembangunanTitle?: string;
  pembangunanSubtitle?: string;
  pembangunanText1?: string;
  pembangunanText2?: string;
  pembangunanProgress?: number;
  pembangunanTarget?: string;
  pembangunanRaised?: string;
  pembangunanImageUrl?: string;
  bankAccountsJson?: string;

  // Programs - Program Misi
  misiPageTitle?: string;
  misiPageSubtitle?: string;
  misiPageText?: string;

  // Programs - Pelayanan Alumni
  alumniPageTitle?: string;
  alumniPageSubtitle?: string;
  alumniPageText?: string;

  // Alumni Berkarya
  berkaryaTitle?: string;
  berkaryaSubtitle?: string;

  // Library
  libraryTitle?: string;
  librarySubtitle?: string;

  // Logo & Home Hero Background
  logoUrl?: string;
  logoText?: string;
  heroBgUrl?: string;
  showHeroSection?: boolean;

  // Fokus Visi Strategis Home Section
  homeVisiTitle?: string;
  homeVisiDesc?: string;

  // Program Misi - 3 Focus Pillars
  misiPilar1Title?: string;
  misiPilar1Desc?: string;
  misiPilar2Title?: string;
  misiPilar2Desc?: string;
  misiPilar3Title?: string;
  misiPilar3Desc?: string;

  // Program Misi - 4 Steps process
  misiStep1Title?: string;
  misiStep1Desc?: string;
  misiStep2Title?: string;
  misiStep2Desc?: string;
  misiStep3Title?: string;
  misiStep3Desc?: string;
  misiStep4Title?: string;
  misiStep4Desc?: string;

  // Pelayanan Alumni - 4 Service Items
  alumniService1Title?: string;
  alumniService1Desc?: string;
  alumniService1Redirect?: string;
  alumniService2Title?: string;
  alumniService2Desc?: string;
  alumniService2Redirect?: string;
  alumniService3Title?: string;
  alumniService3Desc?: string;
  alumniService3Redirect?: string;
  alumniService4Title?: string;
  alumniService4Desc?: string;
  alumniService4Redirect?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  documentFile?: string;
  documentFileName?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  documentFile?: string;
  documentFileName?: string;
}

export interface MisiRegistration {
  id: string;
  misiTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
