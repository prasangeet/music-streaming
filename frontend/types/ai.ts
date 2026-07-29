export interface AlbumInsightsResponse {
  summary: string;
  moods: string[];
  themes: string[];
  recommendedFor: string[];
  similarArtists: string[];
}
