"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Role } from "@/types/auth";

interface Me {
  role: { name: Role };
}

export function useCurrentRole() {
  const query = useQuery({
    queryKey: ["me", "role"],
    queryFn: () => api<Me>("/users/me"),
    staleTime: Infinity,
  });

  return { ...query, role: query.data?.role.name };
}