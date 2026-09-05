"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UploadDropzone from "@/components/UploadDropzone";
import RoomTypePicker from "@/components/RoomTypePicker";
import KitchenConfigurator from "@/components/KitchenConfigurator";
import ColorPicker from "@/components/ColorPicker";
import ResultGallery, { type GenerateResponse } from "@/components/ResultGallery";
import { DEFAULT_KITCHEN_CONFIG, type KitchenConfig } from "@/lib/kitchenOptions";
import type { RoomType } from "@/lib/promptTemplates";

const STORAGE_KEY = "replicate_api_key";

type Stage = "form" | "generating" | "result";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>("kitchen");
  const [userRequest, setUserRequest] = useState("");
  const [colorHex, setColorHex] = useState("#D9CDBB");
  const [colorName, setColorName] = useState<string | null>("Krem");
  const [kitchenConfig, setKitchenConfig] = useState<KitchenConfig>(DEFAULT_KITCHEN_CONFIG);
  const [stage, setStage] = useState<Stage>("form");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    try {
      setHasApiKey(!!localStorage.getItem(STORAGE_KEY));
    } catch {}
  }, []);

  async function handleGenerate() {
    if (!file) return;

    let apiKey = "";
    try { apiKey = localStorage.getItem(STORAGE_KEY) ?? ""; } catch {}

    setStage("generating");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomType", roomType);
    if (productFile) formData.append("productImage", productFile);

    if (roomType === "kitchen") {
      formData.append("kitchenConfig", JSON.stringify(kitchenConfig));
    } else {
      formData.append("userRequest", userRequest);
      formData.append("colorHex", colorHex);
      if (colorName) formData.append("colorName", colorName);
    }

    const headers: Record<string, string> = {};
    if (apiKey) headers["x-replicate-key"] = apiKey;

    try {
      const res = await fetch("/api/generate", { method: "POST", body: formData, headers });
      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ demo: false, error: "Sunucuya ulaşılamadı. Bağlantını kontrol et." });
    } finally {
      setStage("result");
    }
  }

  function handleRetry() {
    setStage("form");
    setResult(null);
  }

  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">Taslak AI</span>
        <h1>Boş Alanı Taslağa Çevir</h1>
        <p>Fotoğrafı yükle, tasarım tercihlerini seç — yapı korunarak gerçekçi bir taslak üretilsin.</p>
      </header>

      {!hasApiKey && (
        <div className="api-key-banner">
          <span>Taslak üretmek için Replicate API anahtarı gerekli.</span>
          <Link href="/settings" className="btn btn--ghost" style={{ fontSize: 13, padding: "6px 14px" }}>
            Ayarlara Git
          </Link>
        </div>
      )}

      <div className="card">
        {stage === "form" && (
          <>
            <div className="dropzone-pair">
              <UploadDropzone
                label="Boş Alan Fotoğrafı"
                hint="JPG, PNG — düz karşıdan çekim"
                previewAlt="Boş alan fotoğrafı"
                required
                previewUrl={previewUrl}
                onFileSelected={(f, url) => { setFile(f); setPreviewUrl(url); }}
                onFileClear={() => { setFile(null); setPreviewUrl(null); }}
              />
              <UploadDropzone
                label="Ürün / Mobilya Fotoğrafı"
                hint="JPG, PNG — yerleştirilecek ürün"
                previewAlt="Ürün fotoğrafı"
                previewUrl={productPreviewUrl}
                onFileSelected={(f, url) => { setProductFile(f); setProductPreviewUrl(url); }}
                onFileClear={() => { setProductFile(null); setProductPreviewUrl(null); }}
              />
            </div>
            <RoomTypePicker value={roomType} onChange={setRoomType} />

            {roomType === "kitchen" ? (
              <KitchenConfigurator value={kitchenConfig} onChange={setKitchenConfig} />
            ) : (
              <div className="configurator">
                <section className="config-section">
                  <span className="config-label">Renk</span>
                  <ColorPicker
                    hex={colorHex}
                    onChange={(hex, name) => {
                      setColorHex(hex);
                      setColorName(name);
                    }}
                  />
                </section>
                <section className="config-section">
                  <span className="config-label">Ek İstek (opsiyonel)</span>
                  <input
                    className="prompt-input"
                    type="text"
                    placeholder="İstek (opsiyonel) — örn. 'modern, sade çizgiler'"
                    value={userRequest}
                    onChange={(e) => setUserRequest(e.target.value)}
                  />
                </section>
              </div>
            )}

            <div className="actions">
              <button className="btn" disabled={!file} onClick={handleGenerate}>
                Taslağı Oluştur
              </button>
            </div>
          </>
        )}

        {stage === "generating" && (
          <div className="generating">
            <div className="spinner" />
            <p>Taslak oluşturuluyor…</p>
          </div>
        )}

        {stage === "result" && result && previewUrl && (
          <ResultGallery beforePreviewUrl={previewUrl} result={result} onRetry={handleRetry} />
        )}
      </div>
    </main>
  );
}
