import { ApiError } from "@/lib/api/errors";

export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/backend/uploads", { method: "POST", body: formData });
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, json?.messages ?? ["Envoi impossible."]);
  }
  return json as { url: string };
}

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Format accepté : JPEG, PNG ou WebP.";
  if (file.size > MAX_FILE_SIZE) return "Taille maximale : 5 Mo.";
  return null;
}