import Badge from "@/components/ui/badge";
import { formatFcfa } from "@/components/ui/amount";
import { formatDate } from "@/lib/format";
import { TRANSACTION_LABELS } from "@/types/transaction";
import type { Transaction } from "@/types/transaction";

const CREDIT = new Set(["DEPOSIT", "LOAN_DISBURSEMENT", "TONTINE_PAYOUT"]);

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = CREDIT.has(tx.type);
  const amount = Number(tx.amount);

  return (
    <li className="bg-white px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium truncate">{TRANSACTION_LABELS[tx.type]}</p>
        <p className="text-xs text-black/50">
          {formatDate(tx.createdAt)} · {tx.performedBy.firstName} {tx.performedBy.lastName}
        </p>
      </div>

      {tx.status === "CANCELLED" && <Badge tone="error">Annulée</Badge>}

      <span
        className={`shrink-0 h-8 px-3 flex items-center rounded-control font-numeric text-xs tabular-nums ${
          isCredit ? "bg-success-bg text-success" : "bg-error-bg text-error"
        } ${tx.status === "CANCELLED" ? "opacity-50" : ""}`}
      >
        {isCredit ? "+" : "−"} {formatFcfa(amount)}
      </span>
    </li>
  );
}