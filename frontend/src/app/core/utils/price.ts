import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('ar-SA-u-nu-latn', {
  style: 'currency',
  currency: 'SAR',
  maximumFractionDigits: 2,
});

/** Plain number used inside order messages, e.g. "500" or "189.50". */
export function plainSar(sar: number): string {
  return Number.isInteger(sar) ? String(sar) : sar.toFixed(2);
}

/** Formats a price in Saudi Riyals, e.g. "500 ر.س.". */
@Pipe({ name: 'sar' })
export class SarPipe implements PipeTransform {
  transform(sar: number): string {
    return formatter.format(sar);
  }
}
