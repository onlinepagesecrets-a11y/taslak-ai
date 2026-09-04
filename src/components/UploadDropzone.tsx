"use client";

import { useRef, useState } from "react";

type Props = {
  onFileSelected: (file: File, previewUrl: string) => void;
  onFileClear?: () => void;
  previewUrl: string | null;
  label: string;
  hint?: string;
  previewAlt?: string;
  required?: boolean;
};

export default function UploadDropzone({
  onFileSelected,
  onFileClear,
  previewUrl,
  label,
  hint = "JPG, PNG",
  previewAlt = "Yüklenen fotoğraf",
  required = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onFileSelected(file, url);
  }

  return (
    <div className="dropzone-wrapper">
      <div className="dropzone-label-row">
        <span className="dropzone-label">{label}</span>
        {!required && <span className="dropzone-optional">opsiyonel</span>}
        {previewUrl && onFileClear && (
          <button
            type="button"
            className="dropzone-clear"
            onClick={(e) => { e.stopPropagation(); onFileClear(); }}
            aria-label="Kaldır"
          >
            ✕
          </button>
        )}
      </div>
      <div
        className={`dropzone${dragOver ? " dropzone--over" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={previewAlt} className="dropzone__preview" />
        ) : (
          <div className="dropzone__empty">
            <span className="dropzone__icon">＋</span>
            <p>Sürükle bırak ya da seç</p>
            <span className="dropzone__hint">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
