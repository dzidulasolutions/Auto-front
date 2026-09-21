import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { backendFetch } from "@/types/backend";

export function errorResponse(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ messages: e.messages }, { status: e.statusCode });
  }
  return NextResponse.json({ messages: ["Une erreur est survenue."] }, { status: 500 });
}

export async function proxyPost(path: string, body: unknown) {
  try {
    await backendFetch(path, { method: "POST", body });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}