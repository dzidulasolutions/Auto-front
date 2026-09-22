"use client";

import { useRef, useState } from "react";
import { IconlyAddUser, IconlyLoader } from "@/components/ui/icons";
import { uploadFile, validateImageFile } from "@/services/uploads.service";

interface Props {
  onUploaded: (url: string) => void;
  error?: string;
}

export default function PhotoPicker({ onUploaded, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onUploaded(url);
    } catch {
      setUploadError("Envoi impossible. Réessayez.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative size-20 rounded-full bg-surface flex items-center justify-center overflow-hidden shrink-0"
        aria-label="Ajouter une photo"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <IconlyAddUser size={24} color="currentColor" />
        )}
        {uploading && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <IconlyLoader size={20} color="#ffffff" />
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_HINT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <p className="text-caption text-muted">Photo (facultatif)</p>
      {(uploadError || error) && <p className="text-small text-error">{uploadError ?? error}</p>}
    </div>
  );
}

const ACCEPTED_HINT = "image/jpeg,image/png,image/webp";