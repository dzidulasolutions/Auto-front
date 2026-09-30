import { api, qs } from "@/lib/api/client";
import type { Branch, BranchStats, CreateBranchInput, UpdateBranchInput } from "@/types/branch";

export const listBranches = (includeInactive = false) =>
  api<Branch[]>(`/branches${qs({ includeInactive: includeInactive ? "true" : undefined })}`);

export const getBranch = (id: string) => api<Branch>(`/branches/${id}`);

export const createBranch = (input: CreateBranchInput) =>
  api<Branch>("/branches", { method: "POST", body: input });

export const updateBranch = (id: string, input: UpdateBranchInput) =>
  api<Branch>(`/branches/${id}`, { method: "PATCH", body: input });

export const deactivateBranch = (id: string) =>
  api<Branch>(`/branches/${id}`, { method: "DELETE" });

export const reactivateBranch = (id: string) =>
  api<Branch>(`/branches/${id}/reactivate`, { method: "PATCH" });

export const getBranchStats = (id: string) => api<BranchStats>(`/branches/${id}/stats`);