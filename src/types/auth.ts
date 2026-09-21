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

export type LoginResult =
  | { mfaRequired: true }
  | { kind: "staff"; user: StaffUser }
  | { kind: "client"; client: ClientLoginResponse["client"] };

export type ActivateResult =
  | { kind: "client"; client: ClientLoginResponse["client"] }
  | { activated: true };

export type ClientProfile = ClientLoginResponse["client"];

export interface SessionUser {
  firstName: string;
  lastName: string;
  label: string; // rôle (staff) ou numéro client
}