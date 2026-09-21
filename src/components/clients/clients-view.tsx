"use client";

import { useState } from "react";
import SearchInput from "@/components/ui/search-input";
import { SEARCH_MIN_CHARS, useClients, useClientSearch } from "@/hooks/use-clients";
import { useDebounce } from "@/hooks/use-debounce";
import { getErrorMessage } from "@/lib/api/errors";
import ClientRows from "./client-rows";
import ClientsListSkeleton from "./clients-list-skeleton";

const LIMIT = 20;

export default function ClientsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const debounced = useDebounce(trimmed, 500);
  const searching = debounced.length >= SEARCH_MIN_CHARS;
  const tooShort = trimmed.length > 0 && trimmed.length < SEARCH_MIN_CHARS;

  const list = useClients(page, LIMIT);
  const search = useClientSearch(searching ? debounced : "");

  const current = searching ? search : list;
  const items = searching ? search.data : list.data?.items;
  const meta = list.data?.meta;
  const dimmed = current.isPlaceholderData || trimmed !== debounced;

  const subtitle = searching
    ? items && `${items.length} ${items.length > 1 ? "résultats" : "résultat"}`
    : meta && `${meta.total} ${meta.total > 1 ? "clients" : "client"}`;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        {subtitle && <p className="text-sm text-black/50">{subtitle}</p>}
      </header>

      <div className="flex flex-col gap-2">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Nom, téléphone ou numéro client"
        />
        {tooShort && (
          <p className="text-xs text-black/50">
            Saisissez au moins {SEARCH_MIN_CHARS} caractères.
          </p>
        )}
      </div>

      {current.isPending && <ClientsListSkeleton showBranch={!searching} />}

      {current.isError && (
        <div className="bg-white p-6 flex flex-col items-start gap-4">
          <p className="text-sm">{getErrorMessage(current.error)}</p>
          <button
            onClick={() => current.refetch()}
            className="h-10 px-5 bg-black text-white text-sm hover:bg-black/85 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {items && items.length === 0 && (
        <div className="bg-white p-8 flex flex-col gap-1">
          {searching ? (
            <>
              <p className="text-sm font-medium">Aucun résultat pour « {debounced} »</p>
              <p className="text-sm text-black/50">
                Vérifiez l&apos;orthographe ou essayez un numéro de téléphone.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Aucun client pour le moment</p>
              <p className="text-sm text-black/50">Les clients ajoutés apparaîtront ici.</p>
            </>
          )}
        </div>
      )}

      {items && items.length > 0 && (
        <div className={`transition-opacity ${dimmed ? "opacity-60" : ""}`}>
          <ClientRows items={items} />

          {!searching && meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-10 px-5 bg-white disabled:opacity-40 transition-opacity"
              >
                Précédent
              </button>
              <span className="text-black/50">
                Page {meta.page} sur {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPages}
                className="h-10 px-5 bg-white disabled:opacity-40 transition-opacity"
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