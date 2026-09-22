import { api } from "@/lib/api/client";
import type { Branch } from "@/types/branch";

export const listBranches = () => api<Branch[]>("/branches");