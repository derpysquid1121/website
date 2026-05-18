import { NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-spotify-embed',
  standalone: true,
  imports: [NgIf],
  templateUrl: './spotify-embed.component.html',
  styleUrls: ['./spotify-embed.component.css'],
})
export class SpotifyEmbedComponent implements OnChanges {
  @Input() kind: 'album' | 'playlist' | 'track' = 'playlist';
  @Input() spotifyId = '';
  @Input() height = 380;
  @Input() compact = false;
  @Input() title = 'Spotify player';

  safeUrl?: SafeResourceUrl;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const url = `https://open.spotify.com/embed/${this.kind}/${this.spotifyId}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
