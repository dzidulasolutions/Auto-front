"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import AmountInput from "@/components/transactions/amount-input";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRescheduleLoan } from "@/hooks/use-loans";
import { getErrorMessage } from "@/lib/api/errors";

interface Props {
  clientId: string;
  loanId: string;
  currentDurationMonths: number;
  onSuccess: () => void;
}

export default function RescheduleLoanForm({ clientId, loanId, currentDurationMonths, onSuccess }: Props) {
  const [newDuration, setNewDuration] = useState(String(currentDurationMonths));
  const [penalty, setPenalty] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useRescheduleLoan(clientId, loanId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);
    setFormError(null);

    const duration = Number(newDuration);
    if (!duration || duration < 1 || duration > 36) {
      setFormError("La nouvelle durée doit être entre 1 et 36 mois.");
      return;
    }

    mutate(
      { newDurationMonths: duration, penaltyAmount: penalty ? Number(penalty) : undefined },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-small text-muted">
        Durée actuelle : {currentDurationMonths} mois. Les échéances restantes seront réétalées.
      </p>

      <Input
        type="number"
        min={1}
        max={36}
        placeholder="Nouvelle durée (mois)"
        value={newDuration}
        onChange={(e) => setNewDuration(e.target.value)}
        required
      />

      <AmountInput value={penalty} onChange={setPenalty} />
      <p className="text-caption text-muted -mt-2">Pénalité de retard (facultatif)</p>

      {formError && <p className="text-small text-error">{formError}</p>}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Réétaler le prêt
      </Button>
    </form>
  );
}