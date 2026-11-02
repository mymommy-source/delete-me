import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, REQUEST, signal } from '@angular/core';
import type { Language } from '../models';
import { ar } from './ar';
import { en, type Dictionary } from './en';

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<Dictionary>;

const dictionaries: Record<Language, Dictionary> = { ar, en };

const isLanguage = (value: unknown): value is Language => value === 'ar' || value === 'en';

/**
 * Holds the active language. The choice is stored in a cookie (not
 * localStorage) so server-side rendering can render the right language and
 * direction on the first response.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });

  private readonly explicitChoice = this.readCookie();
  private readonly current = signal<Language>(this.explicitChoice ?? 'ar');

  readonly lang = this.current.asReadonly();
  readonly dir = computed(() => (this.current() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.current() === 'ar');
  readonly dictionary = computed(() => dictionaries[this.current()]);

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.lang = this.current();
      root.dir = this.dir();
    });
  }

  /** Looks up a dotted key and fills `{name}` placeholders. */
  t(key: TranslationKey, params?: Record<string, string | number>): string {
    let node: unknown = this.dictionary();
    for (const part of key.split('.')) {
      node = (node as Record<string, unknown> | undefined)?.[part];
    }
    let text = typeof node === 'string' ? node : key;
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  }

  /** Picks the `<field>Ar` / `<field>En` variant of a bilingual record, falling back to the other language. */
  pick<T extends object>(record: T | null | undefined, field: string): string {
    if (!record) return '';
    const values = record as Record<string, unknown>;
    const [primary, secondary] = this.current() === 'ar' ? ['Ar', 'En'] : ['En', 'Ar'];
    const value = values[field + primary] || values[field + secondary];
    return typeof value === 'string' ? value : '';
  }

  /** Applies the site's default language unless the visitor already chose one. */
  applyDefault(lang: Language): void {
    if (!this.explicitChoice && isLanguage(lang)) this.current.set(lang);
  }

  private readCookie(): Language | null {
    const header = this.request?.headers.get('cookie') ?? this.safeDocumentCookie();
    const match = header.match(/(?:^|;\s*)lang=(ar|en)\b/);
    return match && isLanguage(match[1]) ? match[1] : null;
  }

  private safeDocumentCookie(): string {
    try {
      return this.document.cookie ?? '';
    } catch {
      return '';
    }
  }
}
