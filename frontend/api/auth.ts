import { api } from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

export const login = async (
  body: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    body
  );

  return data;
};

export const register = async (
  body: RegisterRequest
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>(
    "/auth/register",
    body
  );

  return data;
};
