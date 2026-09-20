"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@/components/ui/alert";
import { IconlyArrowRight, IconlyHide, IconlyLoader, IconlyShow } from "@/components/ui/icons";
import { useLogin } from "@/hooks/use-login";

const inputClass =
  "w-full h-11 placeholder:text-white/50 text-white font-ui text-sm border outline-none border-white/30 p-4 bg-transparent focus:border-white transition-colors";

export default function ConnexionForm() {
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState(params.get("identifiant") ?? "");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { submit, loading, mfaRequired, error, clearError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    submit({ identifier: identifier.trim(), password, ...(mfaRequired ? { mfaCode } : {}) });
  };

  return (
    <section className="min-h-dvh bg-black flex justify-center p-4">
      <div className="w-full lg:w-120 flex flex-col justify-center gap-12">
        <div className="font-ui font-bold text-xl text-white">Autogo.</div>

        <form onSubmit={handleSubmit} className="pb-6 flex flex-col gap-3">
          <div className="mb-2">
            <h1 className="font-ui text-2xl text-white font-bold">Bon retour.</h1>
            <p className="font-ui text-sm text-white/60 mt-1">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>

          {error && <Alert type="error" message={error} onClose={clearError} />}

          <input type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email ou Téléphone"
            autoComplete="username"
            required
            className={inputClass}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-0 top-0 h-11 w-11 flex justify-center items-center text-white/60"
            >
              {showPassword ? (
                <IconlyHide color="currentColor" size={20} />
              ) : (
                <IconlyShow color="currentColor" size={20} />
              )}
            </button>
          </div>

          {mfaRequired && (
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Code de vérification (6 chiffres)"
              autoComplete="one-time-code"
              required
              className={inputClass}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex justify-between pl-4 pr-1 items-center bg-white mt-3 text-black font-ui text-sm font-medium disabled:opacity-60"
          >
            {mfaRequired ? "Valider" : "Se connecter"}
            <span className="w-10 h-9 bg-black text-white flex justify-center items-center">
              {loading ? (
                <IconlyLoader color="currentColor" size={20} />
              ) : (
                <IconlyArrowRight color="currentColor" size={24} />
              )}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}