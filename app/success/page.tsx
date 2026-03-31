import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { order?: string };
}) {
  const orderId = searchParams?.order ?? `EVL-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-24">
      <div className="w-full rounded-2xl border border-black/10 bg-white/70 p-8 text-center">
        <p className="text-xs tracking-[0.2em] text-sageGreen">PAYMENT SUCCESSFUL</p>
        <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl">Thank You For Your Order</h1>
        <p className="mt-3 text-sm text-charcoal/75">Your order has been received and is now being processed.</p>
        <p className="mt-4 text-sm text-burnishedGold">Order ID: {orderId}</p>
        <Link href="/" className="mt-6 inline-block rounded-full border border-burnishedGold px-5 py-2 text-sm font-medium text-burnishedGold">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
