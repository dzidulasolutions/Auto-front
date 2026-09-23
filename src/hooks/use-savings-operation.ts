"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newIdempotencyKey } from "@/lib/idempotency";
import { depositToSavings, withdrawFromSavings } from "@/services/savings.service";
import { savingsKeys } from "./use-savings-account";
import { transactionKeys } from "./use-transactions";

export function useSavingsOperation(clientId: string, accountId: string, kind: "deposit" | "withdraw") {
  const queryClient = useQueryClient();
  const keyRef = useRef<string>(newIdempotencyKey());
  const fn = kind === "deposit" ? depositToSavings : withdrawFromSavings;

  const mutation = useMutation({
    mutationFn: (amount: number) => fn(accountId, amount, keyRef.current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsKeys.byClient(clientId) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      keyRef.current = newIdempotencyKey();
    },
  });

  const resetKey = () => {
    keyRef.current = newIdempotencyKey();
  };

  return { ...mutation, resetKey };
}