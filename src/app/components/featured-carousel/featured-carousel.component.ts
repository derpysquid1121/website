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

  get activeSlide(): MusicEntry {
    return this.slides[this.activeIndex];
  }

  prev(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  goTo(index: number): void {
    this.activeIndex = index;
  }

  embedHeight(slide: MusicEntry): number {
    return slide.kind === 'album' ? 480 : 430;
  }
}
