"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listSettings, updateSetting } from "@/services/settings.service";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: listSettings,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: number }) => updateSetting(key, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}