import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TermsConsentService } from '../../core/consent/terms-consent.service';
import { SiteContentStore } from '../../core/content/site-content.store';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Product } from '../../core/models';
import { SeoService } from '../../core/seo/seo.service';
import { CollectionSectionComponent } from '../products/collection-section.component';
import { TermsGateComponent } from './components/terms-gate.component';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, CollectionSectionComponent, TermsGateComponent],
  providers: [SiteContentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-svh bg-ivory" [attr.inert]="consent.accepted() ? null : ''" [attr.aria-hidden]="consent.accepted() ? null : 'true'">
      <header class="flex justify-center bg-blush pt-12 pb-10 sm:pt-16 sm:pb-12">
        <img
          [ngSrc]="logoUrl()"
          alt=""
          width="176"
          height="176"
          priority
          class="size-36 rounded-full border-4 border-ivory object-cover shadow-lift sm:size-44"
        />
      </header>
      <app-collection-section [products]="store.products()" [orderUrl]="orderUrl" />
    </main>
    @if (!consent.accepted()) {
      <app-terms-gate [logoUrl]="logoUrl()" (accepted)="consent.accept()" />
    }
  `,
})
export class HomePage {
  protected readonly store = inject(SiteContentStore);
  protected readonly consent = inject(TermsConsentService);
  private readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  protected readonly logoUrl = () => this.store.settings()?.logoUrl || '/logo.jpg';
  protected readonly orderUrl = (product: Product) => this.store.productOrderUrl(product);

  constructor() {
    effect(() => {
      const settings = this.store.settings();
      const title = settings?.seoTitle || this.i18n.t('collection.title');
      this.seo.update({
        title,
        description: settings?.seoDescription || this.i18n.t('collection.subtitle'),
        image: this.store.products()[0]?.images[0]?.url,
        lang: this.i18n.lang(),
        siteName: title,
      });
    });
  }
}
