"use client";

import Amount from "@/components/ui/amount";
import Skeleton from "@/components/ui/skeleton";
import { usePortalLoans, usePortalMe, usePortalSavings, usePortalTontines } from "@/hooks/use-portal";

export default function PortalHome() {
  const { data: me } = usePortalMe();
  const { data: savings, isPending: savingsPending } = usePortalSavings();
  const { data: loans, isPending: loansPending } = usePortalLoans();
  const { data: tontines, isPending: tontinesPending } = usePortalTontines();

  const totalSavings = savings?.reduce((sum, a) => sum + Number(a.balance), 0) ?? 0;
  const activeLoans = loans?.filter((l) => l.status === "DISBURSED").length ?? 0;
  const activeTontines = tontines?.filter((t) => t.status === "ACTIVE").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1">Bonjour {me?.firstName ?? ""}</h1>
        <p className="text-small text-muted">{me?.clientNumber}</p>
      </div>

      <div className="bg-black text-white p-5 flex flex-col gap-1">
        <span className="text-caption uppercase text-white/60">Épargne totale</span>
        {savingsPending ? (
          <Skeleton className="h-8 w-32 bg-white/20" />
        ) : (
          <Amount value={totalSavings} className="text-display text-white" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-4">
          <p className="text-caption text-muted uppercase">Prêts actifs</p>
          {loansPending ? <Skeleton className="h-6 w-10" /> : <p className="text-h2">{activeLoans}</p>}
        </div>
        <div className="bg-white p-4">
          <p className="text-caption text-muted uppercase">Tontines actives</p>
          {tontinesPending ? <Skeleton className="h-6 w-10" /> : <p className="text-h2">{activeTontines}</p>}
        </div>
      </div>
    </div>
  );
}