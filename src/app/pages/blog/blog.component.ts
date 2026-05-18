import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { carouselEntries, musicEntries } from '../../data/music-entries';
import { MusicEntry } from '../../models/music-entry.model';
import { FeaturedCarouselComponent } from '../../components/featured-carousel/featured-carousel.component';
import { SpotifyEmbedComponent } from '../../components/spotify-embed/spotify-embed.component';
import { siteConfig } from '../../site.config';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgFor, NgIf, FeaturedCarouselComponent, SpotifyEmbedComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  readonly site = siteConfig;
  readonly carousel = carouselEntries;
  readonly entries = musicEntries;

  hasDescription(entry: MusicEntry): boolean {
    return !!(entry.body?.trim() || entry.subtitle);
  }
}
