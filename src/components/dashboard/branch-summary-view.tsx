"use client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useState } from "react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import { chart_display_v0 } from "@/lib/chart"; 
import { useBranches } from "@/hooks/use-branches";
import { useBranchSummary } from "@/hooks/use-dashboard";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import { PRIVILEGED_ROLES } from "@/types/auth";


export default function BranchSummaryView() {
  const { role } = useCurrentRole();
  const isPrivileged = !!role && PRIVILEGED_ROLES.includes(role);
  const { data: branches } = useBranches(role);
  const [branchId, setBranchId] = useState<string>("");

  const { data, isPending, isError, error, refetch } = useBranchSummary(
    isPrivileged ? branchId || undefined : undefined,
  );

  const totalTransactions = data?.reduce((sum, d) => sum + d.transaction_count, 0) ?? 0;
  const totalDeposits = data?.reduce((sum, d) => sum + d.total_deposits, 0) ?? 0;
  const totalDisbursements = data?.reduce((sum, d) => sum + d.total_disbursements, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2">Résumé d&apos;agence</h2>

      {isPrivileged && (
        <Select
          placeholder="Choisir une agence"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
        >
          {branches?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.city}
            </option>
          ))}
        </Select>
      )}

      {isPrivileged && !branchId && (
        <div className="bg-white p-6">
          <p className="text-small text-muted">Choisissez une agence pour voir son résumé.</p>
        </div>
      )}

      {(!isPrivileged || branchId) && isPending && <Skeleton className="h-40 w-full" />}

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
          <p className="text-small text-muted">Aucune activité sur les 30 derniers jours.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-4">
              <p className="text-caption text-muted uppercase">Transactions</p>
              <p className="text-h2">{totalTransactions}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-caption text-muted uppercase">Dépôts</p>
              <p className="text-h2">{totalDeposits.toLocaleString("fr-FR")}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-caption text-muted uppercase">Décaissements</p>
              <p className="text-h2">{totalDisbursements.toLocaleString("fr-FR")}</p>
            </div>
          </div>

          <div className="bg-white p-4 flex flex-col gap-2">
            <p className="text-small text-muted mb-2">Activité par jour (30 derniers jours)</p>
            {[...data]
              .sort((a, b) => a.summary_date.localeCompare(b.summary_date))
              .map((day) => (
                <div key={day.summary_date} className="flex items-center justify-between text-small">
                  <span className="text-muted">{formatDate(day.summary_date)}</span>
                  <span>{day.transaction_count} transactions</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}