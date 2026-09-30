"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks/use-me";
import { getErrorMessage } from "@/lib/api/errors";
import type { Me } from "@/types/auth";

export default function ProfileInfoForm({ me }: { me: Me }) {
  const [address, setAddress] = useState(me.profile?.address ?? "");
  const [city, setCity] = useState(me.profile?.city ?? "");
  const [birthDate, setBirthDate] = useState(me.profile?.birthDate?.slice(0, 10) ?? "");
  const [notice, setNotice] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error, reset } = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setShowError(false);

    mutate(
      { address: address.trim() || undefined, city: city.trim() || undefined, birthDate: birthDate || undefined },
      {
        onSuccess: () => setNotice("Profil mis à jour."),
        onError: () => setShowError(true),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <Input placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
      <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

      <Button type="submit" loading={isPending} className="mt-2">
        Enregistrer
      </Button>
    </form>
  );
}