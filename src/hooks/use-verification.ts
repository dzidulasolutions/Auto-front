"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendEmailVerification,
  sendPhoneVerification,
  verifyEmail,
  verifyPhone,
} from "@/services/verification.service";
import { meKeys } from "./use-me";

export function useSendEmailVerification() {
  return useMutation({ mutationFn: sendEmailVerification });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => verifyEmail(code),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.me });
      await queryClient.invalidateQueries({ queryKey: meKeys.me });
    },
  });
}

export function useSendPhoneVerification() {
  return useMutation({ mutationFn: sendPhoneVerification });
}

export function useVerifyPhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => verifyPhone(code),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.me });
      await queryClient.invalidateQueries({ queryKey: meKeys.me });
    },
  });
}