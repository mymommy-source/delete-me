import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type OrnamentVariant = 'sprig' | 'divider';

/** Fine-line botanical accents drawn in dusty rose. Purely decorative. */
@Component({
  selector: 'app-ornament',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'pointer-events-none block text-rose' },
  template: `
    @switch (variant()) {
      @case ('sprig') {
        <svg viewBox="0 0 120 160" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" class="h-full w-full">
          <path d="M60 156C60 118 58 82 64 48c3-15 8-28 14-40" />
          <path d="M61 128c-14-4-24-14-28-28 14 2 25 12 28 28Z" fill="currentColor" fill-opacity=".12" />
          <path d="M61 104c13-5 22-15 24-29-13 3-22 14-24 29Z" fill="currentColor" fill-opacity=".12" />
          <path d="M62 80c-12-5-19-15-20-28 12 3 19 13 20 28Z" fill="currentColor" fill-opacity=".12" />
          <path d="M65 58c11-6 17-16 17-28-11 4-17 14-17 28Z" fill="currentColor" fill-opacity=".12" />
          <circle cx="78" cy="8" r="3" fill="currentColor" fill-opacity=".35" stroke="none" />
          <circle cx="86" cy="20" r="2" fill="currentColor" fill-opacity=".3" stroke="none" />
        </svg>
      }
      @default {
        <svg viewBox="0 0 160 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" class="h-full w-full">
          <path d="M2 8h56M102 8h56" stroke-opacity=".6" />
          <path d="M80 2c3 3 3 9 0 12-3-3-3-9 0-12Z" fill="currentColor" fill-opacity=".25" />
          <path d="M66 8c4-3 8-3 10 0-2 3-6 3-10 0ZM94 8c-4-3-8-3-10 0 2 3 6 3 10 0Z" fill="currentColor" fill-opacity=".2" />
        </svg>
      }
    }
  `,
})
export class OrnamentComponent {
  readonly variant = input<OrnamentVariant>('divider');
}
