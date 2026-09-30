import { redirect } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import { ROUTES } from "@/config/routes";
import { getSessionUser } from "@/lib/session";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);

  // Pas d'espace propre : on réutilise le shell "agent" par défaut pour l'apparence,
  // la nav de la sidebar reste celle-ci quel que soit le rôle réel.
  return (
    <AppShell area="agent" user={user} focus="mobile">
      {children}
    </AppShell>
  );
}