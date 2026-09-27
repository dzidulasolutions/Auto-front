"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import Amount from "@/components/ui/amount";
import Button from "@/components/ui/button";
import ExpandableList from "@/components/ui/expandable-list";
import Modal from "@/components/ui/modal";
import type { Loan, LoanScheduleItem } from "@/types/loan";
import RepayLoanForm from "./repay-loan-form";
import ScheduleRow from "./schedule-row";
import { FiCheckCircle } from "@/components/ui/icons";

interface Props {
  loan: Loan & { schedules: LoanScheduleItem[] };
  clientId: string;
}

export default function LoanSchedule({ loan, clientId }: Props) {
  const [repayOpen, setRepayOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const schedules = loan.schedules ?? [];
  const pending = schedules.filter((s) => s.status === "PENDING");
  const paid = schedules.filter((s) => s.status === "PAID");
  const remaining = pending.reduce((sum, s) => sum + Number(s.amountDue), 0);
  const allPaid = schedules.length > 0 && paid.length === schedules.length;

  return (
    <div className="flex flex-col gap-4">
      {notice && <Alert type="success" message={notice} onClose={() => setNotice(null)} />}

      <div
        className={`p-4 rounded-surface flex items-center justify-between ${
          allPaid ? "bg-success-bg" : "bg-surface"
        }`}
      >
        <div className="flex items-center gap-3">
          {allPaid && <FiCheckCircle size={20} color="#15803d" />}
          <div className="flex flex-col gap-2">
            <p className={`text-small ${allPaid ? "text-success" : "text-muted"}`}>
              {paid.length}/{schedules.length} échéances payées
            </p>
            {allPaid ? (
              <p className="text-h2 text-success">Prêt entièrement remboursé</p>
            ) : (
              <Amount value={remaining} className="text-h2" />
            )}
          </div>
        </div>
        {pending.length > 0 && loan.status === "DISBURSED" && (
          <Button size="sm" onClick={() => setRepayOpen(true)}>
            Rembourser
          </Button>
        )}
      </div>

      <ExpandableList
        items={schedules}
        className="flex flex-col gap-2"
        renderItem={(item) => <ScheduleRow item={item} />}
      />

      <Modal open={repayOpen} onClose={() => setRepayOpen(false)} title="Rembourser le prêt" variant="drawer">
        <RepayLoanForm
          clientId={clientId}
          loanId={loan.id}
          pending={pending}
          onSuccess={() => {
            setRepayOpen(false);
            setNotice("Remboursement enregistré.");
          }}
        />
      </Modal>
    </div>
  );
}