export interface ImageAsset {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price in Saudi Riyals. */
  price: number;
  images: ImageAsset[];
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
}

export interface ShopSettings {
  /** X (Twitter) username that receives orders by DM, without the @. */
  xUsername: string;
  /** Numeric X account ID; opens the DM directly with the order message prefilled. */
  xUserId: string;
  /** Order message; {product} and {price} are filled in automatically. */
  orderMessage: string;
  seoTitle: string;
  seoDescription: string;
  logoUrl: string;
}
