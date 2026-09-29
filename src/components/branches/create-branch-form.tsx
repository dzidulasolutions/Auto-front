"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateBranch } from "@/hooks/use-branches";
import { getErrorMessage } from "@/lib/api/errors";

export default function CreateBranchForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useCreateBranch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    mutate(
      { name: name.trim(), code: code.trim(), city: city.trim(), address: address.trim() || undefined },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input placeholder="Nom de l'agence" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="Code (ex : LOM-01)" value={code} onChange={(e) => setCode(e.target.value)} required />
      <Input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required />
      <Input
        placeholder="Adresse (facultatif)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Créer l&apos;agence
      </Button>
    </form>
  );
}