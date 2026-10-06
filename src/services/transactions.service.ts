import { api, qs } from "@/lib/api/client";
import type { Paginated } from "@/types/api";
import type { CreateTransactionInput, Transaction, TransactionType } from "@/types/transaction";

export interface ListTransactionsParams {
  clientId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export const listTransactions = (p: ListTransactionsParams = {}) =>
  api<Paginated<Transaction>>(
    `/transactions${qs({
      clientId: p.clientId,
      type: p.type,
      fromDate: p.fromDate,
      toDate: p.toDate,
      page: p.page,
      limit: p.limit,
    })}`,
  );

export const createTransaction = (input: CreateTransactionInput) =>
  api<Transaction>("/transactions", { method: "POST", body: input });

export const cancelTransaction = (id: string, reason: string) =>
  api<Transaction>(`/transactions/${id}/cancel`, { method: "PATCH", body: { reason } });

