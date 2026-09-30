"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { useBranches, useDeactivateBranch } from "@/hooks/use-branches";
import { getErrorMessage } from "@/lib/api/errors";
import type { Branch } from "@/types/branch";
import CreateBranchForm from "./create-branch-form";
import EditBranchForm from "./edit-branch-form";
import { useCurrentRole } from "@/hooks/use-current-role";
import { IconlyEdit, IconlyTrash } from "@/components/ui/icons";

export default function BranchesView() {
  const { role } = useCurrentRole();
  const { data: branches, isPending, isError, error, refetch } = useBranches(role);
  const { mutate: deactivate, isPending: deactivating } = useDeactivateBranch();

  const [createOpen, setCreateOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [confirmBranch, setConfirmBranch] = useState<Branch | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDeactivate = () => {
    if (!confirmBranch) return;
    deactivate(confirmBranch.id, {
      onSuccess: () => {
        setConfirmBranch(null);
        setNotice("Agence désactivée.");
      },
      onError: (e) => setActionError(getErrorMessage(e)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <Alert type="error" message={actionError} onClose={() => setActionError(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-h1">Agences</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Nouvelle agence
        </Button>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
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

      {branches && branches.length > 0 && (
        <div className="flex flex-col gap-2">
          {branches.map((b) => (
            <div key={b.id} className="bg-white px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-body font-medium">
                  {b.name} — {b.code}
                </p>
                <p className="text-caption text-muted">{b.city}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge tone={b.status === "ACTIVE" ? "success" : "neutral"}>
                  {b.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
                <Button variant="secondary" size="sm" onClick={() => setEditBranch(b)}>
                  <IconlyEdit size={16} color="currentColor" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
                {b.status === "ACTIVE" && (
                  <Button variant="danger" size="sm" onClick={() => setConfirmBranch(b)}>
                    <IconlyTrash size={16} color="currentColor" />
                    <span className="hidden sm:inline">Désactiver</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nouvelle agence" variant="drawer">
        <CreateBranchForm
          onSuccess={() => {
            setCreateOpen(false);
            setNotice("Agence créée.");
          }}
        />
      </Modal>

      <Modal open={!!editBranch} onClose={() => setEditBranch(null)} title="Modifier l'agence" variant="drawer">
        {editBranch && (
          <EditBranchForm
            branch={editBranch}
            onSuccess={() => {
              setEditBranch(null);
              setNotice("Agence mise à jour.");
            }}
          />
        )}
      </Modal>

      <Modal open={!!confirmBranch} onClose={() => setConfirmBranch(null)} title="Désactiver cette agence ?">
        <div className="flex flex-col gap-4">
          <p className="text-small text-muted">
            {confirmBranch?.name} ne sera plus utilisable pour de nouvelles opérations. Cette action
            peut être annulée par un administrateur.
          </p>
          
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmBranch(null)}>
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