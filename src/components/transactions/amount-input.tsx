"use client";

import Input from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export default function AmountInput({ value, onChange, error }: Props) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="Montant (FCFA)"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      error={error}
      required
    />
  );
}