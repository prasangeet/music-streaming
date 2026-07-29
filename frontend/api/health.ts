import axios from "axios";

import { BACKEND_ORIGIN } from "@/lib/api";

export const checkBackendHealth = async (): Promise<boolean> => {
  const { status } = await axios.get<string>(`${BACKEND_ORIGIN}/health`, {
    timeout: 6000,
  });

  return status >= 200 && status < 300;
};
