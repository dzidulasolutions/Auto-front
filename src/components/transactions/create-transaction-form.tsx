"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import { getErrorMessage } from "@/lib/api/errors";
import type { TransactionType } from "@/types/transaction";
import AmountInput from "./amount-input";

interface Props {
  clientId: string;
  type: Extract<TransactionType, "DEPOSIT" | "WITHDRAWAL">;
  onSuccess: () => void;
}

const LABELS: Record<Props["type"], string> = {
  DEPOSIT: "Enregistrer le dépôt",
  WITHDRAWAL: "Enregistrer le retrait",
};

export default function CreateTransactionForm({ clientId, type, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset, resetKey } = useCreateTransaction();

  const handleAmountChange = (v: string) => {
    setAmount(v);
    setAmountError(null);
    resetKey(); // la saisie a changé : ne pas rejouer une ancienne clé d'idempotence
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

    mutate(
      { clientId, type, amount: value, description: description.trim() || undefined },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AmountInput value={amount} onChange={handleAmountChange} error={amountError ?? undefined} />
      <Input
        placeholder="Description (facultatif)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

<Button type="submit" loading={isPending} loadingHint="Connexion au serveur…" className="mt-2">
  {LABELS[type]}
</Button>
    </form>
  );
}