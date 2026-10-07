import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ApiError } from "@/lib/api/errors";
import { errorResponse } from "@/lib/api/proxy";

const BASE_URL = process.env.BACKEND_URL;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session.accessToken) throw new ApiError(401, ["Session expirée. Reconnectez-vous."]);

    const res = await fetch(`${BASE_URL}/loans/${id}/passbook-pdf`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) throw new ApiError(res.status, ["Impossible de générer l'échéancier."]);

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="echeancier.pdf"`,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}