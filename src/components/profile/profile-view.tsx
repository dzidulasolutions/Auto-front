"use client";

import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-me";
import { getErrorMessage } from "@/lib/api/errors";
import ContactForm from "./contact-form";
import ProfileInfoForm from "./profile-info-form";

export default function ProfileView() {
  const { data: me, isPending, isError, error, refetch } = useMe();

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="bg-white p-4 flex flex-col items-start gap-3">
        <p className="text-small">{getErrorMessage(error)}</p>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h1">
          {me.firstName} {me.lastName}
        </h1>
        <p className="text-small text-muted">{me.role.name}</p>
      </div>

      <div className="bg-white p-5 flex flex-col gap-4">
        <h2 className="text-h2">Coordonnées</h2>
        <ContactForm me={me} />
      </div>

      <div className="bg-white p-5 flex flex-col gap-4">
        <h2 className="text-h2">Informations</h2>
        <ProfileInfoForm me={me} />
      </div>
    </div>
  );
}