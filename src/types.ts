export interface Setting {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  visi: string;
  misi: string;
  address: string;
  email: string;
  phone: string;
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
