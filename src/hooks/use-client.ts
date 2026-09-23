"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient, getProfileComplete } from "@/services/clients.service";

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", "detail", id],
    queryFn: () => getClient(id),
  });
}

export function useProfileComplete(id: string) {
  return useQuery({
    queryKey: ["clients", "profile-complete", id],
    queryFn: () => getProfileComplete(id),
  });
}