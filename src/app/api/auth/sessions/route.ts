import { NextResponse } from "next/server";
import { authedFetch } from "@/lib/api/authed";
import { errorResponse } from "@/lib/api/proxy";

export async function GET() {
  try {
    return NextResponse.json(await authedFetch("/auth/sessions"));
  } catch (e) {
    return errorResponse(e);
  }
}