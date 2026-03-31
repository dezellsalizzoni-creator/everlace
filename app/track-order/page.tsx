"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getOrderById, getEstimatedDelivery, getTrackingNumber, orderStatusLabelZh, type Order } from "@/lib/orders";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const normalized = query.trim().toUpperCase();
    setOrder(normalized ? getOrderById(normalized) ?? null : null);
    setSearched(true);
  };

  return (
    <main className="min-h-screen bg-warmStone px-6 py-24">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h1 className="font-[var(--font-cormorant)] text-5xl text-charcoal">Track Your Order</h1>
          <p className="mt-2 text-sm text-charcoal/70">Order ID format: EV-20240331-A3B7</p>
          <form onSubmit={onSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-sm outline-none transition focus:border-accentGold focus:ring-2 focus:ring-accentGold/30"
              placeholder="Enter order number"
            />
            <button className="rounded-lg bg-accentGold px-5 py-3 text-sm font-semibold text-charcoal">Search</button>
          </form>
        </section>

        {searched && !order && (
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal/70">
              No order found for this ID in current browser storage.{" "}
              <Link href="/orders" className="font-medium text-burnishedGold underline underline-offset-4">
                View saved orders
              </Link>
            </p>
          </section>
        )}

        {order && (
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-[var(--font-cormorant)] text-3xl text-charcoal">Order Details</h2>
            <div className="mt-4 grid gap-2 text-sm text-charcoal/80">
              <p>
                <span className="font-medium">Order number:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">Order time:</span> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span> {orderStatusLabelZh[order.status]}
              </p>
              <p>
                <span className="font-medium">Tracking number:</span> {getTrackingNumber(order)}
              </p>
              <p>
                <span className="font-medium">Estimated delivery:</span> {getEstimatedDelivery(order)}
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href={`/orders/${encodeURIComponent(order.id)}`} className="rounded-full border border-burnishedGold px-4 py-2 text-xs text-burnishedGold">
                View Full Order
              </Link>
              <Link href="/" className="rounded-full bg-accentGold px-4 py-2 text-xs font-semibold text-charcoal">
                Continue Shopping
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
