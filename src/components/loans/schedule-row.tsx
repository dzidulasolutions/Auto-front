import Amount from "@/components/ui/amount";
import Badge from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { SCHEDULE_STATUS_LABELS, isScheduleOverdue, scheduleStatusTone } from "@/types/loan";
import type { LoanScheduleItem } from "@/types/loan";

export default function ScheduleRow({ item }: { item: LoanScheduleItem }) {
  const overdue = isScheduleOverdue(item);
  const label = overdue ? "En retard" : SCHEDULE_STATUS_LABELS[item.status];
  const tone = overdue ? "error" : scheduleStatusTone(item.status);

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white">
      <div className="flex-1 min-w-0">
        <p className="text-caption text-muted">Échéance {item.installmentNumber}</p>
        <p className="text-body">{formatDate(item.dueDate)}</p>
      </div>
      <Badge tone={tone}>{label}</Badge>
      <Amount value={Number(item.amountDue)} className="shrink-0" />
    </li>
  );
}