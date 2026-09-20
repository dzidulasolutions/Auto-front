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