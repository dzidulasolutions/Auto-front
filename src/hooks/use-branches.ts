"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBranch,
  deactivateBranch,
  getBranch,
  getBranchStats,
  listBranches,
  reactivateBranch,
  updateBranch,
} from "@/services/branches.service";
import { PRIVILEGED_ROLES, type Role } from "@/types/auth";
import type { UpdateBranchInput } from "@/types/branch";

export function useBranches(role?: Role) {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => listBranches(),
    enabled: !!role && PRIVILEGED_ROLES.includes(role),
    staleTime: 5 * 60_000,
  });
}

export function useAllBranches() {
  return useQuery({
    queryKey: ["branches", "all"],
    queryFn: () => listBranches(true),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ["branches", "detail", id],
    queryFn: () => getBranch(id),
  });
}

export function useBranchStats(id: string) {
  return useQuery({
    queryKey: ["branches", "stats", id],
    queryFn: () => getBranchStats(id),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
}

export function useUpdateBranch(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBranchInput) => updateBranch(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "detail", id] });
    },
  });
}

export function useDeactivateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
}

export function useReactivateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reactivateBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branches"] }),
  });
}