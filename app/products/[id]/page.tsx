"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductById } from "@/lib/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return notFound();

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-warmStone/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-charcoal/80 hover:text-burnishedGold">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link href="/" className="text-sm tracking-brand">
            EVERLACE
          </Link>
        </div>
      </header>
      <ProductDetailView product={product} />
      <Footer />
    </div>
  );
}
