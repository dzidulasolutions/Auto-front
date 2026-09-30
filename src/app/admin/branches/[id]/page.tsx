import BranchDetailView from "@/components/branches/branch-detail-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BranchDetailView id={id} />;
}
