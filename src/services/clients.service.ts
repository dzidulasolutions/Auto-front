import { api, qs } from "@/lib/api/client";
import type { Paginated } from "@/types/api";
import type { Client , ClientSearchResult, CreateClientInput} from "@/types/client";

export interface ListClientsParams {
  page?: number;
  limit?: number;
}

export const listClients = (p: ListClientsParams = {}) =>
  api<Paginated<Client>>(`/clients${qs({ page: p.page, limit: p.limit })}`);


export const searchClients = (q: string) =>
  api<ClientSearchResult[]>(`/clients/search${qs({ q })}`);


export const createClient = (input: CreateClientInput) =>
  api<Client>("/clients", { method: "POST", body: input });