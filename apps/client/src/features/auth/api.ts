import { api } from "@/lib/api";
import type { AuthResponse, User } from "./types";

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function register(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", input);
  return data;
}

export async function getCurrentUser(): Promise<{ user: User }> {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data;
}
