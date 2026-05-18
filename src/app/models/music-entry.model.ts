export type SpotifyEmbedType = 'album' | 'playlist' | 'track';

export interface MusicEntry {
  spotifyId: string;
  kind: SpotifyEmbedType;
  title: string;
  subtitle?: string;
  body?: string;
  featured?: boolean;
}
