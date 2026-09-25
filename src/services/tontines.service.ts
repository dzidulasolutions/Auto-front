import { api } from "@/lib/api/client";
import { newIdempotencyKey } from "@/lib/idempotency";
import type {
  CreateTontineInput,
  TontineCollectionsResponse,
  TontineCycle,
} from "@/types/tontine";

export const listTontinesByClient = (clientId: string) =>
  api<TontineCycle[]>(`/tontines/cycles/by-client/${clientId}`);

export const createTontineCycle = (input: CreateTontineInput) =>
  api<{ cycle: TontineCycle; totalCollectionsGenerated: number }>("/tontines/cycles", {
    method: "POST",
    body: input,
  });

export const getTontineCollections = (cycleId: string) =>
  api<TontineCollectionsResponse>(`/tontines/cycles/${cycleId}/collections`);

export const validateCollection = (collectionId: string) =>
  api(`/tontines/collections/${collectionId}/validate`, {
    method: "PATCH",
    body: { idempotencyKey: newIdempotencyKey() },
  });

export const closeTontineCycle = (cycleId: string) =>
  api<TontineCycle>(`/tontines/cycles/${cycleId}/close`, {
    method: "PATCH",
    body: { idempotencyKey: newIdempotencyKey() },
  });