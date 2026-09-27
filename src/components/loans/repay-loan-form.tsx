"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import AmountInput from "@/components/transactions/amount-input";
import { useRepayLoan } from "@/hooks/use-loans";
import { getErrorMessage } from "@/lib/api/errors";
import type { LoanScheduleItem } from "@/types/loan";

interface Props {
  clientId: string;
  loanId: string;
  pending: LoanScheduleItem[]; // échéances PENDING, dans l'ordre (FIFO)
  onSuccess: () => void;
}

export default function RepayLoanForm({ clientId, loanId, pending, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useRepayLoan(clientId, loanId);

  // Montants suggérés : 1, 3 et toutes les échéances restantes (FIFO)
  const suggestions = [1, 3, pending.length]
    .filter((n, i, arr) => n > 0 && n <= pending.length && arr.indexOf(n) === i)
    .map((n) => ({
      count: n,
      total: pending.slice(0, n).reduce((sum, p) => sum + Number(p.amountDue), 0),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);
    setFormError(null);

    const value = Number(amount);
    if (!amount || value <= 0) {
      setFormError("Entrez un montant valide.");
      return;
    }

    mutate(value, { onSuccess, onError: () => setShowError(true) });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {suggestions.map(({ count, total }) => (
          <button
            key={count}
            type="button"
            onClick={() => setAmount(String(total))}
            className="h-9 px-3 bg-surface rounded-control text-small hover:bg-border transition-colors"
          >
            {count} échéance{count > 1 ? "s" : ""} · {total.toLocaleString("fr-FR")} FCFA
          </button>
        ))}
      </div>

      <AmountInput value={amount} onChange={setAmount} />
      {formError && <p className="text-small text-error">{formError}</p>}

      <p className="text-caption text-muted">
        Le montant doit correspondre exactement à un nombre entier d&apos;échéances consécutives.
      </p>

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Enregistrer le remboursement
      </Button>
    </form>
  );
}