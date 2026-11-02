import { DOCUMENT } from '@angular/common';
import { HTTP_TRANSFER_CACHE_ORIGIN_MAP, HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken, type Provider, REQUEST } from '@angular/core';

/**
 * Absolute API URL used during server-side rendering, where relative URLs
 * cannot be resolved. Only provided in the server config; null in the browser.
 * Must end with `/api` so it maps 1:1 onto the browser's `<origin>/api`.
 */
export const SERVER_API_URL = new InjectionToken<string | null>('SERVER_API_URL', {
  factory: () => null,
});

/** Base path of the API as seen by the browser. */
export const API_PREFIX = '/api';

/**
 * Resolves `/api/...` to an absolute URL: the internal API on the server, the
 * page origin in the browser. Combined with the origin map below, both sides
 * produce the same HTTP transfer-cache keys, so SSR data is reused on hydration.
 */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(`${API_PREFIX}/`)) return next(req);
  const base = inject(SERVER_API_URL) ?? `${inject(DOCUMENT).location.origin}${API_PREFIX}`;
  return next(req.clone({ url: base + req.url.slice(API_PREFIX.length) }));
};

/** Server-only: tells the transfer cache that the internal API origin equals the public one. */
export function provideServerApi(apiUrl: string): Provider[] {
  return [
    { provide: SERVER_API_URL, useValue: apiUrl },
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useFactory: () => {
        const request = inject(REQUEST, { optional: true });
        return request ? { [new URL(apiUrl).origin]: new URL(request.url).origin } : {};
      },
    },
  ];
}
