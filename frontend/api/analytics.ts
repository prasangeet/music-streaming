import { api } from "@/lib/api";
import {
  ArtistAnalyticsResponse,
  GenreAnalyticsResponse,
  RatingAnalyticsResponse,
  ReleaseYearAnalyticsResponse,
} from "@/types";

export const getGenreAnalytics =
  async (): Promise<GenreAnalyticsResponse[]> => {
    const { data } =
      await api.get<GenreAnalyticsResponse[]>(
        "/analytics/genres"
      );

    return data;
  };

export const getArtistAnalytics =
  async (): Promise<ArtistAnalyticsResponse[]> => {
    const { data } =
      await api.get<ArtistAnalyticsResponse[]>(
        "/analytics/artists"
      );

    return data;
  };

export const getRatingAnalytics =
  async (): Promise<RatingAnalyticsResponse[]> => {
    const { data } =
      await api.get<RatingAnalyticsResponse[]>(
        "/analytics/ratings"
      );

    return data;
  };

export const getReleaseAnalytics =
  async (): Promise<ReleaseYearAnalyticsResponse[]> => {
    const { data } =
      await api.get<ReleaseYearAnalyticsResponse[]>(
        "/analytics/releases"
      );

    return data;
  };
