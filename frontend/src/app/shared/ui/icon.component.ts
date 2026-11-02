import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Simplified line/solid icons, drawn on a 24px grid. */
const ICONS: Record<string, string> = {
  x:
    '<path fill="currentColor" d="M17.5 3h3l-6.6 7.6L21.7 21h-6.1l-4.8-6.2L5.3 21h-3l7.1-8.1L2 3h6.2l4.3 5.7L17.5 3Zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5Z"/>',
  close:
    '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="m6 6 12 12M18 6 6 18"/>',
  'chevron-left':
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="m14.5 5-7 7 7 7"/>',
  'chevron-right':
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="m9.5 5 7 7-7 7"/>',
  image:
    '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="9.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="m3.5 17 5-4.5 4 3.5 3-2.5 5 4"/>',
  link:
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  sparkle:
    '<path fill="currentColor" d="M12 3c.5 4.2 2.8 6.5 7 7-4.2.5-6.5 2.8-7 7-.5-4.2-2.8-6.5-7-7 4.2-.5 6.5-2.8 7-7Z"/>',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'inline-block shrink-0' },
  // innerHTML goes on a <span>: the server-side DOM cannot set it on <svg>.
  template: `<span class="block size-full" [innerHTML]="markup()"></span>`,
})
export class IconComponent {
  readonly name = input.required<string>();
  private readonly sanitizer = inject(DomSanitizer);
  // Icon markup is a static constant above, never user input.
  protected readonly markup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24" width="100%" height="100%" style="display:block">${ICONS[this.name()] ?? ICONS['link']}</svg>`,
    ),
  );
}
