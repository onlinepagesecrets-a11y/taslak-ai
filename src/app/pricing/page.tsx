"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SUBSCRIPTION_PLAN, formatSubscriptionPrice } from "@/lib/subscriptionPlan";

export default function PricingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setError(null);

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Ödeme başlatılamadı.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Sunucuya ulaşılamadı.");
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">Fiyatlandırma</span>
        <h1>Basit, Tek Plan</h1>
        <p>Kendi Replicate API anahtarınla sınırsız taslak üret. Kullanım maliyeti kendi hesabından düşer.</p>
      </header>

      <div className="pricing-single">
        <div className="pricing-card pricing-card--highlight pricing-card--solo">
          <span className="pricing-card__badge">Tek Plan</span>
          <h2 className="pricing-card__name">{SUBSCRIPTION_PLAN.name}</h2>
          <div className="pricing-card__price">
            {formatSubscriptionPrice()}
            <span className="pricing-card__interval">/ay</span>
          </div>
          <ul className="pricing-card__features">
            <li>Sınırsız taslak üretimi</li>
            <li>Tüm oda tipleri (mutfak, banyo, vestiyer, yatak odası)</li>
            <li>Kendi Replicate API anahtarınla — kullanım maliyeti bize değil, doğrudan Replicate hesabına yansır</li>
            <li>İstediğin zaman iptal et</li>
          </ul>
          <button type="button" className="btn" disabled={loading} onClick={handleSubscribe}>
            {loading ? "Yönlendiriliyor…" : "Abone Ol"}
          </button>
        </div>
      </div>

      {error && <p className="auth-error" style={{ textAlign: "center", marginTop: 16 }}>{error}</p>}

      <div className="pricing-faq">
        <h3>Sıkça Sorulan Sorular</h3>
        <details>
          <summary>Neden kendi API anahtarımı girmem gerekiyor?</summary>
          <p>
            Taslak AI, taslak üretimini Replicate üzerinden çalıştırır. Aboneliğin yalnızca uygulamaya
            erişim ve arayüz içindir; üretim maliyeti doğrudan senin Replicate hesabından karşılanır —
            bu sayede sabit, düşük bir aylık ücretle sınırsız kullanabilirsin.
          </p>
        </details>
        <details>
          <summary>API anahtarımı nereden alırım?</summary>
          <p>
            <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer">
              replicate.com/account/api-tokens
            </a>{" "}
            adresinden ücretsiz bir hesap oluşturup anahtarını alabilir, panelden ekleyebilirsin.
          </p>
        </details>
        <details>
          <summary>İade politikanız nedir?</summary>
          <p>
            Taslak AI dijital bir hizmettir; abonelik ücreti dönem başında tahsil edilir ve iade edilmez.
            İstediğin zaman iptal edebilirsin — iptal, mevcut ödeme döneminin sonunda geçerli olur.
            Detaylar için <a href="/legal/refund">İade Politikası</a> sayfasına bakabilirsin.
          </p>
        </details>
        <details>
          <summary>Ödeme güvenli mi?</summary>
          <p>Tüm ödemeler Stripe altyapısı üzerinden işlenir; kart bilgilerin bizim sunucularımıza ulaşmaz.</p>
        </details>
      </div>
    </main>
  );
}
