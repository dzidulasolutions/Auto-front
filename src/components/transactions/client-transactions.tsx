"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useTransactions } from "@/hooks/use-transactions";
import { getErrorMessage } from "@/lib/api/errors";
import CreateTransactionForm from "./create-transaction-form";
import TransactionRow from "./transaction-row";
import TransactionsListSkeleton from "./transactions-list-skeleton";
import type { TransactionType } from "@/types/transaction";

export default function ClientTransactions({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useTransactions({ clientId, limit: 10 });
  const [open, setOpen] = useState<Extract<TransactionType, "DEPOSIT" | "WITHDRAWAL"> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-h2">Transactions</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpen("DEPOSIT")}>
            Dépôt
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setOpen("WITHDRAWAL")}>
            Retrait
          </Button>
        </div>
      </div>

      {isPending && <TransactionsListSkeleton />}

      {isError && (
        <div className="bg-white p-4 flex flex-col items-start gap-3">
          <p className="text-small">{getErrorMessage(error)}</p>
          <Button size="sm" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="bg-white p-6">
          <p className="text-small text-muted">Aucune transaction pour ce client.</p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {data.items.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </ul>
      )}

      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open === "DEPOSIT" ? "Nouveau dépôt" : "Nouveau retrait"}
        variant="drawer"
      >
        {open && (
          <CreateTransactionForm
            clientId={clientId}
            type={open}
            onSuccess={() => {
              setOpen(null);
              setNotice(open === "DEPOSIT" ? "Dépôt enregistré." : "Retrait enregistré.");
            }}
          />
        )}
      </Modal>
    </div>
  );
}