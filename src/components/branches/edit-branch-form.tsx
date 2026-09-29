"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateBranch } from "@/hooks/use-branches";
import { getErrorMessage } from "@/lib/api/errors";
import type { Branch } from "@/types/branch";

interface Props {
  branch: Branch;
  onSuccess: () => void;
}

export default function EditBranchForm({ branch, onSuccess }: Props) {
  const [name, setName] = useState(branch.name);
  const [code, setCode] = useState(branch.code);
  const [city, setCity] = useState(branch.city);
  const [address, setAddress] = useState(branch.address ?? "");
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useUpdateBranch(branch.id);

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
      <Input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required />
      <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} required />
      <Input
        placeholder="Adresse (facultatif)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
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