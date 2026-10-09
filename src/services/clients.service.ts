import { api, qs } from "@/lib/api/client";
import type { Paginated } from "@/types/api";
import type { Client, ClientSearchResult, CreateClientInput, UpdateClientInput } from "@/types/client";
export const getClient = (id: string) => api<Client>(`/clients/${id}`);

export interface ListClientsParams {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}


export const listClients = (p: ListClientsParams = {}) =>
  api<Paginated<Client>>(
    `/clients${qs({ page: p.page, limit: p.limit, includeInactive: p.includeInactive ? "true" : undefined })}`,
  );

export const reactivateClient = (id: string) =>
  api<Client>(`/clients/${id}/reactivate`, { method: "PATCH" });


export const searchClients = (q: string) =>
  api<ClientSearchResult[]>(`/clients/search${qs({ q })}`);


export const createClient = (input: CreateClientInput) =>
  api<Client>("/clients", { method: "POST", body: input });


export const getProfileComplete = async (id: string): Promise<boolean> => {
  const res = await api<boolean | { complete: boolean }>(`/clients/${id}/profile-complete`);
  return typeof res === "boolean" ? res : res.complete;
};

export const deleteClient = (id: string) => api<void>(`/clients/${id}`, { method: "DELETE" });


export const updateClient = (id: string, input: UpdateClientInput) =>
  api<Client>(`/clients/${id}`, { method: "PATCH", body: input });