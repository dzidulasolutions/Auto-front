"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useRevokeOtherSessions, useRevokeSession, useSessions } from "@/hooks/use-sessions";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import { IconlyTrash } from "@/components/ui/icons";

export default function SessionsSection() {
  const { data, isPending, isError, error, refetch } = useSessions();
  const { mutate: revoke } = useRevokeSession();
  const { mutate: revokeOthers, isPending: revokingOthers } = useRevokeOtherSessions();

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setRevokingId(id);
    revoke(id, {
      onSuccess: () => setNotice("Session révoquée."),
      onError: (e) => setActionError(getErrorMessage(e)),
      onSettled: () => setRevokingId(null),
    });
  };

  const handleRevokeOthers = () => {
    revokeOthers(undefined, {
      onSuccess: () => setNotice("Les autres sessions ont été révoquées."),
      onError: (e) => setActionError(getErrorMessage(e)),
    });
  };

  if (isPending) return <Skeleton className="h-32 w-full" />;

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-small">{getErrorMessage(error)}</p>
        <Button size="sm" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <Alert type="error" message={actionError} onClose={() => setActionError(null)} />}

      <div className="flex items-center justify-between">
        <p className="text-body font-medium">Sessions actives</p>
        {data && data.length > 1 && (
          <Button variant="secondary" size="sm" loading={revokingOthers} onClick={handleRevokeOthers}>
            Révoquer les autres
          </Button>
        )}
      </div>

      {data && data.length === 0 && <p className="text-small text-muted">Aucune session active.</p>}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((s) => (
            <div key={s.id} className="bg-surface px-3 py-2 flex items-center justify-between gap-3 rounded-control">
              <div className="min-w-0">
                <p className="text-small truncate">{s.userAgent ?? "Appareil inconnu"}</p>
                <p className="text-caption text-muted">
                  {s.ipAddress ?? "IP inconnue"} · {formatDate(s.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRevoke(s.id)}
                disabled={revokingId === s.id}
                aria-label="Révoquer cette session"
                className="text-muted hover:text-error transition-colors shrink-0 disabled:opacity-40"
              >
                <IconlyTrash size={16} color="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}