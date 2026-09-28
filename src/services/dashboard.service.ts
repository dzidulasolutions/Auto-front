import { api, qs } from "@/lib/api/client";
import type { BranchSummaryDay, DailyCollection, LoanAtRisk } from "@/types/dashboard";

export const getBranchSummary = (branchId?: string) =>
  api<BranchSummaryDay[]>(`/dashboard/branch-summary${qs({ branchId })}`);

export const getPortfolioAtRisk = () => api<LoanAtRisk[]>("/dashboard/portfolio-at-risk");

export const getMyDailyCollections = () =>
  api<DailyCollection[]>("/dashboard/my-daily-collections");