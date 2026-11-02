import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Product } from '../../core/models';
import { SarPipe } from '../../core/utils/price';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-product-card',
  imports: [SarPipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <article class="group flex h-full flex-col" [attr.aria-labelledby]="'product-' + product()._id">
      <div
        class="relative aspect-[3/5] w-full overflow-hidden rounded-[1.25rem] bg-beige/50 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:rounded-[1.75rem]"
        (touchstart)="touchStart($event)"
        (touchend)="touchEnd($event)"
      >
      <button
        type="button"
        (click)="viewDetails.emit()"
        class="absolute inset-0 block size-full"
        [attr.aria-label]="i18n.t('collection.viewDetails') + ': ' + name()"
      >
        @for (img of product().images; track img.url; let i = $index) {
          <img
            [src]="img.url"
            [alt]="img.alt || name()"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-(--ease-soft) group-hover:scale-[1.04]"
            [class.opacity-0]="i !== active()"
            [attr.aria-hidden]="i !== active() ? 'true' : null"
          />
        } @empty {
          <span class="absolute inset-0 grid place-items-center text-rose/60"><app-icon name="image" class="size-10" /></span>
        }
      </button>

        <span class="pointer-events-none absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1.5 sm:inset-x-4 sm:top-4 sm:gap-2">
          @if (product().isNewArrival) {
            <span class="chip bg-ivory/95 text-rose-deep shadow-soft">{{ i18n.t('collection.newArrival') }}</span>
          }
          @if (product().isFeatured) {
            <span class="chip bg-rose-deep/90 text-white">
              <app-icon name="sparkle" class="size-3" />{{ i18n.t('collection.featuredBadge') }}
            </span>
          }
        </span>

        @if (count() > 1) {
          <!-- Switch between this product's photos without leaving the card -->
          <button
            type="button"
            (click)="step(-1)"
            class="absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-cocoa shadow-soft transition hover:bg-ivory ltr:left-2 rtl:right-2 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            [attr.aria-label]="i18n.t('product.previous')"
          >
            <app-icon name="chevron-left" class="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            (click)="step(1)"
            class="absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-cocoa shadow-soft transition hover:bg-ivory ltr:right-2 rtl:left-2 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            [attr.aria-label]="i18n.t('product.next')"
          >
            <app-icon name="chevron-right" class="size-4 rtl:rotate-180" />
          </button>
          <div class="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            @for (img of product().images; track img.url; let i = $index) {
              <button
                type="button"
                (click)="active.set(i)"
                class="h-1.5 rounded-full shadow-sm transition-all duration-300"
                [class]="i === active() ? 'w-5 bg-ivory' : 'w-1.5 bg-ivory/60'"
                [attr.aria-label]="i18n.t('product.image') + ' ' + (i + 1)"
                [attr.aria-current]="i === active() ? 'true' : null"
              ></button>
            }
          </div>
        }
      </div>

      <div class="flex flex-1 flex-col px-1 pt-4 sm:pt-5">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3 [id]="'product-' + product()._id" class="font-display text-base leading-snug text-cocoa sm:text-[1.3rem] rtl:font-arabic rtl:font-medium sm:rtl:text-lg">
            {{ name() }}
          </h3>
          <p class="shrink-0 text-sm font-medium text-rose-deep tabular-nums sm:pt-1 sm:text-[0.9375rem]">
            {{ product().price | sar: i18n.lang() }}
          </p>
        </div>
        @if (description()) {
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-cocoa-soft max-sm:hidden">{{ description() }}</p>
        }

        <div class="mt-auto flex items-center gap-2 pt-4 sm:pt-5">
          @if (orderUrl()) {
            <a
              [href]="orderUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-sm flex-1 max-sm:px-3 max-sm:text-xs"
              [class]="product().isAvailable ? 'btn-primary' : 'btn-outline'"
            >
              <app-icon name="x" class="size-4" />
              {{ product().isAvailable ? i18n.t('collection.order') : i18n.t('collection.askAvailability') }}
            </a>
          }
          <button type="button" (click)="viewDetails.emit()" class="btn-ghost btn-sm max-sm:hidden">
            {{ i18n.t('collection.viewDetails') }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  protected readonly i18n = inject(I18nService);
  readonly product = input.required<Product>();
  readonly orderUrl = input<string | null>(null);
  readonly viewDetails = output<void>();

  protected readonly name = computed(() => this.i18n.pick(this.product(), 'name'));
  protected readonly description = computed(() => this.i18n.pick(this.product(), 'description'));
  protected readonly count = computed(() => this.product().images.length);
  /** Index of the photo shown in the card; resets when the product changes. */
  protected readonly active = linkedSignal({ source: this.product, computation: () => 0 });
  private touchX: number | null = null;

  protected step(delta: number): void {
    const count = this.count();
    this.active.update((i) => (i + delta + count) % count);
  }

  protected touchStart(event: TouchEvent): void {
    this.touchX = event.changedTouches[0]?.clientX ?? null;
  }

  protected touchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX;
    if (this.touchX === null || endX === undefined || this.count() < 2) return;
    const dx = endX - this.touchX;
    this.touchX = null;
    if (Math.abs(dx) < 40) return;
    // Swiping toward the reading direction moves forward.
    this.step((dx < 0) !== this.i18n.isRtl() ? 1 : -1);
  }
}
