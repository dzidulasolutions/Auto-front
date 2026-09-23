"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient, getProfileComplete } from "@/services/clients.service";

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

export function useProfileComplete(id: string) {
  return useQuery({
    queryKey: clientDetailKeys.profileComplete(id),
    queryFn: () => getProfileComplete(id),
  });
}