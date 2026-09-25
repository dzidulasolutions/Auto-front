export interface TontineCycle {
  id: string;
  cycleNumber: string;
  clientId: string;
  branchId: string;
  amountPerCollection: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  allowedWeekdays: number[];
  status: string; // "ACTIVE" confirmé, "CLOSED" probable après clôture
  commissionRate: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface TontineProgress {
  total: number;
  collected: number;
  missed: number;
  pending: number;
  amountCollected: number;
}

export interface TontineCollection {
  id: string;
  cycleId: string;
  scheduledDate: string;
  collectedAt: string | null;
  status: string; // "A_COLLECTER" confirmé ; statut "validée"/"manquée" à confirmer
  transactionId: string | null;
  collectedById: string | null;
  createdAt: string;
}

// Réponse de GET /tontines/cycles/:id/collections — le "cycle" imbriqué est partiel,
// à fusionner avec l'objet complet obtenu via by-client si besoin d'autres champs.
export interface TontineCollectionsResponse {
  cycle: Pick<TontineCycle, "cycleNumber" | "amountPerCollection" | "status">;
  progression: TontineProgress;
  collections: TontineCollection[];
}

export interface CreateTontineInput {
  clientId: string;
  amountPerCollection: number;
  durationMonths: number;
  startDate: string;
  allowedWeekdays: number[];
}

export const WEEKDAY_LABELS: Record<number, string> = {
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
  7: "Dim",
};

export const CYCLE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  CLOSED: "Clôturé",
};

export const COLLECTION_STATUS_LABELS: Record<string, string> = {
  A_COLLECTER: "À collecter",
};

// Style par défaut pour un statut non encore rencontré, à affiner une fois confirmé
export function collectionStatusTone(status: string): "neutral" | "success" | "warning" | "error" {
  if (status === "A_COLLECTER") return "neutral";
  if (status.includes("COLLECT")) return "success"; // pari : un statut "validée" contiendra COLLECT
  if (status.includes("MANQ") || status.includes("RETARD")) return "error";
  return "neutral";
}

export function isOverdue(collection: Pick<TontineCollection, "status" | "scheduledDate">): boolean {
  return collection.status === "A_COLLECTER" && new Date(collection.scheduledDate) < new Date();
}