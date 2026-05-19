import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MusicEntry } from '../../models/music-entry.model';
import { SpotifyEmbedComponent } from '../spotify-embed/spotify-embed.component';

@Component({
  selector: 'app-featured-carousel',
  standalone: true,
  imports: [NgFor, NgIf, SpotifyEmbedComponent],
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.css'],
})
export class FeaturedCarouselComponent {
  @Input({ required: true }) slides: MusicEntry[] = [];

  activeIndex = 0;

  prev(): void {
    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  goTo(index: number): void {
    this.activeIndex = index;
  }

  onSlideClick(i: number): void {
    if (i !== this.activeIndex) this.goTo(i);
  }

  getOffset(i: number): number {
    const n = this.slides.length;
    let d = i - this.activeIndex;
    if (d > Math.floor(n / 2)) d -= n;
    if (d < -Math.floor(n / 2)) d += n;
    return d;
  }

  getPositionClass(i: number): string {
    const d = this.getOffset(i);
    if (d === 0)  return 'carousel-slide pos-center';
    if (d === 1)  return 'carousel-slide pos-right-1';
    if (d === -1) return 'carousel-slide pos-left-1';
    if (d === 2)  return 'carousel-slide pos-right-2';
    if (d === -2) return 'carousel-slide pos-left-2';
    return 'carousel-slide pos-hidden';
  }

  embedHeight(): number {
    return 480;
  }
}
