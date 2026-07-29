import { api } from "@/lib/api";
import { CurrentUserResponse } from "@/types";

export const getCurrentUser =
  async (): Promise<CurrentUserResponse> => {
    const { data } =
      await api.get<CurrentUserResponse>(
        "/users/me"
      );

    return data;
  };
