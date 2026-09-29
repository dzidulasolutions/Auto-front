"use client";

import Amount from "@/components/ui/amount";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { usePortalSavings } from "@/hooks/use-portal";
import { getErrorMessage } from "@/lib/api/errors";

export default function PortalSavingsView() {
  const { data, isPending, isError, error, refetch } = usePortalSavings();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-h1">Mon épargne</h1>

      {isPending && <Skeleton className="h-24 w-full" />}

      {isError && (
        <div className="bg-white p-4 flex flex-col items-start gap-3">
          <p className="text-small">{getErrorMessage(error)}</p>
          <Button size="sm" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="bg-white p-6">
          <p className="text-small text-muted">Aucun compte épargne.</p>
        </div>
      )}

      {data?.map((account) => (
        <div key={account.id} className="bg-white p-5 flex items-center justify-between">
          <div>
            <p className="text-body font-medium">{account.accountNumber}</p>
            <p className="text-caption text-muted">Solde disponible</p>
          </div>
          <Amount value={Number(account.balance)} className="text-h2" />
        </div>
      ))}
    </div>
  );
}