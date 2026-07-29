export interface AlbumInsightsResponse {
  summary: string;
  moods: string[];
  themes: string[];
  recommendedFor: string[];
  similarArtists: string[];
}

export interface LibraryInsightsResponse {
  summary: string;
  dominantGenres: string[];
  listeningPersonality: string[];
  trendHighlights: string[];
  recommendations: string[];
  discoverySuggestions: string[];
}
