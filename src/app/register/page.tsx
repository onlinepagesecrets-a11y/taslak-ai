"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SUBSCRIPTION_PLAN, formatSubscriptionPrice } from "@/lib/subscriptionPlan";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Devam etmek için Kullanım Koşulları'nı ve Gizlilik Politikası'nı kabul etmelisin.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Kayıt sırasında bir hata oluştu.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="page page--narrow">
      <div className="card auth-card">
        <h1 className="auth-title">Kayıt Ol</h1>
        <p className="auth-subtitle">
          {SUBSCRIPTION_PLAN.name} — {formatSubscriptionPrice()}/ay. Kendi Replicate API anahtarınla
          sınırsız kullan.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            İsim (opsiyonel)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="prompt-input"
              autoComplete="name"
            />
          </label>
          <label className="auth-label">
            E-posta
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="prompt-input"
              autoComplete="email"
            />
          </label>
          <label className="auth-label">
            Şifre (en az 8 karakter)
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="prompt-input"
              autoComplete="new-password"
            />
          </label>
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              <Link href="/legal/terms" target="_blank">
                Kullanım Koşulları
              </Link>
              {" "}ve{" "}
              <Link href="/legal/privacy" target="_blank">
                Gizlilik Politikası
              </Link>
              &apos;nı okudum, kabul ediyorum.
            </span>
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Kayıt oluşturuluyor…" : "Kayıt Ol"}
          </button>
        </form>
        <p className="auth-switch">
          Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
        </p>
      </div>
    </main>
  );
}
