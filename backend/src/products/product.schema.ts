import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { collectionName } from '../common/collection-name';
import { ImageAsset, ImageAssetSchema } from '../common/schemas/image-asset.schema';

@Schema({ timestamps: true, versionKey: false, collection: collectionName('products') })
export class Product {
  @Prop({ required: true, trim: true, maxlength: 140 })
  nameAr!: string;

  @Prop({ required: true, trim: true, maxlength: 140 })
  nameEn!: string;

  @Prop({ default: '', trim: true, maxlength: 4000 })
  descriptionAr!: string;

  @Prop({ default: '', trim: true, maxlength: 4000 })
  descriptionEn!: string;

  /** Price in halalas (1 SAR = 100 halalas) to avoid floating point errors. */
  @Prop({
    required: true,
    min: 0,
    validate: { validator: Number.isInteger, message: 'price must be an integer amount of halalas' },
  })
  price!: number;

  @Prop({ type: String, enum: ['SAR'], default: 'SAR' })
  currency!: 'SAR';

  @Prop({ type: [ImageAssetSchema], default: [] })
  images!: ImageAsset[];

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ default: false })
  isFeatured!: boolean;

  @Prop({ default: false })
  isNewArrival!: boolean;

  @Prop({ default: 0 })
  displayOrder!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ displayOrder: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isAvailable: 1 });
