"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSavingsAccount } from "@/services/savings.service";
import { savingsKeys } from "./use-savings-account";

export function useCreateSavingsAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavingsAccount,
    onSuccess: (_, clientId) => {
      queryClient.invalidateQueries({ queryKey: savingsKeys.byClient(clientId) });
    },
  });
}