import { NextResponse, type NextRequest } from "next/server";
import { SESSION_KEYS as K } from "@/config/session-keys";
import { homeForRole, isRole, ROUTES } from "@/config/routes";

const AREAS = ["/admin", "/manager", "/agent", "/caissier", "/comptable", "/client"];
const SKIP_IF_LOGGED = ["/", ROUTES.login];

// Retourne l'espace de l'utilisateur connecté, ou null
function homeOf(req: NextRequest): string | null {
  const kind = req.cookies.get(K.kind)?.value;

  if (kind === "client") {
    return req.cookies.has(K.access) ? ROUTES.client : null;
  }
  if (kind === "staff") {
    const role = req.cookies.get(K.role)?.value;
    // le refresh token maintient la session même si l'access token a expiré
    return req.cookies.has(K.refresh) && isRole(role) ? homeForRole(role) : null;
  }
  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const home = homeOf(req);
  const go = (path: string) => NextResponse.redirect(new URL(path, req.url));

  const area = AREAS.find((a) => pathname === a || pathname.startsWith(`${a}/`));

  if (area) {
    if (!home) return go(ROUTES.login);
    if (area !== home) return go(home);
    return NextResponse.next();
  }

  if (home && SKIP_IF_LOGGED.includes(pathname)) return go(home);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};