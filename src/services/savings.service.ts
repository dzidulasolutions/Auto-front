import { api } from "@/lib/api/client";
import type { SavingsAccount } from "@/types/savings";
import { ApiError } from "@/lib/api/errors";

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