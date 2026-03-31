"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

const tabs = ["Description", "Specifications", "Care Guide", "Shipping"] as const;
const upgrades = [
  { key: "heating", label: "Heating System", price: 300 },
  { key: "voice", label: "Voice Module", price: 500 },
  { key: "feet", label: "Standing Feet", price: 200 },
];
const skinToneOptions = ["Ivory", "Natural", "Honey", "Bronze"];
const hairColorOptions = ["Onyx", "Chestnut", "Ash Brown", "Platinum"];
const eyeColorOptions = ["Hazel", "Gray", "Amber", "Ocean Blue"];

export default function ProductDetailView({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [skinTone, setSkinTone] = useState(skinToneOptions[1]);
  const [hairColor, setHairColor] = useState(hairColorOptions[0]);
  const [eyeColor, setEyeColor] = useState(eyeColorOptions[0]);
  const [activeImage, setActiveImage] = useState(product.gallery[0].image);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { addItem } = useCart();

  const total = useMemo(
    () => product.basePrice + upgrades.reduce((sum, item) => sum + (selected[item.key] ? item.price : 0), 0),
    [product.basePrice, selected]
  );

  const upgradesTotal = useMemo(
    () => upgrades.reduce((sum, item) => sum + (selected[item.key] ? item.price : 0), 0),
    [selected]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]"
      >
        <section className="space-y-6">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="relative block w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0.2, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.2, scale: 0.98 }}
                transition={{ duration: 0.45 }}
              >
                <Image src={activeImage} alt={`${product.name} preview`} width={1200} height={1600} className="w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/0 via-black/0 to-black/10 p-6">
              <div className="flex max-w-md items-center gap-3 rounded-xl border border-white/30 bg-black/35 px-4 py-3 text-left text-white">
                <Camera className="h-5 w-5 text-white/80" />
                <p className="text-xs leading-relaxed text-white/90">
                  Product imagery placeholder - High-resolution photography will be loaded here
                </p>
              </div>
            </div>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs text-white">Click to enlarge</span>
          </button>
          <div className="grid grid-cols-5 gap-3">
            {product.gallery.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveImage(item.image)}
                className={`flex items-center justify-center gap-2 rounded-md border py-3 text-xs transition ${
                  activeImage === item.image
                    ? "border-burnishedGold text-burnishedGold"
                    : "border-black/10 bg-white/70 text-charcoal/70 hover:border-black/20"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: thumbColor(item.label) }}
                  aria-hidden
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="top-24 h-fit rounded-2xl border border-black/10 bg-white/75 p-6 lg:sticky">
          <h1 className="font-[var(--font-cormorant)] text-4xl">{product.name} - {product.tagline}</h1>
          <p className="mt-2 text-lg text-charcoal/70">From ${product.basePrice.toLocaleString()} USD</p>
          <p className="mt-2 text-2xl text-burnishedGold font-medium">Total: ${total.toLocaleString()} USD</p>
          {upgradesTotal > 0 && <p className="mt-1 text-xs text-charcoal/60">Includes +${upgradesTotal.toLocaleString()} upgrades</p>}
          <p className="mt-4 text-sm text-charcoal/80">
            AI-assisted companion platform designed for responsive interaction, emotional continuity, and anatomically accurate construction.
          </p>

          <div className="mt-5 space-y-1 rounded-xl bg-warmStone/50 p-4 text-sm">
            <p>Height: {product.specs.height}</p>
            <p>Weight: {product.specs.weight}</p>
            <p>Bust: {product.specs.bust}</p>
            <p>Waist: {product.specs.waist}</p>
            <p>Hip: {product.specs.hip}</p>
            <p>Orifices: {product.specs.orifices}</p>
          </div>

          <div className="mt-6 space-y-4">
            <OptionGroup title="Skin Tone" options={skinToneOptions} value={skinTone} onChange={setSkinTone} />
            <OptionGroup title="Hair Color" options={hairColorOptions} value={hairColor} onChange={setHairColor} />
            <OptionGroup title="Eye Color" options={eyeColorOptions} value={eyeColor} onChange={setEyeColor} />
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
            <button
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: `${product.name} - ${product.tagline}`,
                  image: activeImage,
                  unitPrice: total,
                  options: {
                    skinTone,
                    hairColor,
                    eyeColor,
                    upgrades: upgrades.filter((item) => selected[item.key]).map((item) => item.label),
                  },
                })
              }
              className="w-full rounded-full bg-burnishedGold px-4 py-3 text-sm font-semibold text-charcoal"
            >
              Add to Cart
            </button>
            <button className="w-full rounded-full border border-burnishedGold bg-white px-4 py-3 text-sm font-medium text-burnishedGold">
              Schedule Consultation
            </button>
          </div>
        </aside>
      </motion.div>

      <section className="mt-12 rounded-2xl border border-black/10 bg-white/60 p-6">
        <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab ? "bg-burnishedGold text-charcoal" : "bg-black/5 text-charcoal/70"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="pt-5 text-sm text-charcoal/80">
          {activeTab === "Description" && (
            <div className="space-y-2">
              <p>{product.name} blends hand-finished silicone craftsmanship with adaptive AI behavior modeling for a personalized companion experience.</p>
              <p>The platform supports voice interaction, context memory, and anatomically accurate body geometry for high-fidelity realism.</p>
            </div>
          )}
          {activeTab === "Specifications" && (
            <div className="grid gap-2 sm:grid-cols-2">
              <p>Height: {product.specs.height}</p>
              <p>Weight: {product.specs.weight}</p>
              <p>Bust: {product.specs.bust}</p>
              <p>Waist: {product.specs.waist}</p>
              <p>Hip: {product.specs.hip}</p>
              <p>Orifices: {product.specs.orifices}</p>
              <p>Joint Count: {product.specs.joints}</p>
              <p>Core Material: Medical-grade silicone over alloy skeleton</p>
            </div>
          )}
          {activeTab === "Care Guide" && (
            <div className="space-y-2">
              <p>Use pH-balanced cleanser and lukewarm water after use.</p>
              <p>Dry fully, apply renewal powder as needed, and store in a ventilated dust-free case.</p>
            </div>
          )}
          {activeTab === "Shipping" && (
            <div className="space-y-2">
              <p>Shipped in unbranded, privacy-protected packaging with adult signature option.</p>
              <p>Processing 3-5 business days, delivery 7-14 business days depending on configuration.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={activeImage} alt={`${product.name} zoom`} width={1400} height={1800} className="w-full object-cover" />
              <button className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs text-white" onClick={() => setIsLightboxOpen(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-[0.18em] text-charcoal/60">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-1.5 text-xs ${value === item ? "bg-burnishedGold text-charcoal" : "bg-black/5 text-charcoal/75"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function thumbColor(label: string) {
  switch (label.toLowerCase()) {
    case "overall":
      return "#2C2C2C";
    case "face":
      return "#C9A961";
    case "body":
      return "#87A878";
    case "detail":
      return "#7C7C7C";
    case "joints":
      return "#B49B7A";
    default:
      return "#2C2C2C";
  }
}
