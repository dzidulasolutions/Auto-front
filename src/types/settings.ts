export interface Setting {
  id: string;
  key: string;
  value: number;
  updatedAt: string;
  updatedById: string | null;
}

export const SETTINGS_LABELS: Record<string, string> = {
  "loan.interest_rate": "Taux d'intérêt sur les prêts",
  "savings.interest_rate": "Taux d'intérêt sur l'épargne",
  "tontine.default_commission_rate": "Commission par défaut sur les tontines",
};

export const SETTINGS_ORDER = [
  "loan.interest_rate",
  "savings.interest_rate",
  "tontine.default_commission_rate",
];