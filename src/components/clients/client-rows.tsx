import { formatDate } from "@/lib/format";
import type { Client } from "@/types/client";
import ClientAvatar from "./client-avatar";
import Link from "next/link";

const COLS_WITH_BRANCH = "grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr]";
const COLS_NO_BRANCH = "grid-cols-[2fr_1.2fr_1.2fr_1fr]";

export default function ClientRows({ items }: { items: Client[] }) {
  const showBranch = items.some((c) => c.branch);
  const cols = showBranch ? COLS_WITH_BRANCH : COLS_NO_BRANCH;

  return (
    <>
      {/* Mobile et tablette : cartes */}
      <ul className="xl:hidden flex flex-col gap-2">
        {items.map((c) => (
          <li key={c.id} className="relative bg-white px-4 py-3 flex items-center gap-3">
            <Link href={`clients/${c.id}`} className="absolute inset-0" aria-label={`${c.firstName} ${c.lastName}`} />

            <ClientAvatar client={c} />
            <div className="flex-1 min-w-0 pointer-events-none">
              <p className="text-[15px] font-medium truncate">
                {c.firstName} {c.lastName}
              </p>
              <p className="text-xs text-black/50">{c.clientNumber}</p>
            </div>


            <a href={`tel:${c.phone}`}
              className="relative z-10 text-xs text-black/60 py-3 pl-2 hover:text-black transition-colors"
            >
              {c.phone}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop large : tableau */}
      <div className="hidden xl:flex flex-col gap-2">
        <div className={`px-5 grid ${cols} gap-4 text-xs uppercase tracking-wide text-black/40`}>
          <span>Client</span>
          <span>N° client</span>
          <span>Téléphone</span>
          {showBranch && <span>Agence</span>}
          <span>Créé le</span>
        </div>

        {items.map((c) => (
          <Link
            key={c.id}
            href={`clients/${c.id}`}
            className={`bg-white px-5 py-4 grid ${cols} items-center gap-4 text-sm hover:bg-surface transition-colors`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ClientAvatar client={c} />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {c.firstName} {c.lastName}
                </p>
                <p className="text-xs text-black/50 truncate">{c.email ?? "Pas d'email"}</p>
              </div>
            </div>
            <span>{c.clientNumber}</span>
            <span>{c.phone}</span>
            {showBranch && <span className="truncate">{c.branch?.name ?? "—"}</span>}
            <span className="text-black/60">{formatDate(c.createdAt)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}