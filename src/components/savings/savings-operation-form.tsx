"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import { useSavingsOperation } from "@/hooks/use-savings-operation";
import { getErrorMessage } from "@/lib/api/errors";
import AmountInput from "@/components/transactions/amount-input";

interface Props {
  clientId: string;
  accountId: string;
  kind: "deposit" | "withdraw";
  onSuccess: () => void;
}

export default function SavingsOperationForm({ clientId, accountId, kind, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset, resetKey } = useSavingsOperation(clientId, accountId, kind);

  const handleAmountChange = (v: string) => {
    setAmount(v);
    setAmountError(null);
    resetKey();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    const value = Number(amount);
    if (!amount || value <= 0) {
      setAmountError("Entrez un montant valide.");
      return;
    }

    mutate(value, { onSuccess, onError: () => setShowError(true) });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AmountInput value={amount} onChange={handleAmountChange} error={amountError ?? undefined} />

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        {kind === "deposit" ? "Enregistrer le dépôt" : "Enregistrer le retrait"}
      </Button>
    </form>
  );
}