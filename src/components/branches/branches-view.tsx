"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Skeleton from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import CreateBranchForm from "./create-branch-form";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useBranches } from "@/hooks/use-branches";

export default function BranchesView() {
  const { role } = useCurrentRole();
  const { data: branches, isPending, isError, error, refetch } = useBranches(role);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}

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
              <Badge tone={b.status === "ACTIVE" ? "success" : "neutral"}>
                {b.status === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
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
    </div>
  );
}