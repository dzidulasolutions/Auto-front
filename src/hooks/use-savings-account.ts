"use client";

import { useQuery } from "@tanstack/react-query";
import { getSavingsAccountByClient, listAllSavingsAccounts } from "@/services/savings.service";

export const savingsKeys = {
  byClient: (clientId: string) => ["savings", clientId] as const,
};

export function useSavingsAccount(clientId: string) {
  return useQuery({
    queryKey: savingsKeys.byClient(clientId),
    queryFn: () => getSavingsAccountByClient(clientId),
  });
}

export function useAllSavingsAccounts(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["savings", "list", page, limit],
    queryFn: () => listAllSavingsAccounts(page, limit),
    placeholderData: (prev) => prev,
  });
}