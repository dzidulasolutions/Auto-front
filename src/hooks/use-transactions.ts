"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelTransaction, listTransactions, type ListTransactionsParams } from "@/services/transactions.service";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (p: ListTransactionsParams) => ["transactions", "list", p] as const,
};

export function useTransactions(params: ListTransactionsParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => listTransactions(params),
    placeholderData: keepPreviousData,
  });
}



export function useCancelTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelTransaction(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });
}