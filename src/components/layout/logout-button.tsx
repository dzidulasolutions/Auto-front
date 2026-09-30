"use client";

import { useState } from "react";
import { logout } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";
import { IconlyLogout } from "@/components/ui/icons";

interface Props {
  className?: string;
  iconOnly?: boolean;
}

export default function LogoutButton({ className = "", iconOnly = false }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await logout().catch(() => {});
    window.location.assign(ROUTES.login);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label="Se déconnecter"
      className={`font-ui inline-flex items-center gap-2 ${className}`}
    >
      <IconlyLogout size={16} color="currentColor" />
      {!iconOnly && <span>{loading ? "Déconnexion…" : "Se déconnecter"}</span>}
    </button>
  );
}