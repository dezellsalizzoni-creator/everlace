import type { CartItem } from "@/components/CartProvider";

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  trackingNumber?: string;
  customer: {
    email: string;
    phone: string;
    fullName: string;
  };
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentIntentId?: string;
};

const STORAGE_KEY = "everlace_orders_v1";

/** EV-年月日-随机4位（字母数字大写） */
export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()
    .padEnd(4, "0")
    .slice(0, 4);
  return `EV-${ymd}-${rand}`;
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getTrackingNumber(order: Order): string {
  if (order.trackingNumber) return order.trackingNumber;
  return `TRK-${order.id.replace(/[^A-Z0-9]/gi, "").slice(-10).toUpperCase()}`;
}

export function getEstimatedDelivery(order: Order): string {
  const base = new Date(order.createdAt);
  const days =
    order.status === "confirmed" ? 10 : order.status === "processing" ? 7 : order.status === "shipped" ? 3 : 0;
  const eta = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  return eta.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const orderStatusLabelZh: Record<OrderStatus, string> = {
  confirmed: "已确认",
  processing: "处理中",
  shipped: "已发货",
  delivered: "已送达",
};
