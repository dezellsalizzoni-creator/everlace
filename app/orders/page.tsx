"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, orderStatusLabel, orderStatusLabelZh, type Order } from "@/lib/orders";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <main className="min-h-screen bg-warmStone px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-cormorant)] text-5xl text-charcoal">Your orders</h1>
            <p className="mt-2 text-sm text-charcoal/65">
              Saved in this browser only (localStorage). Clearing site data will remove history.
            </p>
          </div>
          <Link href="/" className="text-sm text-burnishedGold underline underline-offset-4">
            Back to shop
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-charcoal/70">No orders yet.</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-accentGold px-5 py-2 text-sm font-semibold text-charcoal">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${encodeURIComponent(order.id)}`}
                  className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-accentGold/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-charcoal">{order.id}</p>
                    <p className="text-xs text-charcoal/60">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-burnishedGold">${order.total.toLocaleString()} USD</p>
                    <p className="text-charcoal/70">
                      {orderStatusLabel[order.status]} <span className="text-charcoal/50">({orderStatusLabelZh[order.status]})</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
