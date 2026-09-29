"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPortalLoans,
  getPortalMe,
  getPortalSavings,
  getPortalTontines,
} from "@/services/portal.service";

export const usePortalMe = () => useQuery({ queryKey: ["portal", "me"], queryFn: getPortalMe });
export const usePortalLoans = () =>
  useQuery({ queryKey: ["portal", "loans"], queryFn: getPortalLoans });
export const usePortalSavings = () =>
  useQuery({ queryKey: ["portal", "savings"], queryFn: getPortalSavings });
export const usePortalTontines = () =>
  useQuery({ queryKey: ["portal", "tontines"], queryFn: getPortalTontines });