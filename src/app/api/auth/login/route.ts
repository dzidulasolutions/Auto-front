import { NextResponse } from "next/server";
import type { ClientLoginResponse, LoginResult, StaffLoginResponse } from "@/types/auth";
import { backendFetch } from "@/types/backend";
import { ApiError } from "@/types/errors";
import { setClientSession, setStaffSession } from "@/types/session";

export async function POST(req: Request) {
  const { identifier, password, mfaCode } = await req.json();

  try {
    // "@" → staff, sinon → client
    if (String(identifier).includes("@")) {
      const data = await backendFetch<StaffLoginResponse>("/auth/login", {
        method: "POST",
        body: { email: identifier, password, ...(mfaCode ? { mfaCode } : {}) },
      });

      if ("mfaRequired" in data) {
        return NextResponse.json<LoginResult>({ mfaRequired: true });
      }

      await setStaffSession(data);
      return NextResponse.json<LoginResult>({ kind: "staff", user: data.user });
    }

    const data = await backendFetch<ClientLoginResponse>("/client-portal/auth/login", {
      method: "POST",
      body: { phone: String(identifier).trim(), password },
    });

    await setClientSession(data.accessToken);
    return NextResponse.json<LoginResult>({ kind: "client", client: data.client });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ messages: e.messages }, { status: e.statusCode });
    }
    return NextResponse.json({ messages: ["Une erreur est survenue."] }, { status: 500 });
  }
}