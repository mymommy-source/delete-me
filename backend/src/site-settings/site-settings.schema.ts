import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { collectionName } from '../common/collection-name';

export const LANGUAGES = ['ar', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Singleton document with site-wide configuration; created with these defaults on first request. */
@Schema({ timestamps: true, versionKey: false, collection: collectionName('site_settings') })
export class SiteSettings {
  @Prop({ type: String, enum: LANGUAGES, default: 'ar' })
  defaultLanguage!: Language;

  /** X (Twitter) username that receives orders by DM, without the @. */
  @Prop({ default: 'Paihs', trim: true, match: /^[A-Za-z0-9_]{0,15}$/ })
  xUsername!: string;

  /** Numeric X account ID; lets the order button open the DM with the message prefilled. */
  @Prop({ default: '1350830939358842881', trim: true, match: /^\d{0,25}$/ })
  xUserId!: string;

  /** Supports the placeholders {product} and {price}. */
  @Prop({ default: 'مرحباً، أرغب في طلب {product} بسعر {price} ريال.', trim: true, maxlength: 500 })
  orderMessageAr!: string;

  @Prop({ default: 'Hello, I would like to order {product} for {price} SAR.', trim: true, maxlength: 500 })
  orderMessageEn!: string;

  @Prop({ default: 'شرابات', trim: true, maxlength: 120 })
  seoTitle!: string;

  @Prop({ default: 'شرابات ناعمة ومرحة — الطلب عبر الخاص في تويتر.', trim: true, maxlength: 320 })
  seoDescription!: string;

  /** Image served by the frontend, e.g. /logo.jpg */
  @Prop({ default: '/logo.jpg', trim: true, maxlength: 2048 })
  logoUrl!: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
