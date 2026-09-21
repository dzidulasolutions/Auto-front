import "server-only";
import { cookies } from "next/headers";
import { SESSION_KEYS as K } from "@/config/session-keys";
import type { ClientProfile, SessionKind, SessionUser, StaffTokens } from "@/types/auth";

const WEEK = 60 * 60 * 24 * 7;

const base = {
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

const encodeUser = (u: SessionUser) => Buffer.from(JSON.stringify(u)).toString("base64url");

function decodeUser(v?: string): SessionUser | null {
  if (!v) return null;
  try {
    return JSON.parse(Buffer.from(v, "base64url").toString()) as SessionUser;
  } catch {
    return null;
  }
}

export async function setStaffSession(t: StaffTokens) {
  const jar = await cookies();
  jar.set(K.access, t.accessToken, { ...base, maxAge: secondsLeft(t.accessToken, 900) });
  jar.set(K.refresh, t.refreshToken, { ...base, maxAge: secondsLeft(t.refreshToken, WEEK) });
  jar.set(K.sessionId, t.sessionId, { ...base, maxAge: WEEK });
  jar.set(K.kind, "staff", { ...base, maxAge: WEEK });
  jar.set(K.role, t.user.role, { ...base, maxAge: WEEK });
  jar.set(
    K.user,
    encodeUser({ firstName: t.user.firstName, lastName: t.user.lastName, label: t.user.role }),
    { ...base, maxAge: WEEK },
  );
}

export async function setClientSession(accessToken: string, client: ClientProfile) {
  const jar = await cookies();
  // évite un mélange avec une ancienne session staff
  [K.refresh, K.sessionId, K.role].forEach((k) => jar.delete(k));

  const maxAge = secondsLeft(accessToken, 3600);
  jar.set(K.access, accessToken, { ...base, maxAge });
  jar.set(K.kind, "client", { ...base, maxAge });
  jar.set(
    K.user,
    encodeUser({ firstName: client.firstName, lastName: client.lastName, label: client.clientNumber }),
    { ...base, maxAge },
  );
}

export async function getSession() {
  const jar = await cookies();
  return {
    accessToken: jar.get(K.access)?.value ?? null,
    refreshToken: jar.get(K.refresh)?.value ?? null,
    sessionId: jar.get(K.sessionId)?.value ?? null,
    kind: (jar.get(K.kind)?.value as SessionKind | undefined) ?? null,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return decodeUser(jar.get(K.user)?.value);
}

export async function clearSession() {
  const jar = await cookies();
  Object.values(K).forEach((k) => jar.delete(k));
}