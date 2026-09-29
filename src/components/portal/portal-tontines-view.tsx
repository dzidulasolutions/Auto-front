"use client";

import { useState } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ExpandableList from "@/components/ui/expandable-list";
import Skeleton from "@/components/ui/skeleton";
import { usePortalTontines } from "@/hooks/use-portal";
import { getErrorMessage } from "@/lib/api/errors";
import { CYCLE_STATUS_LABELS, isOverdue } from "@/types/tontine";

export default function PortalTontinesView() {
  const { data, isPending, isError, error, refetch } = usePortalTontines();
  const [openId, setOpenId] = useState<string | null>(null);

  if (isPending) return <Skeleton className="h-40 w-full" />;

  if (isError) {
    return (
      <div className="bg-white p-4 flex flex-col items-start gap-3">
        <p className="text-small">{getErrorMessage(error)}</p>
        <Button size="sm" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-h1">Mes tontines</h1>
        <div className="bg-white p-6">
          <p className="text-small text-muted">Aucune tontine.</p>
        </div>
      </div>
    );
  }

  const open = data.find((t) => t.id === openId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-h1">Mes tontines</h1>

      <div className="flex flex-col gap-2">
        {data.map((cycle) => (
          <button
            key={cycle.id}
            onClick={() => setOpenId(cycle.id === openId ? null : cycle.id)}
            className="w-full bg-white px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-surface transition-colors"
          >
            <div>
              <p className="text-body font-medium">{cycle.cycleNumber}</p>
              <p className="text-caption text-muted">
                {Number(cycle.amountPerCollection).toLocaleString("fr-FR")} FCFA / collecte
              </p>
            </div>
            <Badge tone={cycle.status === "ACTIVE" ? "neutral" : "success"}>
              {CYCLE_STATUS_LABELS[cycle.status] ?? cycle.status}
            </Badge>
          </button>
        ))}
      </div>

      {open && (
        <div className="bg-surface p-4 flex flex-col gap-2">
          <p className="text-small text-muted mb-2">Carnet — {open.cycleNumber}</p>
          <ExpandableList
            items={open.collections}
            className="flex flex-col gap-1"
            renderItem={(c) => {
              const overdue = isOverdue(c);
              return (
                <div className="bg-white px-3 py-2 flex items-center justify-between text-small">
                  <span>{new Date(c.scheduledDate).toLocaleDateString("fr-FR")}</span>
                  <Badge tone={overdue ? "error" : c.status === "COLLECTE" ? "success" : "neutral"}>
                    {overdue ? "En retard" : c.status === "COLLECTE" ? "Collectée" : "À collecter"}
                  </Badge>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}