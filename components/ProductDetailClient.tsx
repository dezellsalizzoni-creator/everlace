"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

const tabs = ["Description", "Specifications", "Care Guide", "Shipping"] as const;
const upgrades = [
  { key: "heating", label: "Heating System", price: 299 },
  { key: "voice", label: "Voice Module", price: 399 },
  { key: "feet", label: "Standing Feet", price: 249 },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const total = useMemo(
    () => product.basePrice + upgrades.reduce((sum, item) => sum + (selected[item.key] ? item.price : 0), 0),
    [product.basePrice, selected]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-28">
      <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl">
            <Image src={product.image} alt={product.name} width={1200} height={800} className="w-full object-cover" />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {["Full", "Face", "Detail", "Private", "Joints"].map((label) => (
              <button key={label} className="rounded-md border border-black/10 bg-white/70 py-3 text-xs">
                {label}
              </button>
            ))}
          </div>
          <div>
            <h1 className="font-[var(--font-cormorant)] text-5xl">{product.name}</h1>
            <p className="mt-2 text-xl">${total.toLocaleString()}</p>
            <p className="mt-4 text-charcoal/75">{product.description}</p>
            <div className="mt-6 grid gap-2 text-sm">
              <p>Height: {product.specs.height}</p>
              <p>Weight: {product.specs.weight}</p>
              <p>Bust: {product.specs.bust}</p>
              <p>Waist: {product.specs.waist}</p>
              <p>Hip: {product.specs.hip}</p>
              <p>Orifices: {product.specs.orifices}</p>
              <p>Joints: {product.specs.joints}</p>
            </div>
          </div>
          <div>
            <div className="flex gap-2 border-b border-black/10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm ${activeTab === tab ? "border-b border-burnishedGold text-burnishedGold" : "text-charcoal/70"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm text-charcoal/80">
              {activeTab === "Description" && "Professional-grade, anatomically accurate companion platform with advanced support modules."}
              {activeTab === "Specifications" && "Body architecture, articulation map, AI response stack, and thermal module compatibility."}
              {activeTab === "Care Guide" && "Use pH-balanced cleanser, dry thoroughly, and store in ventilated environment."}
              {activeTab === "Shipping" && "Discreet neutral packaging with insured and trackable premium delivery."}
            </div>
          </div>
        </div>
        <aside className="top-24 h-fit rounded-2xl border border-black/10 bg-white/75 p-6 lg:sticky">
          <h2 className="font-[var(--font-cormorant)] text-3xl">Configuration</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {["Height", "Body Type", "Skin Tone", "Eye Color", "Hair Style"].map((item) => (
              <label key={item} className="grid gap-1">
                {item}
                <select className="rounded-md border border-black/15 bg-transparent p-2">
                  <option>Standard</option>
                </select>
              </label>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            {upgrades.map((u) => (
              <label key={u.key} className="flex items-center justify-between text-sm">
                <span>{u.label}</span>
                <span className="flex items-center gap-2">
                  +${u.price}
                  <input type="checkbox" onChange={(e) => setSelected((p) => ({ ...p, [u.key]: e.target.checked }))} />
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <button className="w-full rounded-full bg-burnishedGold px-4 py-3 text-sm">Add to Cart</button>
            <button className="w-full rounded-full border border-black/20 px-4 py-3 text-sm">Schedule Video Consultation</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
