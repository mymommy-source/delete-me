import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { Language } from '../models';

export interface SeoData {
  title: string;
  description: string;
  image?: string | null;
  lang: Language;
  siteName: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update({ title, description, image, lang, siteName }: SeoData): void {
    const url = this.canonicalUrl();
    this.title.setTitle(title);

    const tags: Record<string, string> = {
      description,
      'og:type': 'website',
      'og:title': title,
      'og:description': description,
      'og:site_name': siteName,
      'og:locale': lang === 'ar' ? 'ar_SA' : 'en_US',
      'og:url': url,
      'twitter:card': image ? 'summary_large_image' : 'summary',
      'twitter:title': title,
      'twitter:description': description,
    };
    if (image) {
      tags['og:image'] = new URL(image, this.document.location.origin).toString();
      tags['twitter:image'] = tags['og:image'];
    }

    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    this.setCanonical(url);
  }

  private canonicalUrl(): string {
    const { origin, pathname } = this.document.location;
    return `${origin}${pathname}`;
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
