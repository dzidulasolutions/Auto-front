"use client";

import { useState } from "react";
import { IconlyHide, IconlyShow } from "@/components/ui/icons";
import { authInputClass } from "./styles";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput(props: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`${authInputClass} pr-12`} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-0 top-0 h-11 w-11 flex justify-center items-center text-white/60"
      >
        {show ? (
          <IconlyHide color="currentColor" size={20} />
        ) : (
          <IconlyShow color="currentColor" size={20} />
        )}
      </button>
    </div>
  );
}