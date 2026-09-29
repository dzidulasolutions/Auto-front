import { api } from "@/lib/api/client";
import type { PortalLoan, PortalMe, PortalSavingsAccount, PortalTontine } from "@/types/portal";

export const getPortalMe = () => api<PortalMe>("/client-portal/me");
export const getPortalLoans = () => api<PortalLoan[]>("/client-portal/loans");
export const getPortalSavings = () => api<PortalSavingsAccount[]>("/client-portal/savings");
export const getPortalTontines = () => api<PortalTontine[]>("/client-portal/tontines");