import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { errorResponse } from "@/lib/api/proxy";
import { ApiError } from "@/lib/api/errors";

const BASE_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.accessToken) throw new ApiError(401, ["Session expirée. Reconnectez-vous."]);

    const formData = await req.formData();

    const res = await fetch(`${BASE_URL}/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: formData,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      const msg = json && !json.success ? json.error.message : ["Envoi impossible."];
      throw new ApiError(res.status, Array.isArray(msg) ? msg : [msg]);
    }

    return NextResponse.json(json.data);
  } catch (e) {
    return errorResponse(e);
  }
}