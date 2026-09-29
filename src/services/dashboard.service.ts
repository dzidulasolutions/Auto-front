import { api, qs } from "@/lib/api/client";
import type { Report, RequestReportInput } from "@/types/dashboard";
import type { BranchSummaryDay, DailyCollection, LoanAtRisk } from "@/types/dashboard";

export const getBranchSummary = (branchId?: string) =>
  api<BranchSummaryDay[]>(`/dashboard/branch-summary${qs({ branchId })}`);

export const getPortfolioAtRisk = () => api<LoanAtRisk[]>("/dashboard/portfolio-at-risk");

export const getMyDailyCollections = () =>
  api<DailyCollection[]>("/dashboard/my-daily-collections");


export const requestMonthlyReport = (input: RequestReportInput) =>
  api<Report>("/dashboard/reports/monthly", { method: "POST", body: input });

export const getReportStatus = (id: string) => api<Report>(`/dashboard/reports/${id}`);