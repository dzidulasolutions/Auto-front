import { ApiError } from "./errors";
import { ROUTES } from "@/config/routes";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface Options {
  method?: Method;
  body?: unknown;
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const hasBody = opts.body !== undefined;

  const res = await fetch(`/api/backend${path}`, {
    method: opts.method ?? "GET",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(opts.body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // Session expirée et non renouvelable : retour à la connexion
    if (res.status === 401) window.location.assign(ROUTES.login);
    throw new ApiError(res.status, json?.messages ?? ["Une erreur est survenue."]);
  }
  return json as T;
}

// Construit "?a=1&b=2" en ignorant les valeurs vides
export function qs(params: Record<string, string | number | null | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}