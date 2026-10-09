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
  deletedAt: string | null;
  branch?: ClientBranch;
}

export interface ClientSearchResult extends Client {
  relevance: number;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  idDocumentUrl?: string;
  branchId?: string;
  
}

export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  idDocumentUrl?: string;
}

export const isClientActive = (c: Pick<Client, never> & { deletedAt?: string | null }) =>
  !c.deletedAt;