"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useDisableMfa, useEnableMfa, useSetupMfa } from "@/hooks/use-mfa";
import { getErrorMessage } from "@/lib/api/errors";

export default function MfaSection({ enabled }: { enabled: boolean }) {
    const [setupOpen, setSetupOpen] = useState(false);
    const [disableOpen, setDisableOpen] = useState(false);
    const [code, setCode] = useState("");
    const [notice, setNotice] = useState<string | null>(null);

    const { mutate: startSetup, data: setupData, isPending: settingUp, reset: resetSetup } = useSetupMfa();
    const { mutate: enable, isPending: enabling, error: enableError, reset: resetEnable } = useEnableMfa();
    const { mutate: disable, isPending: disabling, error: disableError, reset: resetDisable } = useDisableMfa();

    const openSetup = () => {
        resetSetup();
        setCode("");
        setSetupOpen(true);
        startSetup();
    };

    const handleEnable = (e: React.FormEvent) => {
        e.preventDefault();
        resetEnable();
        enable(code, {
            onSuccess: () => {
                setSetupOpen(false);
                setNotice("Authentification à deux facteurs activée.");
            },
        });
    };

    const handleDisable = (e: React.FormEvent) => {
        e.preventDefault();
        resetDisable();
        disable(code, {
            onSuccess: () => {
                setDisableOpen(false);
                setNotice("Authentification à deux facteurs désactivée.");
            },
        });
    };

    return (
        <div className="flex flex-col gap-3">
            {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-body font-medium">Authentification à deux facteurs</p>
                    <p className="text-caption text-muted">Protège votre compte avec un code temporaire</p>
                </div>
                <Badge tone={enabled ? "success" : "neutral"}>{enabled ? "Activée" : "Désactivée"}</Badge>
            </div>

            {enabled ? (
                <Button variant="danger" size="sm" onClick={() => { setCode(""); setDisableOpen(true); }}>
                    Désactiver
                </Button>
            ) : (
                <Button size="sm" onClick={openSetup}>
                    Activer
                </Button>
            )}

            <Modal open={setupOpen} onClose={() => setSetupOpen(false)} title="Activer la double authentification">
                <div className="flex flex-col gap-4">
                    {settingUp && <p className="text-small text-muted">Génération du code QR…</p>}
                    {setupData && (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element -- data URI, next/image non pertinent ici */}
                            <img src={setupData.qrCodeDataUrl} alt="QR code MFA" className="mx-auto" />
                            <p className="text-caption text-muted text-center">
                                Scannez ce code, ou entrez cette clé manuellement si vous êtes sur le même appareil :
                            </p>
                            <div className="bg-surface px-3 py-2 rounded-control flex items-center justify-between gap-2">
                                <code className="text-small font-mono break-all">{setupData.secret}</code>
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(setupData.secret)}
                                    className="text-caption text-muted hover:text-foreground transition-colors shrink-0"
                                >
                                    Copier
                                </button>
                            </div>
                        </>
                    )}

                    <form onSubmit={handleEnable} className="flex flex-col gap-3">
                        <Input
                            placeholder="Code à 6 chiffres"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                            required
                        />
                        {enableError && <p className="text-small text-error">{getErrorMessage(enableError)}</p>}
                        <Button type="submit" loading={enabling} disabled={!setupData}>
                            Confirmer
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal open={disableOpen} onClose={() => setDisableOpen(false)} title="Désactiver la double authentification">
                <form onSubmit={handleDisable} className="flex flex-col gap-4">
                    <p className="text-small text-muted">Entrez votre code actuel pour confirmer.</p>
                    <Input
                        placeholder="Code à 6 chiffres"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        required
                    />
                    {disableError && <p className="text-small text-error">{getErrorMessage(disableError)}</p>}
                    <Button type="submit" variant="danger" loading={disabling}>
                        Désactiver
                    </Button>
                </form>
            </Modal>
        </div>
    );
}