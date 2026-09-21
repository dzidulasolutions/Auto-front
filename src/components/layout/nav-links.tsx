"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AREAS, type Area } from "@/config/areas";

interface Props {
  area: Area;
  variant: "sidebar" | "bottom";
  className?: string;
}

export default function NavLinks({ area, variant, className = "" }: Props) {
  const pathname = usePathname();
  const items = AREAS[area].nav;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  if (variant === "sidebar") {
    return (
      <nav className={`flex flex-col gap-1 ${className}`}>
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`h-10 px-3 flex items-center gap-3 font-ui text-sm transition-colors ${
                active ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon size={18} color="currentColor" />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 h-16 bg-white flex justify-around items-center shadow-[0_-8px_24px_rgba(0,0,0,0.06)] ${className}`}
    >
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 font-ui text-xs ${
              active ? "text-black" : "text-black/40"
            }`}
          >
            <Icon size={20} color="currentColor" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}