import { api } from "@/lib/api";
import {
  AlbumFilterRequest,
  AlbumResponse,
  CreateAlbumRequest,
  Page,
  UpdateAlbumRequest,
} from "@/types";

export interface GetAlbumsParams {
  filter?: AlbumFilterRequest;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export const getAlbums = async (
  params?: GetAlbumsParams
): Promise<Page<AlbumResponse>> => {
  const { data } = await api.get<Page<AlbumResponse>>("/albums", {
    params,
  });

  return data;
};

export const getAlbumById = async (
  albumId: number
): Promise<AlbumResponse> => {
  const { data } = await api.get<AlbumResponse>(
    `/albums/${albumId}`
  );

  return data;
};

export const createAlbum = async (
  body: CreateAlbumRequest
): Promise<AlbumResponse> => {
  const { data } = await api.post<AlbumResponse>(
    "/albums",
    body
  );

  return data;
};

export const updateAlbum = async (
  albumId: number,
  body: UpdateAlbumRequest
): Promise<AlbumResponse> => {
  const { data } = await api.put<AlbumResponse>(
    `/albums/${albumId}`,
    body
  );

  return data;
};

export const deleteAlbum = async (
  albumId: number
): Promise<void> => {
  await api.delete(`/albums/${albumId}`);
};
