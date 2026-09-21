import { NextResponse, type NextRequest } from "next/server";
import { authedFetch } from "@/lib/api/authed";
import { errorResponse } from "@/lib/api/proxy";

type Ctx = { params: Promise<{ path: string[] }> };

const BLOCKED = ["auth", "client-portal/auth", "uploads"];

async function forward(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const target = path.join("/");

  const unsafe = path.some((s) => s === ".." || s === ".");
  const blocked = BLOCKED.some((b) => target === b || target.startsWith(`${b}/`));
  if (unsafe || blocked) {
    return NextResponse.json({ messages: ["Route non autorisée."] }, { status: 403 });
  }

  const method = req.method as "GET" | "POST" | "PATCH" | "DELETE";
  const hasBody = method === "POST" || method === "PATCH";
  const body = hasBody ? await req.json().catch(() => undefined) : undefined;

  try {
    const data = await authedFetch(`/${target}${req.nextUrl.search}`, { method, body });
    return NextResponse.json(strip(data) ?? null);
  } catch (e) {
    return errorResponse(e);
  }
}

const SECRET_KEYS = new Set(["password", "passwordHash", "resetPasswordToken", "resetPasswordExpiresAt"]);

function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !SECRET_KEYS.has(k))
        .map(([k, v]) => [k, strip(v)]),
    );
  }
  return value;
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;