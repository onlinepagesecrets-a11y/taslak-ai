"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data.error ?? "Abonelik yönetimi açılamadı.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <button type="button" className="btn btn--ghost" onClick={handleClick} disabled={loading}>
        {loading ? "Yönlendiriliyor…" : "Aboneliği Yönet"}
      </button>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}
