"use client";

import { useState } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { getErrorMessage } from "@/lib/api/errors";

interface Props {
  verified: boolean;
  label: string;
  disabled?: boolean;
  onSendCode: () => Promise<unknown>;
  onVerify: (code: string) => Promise<unknown>;
  onVerified: () => void;
}

export default function VerifyField({ verified, label, disabled, onSendCode, onVerify, onVerified }: Props) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    setSent(false);
    setCode("");
    setError(null);
    setSending(true);
    try {
      await onSendCode();
      setSent(true);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setVerifying(true);
    try {
      await onVerify(code);
      setOpen(false);
      onVerified();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setVerifying(false);
    }
  };

  if (verified) {
    return <Badge tone="success">Vérifié</Badge>;
  }

  return (
    <>
      <button type="button" onClick={handleOpen} disabled={disabled} className="inline-flex disabled:opacity-40">
        <Badge tone="warning">Non vérifié · Vérifier</Badge>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={`Vérifier ${label.toLowerCase()}`}>
        <div className="flex flex-col gap-4">
          {sending && <p className="text-small text-muted">Envoi du code…</p>}
          {sent && !sending && (
            <p className="text-small text-muted">Un code a été envoyé. Entrez-le ci-dessous.</p>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-3">
            <Input
              placeholder="Code reçu"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
            {error && <p className="text-small text-error">{error}</p>}
            <Button type="submit" loading={verifying} disabled={!sent} onClick={(e) => e.stopPropagation()}>
              Confirmer
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}