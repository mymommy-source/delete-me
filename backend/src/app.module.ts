import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ProductsModule } from './products/products.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';

// Strips query selectors ($gt, $ne, ...) from user-provided filter values.
mongoose.set('sanitizeFilter', true);

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env and fill it in.');
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ProductsModule,
    SiteSettingsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
