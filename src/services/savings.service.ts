import { api, qs } from "@/lib/api/client";
import type { SavingsAccount } from "@/types/savings";
import { ApiError } from "@/lib/api/errors";
import type { Paginated } from "@/types/api";


export const createSavingsAccount = (clientId: string) =>
  api<SavingsAccount>("/savings/accounts", { method: "POST", body: { clientId } });

export const depositToSavings = (accountId: string, amount: number, idempotencyKey: string) =>
  api<SavingsAccount>(`/savings/accounts/${accountId}/deposit`, {
    method: "POST",
    body: { amount, idempotencyKey },
  });

export const withdrawFromSavings = (accountId: string, amount: number, idempotencyKey: string) =>
  api<SavingsAccount>(`/savings/accounts/${accountId}/withdraw`, {
    method: "POST",
    body: { amount, idempotencyKey },
  });


export const getSavingsAccountByClient = async (clientId: string): Promise<SavingsAccount | null> => {
  try {
    return await api<SavingsAccount>(`/savings/accounts/by-client/${clientId}`);
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) return null;
    throw e;
  }
};

export const listAllSavingsAccounts = (page = 1, limit = 20) =>
  api<Paginated<SavingsAccount & { client: { firstName: string; lastName: string; clientNumber: string } }>>(
    `/savings/accounts${qs({ page, limit })}`,
  );