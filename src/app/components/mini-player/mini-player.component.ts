import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [],
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.css'],
})
export class MiniPlayerComponent {
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;

  visible = false;

  private placeholder: HTMLElement | null = null;
  private activeIframe: HTMLIFrameElement | null = null;

  take(iframe: HTMLIFrameElement): void {
    // Insert a placeholder so we know where to return the iframe
    const ph = document.createElement('span');
    ph.setAttribute('data-mini-placeholder', '');
    iframe.parentNode!.insertBefore(ph, iframe);
    this.placeholder = ph;

    // Atomic DOM move — keeps the iframe alive and audio playing
    this.containerRef.nativeElement.appendChild(iframe);
    this.activeIframe = iframe;
    this.visible = true;
  }

  return(): void {
    if (!this.activeIframe || !this.placeholder) return;

    const ph = this.placeholder;
    ph.parentNode!.insertBefore(this.activeIframe, ph);
    ph.remove();

    this.placeholder = null;
    this.activeIframe = null;
    this.visible = false;
  }

  isHolding(): boolean {
    return this.activeIframe !== null;
  }
}
