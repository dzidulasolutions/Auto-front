import ClientDetailView from "@/components/clients/client-detail-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientDetailView id={id} area="/admin" />;
}
