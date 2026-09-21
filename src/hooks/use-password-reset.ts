"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/api/errors";
import { forgotPassword, resetPassword } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";

export function usePasswordReset() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const run = async (action: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const requestCode = (value: string) =>
    run(async () => {
      await forgotPassword(value);
      setEmail(value);
      setStep("reset");
    });

  const reset = (code: string, newPassword: string) =>
    run(async () => {
      await resetPassword({ email, code, newPassword });
      router.replace(`${ROUTES.login}?reset=1`);
    });

  const restart = () => {
    setError(null);
    setStep("email");
  };

  return { step, email, loading, error, clearError, requestCode, reset, restart };
}