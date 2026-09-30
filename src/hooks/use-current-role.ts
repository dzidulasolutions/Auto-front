"use client";

import { useMe } from "./use-me";

export function useCurrentRole() {
  const query = useMe();
  return { ...query, role: query.data?.role.name };
}