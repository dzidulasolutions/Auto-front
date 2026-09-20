export type Role =
  | "SuperAdmin" | "Admin" | "Manager"
  | "Agent" | "Caissier" | "Comptable";

export interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role; // à vérifier dans le Swagger : string ou objet { name } ?
}

export interface StaffTokens {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: StaffUser;
}

export type StaffLoginResponse = StaffTokens | { mfaRequired: true };

export interface ClientLoginResponse {
  accessToken: string;
  client: { id: string; clientNumber: string; firstName: string; lastName: string };
}

export type SessionKind = "staff" | "client";