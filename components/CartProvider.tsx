"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Minus, Package, Plus, Trash2, X } from "lucide-react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: {
    skinTone: string;
    hairColor: string;
    eyeColor: string;
    upgrades: string[];
  };
};

type AddCartInput = Omit<CartItem, "id" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddCartInput) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "everlace_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const addItem = (input: AddCartInput) => {
    const optionKey = JSON.stringify(input.options);
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === input.productId && JSON.stringify(item.options) === optionKey);
      if (existing) {
        return prev.map((item) => (item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...input, id: `${input.productId}-${Date.now()}`, quantity: 1 }];
    });
    setToast("Added to cart");
    setIsOpen(true);
  };

  const increaseQty = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));

  const decreaseQty = (id: string) =>
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      })
    );

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[130] rounded-full bg-burnishedGold px-4 py-2 text-sm font-medium text-charcoal shadow-lg">
          {toast}
        </div>
      )}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const cart = useCart();
  return (
    <>
      {cart.isOpen && <div className="fixed inset-0 z-[110] bg-black/30" onClick={cart.closeCart} />}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-screen w-full max-w-md flex-col border-l border-black/10 bg-warmStone shadow-2xl transition-transform duration-300 ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="font-[var(--font-cormorant)] text-3xl">Your Cart</h3>
          <button onClick={cart.closeCart}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {cart.items.length === 0 && (
            <div className="rounded-xl border border-black/10 bg-white/55 p-5 text-center">
              <p className="text-sm text-charcoal/70">Your cart is empty</p>
              <Link
                href="/"
                onClick={cart.closeCart}
                className="mt-4 inline-block rounded-full border border-burnishedGold px-4 py-2 text-xs font-medium text-burnishedGold"
              >
                Continue Shopping
              </Link>
            </div>
          )}
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <div className="border-t border-black/10 px-5 py-4">
          <p className="mb-3 text-sm">Subtotal: ${cart.subtotal.toLocaleString()} USD</p>
          <Link
            href="/checkout"
            onClick={cart.closeCart}
            className="block w-full rounded-full bg-burnishedGold px-4 py-3 text-center text-sm font-semibold text-charcoal"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const cart = useCart();
  const [imageFailed, setImageFailed] = useState(false);

  const onRemove = () => {
    if (window.confirm("Remove this item from cart?")) {
      cart.removeItem(item.id);
    }
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white/65 p-3">
      <div className="flex gap-3">
        {!imageFailed ? (
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-black/5 text-charcoal/45">
            <Package size={18} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="text-xs text-charcoal/65">
            {item.options.skinTone} / {item.options.hairColor} / {item.options.eyeColor}
          </p>
          <p className="text-xs text-charcoal/65">{item.options.upgrades.join(", ") || "No upgrades"}</p>
          <p className="mt-1 text-sm text-burnishedGold">${item.unitPrice.toLocaleString()} USD</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full border border-burnishedGold text-burnishedGold transition hover:bg-burnishedGold hover:text-charcoal"
            onClick={() => cart.decreaseQty(item.id)}
          >
            <Minus size={14} />
          </button>
          <span className="w-7 text-center text-sm">{item.quantity}</span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full border border-burnishedGold text-burnishedGold transition hover:bg-burnishedGold hover:text-charcoal"
            onClick={() => cart.increaseQty(item.id)}
          >
            <Plus size={14} />
          </button>
        </div>
        <button className="text-charcoal/60 transition hover:text-red-600" onClick={onRemove} aria-label="Remove item">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
