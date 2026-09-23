"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listTransactions, type ListTransactionsParams } from "@/services/transactions.service";

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