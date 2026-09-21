import AreaLayout from "@/components/layout/area-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AreaLayout area="agent">{children}</AreaLayout>;
}
