"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  variant?: "modal" | "drawer";
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, variant = "modal", children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const fromBottom = variant === "drawer";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={fromBottom ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            animate={fromBottom ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={fromBottom ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-surface sm:rounded-surface shadow-elevated max-h-[90dvh] overflow-y-auto"
          >
            {title && (
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-h2">{title}</h2>
              </div>
            )}
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}