"use client";

import { useState } from "react";
import Amount from "@/components/ui/amount";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ExpandableList from "@/components/ui/expandable-list";
import Skeleton from "@/components/ui/skeleton";
import { usePortalLoans } from "@/hooks/use-portal";
import { getErrorMessage } from "@/lib/api/errors";
import { LOAN_STATUS_LABELS, loanStatusTone } from "@/types/loan";
import type { PortalLoan } from "@/types/portal";

export default function PortalLoansView() {
  const { data, isPending, isError, error, refetch } = usePortalLoans();
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
        <h1 className="text-h1">Mes prêts</h1>
        <div className="bg-white p-6">
          <p className="text-small text-muted">Aucun prêt.</p>
        </div>
      </div>
    );
  }

  const open = data.find((l) => l.id === openId) as PortalLoan | undefined;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-h1">Mes prêts</h1>

      <div className="flex flex-col gap-2">
        {data.map((loan) => (
          <button
            key={loan.id}
            onClick={() => setOpenId(loan.id === openId ? null : loan.id)}
            className="w-full bg-white px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-surface transition-colors"
          >
            <div>
              <p className="text-body font-medium">{loan.loanNumber}</p>
              <p className="text-caption text-muted">
                {Number(loan.principal).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <Badge tone={loanStatusTone(loan.status)}>{LOAN_STATUS_LABELS[loan.status]}</Badge>
          </button>
        ))}
      </div>

      {open && (
        <div className="bg-surface p-4 flex flex-col gap-2">
          <p className="text-small text-muted mb-2">Échéancier — {open.loanNumber}</p>
          <ExpandableList
            items={open.schedules}
            className="flex flex-col gap-1"
            renderItem={(s) => (
              <div className="bg-white px-3 py-2 flex items-center justify-between text-small">
                <span>Échéance {s.installmentNumber}</span>
                <span>{Number(s.amountDue).toLocaleString("fr-FR")} FCFA</span>
                <Badge tone={s.status === "PAID" ? "success" : "neutral"}>
                  {s.status === "PAID" ? "Payée" : "À payer"}
                </Badge>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}