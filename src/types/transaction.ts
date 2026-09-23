export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "LOAN_DISBURSEMENT"
  | "LOAN_REPAYMENT"
  | "TONTINE_COLLECTION"
  | "TONTINE_PAYOUT";

export type TransactionStatus = "COMPLETED" | "CANCELLED";

export interface Transaction {
  id: string;
  transactionNumber: string;
  clientId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string; // le backend renvoie une chaîne, à convertir avec Number() à l'affichage
  description: string | null;
  receiptUrl: string | null;
  performedBy: { firstName: string; lastName: string };
  cancelledAt: string | null;
  cancelledById: string | null;
  createdAt: string;
}

export interface CreateTransactionInput {
  clientId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  DEPOSIT: "Dépôt",
  WITHDRAWAL: "Retrait",
  LOAN_DISBURSEMENT: "Décaissement de prêt",
  LOAN_REPAYMENT: "Remboursement de prêt",
  TONTINE_COLLECTION: "Collecte tontine",
  TONTINE_PAYOUT: "Restitution tontine",
};