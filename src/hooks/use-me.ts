"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMyContact, updateMyProfile } from "@/services/profile.service";
import type { UpdateContactInput, UpdateProfileInput } from "@/services/profile.service";

export const meKeys = { me: ["me"] as const };

export function useMe() {
  return useQuery({ queryKey: meKeys.me, queryFn: getMe });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile(input),
    onSuccess: (data) => queryClient.setQueryData(meKeys.me, data),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContactInput) => updateMyContact(input),
    onSuccess: (data) => queryClient.setQueryData(meKeys.me, data),
  });
}