import { api } from "@/lib/api/client";
import type { Session } from "@/types/auth";

export const listSessions = () => api<Session[]>("/auth/sessions");

export const revokeSession = (id: string) =>
  api<{ message: string }>(`/auth/sessions/${id}`, { method: "DELETE" });

export const revokeOtherSessions = () =>
  api<{ message: string }>("/auth/sessions", { method: "DELETE" });