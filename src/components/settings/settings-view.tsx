"use client";

import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/use-settings";
import { getErrorMessage } from "@/lib/api/errors";
import { SETTINGS_ORDER } from "@/types/settings";
import SettingRow from "./setting-row";

export default function SettingsView() {
  const { data, isPending, isError, error, refetch } = useSettings();

  const ordered = data
    ? [...data].sort((a, b) => SETTINGS_ORDER.indexOf(a.key) - SETTINGS_ORDER.indexOf(b.key))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1">Paramètres</h1>

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
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

      {ordered.length > 0 && (
        <div className="flex flex-col gap-2">
          {ordered.map((setting) => (
            <SettingRow key={setting.id} setting={setting} />
          ))}
        </div>
      )}
    </div>
  );
}