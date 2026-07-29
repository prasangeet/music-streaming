import { api } from "@/lib/api";
import { AlbumInsightsResponse } from "@/types";

export const getAlbumInsights = async (
  albumId: number
): Promise<AlbumInsightsResponse> => {
  const { data } =
    await api.get<AlbumInsightsResponse>(
      `/ai/albums/${albumId}/insights`
    );

  return data;
};

export const refreshAlbumInsights = async (
  albumId: number
): Promise<AlbumInsightsResponse> => {
  const { data } =
    await api.post<AlbumInsightsResponse>(
      `/ai/albums/${albumId}/insights/refresh`
    );

  return data;
};
