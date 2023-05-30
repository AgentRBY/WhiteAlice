export interface MusicIdentifyModel {
  status: string;
  result: Result;
}

export interface Result {
  artist: string;
  title: string;
  album: string;
  release_date: Date;
  label: string;
  timecode: string;
  song_link: string;
  spotify: Spotify;
}

export interface Spotify {
  album: Album;
  external_ids: ExternalIDS;
  popularity: number;
  is_playable: null;
  linked_from: null;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  uri: string;
}

export interface Album {
  name: string;
  artists: Artist[];
  album_group: string;
  album_type: string;
  id: string;
  uri: string;
  available_markets: string[];
  href: string;
  images: Image[];
  external_urls: ExternalUrls;
  release_date: Date;
  release_date_precision: string;
}

export interface Artist {
  name: string;
  id: string;
  uri: string;
  href: string;
  external_urls: ExternalUrls;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface ExternalIDS {
  isrc: string;
}
