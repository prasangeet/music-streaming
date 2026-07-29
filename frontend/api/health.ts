import axios from "axios";

import { BACKEND_ORIGIN } from "@/lib/api";

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const { status } = await axios.get(`${BACKEND_ORIGIN}/health`, {
      timeout: 6000,
    });

    return status >= 200 && status < 300;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};
