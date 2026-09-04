import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { SUBSCRIPTION_PLAN } from "@/lib/subscriptionPlan";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Ödeme sistemi henüz yapılandırılmadı. Lütfen daha sonra tekrar dene." },
      { status: 503 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3020";
  const usesConfiguredPrice = SUBSCRIPTION_PLAN.stripePriceId && !SUBSCRIPTION_PLAN.stripePriceId.includes("DEGISTIR");

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId ? undefined : (user.email ?? undefined),
    client_reference_id: session.user.id,
    line_items: [
      usesConfiguredPrice
        ? { price: SUBSCRIPTION_PLAN.stripePriceId, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: SUBSCRIPTION_PLAN.currency,
              unit_amount: SUBSCRIPTION_PLAN.priceCents,
              recurring: { interval: SUBSCRIPTION_PLAN.interval },
              product_data: {
                name: SUBSCRIPTION_PLAN.name,
                description: SUBSCRIPTION_PLAN.description,
              },
            },
          },
    ],
    metadata: { userId: session.user.id },
    subscription_data: { metadata: { userId: session.user.id } },
    success_url: `${baseUrl}/dashboard?subscribed=success`,
    cancel_url: `${baseUrl}/pricing?subscribed=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
