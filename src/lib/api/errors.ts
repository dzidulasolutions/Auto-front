export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public messages: string[],
  ) {
    super(messages[0] ?? "Erreur inconnue");
  }

  get isRateLimited() {
    return this.statusCode === 429;
  }
}

export function normalizeMessages(message: string | string[] | undefined): string[] {
  if (!message) return [];
  return Array.isArray(message) ? message : [message];
}

export function getErrorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    return e.isRateLimited ? "Trop de tentatives. Réessayez dans une minute." : e.message;
  }
  return "Une erreur est survenue. Réessayez.";
}