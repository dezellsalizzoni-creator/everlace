"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getOrderById, type Order } from "@/lib/orders";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("order");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderIdParam) {
      setOrder(null);
      return;
    }
    setOrder(getOrderById(orderIdParam) ?? null);
  }, [orderIdParam]);

  const displayId = orderIdParam ?? "—";
  const estimatedShip =
    order?.createdAt != null
      ? new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "within 5–7 business days";

  if (order === undefined) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-24">
        <p className="text-sm text-charcoal/70">Loading order…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warmStone px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
        <p className="text-xs tracking-[0.2em] text-sageGreen">PAYMENT SUCCESSFUL</p>
        <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl text-charcoal">Thank You</h1>
        <p className="mt-3 text-sm text-charcoal/75">
          A confirmation email will be sent to {order?.customer.email ?? "your inbox"} once processing begins.
        </p>
        <p className="mt-4 text-lg font-medium text-burnishedGold">Order number: {displayId}</p>
        <p className="mt-2 text-sm text-charcoal/70">
          Estimated dispatch window: <span className="font-medium text-charcoal">{estimatedShip}</span>
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {orderIdParam && (
            <Link
              href={`/orders/${encodeURIComponent(orderIdParam)}`}
              className="inline-block w-full max-w-xs rounded-full border border-burnishedGold bg-white px-5 py-2.5 text-sm font-medium text-burnishedGold sm:w-auto"
            >
              View order details
            </Link>
          )}
          <Link
            href="/"
            className="inline-block w-full max-w-xs rounded-full bg-accentGold px-5 py-2.5 text-sm font-semibold text-charcoal sm:w-auto"
          >
            Continue shopping
          </Link>
        </div>
        {order === null && orderIdParam && (
          <p className="mt-6 text-xs text-charcoal/60">
            Order record not found in this browser. Check order history or contact support with your payment receipt.
          </p>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-24">
          <p className="text-sm text-charcoal/70">Loading…</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
