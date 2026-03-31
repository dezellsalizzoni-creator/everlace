"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getOrderById,
  orderStatusLabel,
  orderStatusLabelZh,
  type Order,
  type OrderStatus,
} from "@/lib/orders";

const statusSteps: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setOrder(null);
      return;
    }
    setOrder(getOrderById(id) ?? null);
  }, [id]);

  if (!id) {
    return (
      <main className="min-h-screen bg-warmStone px-6 py-24">
        <p className="text-sm text-charcoal/70">Invalid order link.</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-burnishedGold underline">
          All orders
        </Link>
      </main>
    );
  }

  if (order === undefined) {
    return (
      <main className="min-h-screen bg-warmStone px-6 py-24">
        <p className="text-sm text-charcoal/70">Loading…</p>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className="min-h-screen bg-warmStone px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="font-[var(--font-cormorant)] text-4xl">Order not found</h1>
          <p className="mt-2 text-sm text-charcoal/70">
            This order is not stored on this device. Orders are kept in your browser (localStorage).
          </p>
          <Link href="/orders" className="mt-6 inline-block text-sm font-medium text-burnishedGold underline">
            View saved orders
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-warmStone px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-charcoal/55">ORDER</p>
            <h1 className="font-[var(--font-cormorant)] text-4xl text-charcoal">{order.id}</h1>
            <p className="text-sm text-charcoal/65">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <Link href="/orders" className="text-sm text-burnishedGold underline underline-offset-4">
            All orders
          </Link>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-[var(--font-cormorant)] text-2xl">Status</h2>
          <p className="mt-2 text-sm text-charcoal">
            <span className="font-semibold text-burnishedGold">{orderStatusLabel[order.status]}</span>
            <span className="text-charcoal/60"> ({orderStatusLabelZh[order.status]})</span>
          </p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {statusSteps.map((step, i) => (
              <li
                key={step}
                className={`rounded-full px-3 py-1 text-xs ${
                  i <= currentIndex ? "bg-accentGold/25 text-charcoal" : "bg-black/5 text-charcoal/45"
                }`}
              >
                {orderStatusLabel[step]}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-[var(--font-cormorant)] text-2xl">Customer & shipping</h2>
          <div className="mt-3 grid gap-1 text-sm text-charcoal/80">
            <p>{order.customer.fullName}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p className="mt-2">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </p>
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-[var(--font-cormorant)] text-2xl">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between border-b border-black/5 py-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-burnishedGold">${(item.unitPrice * item.quantity).toLocaleString()} USD</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shipping.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between font-semibold text-burnishedGold">
              <span>Total</span>
              <span>${order.total.toLocaleString()} USD</span>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block rounded-full bg-accentGold px-6 py-2.5 text-sm font-semibold text-charcoal">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
