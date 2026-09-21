"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/api/errors";
import { activateClient, type ActivateInput } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";

export function useActivate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = async (input: ActivateInput) => {
    if (input.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await activateClient(input);

      if ("activated" in result) {
        router.replace(`${ROUTES.login}?activated=1`);
        return;
      }

      localStorage.setItem("autogo_last_identifier", input.phone);
      router.replace(ROUTES.client);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, clearError };
}