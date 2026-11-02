import { DOCUMENT } from '@angular/common';
import { inject, Injectable, REQUEST, signal } from '@angular/core';

/** Bump to ask everyone to accept again after the terms change. */
const COOKIE = 'terms_accepted';
const VERSION = 'v1';
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Remembers whether the visitor accepted the terms. Stored in a cookie so the
 * server-rendered page already knows and returning visitors see no flash.
 */
@Injectable({ providedIn: 'root' })
export class TermsConsentService {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });

  readonly accepted = signal(this.read());

  accept(): void {
    this.document.cookie = `${COOKIE}=${VERSION}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    this.accepted.set(true);
  }

  private read(): boolean {
    let cookies = this.request?.headers.get('cookie') ?? '';
    if (!this.request) {
      try {
        cookies = this.document.cookie ?? '';
      } catch {
        cookies = '';
      }
    }
    return new RegExp(`(?:^|;\\s*)${COOKIE}=${VERSION}\\b`).test(cookies);
  }
}
