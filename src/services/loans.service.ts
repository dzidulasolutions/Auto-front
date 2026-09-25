import { api, qs } from "@/lib/api/client";
import { newIdempotencyKey } from "@/lib/idempotency";
import type { Paginated } from "@/types/api";
import type { CreateLoanInput, Loan, LoanStatus, LoanWithSchedule } from "@/types/loan";

export interface ListLoansParams {
  clientId?: string;
  status?: LoanStatus;
  page?: number;
  limit?: number;
}

export const listLoans = (p: ListLoansParams = {}) =>
  api<Paginated<Loan>>(
    `/loans${qs({ clientId: p.clientId, status: p.status, page: p.page, limit: p.limit })}`,
  );

export const getLoan = (id: string) => api<LoanWithSchedule>(`/loans/${id}`);

export const createLoan = (input: CreateLoanInput) =>
  api<Loan>("/loans", { method: "POST", body: input });

export const submitLoan = (id: string) => api<Loan>(`/loans/${id}/submit`, { method: "PATCH" });

export const approveLoan = (id: string) => api<Loan>(`/loans/${id}/approve`, { method: "PATCH" });

export const rejectLoan = (id: string, reason: string) =>
  api<Loan>(`/loans/${id}/reject`, { method: "PATCH", body: { reason } });

export const disburseLoan = (id: string) =>
  api<LoanWithSchedule>(`/loans/${id}/disburse`, {
    method: "PATCH",
    body: { idempotencyKey: newIdempotencyKey() },
  });

export const repayLoan = (id: string, amount: number) =>
  api(`/loans/${id}/repay`, {
    method: "PATCH",
    body: { amount, idempotencyKey: newIdempotencyKey() },
  });