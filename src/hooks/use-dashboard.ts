"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBranchSummary,
  getMyDailyCollections,
  getPortfolioAtRisk,
} from "@/services/dashboard.service";

export function useBranchSummary(branchId?: string) {
  return useQuery({
    queryKey: ["dashboard", "branch-summary", branchId],
    queryFn: () => getBranchSummary(branchId),
    enabled: branchId !== undefined, // pour un Manager, laisser undefined marche aussi (agence auto côté backend)
  });
}

export function usePortfolioAtRisk() {
  return useQuery({
    queryKey: ["dashboard", "portfolio-at-risk"],
    queryFn: getPortfolioAtRisk,
  });
}

export function useMyDailyCollections() {
  return useQuery({
    queryKey: ["dashboard", "my-daily-collections"],
    queryFn: getMyDailyCollections,
  });
}