"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deactivateUser,
  getUser,
  listRoles,
  listUsers,
  updateUser,
} from "@/services/users.service";
import type { CreateUserInput, UpdateUserInput } from "@/types/user";

const usersKey = ["users"] as const;

export function useUsers() {
  return useQuery({ queryKey: usersKey, queryFn: listUsers });
}

export function useUser(id: string) {
  return useQuery({ queryKey: ["users", "detail", id], queryFn: () => getUser(id) });
}

export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: listRoles, staleTime: 10 * 60_000 });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKey });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", id] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  });
}