import { redirect } from "next/navigation";
import { AREAS, type Area } from "@/config/areas";
import { ROUTES } from "@/config/routes";
import { getSessionUser } from "@/lib/session";
import DesktopShell from "./desktop-shell";
import MobileShell from "./mobile-shell";

export default async function AreaLayout({
  area,
  children,
}: {
  area: Area;
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  const Shell = AREAS[area].shell === "desktop" ? DesktopShell : MobileShell;
  return (
    <Shell area={area} user={user}>
      {children}
    </Shell>
  );
}