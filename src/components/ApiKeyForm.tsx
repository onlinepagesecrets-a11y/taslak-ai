"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  maskedKey: string | null;
};

export default function ApiKeyForm({ maskedKey }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(!maskedKey);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/settings/api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kaydedilemedi.");
      return;
    }

    setApiKey("");
    setEditing(false);
    router.refresh();
  }

  async function handleRemove() {
    setLoading(true);
    await fetch("/api/settings/api-key", { method: "DELETE" });
    setLoading(false);
    setEditing(true);
    router.refresh();
  }

  if (!editing && maskedKey) {
    return (
      <div className="api-key-row">
        <code className="api-key-masked">{maskedKey}</code>
        <div className="api-key-actions">
          <button type="button" className="btn btn--ghost" onClick={() => setEditing(true)}>
            Değiştir
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleRemove} disabled={loading}>
            Kaldır
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="auth-form">
      <input
        type="password"
        className="prompt-input"
        placeholder="r8_..."
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        autoComplete="off"
        required
      />
      {error && <p className="auth-error">{error}</p>}
      <div className="api-key-actions">
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {maskedKey && (
          <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
