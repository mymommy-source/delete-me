import { httpResource } from '@angular/common/http';
import { computed, effect, inject, Injectable } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import type { Paginated, Product, PublicSettings } from '../models';
import { buildXOrderUrl, fillTemplate } from '../utils/order-link';
import { plainSar } from '../utils/price';

/**
 * Public content for the site (settings and products). Requests run during SSR and are
 * handed to the browser through the HTTP transfer cache, so they are not
 * fetched twice. Provided by the home page so every visit loads fresh content.
 */
@Injectable()
export class SiteContentStore {
  private readonly i18n = inject(I18nService);

  readonly settingsResource = httpResource<PublicSettings>(() => '/api/settings/public');
  readonly productsResource = httpResource<Paginated<Product>>(() => '/api/products?limit=100');

  readonly settings = computed(() => (this.settingsResource.hasValue() ? this.settingsResource.value() : null));
  readonly products = computed(() => {
    // Only products available for order are shown publicly.
    return this.productsResource.hasValue() ? this.productsResource.value().items.filter((p) => p.isAvailable) : [];
  });

  constructor() {
    effect(() => {
      const lang = this.settings()?.defaultLanguage;
      if (lang) this.i18n.applyDefault(lang);
    });
  }

  /** X DM link with the product order message in the active language. */
  productOrderUrl(product: Product): string | null {
    const settings = this.settings();
    if (!settings) return null;
    const template = this.i18n.pick(settings, 'orderMessage');
    const message = fillTemplate(template, {
      product: this.i18n.pick(product, 'name'),
      price: plainSar(product.price),
    });
    return buildXOrderUrl(settings.xUsername, settings.xUserId, message);
  }

}
