"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateContact } from "@/hooks/use-me";
import { getErrorMessage } from "@/lib/api/errors";
import type { Me } from "@/types/auth";

export default function ContactForm({ me }: { me: Me }) {
  const [email, setEmail] = useState(me.email);
  const [phone, setPhone] = useState(me.phone ?? "");
  const [notice, setNotice] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useUpdateContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    mutate(
      { email: email.trim() || undefined, phone: phone.trim() || undefined },
      {
        onSuccess: () => setNotice("Coordonnées mises à jour. Pensez à revérifier."),
        onError: () => setShowError(true),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <div className="flex flex-col gap-1.5">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Badge tone={me.emailVerified ? "success" : "warning"}>
          {me.emailVerified ? "Vérifié" : "Non vérifié"}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <Input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Badge tone={me.phoneVerified ? "success" : "warning"}>
          {me.phoneVerified ? "Vérifié" : "Non vérifié"}
        </Badge>
      </div>

      <Button type="submit" loading={isPending} className="mt-2">
        Enregistrer
      </Button>
    </form>
  );
}