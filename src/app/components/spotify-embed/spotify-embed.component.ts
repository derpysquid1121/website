import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-spotify-embed',
  standalone: true,
  imports: [NgIf],
  templateUrl: './spotify-embed.component.html',
  styleUrls: ['./spotify-embed.component.css'],
})
export class SpotifyEmbedComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() kind: 'album' | 'playlist' | 'track' = 'playlist';
  @Input() spotifyId = '';
  @Input() height = 380;
  @Input() compact = false;
  @Input() title = 'Spotify player';

  @ViewChild('iframeEl') iframeEl?: ElementRef<HTMLIFrameElement>;

  safeUrl?: SafeResourceUrl;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly playerService: PlayerService,
  ) {}

  ngOnChanges(): void {
    const url = `https://open.spotify.com/embed/${this.kind}/${this.spotifyId}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  @HostListener('click')
  onClicked(): void {
    const el = this.iframeEl?.nativeElement;
    if (el) this.playerService.markClicked(el);
  }

  ngAfterViewInit(): void {
    const el = this.iframeEl?.nativeElement;
    if (el) {
      this.playerService.register(el, {
        kind: this.kind,
        spotifyId: this.spotifyId,
        title: this.title,
      });
    }
  }

  ngOnDestroy(): void {
    const el = this.iframeEl?.nativeElement;
    if (el) {
      this.playerService.unregister(el);
    }
  }
}
