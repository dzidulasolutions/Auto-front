"use client";

import { useQuery } from "@tanstack/react-query";
import { getSavingsAccountByClient } from "@/services/savings.service";

export const savingsKeys = {
  byClient: (clientId: string) => ["savings", clientId] as const,
};

export function useSavingsAccount(clientId: string) {
  return useQuery({
    queryKey: savingsKeys.byClient(clientId),
    queryFn: () => getSavingsAccountByClient(clientId),
  });
}