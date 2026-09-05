"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "replicate_api_key";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) ?? "";
      if (stored) {
        setApiKey(stored);
        setHasSaved(true);
      }
    } catch {}
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      setHasSaved(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  }

  function handleRemove() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setApiKey("");
      setHasSaved(false);
    } catch {}
  }

  const masked = hasSaved && apiKey
    ? apiKey.slice(0, 6) + "••••••••" + apiKey.slice(-4)
    : null;

  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">Ayarlar</span>
        <h1>Replicate API Anahtarı</h1>
        <p>Taslak üretimi kendi Replicate hesabından çalışır. Anahtar yalnızca tarayıcında saklanır.</p>
      </header>

      {/* Adım 1 — Hesap ve ödeme */}
      <div className="card settings-step">
        <div className="settings-step__num">1</div>
        <div>
          <h2 className="settings-step__title">Replicate Hesabı Aç ve Kredi Yükle</h2>
          <p className="settings-step__desc">
            Replicate ücretsiz kayıt sunar. Her taslak üretimi yaklaşık <strong>$0.0086</strong> (≈0.28 TL) tutar.
            Test için <strong>$5 kredi</strong> 580 üretim yapar.
          </p>
          <div className="settings-step__actions">
            <a
              href="https://replicate.com/signin"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Replicate'e Kaydol
            </a>
            <a
              href="https://replicate.com/account/billing"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost"
            >
              Kredi Yükle
            </a>
          </div>
        </div>
      </div>

      {/* Adım 2 — API anahtarı al */}
      <div className="card settings-step">
        <div className="settings-step__num">2</div>
        <div>
          <h2 className="settings-step__title">API Anahtarı Al</h2>
          <p className="settings-step__desc">
            Replicate hesabında{" "}
            <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer">
              replicate.com/account/api-tokens
            </a>{" "}
            adresine git, yeni bir token oluştur ve kopyala.
          </p>
          <a
            href="https://replicate.com/account/api-tokens"
            target="_blank"
            rel="noreferrer"
            className="btn btn--ghost"
          >
            API Token Sayfası
          </a>
        </div>
      </div>

      {/* Adım 3 — Anahtarı kaydet */}
      <div className="card settings-step">
        <div className="settings-step__num">3</div>
        <div style={{ width: "100%" }}>
          <h2 className="settings-step__title">Anahtarı Buraya Gir</h2>
          {hasSaved && masked && (
            <div className="settings-key-saved">
              <code className="api-key-masked">{masked}</code>
              <span className="settings-key-badge">Aktif</span>
              <button type="button" className="dropzone-clear" onClick={handleRemove}>✕ Kaldır</button>
            </div>
          )}
          <form onSubmit={handleSave} style={{ marginTop: hasSaved ? 12 : 0 }}>
            <input
              type="password"
              className="prompt-input"
              placeholder="r8_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="settings-step__actions">
              <button type="submit" className="btn" disabled={apiKey.trim().length < 10}>
                {saved ? "Kaydedildi ✓" : hasSaved ? "Güncelle" : "Kaydet"}
              </button>
              <Link href="/" className="btn btn--ghost">
                Ana Sayfaya Dön
              </Link>
            </div>
          </form>
          <p className="settings-note">
            Anahtar yalnızca bu tarayıcıda saklanır, sunucuya gönderilmez. Her üretimde şifreli olarak iletilir.
          </p>
        </div>
      </div>
    </main>
  );
}
