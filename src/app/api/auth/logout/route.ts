import { NextResponse } from "next/server";
import { refreshStaff } from "@/lib/api/authed";
import { clearSession, getSession } from "@/lib/session";
import { backendFetch } from "@/types/backend";

export async function POST() {
  const s = await getSession();
  try {
    if (s.kind === "staff" && s.refreshToken) {
      let access = s.accessToken;
      let refresh = s.refreshToken;
      if (!access) {
        const t = await refreshStaff(refresh);
        access = t.accessToken;
        refresh = t.refreshToken;
      }
      await backendFetch("/auth/logout", {
        method: "POST",
        token: access,
        body: { refreshToken: refresh },
      });
    }
  } catch {
    // on déconnecte localement quoi qu'il arrive
  } finally {
    await clearSession();
  }
  return NextResponse.json({ ok: true });
}