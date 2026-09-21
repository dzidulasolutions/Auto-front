import { IconlyHome } from "@/components/ui/icons";

export type Area = "admin" | "manager" | "agent" | "caissier" | "comptable" | "client";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof IconlyHome;
  exact?: boolean;
}

interface AreaConfig {
  title: string;
  shell: "desktop" | "mobile";
  nav: NavItem[];
}

const accueil = (href: string): NavItem => ({
  label: "Accueil",
  href,
  icon: IconlyHome,
  exact: true,
});

export const AREAS: Record<Area, AreaConfig> = {
  admin: { title: "Administration", shell: "desktop", nav: [accueil("/admin")] },
  manager: { title: "Agence", shell: "desktop", nav: [accueil("/manager")] },
  comptable: { title: "Comptabilité", shell: "desktop", nav: [accueil("/comptable")] },
  agent: { title: "Agent", shell: "mobile", nav: [accueil("/agent")] },
  caissier: { title: "Caisse", shell: "mobile", nav: [accueil("/caissier")] },
  client: { title: "Mon espace", shell: "mobile", nav: [accueil("/client")] },
};