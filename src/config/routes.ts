import type { Role } from "@/types/auth";

export const ROUTES = {
  login: "/connexion",
  client: "/client",
} as const;

const ROLE_HOME: Record<Role, string> = {
  SuperAdmin: "/admin",
  Admin: "/admin",
  Manager: "/manager",
  Agent: "/agent",
  Caissier: "/caissier",
  Comptable: "/comptable",
};

export const homeForRole = (role: Role) => ROLE_HOME[role];