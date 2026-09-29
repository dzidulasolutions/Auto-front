"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateSetting } from "@/hooks/use-settings";
import { getErrorMessage } from "@/lib/api/errors";
import { SETTINGS_LABELS } from "@/types/settings";
import type { Setting } from "@/types/settings";

export default function SettingRow({ setting }: { setting: Setting }) {
  // affiché et saisi en pourcentage (20), converti en taux (0.2) pour l'API
  const [percent, setPercent] = useState(String(setting.value * 100));
  const [showError, setShowError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useUpdateSetting();

  const dirty = Number(percent) !== setting.value * 100;

  const handleSave = () => {
    reset();
    setShowError(false);

    const value = Number(percent);
    if (!percent || value < 0 || value > 100) return;

    mutate(
      { key: setting.key, value: value / 100 },
      {
        onSuccess: () => setNotice("Mis à jour."),
        onError: () => setShowError(true),
      },
    );
  };

  return (
    <div className="bg-white p-4 flex flex-col gap-3">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}
      {showError && error && (
        <Alert type="error" message={getErrorMessage(error)} onClose={() => setShowError(false)} />
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-body font-medium">{SETTINGS_LABELS[setting.key] ?? setting.key}</p>
          <p className="text-caption text-muted">{setting.key}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-24">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </div>
          <span className="text-body text-muted">%</span>
          <Button size="sm" loading={isPending} disabled={!dirty} onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}