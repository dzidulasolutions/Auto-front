import BranchSummaryView from "@/components/dashboard/branch-summary-view";
import PortfolioAtRiskView from "@/components/dashboard/portfolio-at-risk-view";
import MonthlyReportForm from "@/components/dashboard/monthly-report-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-h1">Accueil</h1>
      <BranchSummaryView />
      <PortfolioAtRiskView area="/admin" />
      <MonthlyReportForm />
    </div>
  );
}