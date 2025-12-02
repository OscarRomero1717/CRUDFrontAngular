import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'hexToUrl',   // <-- NOMBRE REAL DEL PIPE
  standalone: true
})
export class HexToUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, mimeType: string): SafeUrl | null {
    if (!value) return null;

    let hex = value.trim();

    if (hex.startsWith('0x')) {
      hex = hex.substring(2);
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }

    const blob = new Blob([bytes], { type: mimeType });

    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
