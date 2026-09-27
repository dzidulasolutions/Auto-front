import LoanDetailView from "@/components/loans/loan-detail-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LoanDetailView loanId={id} />;
}
