"use client";

import { useState } from "react";
import { logout } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await logout().catch(() => {});
    window.location.assign(ROUTES.login);
  };

  return (
    <button onClick={handleClick} disabled={loading} className={`font-ui ${className}`}>
      {loading ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}