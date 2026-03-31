"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const inputBaseClass =
  "peer w-full rounded-lg border border-black/15 bg-white px-3 pb-2 pt-7 text-sm outline-none transition focus:border-accentGold focus:ring-2 focus:ring-accentGold/30";

/** 文本输入：空态 top-3；聚焦或有内容时 -top-2 + text-[10px]（peer 必须在标签前的 input 上） */
const labelBaseClass =
  "pointer-events-none absolute left-3 top-3 z-10 text-xs text-charcoal/50 transition-all duration-200 " +
  "peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-accentGold " +
  "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px] " +
  "peer-[:not(:placeholder-shown)]:text-charcoal/60";

/** Stripe iframe：无 placeholder，用 group-focus-within 模拟上浮 */
const stripeFieldClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 pb-2 pt-7 text-sm outline-none transition " +
  "group-focus-within:border-accentGold group-focus-within:ring-2 group-focus-within:ring-accentGold/30";
const stripeLabelClass =
  "pointer-events-none absolute left-3 top-3 z-10 text-xs text-charcoal/50 transition-all duration-200 " +
  "group-focus-within:-top-2 group-focus-within:text-[10px] group-focus-within:text-accentGold";

const stripeElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      color: "#2C2C2C",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "14px",
      "::placeholder": {
        color: "#7A7A7A",
      },
    },
    invalid: {
      color: "#B42318",
    },
  },
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const shipping = items.length > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-warmStone">
      <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-6 rounded-md border border-yellow-500/40 bg-yellow-400/30 px-4 py-2 text-center text-sm text-charcoal">
        TEST MODE - No real charges
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-[var(--font-cormorant)] text-4xl">Order Summary</h2>
          <div className="mt-5 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-charcoal/70">
                Your cart is empty.{" "}
                <Link href="/" className="font-medium text-burnishedGold underline underline-offset-4">
                  Continue shopping.
                </Link>
              </p>
            )}
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-black/10 bg-warmStone/60 p-3 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-charcoal/65">
                  Qty {item.quantity} - ${item.unitPrice.toLocaleString()} USD each
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between font-semibold text-burnishedGold">
              <span>Total</span>
              <span>${total.toLocaleString()} USD</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-[var(--font-cormorant)] text-4xl">Payment</h2>
          <p className="mt-2 text-xs text-charcoal/65">Use test card: 4242 4242 4242 4242</p>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={total} disabled={items.length === 0} />
            </Elements>
          ) : (
            <p className="mt-4 text-sm text-red-600">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment variables.</p>
          )}
          <Link href="/" className="mt-6 inline-block text-xs text-charcoal/65 underline underline-offset-4">
            Back to Home
          </Link>
        </section>
      </div>
      </div>
    </main>
  );
}

function CheckoutForm({ amount, disabled }: { amount: number; disabled: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const amountCents = useMemo(() => Math.round(amount * 100), [amount]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (disabled) {
      setError("Your cart is empty.");
      return;
    }
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    setLoading(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountCents, currency: "usd" }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || "Failed to initialize payment.");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name,
            address: {
              line1,
              city,
              postal_code: postalCode,
              country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed. Please try again.");
        return;
      }
      if (result.paymentIntent?.status === "succeeded") {
        const id = result.paymentIntent.id;
        clearCart();
        router.push(`/success?order=${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <div className="group relative">
        <div className={stripeFieldClass}>
          <CardNumberElement options={stripeElementOptions} />
        </div>
        <span className={stripeLabelClass}>Card Number</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="group relative">
          <div className={stripeFieldClass}>
            <CardExpiryElement options={stripeElementOptions} />
          </div>
          <span className={stripeLabelClass}>Expiry</span>
        </div>
        <div className="group relative">
          <div className={stripeFieldClass}>
            <CardCvcElement options={stripeElementOptions} />
          </div>
          <span className={stripeLabelClass}>CVC</span>
        </div>
      </div>
      <div className="grid gap-3">
        <FloatingInput label="Billing Name" value={name} onChange={setName} />
        <FloatingInput label="Address Line 1" value={line1} onChange={setLine1} />
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput label="City" value={city} onChange={setCity} />
          <FloatingInput label="ZIP / Postal Code" value={postalCode} onChange={setPostalCode} />
        </div>
        <FloatingInput label="Country (US)" value={country} onChange={setCountry} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full rounded-full bg-accentGold px-4 py-3 text-sm font-semibold text-charcoal disabled:cursor-not-allowed disabled:opacity-55"
      >
        {loading ? "Processing..." : `Pay $${amount.toLocaleString()} USD`}
      </button>
    </form>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <input className={inputBaseClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" " />
      <span className={labelBaseClass}>{label}</span>
    </label>
  );
}
