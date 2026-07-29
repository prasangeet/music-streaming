import { api } from "@/lib/api";
import {
  AlbumResponse,
  ItunesAlbumDto,
} from "@/types";

export const searchAlbums = async (
  term: string
): Promise<ItunesAlbumDto[]> => {
  const { data } = await api.get<ItunesAlbumDto[]>(
    "/itunes/search",
    {
      params: {
        term,
      },
    }
  );

  return data;
};

export const getItunesAlbum = async (
  collectionId: number
): Promise<ItunesAlbumDto[]> => {
  const { data } = await api.get<ItunesAlbumDto[]>(
    `/itunes/albums/${collectionId}`
  );

  return data;
};

export const saveAlbum = async (
  collectionId: number
): Promise<AlbumResponse> => {
  const { data } = await api.post<AlbumResponse>(
    `/itunes/albums/${collectionId}/save`
  );

  return data;
};
