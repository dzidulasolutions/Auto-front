"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listClients } from "@/services/clients.service";

export const clientKeys = {
  all: ["clients"] as const,
  list: (page: number, limit: number) => ["clients", "list", page, limit] as const,
};

export function useClients(page: number, limit = 20) {
  return useQuery({
    queryKey: clientKeys.list(page, limit),
    queryFn: () => listClients({ page, limit }),
    placeholderData: keepPreviousData,
  });
}