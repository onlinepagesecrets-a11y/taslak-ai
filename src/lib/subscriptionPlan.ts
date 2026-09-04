// Tek abonelik planı: kullanıcı kendi Replicate API anahtarını girer,
// biz sadece uygulamaya erişim için aylık ücret alırız (kullanım maliyeti kullanıcının kendi hesabından düşer).

export const SUBSCRIPTION_PLAN = {
  name: "Taslak AI Pro",
  priceCents: 1000, // $10.00
  currency: "usd",
  interval: "month" as const,
  stripePriceId: process.env.STRIPE_PRICE_SUBSCRIPTION ?? "",
  description: "Sınırsız taslak üretimi. Kullanım maliyeti kendi Replicate hesabından düşer.",
};

export function formatSubscriptionPrice(): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: SUBSCRIPTION_PLAN.currency.toUpperCase(),
  }).format(SUBSCRIPTION_PLAN.priceCents / 100);
}
