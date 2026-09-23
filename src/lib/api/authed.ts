import "server-only";
import { ApiError } from "./errors";
import { clearSession, getSession, setStaffSession } from "@/lib/session";
import type { StaffTokens } from "@/types/auth";
import { backendFetch , type Options} from "@/types/backend";

// Le refresh token est à usage unique : on évite qu'une rafale de requêtes
// parallèles le consomme plusieurs fois.
const inflight = new Map<string, Promise<StaffTokens>>();

export function refreshStaff(refreshToken: string): Promise<StaffTokens> {
  const running = inflight.get(refreshToken);
  if (running) return running;

  const promise = backendFetch<StaffTokens>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
  inflight.set(refreshToken, promise);
  setTimeout(() => inflight.delete(refreshToken), 10_000);
  return promise;
}

const expired = () => new ApiError(401, ["Session expirée. Reconnectez-vous."]);

// À utiliser uniquement dans des route handlers (les cookies n'y sont modifiables).
async function renew(refreshToken: string): Promise<string> {
  try {
    const tokens = await refreshStaff(refreshToken);
    await setStaffSession(tokens);
    return tokens.accessToken;
  } catch {
    await clearSession();
    throw expired();
  }
}

export async function authedFetch<T>(
  path: string,
  opts: Omit<Options, "token"> = {},
): Promise<T> {
  const session = await getSession();
  if (!session.kind) throw expired();

  const canRefresh = session.kind === "staff" && !!session.refreshToken;
  let token = session.accessToken;

  if (!token && canRefresh) token = await renew(session.refreshToken!);
  if (!token) throw expired();

  try {
    return await backendFetch<T>(path, { ...opts, token });
  } catch (e) {
  if (e instanceof ApiError && e.statusCode === 401 && canRefresh) {
    const fresh = await renew(session.refreshToken!);
    return backendFetch<T>(path, { ...opts, token: fresh });
  }
  throw e;
}
}