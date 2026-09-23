"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateClient } from "@/hooks/use-update-client";
import { getErrorMessage } from "@/lib/api/errors";
import type { Client } from "@/types/client";
import PhotoPicker from "./photo-picker";
import DocumentPicker from "./document-picker";

interface Props {
  client: Client;
  onSuccess: () => void;
}

const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export default function EditClientForm({ client, onSuccess }: Props) {
  const [firstName, setFirstName] = useState(client.firstName);
  const [lastName, setLastName] = useState(client.lastName);
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(client.photoUrl ?? undefined);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
const [idDocumentUrl, setIdDocumentUrl] = useState<string | undefined>(
  /* edit seulement : */ client.idDocumentUrl ?? undefined,
);
  const { mutate, isPending, error, reset } = useUpdateClient(client.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    const trimmedPhone = phone.trim();
    const phoneOk = PHONE_PATTERN.test(trimmedPhone);
    setPhoneError(phoneOk ? null : "Numéro invalide (8 à 15 chiffres, indicatif optionnel).");
    if (!phoneOk) return;

    mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: trimmedPhone,
        email: email.trim() || undefined,
        photoUrl,
      },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PhotoPicker onUploaded={setPhotoUrl} initialUrl={client.photoUrl} />
      <DocumentPicker onUploaded={setIdDocumentUrl} /* edit seulement : */ initialUrl={client.idDocumentUrl} />
      <Input
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <Input
        placeholder="Nom"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <Input
        placeholder="Téléphone (+228XXXXXXXX)"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={phoneError ?? undefined}
        required
      />
      <Input
        placeholder="Email (facultatif)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Enregistrer
      </Button>
    </form>
  );
}