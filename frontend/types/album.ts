export interface AlbumResponse {
  id: number;
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string | null;
  releaseDate: string | null;
  trackCount: number | null;
  artworkUrl: string | null;
  userRating: number | null;
  userNotes: string | null;
  favourite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumRequest {
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre?: string;
  artworkUrl?: string;
  trackCount?: number;
  userRating?: number | null;
  userNotes?: string;
  favourite?: boolean;
}

export interface UpdateAlbumRequest {
  userRating: number | null;
  userNotes: string;
  favourite: boolean;
}

export interface AlbumFilterRequest {
  title?: string;
  artist?: string;
  genre?: string;
  favourite?: boolean;
  rating?: number;
}
