"use client";

import { useRef, useState } from "react";
import { IconlyDocument, IconlyLoader } from "@/components/ui/icons";
import { uploadFile, validateImageFile } from "@/services/uploads.service";

interface Props {
  onUploaded: (url: string) => void;
  initialUrl?: string | null;
  error?: string;
}

export default function DocumentPicker({ onUploaded, initialUrl, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(initialUrl ? "Pièce ajoutée" : null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      setUploadError(invalid);
      return;
    }

    setUploadError(null);
    setFileName(file.name);
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onUploaded(url);
    } catch {
      setUploadError("Envoi impossible. Réessayez.");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full h-11 px-4 bg-surface flex items-center gap-3 rounded-control text-left"
      >
        {uploading ? (
          <IconlyLoader size={16} color="currentColor" />
        ) : (
          <IconlyDocument size={16} color="currentColor" />
        )}
        <span className={`text-body ${fileName ? "" : "text-muted"}`}>
          {fileName ?? "Pièce d'identité (facultatif)"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {(uploadError || error) && <p className="text-small text-error">{uploadError ?? error}</p>}
    </div>
  );
}