"use client";

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
};

export default function ResultGallery({ beforePreviewUrl, result, onRetry }: Props) {
  if (result.error) {
    return (
      <div className="result-error">
        <p>{result.error}</p>
        <button className="btn btn--ghost" onClick={onRetry}>
          Yeniden Dene
        </button>
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
          <button className="btn" onClick={onRetry}>
            Yeniden Dene
          </button>
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
      <button className="btn btn--ghost" onClick={onRetry}>
        Yeniden Dene
      </button>
    </div>
  );
}
