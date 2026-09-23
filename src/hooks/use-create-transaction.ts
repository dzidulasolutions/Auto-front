"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newIdempotencyKey } from "@/lib/idempotency";
import { createTransaction } from "@/services/transactions.service";
import { transactionKeys } from "./use-transactions";
import type { CreateTransactionInput } from "@/types/transaction";

type Input = Omit<CreateTransactionInput, "idempotencyKey">;

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  // conservée entre deux appels tant que la saisie n'a pas changé (voir resetKey)
  const keyRef = useRef<string>(newIdempotencyKey());

  const mutation = useMutation({
    mutationFn: (input: Input) => createTransaction({ ...input, idempotencyKey: keyRef.current }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      keyRef.current = newIdempotencyKey(); // succès : prochaine action = nouvelle clé
    },
  });

  // à appeler quand l'utilisateur modifie la saisie après un échec, avant de renvoyer
  const resetKey = () => {
    keyRef.current = newIdempotencyKey();
  };

  return { ...mutation, resetKey };
}