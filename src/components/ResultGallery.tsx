"use client";

import { useState } from "react";

export type GenerateResponse = {
  demo: boolean;
  imageUrl?: string;
  prompt?: string;
  error?: string;
  requiresAuth?: boolean;
  requiresSubscription?: boolean;
  requiresApiKey?: boolean;
};

type Props = {
  beforePreviewUrl: string;
  result: GenerateResponse;
  onRetry: () => void;
  onReset: () => void;
};

export default function ResultGallery({ beforePreviewUrl, result, onRetry, onReset }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!result.imageUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(result.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taslak-ai-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(result.imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  if (result.error) {
    return (
      <div className="result-error">
        <p>{result.error}</p>
        <div className="result-actions">
          <button className="btn btn--ghost" onClick={onRetry}>
            Yeniden Dene
          </button>
          <button className="btn btn--ghost" onClick={onReset}>
            Sil / Baştan Başla
          </button>
        </div>
      </div>
    );
  }

  if (result.demo) {
    return (
      <div className="demo-notice">
        <div className="demo-notice__dot" />
        <div>
          <p>
            <strong>Demo modu:</strong> <code>REPLICATE_API_TOKEN</code> ve{" "}
            <code>REPLICATE_MODEL</code> ortam değişkenleri ayarlanmadığı için gerçek bir taslak
            üretilmedi. <code>.env.local</code> dosyasına eklenince gerçek AI çıktısı görünür.
          </p>
          <p className="demo-notice__prompt">
            Üretilecek prompt: <em>{result.prompt}</em>
          </p>
          <div className="result-actions">
            <button className="btn" onClick={onRetry}>
              Yeniden Dene
            </button>
            <button className="btn btn--ghost" onClick={onReset}>
              Sil / Baştan Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="result">
      <div className="result__pair">
        <figure>
          <figcaption>Önce</figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforePreviewUrl} alt="Taslak öncesi alan" />
        </figure>
        <figure>
          <figcaption>Sonra</figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.imageUrl} alt="AI tarafından üretilen taslak" />
        </figure>
      </div>
      <div className="result-actions">
        <button className="btn" onClick={handleDownload} disabled={downloading}>
          {downloading ? "İndiriliyor…" : "İndir"}
        </button>
        <button className="btn btn--ghost" onClick={onRetry}>
          Yeniden Dene
        </button>
        <button className="btn btn--ghost" onClick={onReset}>
          Sil / Baştan Başla
        </button>
      </div>
    </div>
  );
}
