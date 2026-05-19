import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PlayerInfo {
  kind: 'album' | 'playlist' | 'track';
  spotifyId: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly registry = new Map<HTMLIFrameElement, PlayerInfo>();
  private _playingIframe: HTMLIFrameElement | null = null;
  private _lastClickedIframe: HTMLIFrameElement | null = null;

  readonly nowPlaying$ = new BehaviorSubject<PlayerInfo | null>(null);

  constructor() {
    window.addEventListener('message', this.onMessage.bind(this));
  }

  register(iframe: HTMLIFrameElement, info: PlayerInfo): void {
    this.registry.set(iframe, info);
  }

  unregister(iframe: HTMLIFrameElement): void {
    this.registry.delete(iframe);
    if (this._playingIframe === iframe) {
      this._playingIframe = null;
      this.nowPlaying$.next(null);
    }
    if (this._lastClickedIframe === iframe) {
      this._lastClickedIframe = null;
    }
  }

  markClicked(iframe: HTMLIFrameElement): void {
    this._lastClickedIframe = iframe;
  }

  getPlayingIframe(): HTMLIFrameElement | null {
    // postMessage detection is preferred; fall back to last-clicked
    return this._playingIframe ?? this._lastClickedIframe;
  }

  private onMessage(event: MessageEvent): void {
    if (event.origin !== 'https://open.spotify.com') return;

    let data: any;
    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    if (data?.type !== 'playback_update') return;

    const iframe = [...this.registry.keys()].find(
      f => f.contentWindow === event.source,
    ) ?? null;

    if (!iframe) return;

    if (!data.payload?.isPaused) {
      this._playingIframe = iframe;
      this.nowPlaying$.next(this.registry.get(iframe) ?? null);
    } else if (this._playingIframe === iframe) {
      this._playingIframe = null;
      this.nowPlaying$.next(null);
    }
  }
}
