"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import AmountInput from "@/components/transactions/amount-input";
import { useCreateTontine } from "@/hooks/use-tontines";
import { getErrorMessage } from "@/lib/api/errors";
import { WEEKDAY_LABELS } from "@/types/tontine";

interface Props {
  clientId: string;
  onSuccess: () => void;
}

export default function CreateTontineForm({ clientId, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [startDate, setStartDate] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useCreateTontine(clientId);

  const toggleWeekday = (day: number) => {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);
    setFormError(null);

    const amountValue = Number(amount);
    const durationValue = Number(durationMonths);

    if (!amount || amountValue <= 0) {
      setFormError("Entrez un montant de collecte valide.");
      return;
    }
    if (!durationValue || durationValue < 1 || durationValue > 12) {
      setFormError("La durée doit être entre 1 et 12 mois.");
      return;
    }
    if (!startDate) {
      setFormError("Choisissez une date de début.");
      return;
    }
    if (weekdays.length === 0) {
      setFormError("Choisissez au moins un jour de collecte.");
      return;
    }

    mutate(
      {
        clientId,
        amountPerCollection: amountValue,
        durationMonths: durationValue,
        startDate,
        allowedWeekdays: weekdays,
      },
      { onSuccess, onError: () => setShowError(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AmountInput value={amount} onChange={setAmount} />
      <Input
        type="number"
        min={1}
        max={12}
        placeholder="Durée (mois, 1 à 12)"
        value={durationMonths}
        onChange={(e) => setDurationMonths(e.target.value)}
        required
      />
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <div className="flex flex-col gap-2">
        <p className="text-small text-muted">Jours de collecte</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(WEEKDAY_LABELS).map(([day, label]) => {
            const active = weekdays.includes(Number(day));
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekday(Number(day))}
                className={`h-9 px-3 rounded-control text-small transition-colors ${
                  active ? "bg-black text-white" : "bg-surface text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {formError && <p className="text-small text-error">{formError}</p>}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Button type="submit" loading={isPending} className="mt-2">
        Créer le cycle
      </Button>
    </form>
  );
}