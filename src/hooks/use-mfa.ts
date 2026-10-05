"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableMfa, enableMfa, setupMfa } from "@/services/mfa.service";
import { meKeys } from "./use-me";

export function useSetupMfa() {
  return useMutation({ mutationFn: setupMfa });
}

export function useEnableMfa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => enableMfa(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKeys.me }),
  });
}

export function useDisableMfa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => disableMfa(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKeys.me }),
  });
}