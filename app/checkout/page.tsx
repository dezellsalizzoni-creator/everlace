"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { generateOrderNumber, saveOrder, type Order } from "@/lib/orders";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const fieldClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-sm text-charcoal outline-none transition focus:border-accentGold focus:ring-2 focus:ring-accentGold/30";
const stripeWrapClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-sm outline-none transition focus-within:border-accentGold focus-within:ring-2 focus-within:ring-accentGold/30";
const labelClass = "mb-1.5 block text-xs font-medium text-charcoal/80";

const stripeElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      color: "#2C2C2C",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "14px",
      "::placeholder": { color: "#7A7A7A" },
    },
    invalid: { color: "#B42318" },
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
            <h2 className="font-[var(--font-cormorant)] text-4xl">Checkout</h2>
            <p className="mt-2 text-xs text-charcoal/65">Test card: 4242 4242 4242 4242</p>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm amount={total} disabled={items.length === 0} shipping={shipping} />
              </Elements>
            ) : (
              <p className="mt-4 text-sm text-red-600">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
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

function CheckoutForm({
  amount,
  disabled,
  shipping,
}: {
  amount: number;
  disabled: boolean;
  shipping: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
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
    if (!email.trim() || !phone.trim() || !fullName.trim() || !line1.trim() || !city.trim() || !postalCode.trim()) {
      setError("Please complete all required contact and shipping fields.");
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
            name: fullName,
            email,
            phone,
            address: {
              line1,
              line2: line2 || undefined,
              city,
              state: stateVal || undefined,
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
        const orderId = generateOrderNumber();
        const order: Order = {
          id: orderId,
          createdAt: new Date().toISOString(),
          status: "confirmed",
          trackingNumber: `TRK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
          customer: {
            email: email.trim(),
            phone: phone.trim(),
            fullName: fullName.trim(),
          },
          shippingAddress: {
            line1: line1.trim(),
            line2: line2.trim(),
            city: city.trim(),
            state: stateVal.trim(),
            postalCode: postalCode.trim(),
            country: country.trim() || "US",
          },
          items: JSON.parse(JSON.stringify(items)) as typeof items,
          subtotal,
          shipping,
          total: amount,
          paymentIntentId: result.paymentIntent.id,
        };
        saveOrder(order);
        clearCart();
        router.push(`/success?order=${encodeURIComponent(orderId)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-6">
      <div>
        <h3 className="font-[var(--font-cormorant)] text-2xl text-charcoal">Contact</h3>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={labelClass} htmlFor="checkout-email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="checkout-phone">
              Phone (shipping updates) <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              autoComplete="tel"
              className={fieldClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-[var(--font-cormorant)] text-2xl text-charcoal">Shipping address</h3>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={labelClass} htmlFor="checkout-name">
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-name"
              autoComplete="name"
              className={fieldClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="checkout-line1">
              Address line 1 <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-line1"
              autoComplete="address-line1"
              className={fieldClass}
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="checkout-line2">
              Address line 2
            </label>
            <input
              id="checkout-line2"
              autoComplete="address-line2"
              className={fieldClass}
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="checkout-city">
                City <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-city"
                autoComplete="address-level2"
                className={fieldClass}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="checkout-state">
                State / Region
              </label>
              <input
                id="checkout-state"
                autoComplete="address-level1"
                className={fieldClass}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="checkout-zip">
                ZIP / Postal code <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-zip"
                autoComplete="postal-code"
                className={fieldClass}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="checkout-country">
                Country <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-country"
                autoComplete="country-name"
                className={fieldClass}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-[var(--font-cormorant)] text-2xl text-charcoal">Payment</h3>
        <div className="mt-3 space-y-4">
          <div>
            <span className={labelClass}>Card number</span>
            <div className={stripeWrapClass}>
              <CardNumberElement options={stripeElementOptions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelClass}>Expiry</span>
              <div className={stripeWrapClass}>
                <CardExpiryElement options={stripeElementOptions} />
              </div>
            </div>
            <div>
              <span className={labelClass}>CVC</span>
              <div className={stripeWrapClass}>
                <CardCvcElement options={stripeElementOptions} />
              </div>
            </div>
          </div>
        </div>
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
