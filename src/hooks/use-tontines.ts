"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeTontineCycle,
  createTontineCycle,
  getTontineCollections,
  listTontinesByClient,
  validateCollection,
  listAllTontines
} from "@/services/tontines.service";
import type { CreateTontineInput } from "@/types/tontine";

export const tontineKeys = {
  byClient: (clientId: string) => ["tontines", "client", clientId] as const,
  collections: (cycleId: string) => ["tontines", "collections", cycleId] as const,
};

export function useTontinesByClient(clientId: string) {
  return useQuery({
    queryKey: tontineKeys.byClient(clientId),
    queryFn: () => listTontinesByClient(clientId),
  });
}

export function useTontineCollections(cycleId: string) {
  return useQuery({
    queryKey: tontineKeys.collections(cycleId),
    queryFn: () => getTontineCollections(cycleId),
  });
}

export function useCreateTontine(clientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTontineInput) => createTontineCycle(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tontineKeys.byClient(clientId) });
    },
  });
}

export function useValidateCollection(cycleId: string, clientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collectionId: string) => validateCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tontineKeys.collections(cycleId) });
      queryClient.invalidateQueries({ queryKey: tontineKeys.byClient(clientId) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // une collecte crée une transaction
    },
  });
}

export function useCloseTontine(cycleId: string, clientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => closeTontineCycle(cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tontineKeys.collections(cycleId) });
      queryClient.invalidateQueries({ queryKey: tontineKeys.byClient(clientId) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // la restitution aussi
    },
  });
}


export function useAllTontines(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["tontines", "list", status, page, limit],
    queryFn: () => listAllTontines(page, limit, status),
    placeholderData: (prev) => prev,
  });
}