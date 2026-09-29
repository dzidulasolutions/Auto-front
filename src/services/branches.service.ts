import { api } from "@/lib/api/client";
import type { Branch, CreateBranchInput, UpdateBranchInput } from "@/types/branch";

export const listBranches = () => api<Branch[]>("/branches");

export const getBranch = (id: string) => api<Branch>(`/branches/${id}`);

export const createBranch = (input: CreateBranchInput) =>
  api<Branch>("/branches", { method: "POST", body: input });

export const updateBranch = (id: string, input: UpdateBranchInput) =>
  api<Branch>(`/branches/${id}`, { method: "PATCH", body: input });

export const deactivateBranch = (id: string) =>
  api<Branch>(`/branches/${id}`, { method: "DELETE" });