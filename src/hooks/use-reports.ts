"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getReportStatus, requestMonthlyReport } from "@/services/dashboard.service";
import type { RequestReportInput } from "@/types/dashboard";

export function useRequestReport() {
  return useMutation({
    mutationFn: (input: RequestReportInput) => requestMonthlyReport(input),
  });
}

// Interroge le statut toutes les 3s tant que le rapport n'est pas prêt (génération async)
export function useReportStatus(reportId: string | null) {
  return useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReportStatus(reportId!),
    enabled: !!reportId,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status === "PENDING" ? 3000 : false;
    },
  });
}