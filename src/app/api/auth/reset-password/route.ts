import { proxyPost } from "@/lib/api/proxy";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();
  return proxyPost("/auth/reset-password", { email, code, newPassword });
}