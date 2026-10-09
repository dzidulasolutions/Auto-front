"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClient, getProfileComplete, listClients, reactivateClient } from "@/services/clients.service";
import { clientKeys } from "./use-clients";

export const clientDetailKeys = {
  detail: (id: string) => ["clients", "detail", id] as const,
  profileComplete: (id: string) => ["clients", "profile-complete", id] as const,
};

export function useClient(id: string) {
  return useQuery({
    queryKey: clientDetailKeys.detail(id),
    queryFn: () => getClient(id),
  });
}

export function useClients(page: number, limit = 20, includeInactive = false) {
  return useQuery({
    queryKey: clientKeys.list(page, limit, includeInactive),
    queryFn: () => listClients({ page, limit, includeInactive }),
    placeholderData: keepPreviousData,
  });
}

export function useProfileComplete(id: string) {
  return useQuery({
    queryKey: clientDetailKeys.profileComplete(id),
    queryFn: () => getProfileComplete(id),
  });
}

export function useReactivateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reactivateClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}