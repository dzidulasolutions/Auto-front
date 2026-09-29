import type { Loan } from "./loan";
import type { LoanScheduleItem } from "./loan";
import type { SavingsAccount } from "./savings";
import type { TontineCollection, TontineCycle } from "./tontine";

export interface PortalMe {
  id: string;
  clientNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
}

export interface PortalLoan extends Loan {
  schedules: LoanScheduleItem[];
}

export interface PortalTontine extends TontineCycle {
  collections: TontineCollection[];
}

export type PortalSavingsAccount = SavingsAccount;