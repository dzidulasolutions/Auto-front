import "server-only";
import type { ApiResponse } from "@/types/api";
import { ApiError, normalizeMessages } from "./errors";

const BASE_URL = process.env.BACKEND_URL;

interface Options {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

export async function backendFetch<T>(path: string, opts: Options = {}): Promise<T> {
  if (!BASE_URL) throw new Error("BACKEND_URL manquant");

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(503, ["Serveur injoignable. Réessayez."]);
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!json || !json.success) {
    const status = json && !json.success ? json.error.statusCode : res.status;
    const msgs = json && !json.success ? normalizeMessages(json.error.message) : [];
    throw new ApiError(status, msgs.length ? msgs : ["Une erreur est survenue."]);
  }

  return json.data;
}