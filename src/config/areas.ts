import { IconlyHome, IconlyUser } from "@/components/ui/icons";

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

const accueil = (base: string): NavItem => ({
  label: "Accueil",
  href: base,
  icon: IconlyHome,
  exact: true,
});

const clients = (base: string): NavItem => ({
  label: "Clients",
  href: `${base}/clients`,
  icon: IconlyUser,
});

export const AREAS: Record<Area, AreaConfig> = {
  admin: {
    title: "Administration",
    shell: "desktop",
    nav: [accueil("/admin"), clients("/admin")],
  },
  manager: {
    title: "Agence",
    shell: "desktop",
    nav: [accueil("/manager"), clients("/manager")],
  },
  comptable: {
    title: "Comptabilité",
    shell: "desktop",
    nav: [accueil("/comptable")],
  },
  agent: {
    title: "Agent",
    shell: "mobile",
    nav: [accueil("/agent"), clients("/agent")],
  },
  caissier: {
    title: "Caisse",
    shell: "mobile",
    nav: [accueil("/caissier"), clients("/caissier")],
  },
  client: {
    title: "Mon espace",
    shell: "mobile",
    nav: [accueil("/client")],
  },
};