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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 -z-10 bg-black/50"
          />

          {/* Seule boîte qui porte la largeur — le parent la centre */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={fromBottom ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            animate={fromBottom ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={fromBottom ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-120 bg-white rounded-t-surface sm:rounded-surface shadow-elevated"
          >
            {/* w-full ici, jamais une largeur propre : il épouse la boîte ci-dessus */}
            <div className="max-h-[90dvh] w-full overflow-y-auto">
              {title && (
                <div className="w-full px-6 pt-6 pb-4">
                  <h2 className="text-h2">{title}</h2>
                </div>
              )}
              <div className="w-full px-6 pb-6">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}