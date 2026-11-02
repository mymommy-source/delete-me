import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { OrnamentComponent } from '../../shared/ui/ornament.component';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, OrnamentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="grid min-h-svh place-items-center bg-blush px-6 text-center">
      <div>
        <app-ornament variant="sprig" class="mx-auto h-32 w-24" />
        <p class="mt-6 font-display text-7xl text-rose">404</p>
        <a routerLink="/" class="btn-primary mt-10">{{ i18n.t('nav.home') }}</a>
      </div>
    </main>
  `,
})
export class NotFoundPage {
  protected readonly i18n = inject(I18nService);

  constructor() {
    inject(Title).setTitle('404');
  }
}
