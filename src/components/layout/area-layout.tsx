import { redirect } from "next/navigation";
import { AREAS, type Area } from "@/config/areas";
import { ROUTES } from "@/config/routes";
import { getSessionUser } from "@/lib/session";
import AppShell from "./app-shell";

export default async function AreaLayout({
  area,
  children,
}: {
  area: Area;
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  return (
<AppShell area={area} user={user} focus={AREAS[area].shell} isClient={area === "client"}>
  {children}
</AppShell>
  );
}