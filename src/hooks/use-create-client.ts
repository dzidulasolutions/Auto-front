"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientKeys } from "./use-clients";
import { createClient } from "@/services/clients.service";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}