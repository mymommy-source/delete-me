import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Gently fades content in as it scrolls into view. Content is fully visible
 * in the server-rendered HTML; only elements still below the fold are hidden
 * once the browser takes over, so nothing flickers and crawlers see it all.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly revealDelay = input(0);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (
        typeof IntersectionObserver === 'undefined' ||
        matchMedia('(prefers-reduced-motion: reduce)').matches ||
        element.getBoundingClientRect().top < innerHeight
      ) {
        return;
      }

      element.classList.add('reveal-pending');
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          element.style.transitionDelay = `${this.revealDelay()}ms`;
          element.classList.add('reveal-in');
          element.classList.remove('reveal-pending');
          observer.disconnect();
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
