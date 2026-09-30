export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string;
  status: "ACTIVE" | "INACTIVE";
  loanApprovalLimit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchInput {
  name: string;
  code: string;
  address?: string;
  city: string;
}

export type UpdateBranchInput = Partial<CreateBranchInput>;

export interface BranchStats {
  clientCount: number;
  staffByRole: Record<string, number>;
}