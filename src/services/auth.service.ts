import type { LoginResult } from "@/types/auth";
import { ApiError } from "@/types/errors";

export interface LoginInput {
  identifier: string;
  password: string;
  mfaCode?: string;
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, json?.messages ?? ["Une erreur est survenue."]);
  }
  return json as LoginResult;
}