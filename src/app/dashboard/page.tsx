import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApiKeyForm from "@/components/ApiKeyForm";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import { SUBSCRIPTION_PLAN, formatSubscriptionPrice } from "@/lib/subscriptionPlan";
import { maskApiKey, decryptSecret } from "@/lib/crypto";

const STATUS_LABEL: Record<string, string> = {
  NONE: "Abonelik Yok",
  ACTIVE: "Aktif",
  PAST_DUE: "Ödeme Sorunu",
  CANCELED: "İptal Edildi",
};

const EVENT_LABEL: Record<string, string> = {
  CHECKOUT_COMPLETED: "Abonelik Başladı",
  RENEWED: "Yenilendi",
  PAYMENT_FAILED: "Ödeme Başarısız",
  CANCELED: "İptal Edildi",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null; // proxy.ts zaten /login'e yönlendiriyor
  }

  const [user, events, generations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, subscriptionStatus: true, currentPeriodEnd: true, replicateApiKeyEnc: true },
    }),
    prisma.subscriptionEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.generation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const maskedKey = user?.replicateApiKeyEnc ? maskApiKey(decryptSecret(user.replicateApiKeyEnc)) : null;
  const isActive = user?.subscriptionStatus === "ACTIVE";

  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">Panel</span>
        <h1>Merhaba{user?.email ? `, ${user.email}` : ""}</h1>
      </header>

      <div className="card dashboard-balance">
        <div>
          <span className="dashboard-balance__label">Abonelik Durumu</span>
          <span className={`dashboard-status dashboard-status--${user?.subscriptionStatus ?? "NONE"}`}>
            {STATUS_LABEL[user?.subscriptionStatus ?? "NONE"]}
          </span>
          {isActive && user?.currentPeriodEnd && (
            <p className="dashboard-renewal">
              Yenilenme: {new Date(user.currentPeriodEnd).toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>
        {isActive ? (
          <ManageSubscriptionButton />
        ) : (
          <Link href="/pricing" className="btn">
            {SUBSCRIPTION_PLAN.name} — {formatSubscriptionPrice()}/ay
          </Link>
        )}
      </div>

      <section className="card">
        <h2 className="dashboard-section-title">Replicate API Anahtarı</h2>
        <p className="dashboard-hint">
          Taslak üretimi kendi Replicate hesabınla, kendi API anahtarınla çalışır — kullanım maliyeti
          Replicate hesabından düşer. Anahtarını{" "}
          <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer">
            replicate.com/account/api-tokens
          </a>{" "}
          adresinden alabilirsin.
        </p>
        <ApiKeyForm maskedKey={maskedKey} />
      </section>

      <section className="card">
        <h2 className="dashboard-section-title">Abonelik Geçmişi</h2>
        {events.length === 0 ? (
          <p className="dashboard-empty">Henüz bir abonelik işlemi yok.</p>
        ) : (
          <ul className="dashboard-list">
            {events.map((ev) => (
              <li key={ev.id} className="dashboard-list__row">
                <span>{EVENT_LABEL[ev.type] ?? ev.type}</span>
                <span className="dashboard-list__date">
                  {new Date(ev.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="dashboard-section-title">Son Üretimler</h2>
        {generations.length === 0 ? (
          <p className="dashboard-empty">Henüz bir taslak üretmedin.</p>
        ) : (
          <ul className="dashboard-list">
            {generations.map((g) => (
              <li key={g.id} className="dashboard-list__row">
                <span>{g.roomType}</span>
                <span>{g.success ? "Başarılı" : "Başarısız"}</span>
                <span className="dashboard-list__date">
                  {new Date(g.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
