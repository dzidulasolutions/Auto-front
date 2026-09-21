"use client";

import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import ClientAvatar from "./client-avatar";
import ClientsListSkeleton from "./clients-list-skeleton";

const LIMIT = 20;

export default function ClientsView() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isPlaceholderData, refetch } = useClients(page, LIMIT);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        {data && (
          <p className="text-sm text-black/50 mt-1">
            {data.meta.total} {data.meta.total > 1 ? "clients" : "client"}
          </p>
        )}
      </div>

      {isPending && <ClientsListSkeleton />}

      {isError && (
        <div className="bg-white p-6 flex flex-col items-start gap-3">
          <p className="text-sm">{getErrorMessage(error)}</p>
          <button onClick={() => refetch()} className="h-9 px-4 bg-black text-white text-sm">
            Réessayer
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="bg-white p-6">
          <p className="text-sm text-black/60">Aucun client pour le moment.</p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
          {/* mobile */}
          <ul className="lg:hidden flex flex-col gap-2">
            {data.items.map((c) => (
              <li key={c.id} className="bg-white p-4 flex items-center gap-3">
                <ClientAvatar client={c} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-xs text-black/50">{c.clientNumber}</p>
                </div>
                <p className="text-xs text-black/60">{c.phone}</p>
              </li>
            ))}
          </ul>

          {/* desktop */}
          <div className="hidden lg:flex flex-col gap-2">
            <div className="px-4 grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr] gap-4 text-xs uppercase text-black/40">
              <span>Client</span>
              <span>N° client</span>
              <span>Téléphone</span>
              <span>Agence</span>
              <span>Créé le</span>
            </div>
            {data.items.map((c) => (
              <div
                key={c.id}
                className="bg-white px-4 py-3 grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr] items-center gap-4 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ClientAvatar client={c} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-black/50 truncate">{c.email ?? "Pas d'email"}</p>
                  </div>
                </div>
                <span>{c.clientNumber}</span>
                <span>{c.phone}</span>
                <span className="truncate">{c.branch?.name ?? "—"}</span>
                <span className="text-black/60">{formatDate(c.createdAt)}</span>
              </div>
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-9 px-4 bg-white disabled:opacity-40"
              >
                Précédent
              </button>
              <span className="text-black/60">
                Page {data.meta.page} sur {data.meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.meta.totalPages}
                className="h-9 px-4 bg-white disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}