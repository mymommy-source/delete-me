import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Product } from '../../core/models';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ProductCardComponent } from './product-card.component';
import { ProductDialogComponent } from './product-dialog.component';

@Component({
  selector: 'app-collection-section',
  imports: [ProductCardComponent, ProductDialogComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="collection" [attr.aria-label]="i18n.t('collection.title')" class="pt-6 pb-10 sm:pt-8 sm:pb-14">
      <div class="container-page">
        @if (products().length) {
          <ul class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7 sm:gap-y-14 lg:grid-cols-3">
            @for (product of products(); track product.id; let i = $index) {
              <li appReveal [revealDelay]="(i % 3) * 90">
                <app-product-card
                  [product]="product"
                  [orderUrl]="orderUrl()(product)"
                  (viewDetails)="selected.set(product)"
                />
              </li>
            }
          </ul>
        } @else {
          <p class="text-center text-cocoa-soft">{{ i18n.t('collection.empty') }}</p>
        }
      </div>
    </section>

    @if (selected(); as product) {
      <app-product-dialog [product]="product" [orderUrl]="orderUrl()(product)" (closed)="selected.set(null)" />
    }
  `,
})
export class CollectionSectionComponent {
  protected readonly i18n = inject(I18nService);
  readonly products = input<Product[]>([]);
  /** Builds the X DM order link for a product. */
  readonly orderUrl = input<(product: Product) => string | null>(() => null);

  protected readonly selected = signal<Product | null>(null);
}
