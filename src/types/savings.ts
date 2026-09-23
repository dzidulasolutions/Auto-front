export interface SavingsAccount {
  id: string;
  accountNumber: string;
  clientId: string;
  balance: string; // à confirmer une fois la route en place : chaîne ou nombre
  createdAt: string;
}