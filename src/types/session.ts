import "server-only";
import { cookies } from "next/headers";
import type { SessionKind, StaffUser } from "@/types/auth";

const KEYS = {
  access: "autogo_at",
  refresh: "autogo_rt",
  sessionId: "autogo_sid",
  kind: "autogo_kind",
} as const;

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function secondsLeft(jwt: string, fallback: number): number {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
    const left = Number(payload.exp) - Math.floor(Date.now() / 1000);
    return left > 0 ? left : fallback;
  } catch {
    return fallback;
  }
}

export async function setStaffSession(t: {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}) {
  const jar = await cookies();
  jar.set(KEYS.access, t.accessToken, { ...baseOptions, maxAge: secondsLeft(t.accessToken, 900) });
  jar.set(KEYS.refresh, t.refreshToken, { ...baseOptions, maxAge: secondsLeft(t.refreshToken, 60 * 60 * 24 * 7) });
  jar.set(KEYS.sessionId, t.sessionId, { ...baseOptions, maxAge: 60 * 60 * 24 * 7 });
  jar.set(KEYS.kind, "staff", { ...baseOptions, maxAge: 60 * 60 * 24 * 7 });
}

export async function setClientSession(accessToken: string) {
  const jar = await cookies();
  jar.set(KEYS.access, accessToken, { ...baseOptions, maxAge: secondsLeft(accessToken, 3600) });
  jar.set(KEYS.kind, "client", { ...baseOptions, maxAge: 3600 });
}

export async function getSession() {
  const jar = await cookies();
  return {
    accessToken: jar.get(KEYS.access)?.value ?? null,
    refreshToken: jar.get(KEYS.refresh)?.value ?? null,
    sessionId: jar.get(KEYS.sessionId)?.value ?? null,
    kind: (jar.get(KEYS.kind)?.value as SessionKind | undefined) ?? null,
  };
}

export async function clearSession() {
  const jar = await cookies();
  Object.values(KEYS).forEach((k) => jar.delete(k));
}