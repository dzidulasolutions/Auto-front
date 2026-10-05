import { api } from "@/lib/api/client";

export const setupMfa = () => api<{ qrCodeDataUrl: string; secret: string }>("/auth/mfa/setup", { method: "POST" });

export const enableMfa = (code: string) =>
  api<{ message: string }>("/auth/mfa/enable", { method: "POST", body: { code } });

export const disableMfa = (code: string) =>
  api<{ message: string }>("/auth/mfa/disable", { method: "POST", body: { code } });