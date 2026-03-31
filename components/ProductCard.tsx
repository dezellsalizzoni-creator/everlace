"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article whileHover="hover" className="group relative min-w-[320px] overflow-hidden rounded-2xl bg-white/50">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.div variants={{ hover: { scale: 1.04 } }} transition={{ duration: 0.4 }}>
            <Image
              src={product.image}
              alt={product.name}
              width={900}
              height={1200}
              className="h-full w-full object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjRTdFM0REJy8+PC9zdmc+"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-end justify-center bg-black/10 pb-8 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full border border-white/50 bg-black/35 px-5 py-2 text-xs text-white">Explore</span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <h3 className="font-[var(--font-cormorant)] text-3xl">{product.name}</h3>
        <p className="text-sm text-charcoal/70">{product.tagline}</p>
        <p className="mt-2 text-sm">From ${product.basePrice.toLocaleString()}</p>
      </div>
    </motion.article>
  );
}
