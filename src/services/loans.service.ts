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

export interface DisburseLoanResult {
  loan: Loan;
  totalToRepay: number;
  amountPerInstallment: number;
  numberOfInstallments: number;
}

export const disburseLoan = (id: string) =>
  api<DisburseLoanResult>(`/loans/${id}/disburse`, {
    method: "PATCH",
    body: { idempotencyKey: newIdempotencyKey() },
  });


  export interface RepayLoanResult {
  loan: Loan;
  transaction: unknown;
}

export const repayLoan = (id: string, amount: number) =>
  api<RepayLoanResult>(`/loans/${id}/repay`, {
    method: "PATCH",
    body: { amount, idempotencyKey: newIdempotencyKey() },
  });

export interface RescheduleLoanInput {
  newDurationMonths: number;
  penaltyAmount?: number;
}

export const rescheduleLoan = (id: string, input: RescheduleLoanInput) =>
  api<LoanWithSchedule>(`/loans/${id}/reschedule`, { method: "PATCH", body: input });