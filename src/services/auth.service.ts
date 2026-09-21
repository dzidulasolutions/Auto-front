import { ApiError } from "@/lib/api/errors";
import type { LoginResult } from "@/types/auth";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, json?.messages ?? ["Une erreur est survenue."]);
  }
  return json as T;
}

export interface LoginInput {
  identifier: string;
  password: string;
  mfaCode?: string;
}

export const login = (input: LoginInput) => post<LoginResult>("/api/auth/login", input);

export const forgotPassword = (email: string) =>
  post<{ ok: true }>("/api/auth/forgot-password", { email });

export const resetPassword = (input: { email: string; code: string; newPassword: string }) =>
  post<{ ok: true }>("/api/auth/reset-password", input);