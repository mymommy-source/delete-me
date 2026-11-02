import { Pipe, PipeTransform } from '@angular/core';
import type { Language } from '../models';

const formatters = new Map<string, Intl.NumberFormat>();

/** Formats integer halalas as SAR, dropping decimals for whole amounts. */
export function formatSar(halalas: number, lang: Language): string {
  const whole = halalas % 100 === 0;
  const key = `${lang}-${whole}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(halalas / 100);
}

/** Plain number used inside order messages, e.g. "485" or "189.50". */
export function plainSar(halalas: number): string {
  return halalas % 100 === 0 ? String(halalas / 100) : (halalas / 100).toFixed(2);
}


@Pipe({ name: 'sar' })
export class SarPipe implements PipeTransform {
  transform(halalas: number, lang: Language): string {
    return formatSar(halalas, lang);
  }
}
