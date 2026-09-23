"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useBranches } from "@/hooks/use-branches";
import { useCreateClient } from "@/hooks/use-create-client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { PRIVILEGED_ROLES } from "@/types/auth";
import { getErrorMessage } from "@/lib/api/errors";
import DocumentPicker from "./document-picker";
import PhotoPicker from "./photo-picker";

interface Props {
  onSuccess: () => void;
}

const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export default function CreateClientForm({ onSuccess }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [idDocumentUrl, setIdDocumentUrl] = useState<string | undefined>();
  const [branchId, setBranchId] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { role } = useCurrentRole();
  const needsBranch = !!role && PRIVILEGED_ROLES.includes(role);
  const { data: branches, isLoading: branchesLoading } = useBranches(role);

  const { mutate, isPending, error, reset } = useCreateClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    const trimmedPhone = phone.trim();
    const phoneOk = PHONE_PATTERN.test(trimmedPhone);
    setPhoneError(phoneOk ? null : "Numéro invalide (8 à 15 chiffres, indicatif optionnel).");

    const branchOk = !needsBranch || !!branchId;
    setBranchError(branchOk ? null : "Choisissez une agence.");

    if (!phoneOk || !branchOk) return;

    mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: trimmedPhone,
        email: email.trim() || undefined,
        photoUrl,
        idDocumentUrl,
        ...(needsBranch ? { branchId } : {}),
      },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PhotoPicker onUploaded={setPhotoUrl} />
      <DocumentPicker onUploaded={setIdDocumentUrl} />

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

      {needsBranch && (
        <Select
          placeholder={branchesLoading ? "Chargement des agences…" : "Choisir une agence"}
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          error={branchError ?? undefined}
          disabled={branchesLoading}
          required
        >
          {branches?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.city}
            </option>
          ))}
        </Select>
      )}

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Créer le client
      </Button>
    </form>
  );
}