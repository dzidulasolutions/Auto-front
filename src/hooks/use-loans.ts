"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveLoan,
  createLoan,
  disburseLoan,
  getLoan,
  listLoans,
  rejectLoan,
  repayLoan,
  submitLoan,
  type ListLoansParams,
} from "@/services/loans.service";
import type { CreateLoanInput, Loan } from "@/types/loan";

export const loanKeys = {
  all: ["loans"] as const,
  list: (p: ListLoansParams) => ["loans", "list", p] as const,
  detail: (id: string) => ["loans", "detail", id] as const,
};

export function useLoansByClient(clientId: string) {
  return useQuery({
    queryKey: loanKeys.list({ clientId }),
    queryFn: () => listLoans({ clientId }),
  });
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: loanKeys.detail(id),
    queryFn: () => getLoan(id),
  });
}

// Écrit le nouveau statut du prêt directement dans le cache, sans attendre le
// prochain fetch — c'est ce qui fait disparaître les boutons d'action immédiatement.
function useLoanStatusMutation<T = void>(
  mutationFn: (id: string, arg: T) => Promise<Loan>,
  clientId: string,
  loanId?: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, arg }: { id: string; arg: T }) => mutationFn(id, arg),
    onSuccess: (updatedLoan) => {
      if (loanId) {
        queryClient.setQueryData(loanKeys.detail(loanId), (old: unknown) =>
          old ? { ...(old as object), ...updatedLoan } : updatedLoan,
        );
      }
      queryClient.invalidateQueries({ queryKey: loanKeys.list({ clientId }) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useCreateLoan(clientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLoanInput) => createLoan(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: loanKeys.list({ clientId }) }),
  });
}

export function useSubmitLoan(clientId: string, loanId: string) {
  return useLoanStatusMutation<void>((id) => submitLoan(id), clientId, loanId);
}

export function useApproveLoan(clientId: string, loanId: string) {
  return useLoanStatusMutation<void>((id) => approveLoan(id), clientId, loanId);
}

export function useRejectLoan(clientId: string, loanId: string) {
  return useLoanStatusMutation<string>((id, reason) => rejectLoan(id, reason), clientId, loanId);
}

export function useDisburseLoan(clientId: string, loanId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => disburseLoan(loanId),
    onSuccess: (result) => {
      // Le décaissement ne renvoie pas l'échéancier : on met à jour le statut
      // immédiatement avec ce qu'on a, puis on redemande le détail complet
      // pour obtenir les vraies échéances.
      queryClient.setQueryData(loanKeys.detail(loanId), (old: unknown) =>
        old ? { ...(old as object), ...result.loan } : result.loan,
      );
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(loanId) });
      queryClient.invalidateQueries({ queryKey: loanKeys.list({ clientId }) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useRepayLoan(clientId: string, loanId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => repayLoan(loanId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(loanId) });
      queryClient.invalidateQueries({ queryKey: loanKeys.list({ clientId }) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}