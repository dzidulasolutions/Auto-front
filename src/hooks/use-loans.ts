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
import type { CreateLoanInput } from "@/types/loan";

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

function useLoanAction<T = void>(
  mutationFn: (id: string, arg: T) => Promise<unknown>,
  clientId: string,
  loanId?: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, arg }: { id: string; arg: T }) => mutationFn(id, arg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.list({ clientId }) });
      if (loanId) queryClient.invalidateQueries({ queryKey: loanKeys.detail(loanId) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // décaissement/remboursement = transaction
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

export function useSubmitLoan(clientId: string) {
  return useLoanAction<void>((id) => submitLoan(id), clientId);
}

export function useApproveLoan(clientId: string) {
  return useLoanAction<void>((id) => approveLoan(id), clientId);
}

export function useRejectLoan(clientId: string) {
  return useLoanAction<string>((id, reason) => rejectLoan(id, reason), clientId);
}

export function useDisburseLoan(clientId: string, loanId: string) {
  return useLoanAction<void>((id) => disburseLoan(id), clientId, loanId);
}

export function useRepayLoan(clientId: string, loanId: string) {
  return useLoanAction<number>((id, amount) => repayLoan(id, amount), clientId, loanId);
}