"use client";

import { FiXCircle, IconlySearch } from "@/components/ui/icons";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Rechercher" }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-0 h-11 flex items-center text-black/40 pointer-events-none">
        <IconlySearch size={18} color="currentColor" />
      </span>

      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-11 pl-11 pr-11 bg-white text-sm placeholder:text-black/40 outline-none focus-visible:ring-2 focus-visible:ring-black transition-shadow"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-black/40 hover:text-black transition-colors"
        >
          <FiXCircle size={16} color="currentColor" />
        </button>
      )}
    </div>
  );
}