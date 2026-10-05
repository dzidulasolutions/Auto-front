import { api } from "@/lib/api/client";
import type { CreateUserInput, RoleOption, StaffMember, UpdateUserInput } from "@/types/user";

export const listUsers = () => api<StaffMember[]>("/users");
export const getUser = (id: string) => api<StaffMember>(`/users/${id}`);
export const createUser = (input: CreateUserInput) =>
  api<StaffMember>("/users", { method: "POST", body: input });
export const updateUser = (id: string, input: UpdateUserInput) =>
  api<StaffMember>(`/users/${id}`, { method: "PATCH", body: input });
export const deactivateUser = (id: string) =>
  api<StaffMember>(`/users/${id}`, { method: "DELETE" });
export const listRoles = () => api<RoleOption[]>("/roles");