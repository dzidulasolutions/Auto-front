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

export const PRIVILEGED_ROLES: Role[] = ["SuperAdmin", "Admin"];

export interface UserProfileData {
  address: string | null;
  city: string | null;
  country: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
}

export interface Me {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  role: { id: string; name: Role };
  branchId: string | null;
  profile: UserProfileData | null;
}

export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
}