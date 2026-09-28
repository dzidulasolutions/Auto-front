import BranchSummaryView from "@/components/dashboard/branch-summary-view";
import PortfolioAtRiskView from "@/components/dashboard/portfolio-at-risk-view";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-h1">Accueil</h1>
      <BranchSummaryView />
      <PortfolioAtRiskView area="/admin" />
    </div>
  );
}