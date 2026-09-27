import type { Role } from "./auth";

export type LoanStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED"
  | "CLOSED";

export type LoanFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export type LoanScheduleStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Loan {
  id: string;
  loanNumber: string;
  clientId: string;
  branchId: string;
  principal: string;
  interestRate: string; // fixé par le backend à la création, jamais saisi par le frontend
  durationMonths: number;
  frequency: LoanFrequency;
  allowedWeekdays: number[];
  status: LoanStatus;
  rejectionReason: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoanScheduleItem {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: string;
  status: LoanScheduleStatus;
  paidAt: string | null;
  transactionId: string | null;
}

export interface LoanWithSchedule extends Loan {
  schedules: LoanScheduleItem[];
}

export interface CreateLoanInput {
  clientId: string;
  principal: number;
  durationMonths: number;
  frequency: LoanFrequency;
  allowedWeekdays?: number[];
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_APPROVAL: "En attente d'approbation",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  DISBURSED: "Décaissé",
  CLOSED: "Clôturé",
};

export const LOAN_FREQUENCY_LABELS: Record<LoanFrequency, string> = {
  DAILY: "Journalière",
  WEEKLY: "Hebdomadaire",
  MONTHLY: "Mensuelle",
};

export const SCHEDULE_STATUS_LABELS: Record<LoanScheduleStatus, string> = {
  PENDING: "À payer",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export function loanStatusTone(status: LoanStatus): "neutral" | "success" | "warning" | "error" {
  if (status === "DISBURSED" || status === "APPROVED" || status === "CLOSED") return "success";
  if (status === "PENDING_APPROVAL") return "warning";
  if (status === "REJECTED") return "error";
  return "neutral";
}

export function scheduleStatusTone(status: LoanScheduleStatus): "neutral" | "success" | "warning" | "error" {
  if (status === "PAID") return "success";
  if (status === "OVERDUE") return "error";
  if (status === "CANCELLED") return "neutral";
  return "neutral"; // PENDING
}

export type LoanAction = "submit" | "approve" | "reject" | "disburse";

export function availableActions(status: LoanStatus): LoanAction[] {
  switch (status) {
    case "DRAFT":
      return ["submit"];
    case "PENDING_APPROVAL":
      return ["approve", "reject"];
    case "APPROVED":
      return ["disburse"];
    default:
      return []; // REJECTED, DISBURSED, CLOSED : plus d'action de cycle de vie
  }
}

export function availableActionsForRole(status: LoanStatus, role: Role): LoanAction[] {
  const canApprove = ["SuperAdmin", "Admin", "Manager"].includes(role);
  return availableActions(status).filter((action) => {
    if (action === "approve" || action === "reject") return canApprove;
    return true; // submit, disburse restent ouverts à Agent/Caissier selon le contrat
  });
}