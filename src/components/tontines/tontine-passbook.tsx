"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Amount, { formatFcfa } from "@/components/ui/amount";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useCloseTontine, useTontineCollections, useValidateCollection } from "@/hooks/use-tontines";
import { getErrorMessage } from "@/lib/api/errors";
import { CYCLE_STATUS_LABELS } from "@/types/tontine";
import CollectionRow from "./collection-row";

export default function TontinePassbook({ cycleId, clientId }: { cycleId: string; clientId: string }) {
  const { data, isPending, isError, error, refetch } = useTontineCollections(cycleId);
  const validate = useValidateCollection(cycleId, clientId);
  const close = useCloseTontine(cycleId, clientId);

  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-small">{getErrorMessage(error)}</p>
        <Button size="sm" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  const { cycle, progression, collections } = data;
  const isActive = cycle.status === "ACTIVE";

  const handleValidate = (collectionId: string) => {
    setActionError(null);
    setValidatingId(collectionId);
    validate.mutate(collectionId, {
      onSuccess: () => setNotice("Collecte validée."),
      onError: (e) => setActionError(getErrorMessage(e)),
      onSettled: () => setValidatingId(null),
    });
  };

  const handleClose = () => {
    setActionError(null);
    close.mutate(undefined, {
      onSuccess: () => setNotice("Cycle clôturé, restitution enregistrée."),
      onError: (e) => setActionError(getErrorMessage(e)),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <Alert type="error" message={actionError} onClose={() => setActionError(null)} />}

      <div className="bg-surface p-4 rounded-surface flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-small text-muted">Montant par collecte</span>
          <Amount value={Number(cycle.amountPerCollection)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-muted">Collecté</span>
          <span className="text-numeric font-numeric tabular-nums">
            {formatFcfa(progression.amountCollected)}
          </span>
        </div>
        <div className="flex items-center justify-between text-small text-muted">
          <span>
            {progression.collected}/{progression.total} collectées
          </span>
          <Badge tone={isActive ? "neutral" : "success"}>
            {CYCLE_STATUS_LABELS[cycle.status] ?? cycle.status}
          </Badge>
        </div>
      </div>

      {isActive && (
        <Button variant="secondary" size="sm" loading={close.isPending} onClick={handleClose}>
          Clôturer le cycle
        </Button>
      )}

      <ul className="flex flex-col gap-2 max-h-[50dvh] overflow-y-auto">
        {collections.map((c) => (
          <CollectionRow
            key={c.id}
            collection={c}
            onValidate={() => handleValidate(c.id)}
            validating={validatingId === c.id}
            disabled={!isActive}
          />
        ))}
      </ul>
    </div>
  );
}