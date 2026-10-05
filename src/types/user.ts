import type { Role } from "./auth";

export interface StaffMember {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  role: { id: string; name: Role };
  branchId: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  branchId: string;
}

export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">>;

export interface RoleOption {
  id: string;
  name: Role;
  description: string | null;
}