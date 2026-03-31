import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe secret key is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-03-25.dahlia" });

  try {
    const { amount, currency = "usd" } = await req.json();
    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount < 50) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(normalizedAmount),
      currency,
      automatic_payment_methods: { enabled: false },
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch {
    return NextResponse.json({ error: "Unable to create payment intent." }, { status: 500 });
  }
}
