import axios, { AxiosError } from "axios";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export const BACKEND_ORIGIN = new URL("/", BASE_API_URL).origin;

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    console.error("Axios Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);

      const { message, error: errorMessage } =
        error.response.data ?? {};

      if (message || errorMessage) {
        error.message =
          message ??
          errorMessage ??
          error.message;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      error.message = "Unable to connect to the server.";
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);
