import { Injectable } from '@angular/core';
import { ar } from './ar';

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<typeof ar>;

/** Interface texts. The site is Arabic only; all texts live in ar.ts. */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Looks up a dotted key, e.g. t('collection.order'). */
  t(key: TranslationKey): string {
    let node: unknown = ar;
    for (const part of key.split('.')) {
      node = (node as Record<string, unknown> | undefined)?.[part];
    }
    return typeof node === 'string' ? node : key;
  }
}
