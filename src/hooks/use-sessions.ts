"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listSessions, revokeOtherSessions, revokeSession } from "@/services/sessions.service";

const sessionsKey = ["sessions"] as const;

export function useSessions() {
  return useQuery({ queryKey: sessionsKey, queryFn: listSessions });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionsKey }),
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionsKey }),
  });
}