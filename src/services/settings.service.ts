import { api } from "@/lib/api/client";
import type { Setting } from "@/types/settings";

export const listSettings = () => api<Setting[]>("/settings");

export const updateSetting = (key: string, value: number) =>
  api<Setting>(`/settings/${key}`, { method: "PATCH", body: { value } });