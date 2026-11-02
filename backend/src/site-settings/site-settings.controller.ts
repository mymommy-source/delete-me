import { Controller, Get } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';

@Controller('settings')
export class SiteSettingsController {
  constructor(private readonly settings: SiteSettingsService) {}

  @Get('public')
  getPublic() {
    return this.settings.getPublic();
  }
}
