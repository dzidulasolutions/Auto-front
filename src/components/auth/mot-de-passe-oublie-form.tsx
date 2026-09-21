"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Alert from "@/components/ui/alert";
import { usePasswordReset } from "@/hooks/use-password-reset";
import { ROUTES } from "@/config/routes";
import { authInputClass } from "./styles";
import PasswordInput from "./password-input";
import SubmitButton from "./submit-button";

export default function MotDePasseOublieForm() {
  const params = useSearchParams();
  const { step, email, loading, error, clearError, requestCode, reset, restart } =
    usePasswordReset();
  const [emailInput, setEmailInput] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (step === "email") requestCode(emailInput.trim());
    else reset(code, password);
  };

  return (
    <section className="min-h-dvh bg-black image-bg flex justify-center p-4">
      <div className="w-full lg:w-120 flex flex-col justify-between">
        <div className="pb-16 font-ui font-bold text-xl text-white">Autogo.</div>

        <form onSubmit={handleSubmit} className="pb-6 flex flex-col gap-3">
          <div className="mb-2">
            <h1 className="font-ui text-2xl text-white font-bold">Mot de passe oublié</h1>
            <p className="font-ui text-sm text-white/60 mt-1">
              {step === "email"
                ? "Entrez votre email, nous vous envoyons un code."
                : `Si ce compte existe, un code à 6 chiffres a été envoyé à ${email}.`}
            </p>
          </div>

          {error && <Alert type="error" message={error} onClose={clearError} />}

          {step === "email" ? (
            <>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className={authInputClass}
              />
              <SubmitButton label="Recevoir le code" loading={loading} />
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Code à 6 chiffres"
                autoComplete="one-time-code"
                required
                className={authInputClass}
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
                required
              />
              <SubmitButton label="Mettre à jour" loading={loading} />
              <button
                type="button"
                onClick={restart}
                className="font-ui text-xs text-white/60 text-left mt-1"
              >
                Email incorrect ou code expiré ? Recommencer
              </button>
            </>
          )}

          <Link href={ROUTES.login} className="font-ui text-xs text-white/60 mt-2">
            Retour à la connexion
          </Link>
        </form>
      </div>
    </section>
  );
}