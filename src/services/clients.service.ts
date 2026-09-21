import { api, qs } from "@/lib/api/client";
import type { Paginated } from "@/types/api";
import type { Client } from "@/types/client";

export interface ListClientsParams {
  page?: number;
  limit?: number;
}

export const listClients = (p: ListClientsParams = {}) =>
  api<Paginated<Client>>(`/clients${qs({ page: p.page, limit: p.limit })}`);