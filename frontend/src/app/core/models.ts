export type Language = 'ar' | 'en';

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Product {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** Integer halalas (1 SAR = 100). */
  price: number;
  currency: 'SAR';
  images: ImageAsset[];
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSettings {
  defaultLanguage: Language;
  xUsername: string;
  xUserId: string;
  orderMessageAr: string;
  orderMessageEn: string;
  seoTitle: string;
  seoDescription: string;
  logoUrl: string;
}
