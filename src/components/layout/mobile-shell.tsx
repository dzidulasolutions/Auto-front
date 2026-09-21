import type { Area } from "@/config/areas";
import type { SessionUser } from "@/types/auth";
import LogoutButton from "./logout-button";
import NavLinks from "./nav-links";

interface Props {
  area: Area;
  user: SessionUser;
  children: React.ReactNode;
}

export default function MobileShell({ area, user, children }: Props) {
  return (
    <div className="min-h-dvh bg-zinc-100 font-ui text-black">
      <header className="h-14 px-4 bg-black text-white flex items-center justify-between">
        <span className="font-bold text-lg">Autogo.</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/60">{user.firstName}</span>
          <LogoutButton className="text-xs text-white/60" />
        </div>
      </header>
      <main className="w-full max-w-xl mx-auto p-4 pb-24">{children}</main>
      <NavLinks area={area} variant="bottom" />
    </div>
  );
}