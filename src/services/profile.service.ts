import { api } from "@/lib/api/client";
import type { Me } from "@/types/auth";

export const getMe = () => api<Me>("/users/me");

export interface UpdateProfileInput {
  address?: string;
  city?: string;
  birthDate?: string;
}

export const updateMyProfile = (input: UpdateProfileInput) =>
  api<Me>("/users/me/profile", { method: "PATCH", body: input });

export interface UpdateContactInput {
  email?: string;
  phone?: string;
}

export const updateMyContact = (input: UpdateContactInput) =>
  api<Me>("/users/me/contact", { method: "PATCH", body: input });