import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Product } from '../../core/models';
import { SarPipe } from '../../core/utils/price';
import { IconComponent } from '../../shared/ui/icon.component';
import { OrnamentComponent } from '../../shared/ui/ornament.component';

@Component({
  selector: 'app-product-dialog',
  imports: [SarPipe, IconComponent, OrnamentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="m-auto max-h-[100svh] w-full max-w-none overflow-hidden bg-transparent p-0 sm:max-h-[92svh] sm:max-w-4xl sm:px-4"
      [attr.aria-labelledby]="'dialog-title-' + product()._id"
      (cancel)="$event.preventDefault(); close()"
      (click)="onBackdrop($event)"
      animate.enter="dialog-enter"
      animate.leave="dialog-leave"
    >
      <div class="relative grid max-h-[100svh] overflow-y-auto bg-ivory shadow-lift sm:max-h-[92svh] sm:rounded-[2rem] md:grid-cols-2">
        <button
          type="button"
          (click)="close()"
          class="absolute top-4 z-10 grid size-11 place-items-center rounded-full bg-ivory/90 text-cocoa shadow-soft transition hover:bg-blush ltr:right-4 rtl:left-4"
          [attr.aria-label]="i18n.t('product.close')"
        >
          <app-icon name="close" class="size-5" />
        </button>

        <!-- Images -->
        <div class="bg-blush/60 p-4 sm:p-6">
          <div class="relative aspect-[3/5] max-h-[70svh] w-full overflow-hidden rounded-[1.5rem] bg-beige md:max-h-none">
            @if (activeImage(); as img) {
              @for (current of [img]; track current.url) {
                <img
                  [src]="current.url"
                  [alt]="current.alt || name()"
                  class="absolute inset-0 size-full object-contain"
                  animate.enter="fade-enter"
                />
              }
            }
          </div>
          @if (product().images.length > 1) {
            <ul class="mt-4 flex gap-3 overflow-x-auto pb-1">
              @for (img of product().images; track img.url; let i = $index) {
                <li class="shrink-0">
                  <button
                    type="button"
                    (click)="active.set(i)"
                    class="relative block size-16 overflow-hidden rounded-xl ring-offset-2 ring-offset-blush transition sm:size-20"
                    [class]="active() === i ? 'ring-2 ring-rose' : 'opacity-70 hover:opacity-100'"
                    [attr.aria-label]="i18n.t('product.image') + ' ' + (i + 1)"
                    [attr.aria-pressed]="active() === i"
                  >
                    <img [src]="img.url" alt="" loading="lazy" class="absolute inset-0 size-full object-cover" />
                  </button>
                </li>
              }
            </ul>
          }
        </div>

        <!-- Details -->
        <div class="flex flex-col p-7 sm:p-10">
          <div class="flex flex-wrap gap-2">
            @if (product().isNewArrival) {
              <span class="chip bg-blush text-rose-deep">{{ i18n.t('collection.newArrival') }}</span>
            }
            @if (product().isFeatured) {
              <span class="chip bg-rose-deep text-white"><app-icon name="sparkle" class="size-3" />{{ i18n.t('collection.featuredBadge') }}</span>
            }
          </div>
          <h2 [id]="'dialog-title-' + product()._id" class="heading-display mt-5 text-3xl leading-tight sm:text-4xl">{{ name() }}</h2>
          <p class="mt-4 text-2xl text-rose-deep tabular-nums">{{ product().price | sar: i18n.lang() }}</p>

          <p class="mt-4 flex items-center gap-2 text-sm">
            <span class="size-2 rounded-full" [class]="product().isAvailable ? 'bg-emerald-600/70' : 'bg-rose'"></span>
            <span class="sr-only">{{ i18n.t('product.availability') }}:</span>
            {{ product().isAvailable ? i18n.t('collection.inStock') : i18n.t('collection.soldOut') }}
          </p>

          <app-ornament variant="divider" class="my-7 h-4 w-32" />

          @if (description()) {
            <h3 class="sr-only">{{ i18n.t('product.description') }}</h3>
            <p class="leading-loose whitespace-pre-line text-cocoa-soft">{{ description() }}</p>
          }

          <div class="mt-auto pt-10">
            @if (orderUrl()) {
              <a [href]="orderUrl()" target="_blank" rel="noopener noreferrer" class="w-full" [class]="product().isAvailable ? 'btn-primary' : 'btn-outline'">
                <app-icon name="x" class="size-[1.125rem]" />
                {{ product().isAvailable ? i18n.t('collection.order') : i18n.t('collection.askAvailability') }}
              </a>
            }
            <p class="mt-4 text-center text-xs text-cocoa-soft">{{ i18n.t('product.orderNote') }}</p>
          </div>
        </div>
      </div>
    </dialog>
  `,
})
export class ProductDialogComponent {
  protected readonly i18n = inject(I18nService);
  readonly product = input.required<Product>();
  readonly orderUrl = input<string | null>(null);
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly active = signal(0);
  protected readonly activeImage = computed(() => this.product().images[this.active()] ?? null);
  protected readonly name = computed(() => this.i18n.pick(this.product(), 'name'));
  protected readonly description = computed(() => this.i18n.pick(this.product(), 'description'));
  private returnFocus: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.returnFocus = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      this.dialog().nativeElement.showModal();
    });
  }

  protected close(): void {
    document.body.style.overflow = '';
    this.returnFocus?.focus({ preventScroll: true });
    this.closed.emit();
  }

  protected onBackdrop(event: MouseEvent): void {
    // Clicks on the dialog element itself (not its content) hit the backdrop.
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
