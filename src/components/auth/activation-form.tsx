"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Alert from "@/components/ui/alert";
import { useActivate } from "@/hooks/use-activate";
import { ROUTES } from "@/config/routes";
import { authInputClass } from "./styles";
import PasswordInput from "./password-input";
import SubmitButton from "./submit-button";

export default function ActivationForm() {
  const params = useSearchParams();
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submit, loading, error, clearError } = useActivate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    submit({ phone: phone.trim(), email: email.trim(), password });
  };

  return (
    <section className="min-h-dvh bg-black image-bg flex justify-center p-4">
      <div className="w-full lg:w-120 flex flex-col justify-between">
        <div className="pb-16 font-ui font-bold text-xl text-white">Autogo.</div>

        <form onSubmit={handleSubmit} className="pb-6 flex flex-col gap-3">
          <div className="mb-2">
            <h1 className="font-ui text-2xl text-white font-bold">Activez votre compte</h1>
            <p className="font-ui text-sm text-white/60 mt-1">
              Utilisez le numéro donné à votre agent, puis choisissez votre mot de passe.
            </p>
          </div>

          {error && <Alert type="error" message={error} onClose={clearError} />}

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone"
            autoComplete="tel"
            required
            className={authInputClass}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className={authInputClass}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (8 caractères minimum)"
            autoComplete="new-password"
            required
          />

          <SubmitButton label="Activer mon compte" loading={loading} />

          <Link href={ROUTES.login} className="font-ui text-xs text-white/60 mt-2">
            J&apos;ai déjà un compte
          </Link>
        </form>
      </div>
    </section>
  );
}