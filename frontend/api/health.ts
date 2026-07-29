import axios from "axios";

import { BASE_API_URL } from "@/lib/api";

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const { status } = await axios.get("/public/ping", {
      baseURL: BASE_API_URL,
      timeout: 6000,
    });

    return status >= 200 && status < 300;
  } catch (error) {
    console.error("Backend ping failed:", error);
    return false;
  }
};
