"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/services/clients.service";
import { clientKeys } from "./use-clients";
import type { UpdateClientInput } from "@/types/client";

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateClientInput) => updateClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: ["clients", "detail", id] });
    },
  });
}