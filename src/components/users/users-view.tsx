"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { useDeactivateUser, useUsers } from "@/hooks/use-users";
import { getErrorMessage } from "@/lib/api/errors";
import { IconlyTrash } from "@/components/ui/icons";
import type { StaffMember } from "@/types/user";
import CreateUserForm from "./create-user-form";

export default function UsersView() {
  const { data: users, isPending, isError, error, refetch } = useUsers();
  const { mutate: deactivate, isPending: deactivating } = useDeactivateUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState<StaffMember | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDeactivate = () => {
    if (!confirmUser) return;
    deactivate(confirmUser.id, {
      onSuccess: () => {
        setConfirmUser(null);
        setNotice("Utilisateur désactivé.");
      },
      onError: (e) => setActionError(getErrorMessage(e)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <Alert type="error" message={actionError} onClose={() => setActionError(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-h1">Utilisateurs</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Nouvel utilisateur
        </Button>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-white p-4 flex flex-col items-start gap-3">
          <p className="text-small">{getErrorMessage(error)}</p>
          <Button size="sm" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      )}

      {users && users.length > 0 && (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="bg-white px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-body font-medium truncate">
                  {u.firstName} {u.lastName}
                </p>
                <p className="text-caption text-muted truncate">{u.email} · {u.role.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge tone={u.status === "ACTIVE" ? "success" : "neutral"}>
                  {u.status === "ACTIVE" ? "Actif" : "Désactivé"}
                </Badge>
                {u.status === "ACTIVE" && (
                  <button
                    type="button"
                    onClick={() => setConfirmUser(u)}
                    aria-label="Désactiver"
                    className="text-muted hover:text-error transition-colors"
                  >
                    <IconlyTrash size={16} color="currentColor" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nouvel utilisateur" variant="drawer">
        <CreateUserForm
          onSuccess={() => {
            setCreateOpen(false);
            setNotice("Utilisateur créé.");
          }}
        />
      </Modal>

      <Modal open={!!confirmUser} onClose={() => setConfirmUser(null)} title="Désactiver cet utilisateur ?">
        <div className="flex flex-col gap-4">
          <p className="text-small text-muted">
            {confirmUser?.firstName} {confirmUser?.lastName} ne pourra plus se connecter.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmUser(null)}>
              Annuler
            </Button>
            <Button variant="danger" loading={deactivating} onClick={handleDeactivate}>
              Désactiver
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}