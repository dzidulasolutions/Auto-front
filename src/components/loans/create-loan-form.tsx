"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import AmountInput from "@/components/transactions/amount-input";
import Input from "@/components/ui/input";
import { useCreateLoan } from "@/hooks/use-loans";
import { getErrorMessage } from "@/lib/api/errors";
import { LOAN_FREQUENCY_LABELS } from "@/types/loan";
import type { LoanFrequency } from "@/types/loan";

interface Props {
  clientId: string;
  onSuccess: () => void;
}

export default function CreateLoanForm({ clientId, onSuccess }: Props) {
  const [principal, setPrincipal] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [frequency, setFrequency] = useState<LoanFrequency | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useCreateLoan(clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);
    setFormError(null);

    const principalValue = Number(principal);
    const durationValue = Number(durationMonths);

    if (!principal || principalValue <= 0) {
      setFormError("Entrez un montant à emprunter valide.");
      return;
    }
    if (!durationValue || durationValue < 1 || durationValue > 36) {
      setFormError("La durée doit être entre 1 et 36 mois.");
      return;
    }
    if (!frequency) {
      setFormError("Choisissez une fréquence de remboursement.");
      return;
    }

    mutate(
      { clientId, principal: principalValue, durationMonths: durationValue, frequency },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AmountInput value={principal} onChange={setPrincipal} />
      <Input
        type="number"
        min={1}
        max={36}
        placeholder="Durée (mois, 1 à 36)"
        value={durationMonths}
        onChange={(e) => setDurationMonths(e.target.value)}
        required
      />
      <Select
        placeholder="Fréquence de remboursement"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as LoanFrequency)}
        required
      >
        {Object.entries(LOAN_FREQUENCY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {formError && <p className="text-small text-error">{formError}</p>}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Créer la demande
      </Button>
    </form>
  );
}