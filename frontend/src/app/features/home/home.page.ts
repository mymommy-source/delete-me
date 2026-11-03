import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TermsConsentService } from '../../core/consent/terms-consent.service';
import type { Product } from '../../core/models';
import { SeoService } from '../../core/seo/seo.service';
import { buildXOrderUrl, fillTemplate } from '../../core/utils/order-link';
import { plainSar } from '../../core/utils/price';
import { PRODUCTS, SETTINGS } from '../../data/shop-data';
import { IconComponent } from '../../shared/ui/icon.component';
import { CollectionSectionComponent } from '../products/collection-section.component';
import { TermsGateComponent } from './components/terms-gate.component';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, CollectionSectionComponent, TermsGateComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-svh bg-ivory" [attr.inert]="consent.accepted() ? null : ''" [attr.aria-hidden]="consent.accepted() ? null : 'true'">
      <header class="flex flex-col items-center gap-5 bg-blush pt-12 pb-5 sm:pt-16 sm:pb-6">
        <img
          [ngSrc]="settings.logoUrl"
          alt=""
          width="176"
          height="176"
          priority
          class="size-36 rounded-full border-4 border-ivory object-cover shadow-lift sm:size-44"
        />
        <a
          [href]="'https://x.com/' + settings.profileXUsername"
          target="_blank"
          rel="noopener noreferrer"
          class="grid size-10 place-items-center rounded-full bg-cocoa text-ivory shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-deep"
          [attr.aria-label]="'X: @' + settings.profileXUsername"
        >
          <app-icon name="x" class="size-4" />
        </a>
      </header>
      <app-collection-section [products]="products" [orderUrl]="orderUrl" />
    </main>
    @if (!consent.accepted()) {
      <app-terms-gate [logoUrl]="settings.logoUrl" (accepted)="consent.accept()" />
    }
  `,
})
export class HomePage {
  protected readonly consent = inject(TermsConsentService);

  protected readonly settings = SETTINGS;
  protected readonly products = PRODUCTS.filter((p) => p.isAvailable);

  /** X DM link with the product order message filled in. */
  protected readonly orderUrl = (product: Product): string | null => {
    const message = fillTemplate(SETTINGS.orderMessage, {
      product: product.name,
      price: plainSar(product.price),
    });
    return buildXOrderUrl(SETTINGS.xUsername, SETTINGS.xUserId, message);
  };

  constructor() {
    inject(SeoService).update({
      title: SETTINGS.seoTitle,
      description: SETTINGS.seoDescription,
      image: this.products[0]?.images[0]?.url,
      siteName: SETTINGS.seoTitle,
    });
  }
}
