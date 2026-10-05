"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useBranches } from "@/hooks/use-branches";
import { useCreateUser, useRoles } from "@/hooks/use-users";
import { getErrorMessage } from "@/lib/api/errors";
import { useCurrentRole } from "@/hooks/use-current-role";

export default function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const { role } = useCurrentRole();
  const { data: branches } = useBranches(role);
  const { data: roles } = useRoles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);
    setFormError(null);

    if (password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!roleId || !branchId) {
      setFormError("Choisissez un rôle et une agence.");
      return;
    }

    mutate(
      { email: email.trim(), password, firstName: firstName.trim(), lastName: lastName.trim(), roleId, branchId },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      <Input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        type="password"
        placeholder="Mot de passe (8 caractères minimum)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Select placeholder="Choisir un rôle" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
        {roles?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </Select>

      <Select placeholder="Choisir une agence" value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
        {branches?.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} — {b.city}
          </option>
        ))}
      </Select>

      {formError && <p className="text-small text-error">{formError}</p>}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Créer l&apos;utilisateur
      </Button>
    </form>
  );
}