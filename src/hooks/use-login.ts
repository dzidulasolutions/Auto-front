"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { login, type LoginInput } from "@/services/auth.service";
import { homeForRole, ROUTES } from "@/config/routes";
import { getErrorMessage } from "@/lib/api/errors";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = async (input: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(input);

      if ("mfaRequired" in result) {
        setMfaRequired(true);
        return;
      }

      localStorage.setItem("autogo_last_identifier", input.identifier);
      router.replace(
        result.kind === "staff" ? homeForRole(result.user.role) : ROUTES.client,
      );
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, mfaRequired, error, clearError };
}
