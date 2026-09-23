"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listClients, searchClients } from "@/services/clients.service";

export const SEARCH_MIN_CHARS = 2;

export const clientKeys = {
  all: ["clients"] as const,
  list: (page: number, limit: number) => ["clients", "list", page, limit] as const,
  search: (q: string) => ["clients", "search", q] as const,
};

export function useClients(page: number, limit = 20) {
  return useQuery({
    queryKey: clientKeys.list(page, limit),
    queryFn: () => listClients({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

export function useClientSearch(q: string) {
  return useQuery({
    queryKey: clientKeys.search(q),
    queryFn: () => searchClients(q),
    enabled: q.length >= SEARCH_MIN_CHARS,
    placeholderData: keepPreviousData,
  });
}

