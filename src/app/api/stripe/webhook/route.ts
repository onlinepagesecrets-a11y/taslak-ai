import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

function mapStripeStatus(status: Stripe.Subscription.Status): "ACTIVE" | "PAST_DUE" | "CANCELED" | "NONE" {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "NONE";
  }
}

async function logEvent(
  userId: string,
  type: "CHECKOUT_COMPLETED" | "RENEWED" | "PAYMENT_FAILED" | "CANCELED",
  stripeEventId: string,
  amountCents?: number | null,
  currency?: string | null,
) {
  try {
    await prisma.subscriptionEvent.create({
      data: { userId, type, stripeEventId, amountCents: amountCents ?? undefined, currency: currency ?? undefined },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!message.includes("Unique constraint")) throw err;
    // stripeEventId zaten işlenmiş (Stripe retry) — yoksay.
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.includes("DEGISTIR")) {
    return NextResponse.json({ error: "Webhook yapılandırılmadı." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing signature");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Geçersiz imza." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        if (userId && checkoutSession.mode === "subscription" && checkoutSession.subscription) {
          const subscriptionId =
            typeof checkoutSession.subscription === "string"
              ? checkoutSession.subscription
              : checkoutSession.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId =
            typeof checkoutSession.customer === "string" ? checkoutSession.customer : checkoutSession.customer?.id;

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: mapStripeStatus(subscription.status),
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            },
          });
          await logEvent(userId, "CHECKOUT_COMPLETED", event.id, checkoutSession.amount_total, checkoutSession.currency);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: mapStripeStatus(subscription.status),
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: "CANCELED" } });
          await logEvent(userId, "CANCELED", event.id);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;
        if (subscriptionId && invoice.billing_reason === "subscription_cycle") {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;
          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: mapStripeStatus(subscription.status),
                currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              },
            });
            await logEvent(userId, "RENEWED", event.id, invoice.amount_paid, invoice.currency);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;
          if (userId) {
            await prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: "PAST_DUE" } });
            await logEvent(userId, "PAYMENT_FAILED", event.id, invoice.amount_due, invoice.currency);
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handling error:", err);
    return NextResponse.json({ error: "Webhook işlenirken hata oluştu." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
