import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettings, SiteSettingsSchema } from './site-settings.schema';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteSettings.name, schema: SiteSettingsSchema },
    ]),
  ],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
