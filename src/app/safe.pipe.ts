import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

/**
 * Sanitize user-generated content to prevent XSS vulnerabilities.
 */
@Pipe({
  name: 'safe',
  standalone: true, // Make it standalone
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null, type: 'html' | 'style' | 'script' | 'url' | 'resourceUrl'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl | null {
    if (!value) {
      return null; // Return null for null or undefined input
    }

    switch (type) {
      case 'html':
        const sanitizedHtml = DOMPurify.sanitize(value);
        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        console.warn('Using bypassSecurityTrustScript can lead to XSS vulnerabilities. Use with caution.');
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        // Fallback to sanitizing HTML if the type is unknown
        const fallbackSanitizedHtml = DOMPurify.sanitize(value);
        return this.sanitizer.bypassSecurityTrustHtml(fallbackSanitizedHtml);
    }
  }
}
