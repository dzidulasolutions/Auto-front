import type { Area } from "@/config/areas";
import type { SessionUser } from "@/types/auth";
import LogoutButton from "./logout-button";
import NavLinks from "./nav-links";

interface Props {
  area: Area;
  user: SessionUser;
  focus: "mobile" | "desktop";
  children: React.ReactNode;
}

export default function AppShell({ area, user, focus, children }: Props) {
  // terrain : colonne lisible ; bureau : pleine largeur
  const width = focus === "mobile" ? "lg:max-w-5xl" : "";

  return (
    <div className="min-h-dvh lg:flex bg-zinc-100 font-ui text-black">
      {/* Desktop : sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-black text-white p-6 sticky top-0 h-dvh">
        <div>
          <div className="font-bold text-xl mb-10">Autogo.</div>
          <NavLinks area={area} variant="sidebar" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-white/60">{user.label}</p>
          </div>
          <LogoutButton className="text-xs text-white/60 hover:text-white text-left" />
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile : barre du haut */}
        <header className="lg:hidden sticky top-0 z-10 h-14 px-4 bg-black text-white flex items-center justify-between">
          <span className="font-bold text-lg">Autogo.</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60">{user.firstName}</span>
            <LogoutButton className="text-xs text-white/60" />
          </div>
        </header>

        <main className={`w-full mx-auto flex-1 p-4 pb-24 lg:p-8 lg:pb-8 ${width}`}>
          {children}
        </main>

        {/* Mobile : barre du bas */}
        <NavLinks area={area} variant="bottom" className="lg:hidden" />
      </div>
    </div>
  );
}