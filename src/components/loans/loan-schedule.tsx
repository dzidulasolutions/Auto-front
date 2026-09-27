export default function LoanSchedule({ loan }: { loan: { schedules: unknown[] }; clientId: string }) {
  return (
    <div className="bg-white p-4">
      <p className="text-small text-muted">Échéancier : {loan.schedules.length} échéances (à venir)</p>
    </div>
  );
}