"use client";

import { useState } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { formatFcfa } from "@/components/ui/amount";
import { useCancelTransaction } from "@/hooks/use-transactions";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import { CAN_CANCEL_TRANSACTION_ROLES } from "@/types/auth";
import { TRANSACTION_LABELS } from "@/types/transaction";
import type { Transaction } from "@/types/transaction";
import { IconlyTrash } from "@/components/ui/icons";

const CREDIT = new Set(["DEPOSIT", "LOAN_DISBURSEMENT", "TONTINE_PAYOUT"]);

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const { role } = useCurrentRole();
  const canCancel = !!role && CAN_CANCEL_TRANSACTION_ROLES.includes(role);
  const isCredit = CREDIT.has(tx.type);
  const amount = Number(tx.amount);
  

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate: cancel, isPending } = useCancelTransaction();

  const CANCELLABLE_TYPES = new Set(["DEPOSIT", "WITHDRAWAL"]);

  const handleCancel = () => {
    if (!reason.trim()) return;
    setError(null);
    cancel(
      { id: tx.id, reason: reason.trim() },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setReason("");
        },
        onError: (e) => setError(getErrorMessage(e)),
      },
    );
  };

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white">
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium truncate">{TRANSACTION_LABELS[tx.type]}</p>
        <p className="text-xs text-black/50">
          {formatDate(tx.createdAt)} · {tx.performedBy.firstName} {tx.performedBy.lastName}
        </p>
      </div>

      {tx.status === "CANCELLED" && <Badge tone="error">Annulée</Badge>}

      <span
        className={`shrink-0 h-8 px-3 flex items-center rounded-control text-numeric font-numeric tabular-nums ${
          isCredit ? "bg-success-bg text-success" : "bg-error-bg text-error"
        } ${tx.status === "CANCELLED" ? "opacity-50" : ""}`}
      >
        {isCredit ? "+" : "−"} {formatFcfa(amount)}
      </span>

      {canCancel && tx.status === "COMPLETED" && CANCELLABLE_TYPES.has(tx.type) && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label="Annuler cette transaction"
          className="text-muted hover:text-error transition-colors shrink-0"
        >
          <IconlyTrash size={16} color="currentColor" />
        </button>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Annuler cette transaction ?">
        <div className="flex flex-col gap-4">
          <p className="text-small text-muted">
            {TRANSACTION_LABELS[tx.type]} de {formatFcfa(amount)}, effectuée le {formatDate(tx.createdAt)}.
          </p>
          <Input
            placeholder="Motif de l'annulation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          {error && <p className="text-small text-error">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" loading={isPending} disabled={!reason.trim()} onClick={handleCancel}>
              Confirmer l&apos;annulation
            </Button>
          </div>
        </div>
      </Modal>
    </li>
  );
}