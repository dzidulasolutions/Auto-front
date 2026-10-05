import {
  IconlyHome,
  IconlyUser,
  IconlyWallet,
  IconlyDiscount,
  IconlyGraph,
  IconlyChart,
  IconlyLocation2
} from "@/components/ui/icons";

export type Area =
  | "admin"
  | "manager"
  | "agent"
  | "caissier"
  | "comptable"
  | "client";

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

const loans = (base: string): NavItem => ({
  label: "Prêts",
  href: `${base}/loans`,
  icon: IconlyWallet,
});

const savings = (base: string): NavItem => ({
  label: "Épargne",
  href: `${base}/savings`,
  icon: IconlyDiscount,
});

const tontines = (base: string): NavItem => ({
  label: "Tontines",
  href: `${base}/tontines`,
  icon: IconlyGraph,
});

const settings = (base: string): NavItem => ({
  label: "Paramètres",
  href: `${base}/settings`,
  icon: IconlyChart,
});

const portalLoans = (base: string): NavItem => ({
  label: "Prêts",
  href: `${base}/loans`,
  icon: IconlyWallet,
});

const portalSavings = (base: string): NavItem => ({
  label: "Épargne",
  href: `${base}/savings`,
  icon: IconlyDiscount,
});

const portalTontines = (base: string): NavItem => ({
  label: "Tontines",
  href: `${base}/tontines`,
  icon: IconlyGraph,
});

const branches = (base: string): NavItem => ({
  label: "Agences",
  href: `${base}/branches`,
  icon: IconlyLocation2, // ou une icône plus adaptée si tu en as une
});

const users = (base: string): NavItem => ({
  label: "Utilisateurs",
  href: `${base}/users`,
  icon: IconlyUser,
});


export const AREAS: Record<Area, AreaConfig> = {
  admin: {
    title: "Administration",
    shell: "desktop",
    nav: [
      accueil("/admin"),
      clients("/admin"),
      loans("/admin"),
      savings("/admin"),
      tontines("/admin"),
      branches("/admin"),
      settings("/admin"),
      users("/admin")
    ],
  },
  manager: {
    title: "Agence",
    shell: "desktop",
    nav: [
      accueil("/manager"),
      clients("/manager"),
      loans("/manager"),
      savings("/manager"),
      tontines("/manager"),
    ],
  },
  comptable: {
    title: "Comptabilité",
    shell: "desktop",
    nav: [accueil("/comptable")],
  },
  agent: {
    title: "Agent",
    shell: "mobile",
    nav: [
      accueil("/agent"),
      clients("/agent"),
      loans("/agent"),
      savings("/agent"),
      tontines("/agent"),
    ],
  },
  caissier: {
    title: "Caisse",
    shell: "mobile",
    nav: [
      accueil("/caissier"),
      clients("/caissier"),
      loans("/caissier"),
      savings("/caissier"),
      tontines("/caissier"),
    ],
  },
  client: {
    title: "Mon espace",
    shell: "mobile",
    nav: [
      accueil("/client"),
      portalLoans("/client"),
      portalSavings("/client"),
      portalTontines("/client"),
    ],
  },
};
