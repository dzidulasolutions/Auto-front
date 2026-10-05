import { api } from "@/lib/api/client";

export const sendEmailVerification = () =>
  api<{ message: string }>("/auth/send-verification", { method: "POST" });

export const verifyEmail = (code: string) =>
  api<{ message: string }>("/auth/verify-email", { method: "POST", body: { code } });

export const sendPhoneVerification = () =>
  api<{ message: string }>("/auth/send-phone-verification", { method: "POST" });

export const verifyPhone = (code: string) =>
  api<{ message: string }>("/auth/verify-phone", { method: "POST", body: { code } });