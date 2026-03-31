'use client'
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductCard from "@/components/ProductCard";
import TechSection from "@/components/TechSection";
import CraftSection from "@/components/CraftSection";
import CustomTeaser from "@/components/CustomTeaser";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <div>
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <section id="companions" className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-8 font-[var(--font-cormorant)] text-5xl">Featured Companions</h2>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        <TechSection />
        <CraftSection />
        <CustomTeaser />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}
