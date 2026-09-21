export interface ClientBranch {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface Client {
  id: string;
  clientNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  idDocumentUrl: string | null;
  branchId: string;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  branch?: ClientBranch;
}

export interface ClientSearchResult extends Client {
  relevance: number;
}