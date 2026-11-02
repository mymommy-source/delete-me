import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

/** Full-screen age confirmation shown before the site can be used. */
@Component({
  selector: 'app-terms-gate',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-blush/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-statement"
      animate.leave="fade-leave"
    >
      <div class="my-auto w-full max-w-lg rounded-[2rem] border border-ivory bg-ivory px-6 py-10 text-center shadow-lift sm:px-10 sm:py-12">
        <img [ngSrc]="logoUrl()" alt="" width="96" height="96" class="mx-auto size-24 rounded-full border-4 border-blush object-cover" />

        <p id="terms-statement" class="mt-8 text-3xl leading-snug font-semibold text-cocoa sm:text-4xl">
          {{ i18n.t('terms.statement') }}
        </p>

        @if (declined()) {
          <p class="mt-6 rounded-2xl bg-blush px-4 py-3 text-base text-rose-deep" role="alert">{{ i18n.t('terms.declined') }}</p>
        }

        <div class="mt-10 flex flex-col gap-3 sm:flex-row-reverse">
          <button type="button" class="btn-primary min-h-14 flex-1 text-base" (click)="accepted.emit()">
            {{ i18n.t('terms.accept') }}
          </button>
          <button type="button" class="btn-outline min-h-14 flex-1 text-base" (click)="declined.set(true)">
            {{ i18n.t('terms.decline') }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TermsGateComponent {
  protected readonly i18n = inject(I18nService);
  readonly logoUrl = input('/logo.jpg');
  readonly accepted = output<void>();

  protected readonly declined = signal(false);
}
