import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/proxy";
import type { ActivateResult, ClientLoginResponse } from "@/types/auth";
import { backendFetch } from "@/types/backend";
import { setClientSession } from "@/lib/session";

export async function POST(req: Request) {
  const { phone, email, password } = await req.json();
  const cleanPhone = String(phone).trim();

  try {
    await backendFetch("/client-portal/auth/activate", {
      method: "POST",
      body: { phone: cleanPhone, email: String(email).trim(), password },
    });
  } catch (e) {
    return errorResponse(e);
  }

  // Compte activé : connexion automatique (si elle échoue, le client se connectera à la main)
  try {
    const data = await backendFetch<ClientLoginResponse>("/client-portal/auth/login", {
      method: "POST",
      body: { phone: cleanPhone, password },
    });
    await setClientSession(data.accessToken, data.client);
    return NextResponse.json<ActivateResult>({ kind: "client", client: data.client });
  } catch {
    return NextResponse.json<ActivateResult>({ activated: true });
  }
}