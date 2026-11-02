import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSettings } from './site-settings.schema';

/**
 * Fields exposed to the website. Anything added to the schema stays private
 * until it is listed here.
 */
const PUBLIC_FIELDS = [
  'defaultLanguage',
  'xUsername',
  'xUserId',
  'orderMessageAr',
  'orderMessageEn',
  'seoTitle',
  'seoDescription',
  'logoUrl',
] as const satisfies readonly (keyof SiteSettings)[];

export type PublicSiteSettings = Pick<SiteSettings, (typeof PUBLIC_FIELDS)[number]>;

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly settingsModel: Model<SiteSettings>,
  ) {}

  /** Returns the public settings, creating defaults on first use. */
  async getPublic(): Promise<PublicSiteSettings> {
    const settings =
      (await this.settingsModel.findOne().lean<SiteSettings>().exec()) ??
      (await this.settingsModel.create({})).toObject();
    return Object.fromEntries(
      PUBLIC_FIELDS.map((field) => [field, settings[field]]),
    ) as PublicSiteSettings;
  }
}
