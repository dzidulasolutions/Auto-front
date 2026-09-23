"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "@/services/clients.service";
import { clientKeys } from "./use-clients";

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}