export interface BranchSummaryDay {
  branch_id: string;
  branch_name: string;
  summary_date: string;
  transaction_count: number;
  total_deposits: number;
  total_withdrawals: number;
  total_disbursements: number;
  total_repayments: number;
}

export interface LoanAtRisk {
  loan_id: string;
  loan_number: string;
  branch_id: string;
  client_id: string;
  principal: number;
  status: string;
  overdue_installments_count: number;
  overdue_amount: number;
}

export type DailyCollectionType = "TONTINE" | "LOAN";

export interface DailyCollection {
  collection_type: DailyCollectionType;
  collection_id: string;
  client_id: string;
  assigned_agent_id: string;
  branch_id: string;
  due_date: string;
  amount_due: string; // observé en chaîne dans le JSON réel
  status: string;
}

export type ReportStatus = "PENDING" | "READY" | "FAILED";

export interface Report {
  id: string;
  branchId: string;
  month: number;
  year: number;
  status: ReportStatus;
  fileUrl: string | null;
  requestedById: string | null;
  createdAt: string;
}

export interface RequestReportInput {
  branchId: string;
  month: number;
  year: number;
}