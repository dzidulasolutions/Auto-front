"use client";

import { useQuery } from "@tanstack/react-query";
import { listBranches } from "@/services/branches.service";
import { PRIVILEGED_ROLES, type Role } from "@/types/auth";

export function useBranches(role?: Role) {
  return useQuery({
    queryKey: ["branches"],
    queryFn: listBranches,
    enabled: !!role && PRIVILEGED_ROLES.includes(role),
    staleTime: 5 * 60_000,
  });
}