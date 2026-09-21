import { proxyPost } from "@/lib/api/proxy";

export async function POST(req: Request) {
  const { email } = await req.json();
  return proxyPost("/auth/forgot-password", { email });
}