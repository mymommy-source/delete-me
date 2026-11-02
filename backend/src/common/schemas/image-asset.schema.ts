import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** A product photo, e.g. /products/cartoon-1.jpg served by the frontend. */
@Schema({ _id: false })
export class ImageAsset {
  @Prop({ required: true, trim: true, maxlength: 2048 })
  url!: string;

  @Prop({ default: '', trim: true, maxlength: 300 })
  alt!: string;

  @Prop({ min: 0 })
  width?: number;

  @Prop({ min: 0 })
  height?: number;
}

export const ImageAssetSchema = SchemaFactory.createForClass(ImageAsset);
