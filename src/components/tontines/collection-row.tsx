import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { COLLECTION_STATUS_LABELS, collectionStatusTone } from "@/types/tontine";
import type { TontineCollection } from "@/types/tontine";

interface Props {
  collection: TontineCollection;
  onValidate: () => void;
  validating: boolean;
  disabled: boolean;
}

export default function CollectionRow({ collection, onValidate, validating, disabled }: Props) {
  const label = COLLECTION_STATUS_LABELS[collection.status] ?? collection.status;
  const canValidate = collection.status === "A_COLLECTER";

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white">
      <div className="flex-1 min-w-0">
        <p className="text-body">{formatDate(collection.scheduledDate)}</p>
      </div>
      <Badge tone={collectionStatusTone(collection.status)}>{label}</Badge>
      {canValidate && (
        <Button size="sm" variant="secondary" loading={validating} disabled={disabled} onClick={onValidate}>
          Valider
        </Button>
      )}
    </li>
  );
}