"use client";

import { useState } from "react";

const skinTones = ["#E7C8A6", "#D6A27A", "#B97A56"];
const hairTones = ["#39281D", "#8A5C3A", "#101010"];

export default function CustomTeaser() {
  const [skin, setSkin] = useState(0);
  const [hair, setHair] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-8 rounded-3xl bg-white/60 p-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-[var(--font-cormorant)] text-4xl">Design Your Companion</h3>
          <p className="text-charcoal/75">Preview customization presets with a simplified silhouette model.</p>
          <label className="block text-sm">Skin Tone</label>
          <input type="range" min={0} max={2} value={skin} onChange={(e) => setSkin(Number(e.target.value))} />
          <label className="block text-sm">Hair Tone</label>
          <input type="range" min={0} max={2} value={hair} onChange={(e) => setHair(Number(e.target.value))} />
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-56 rounded-[999px] border border-black/10" style={{ backgroundColor: skinTones[skin] }}>
            <div className="absolute -top-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full" style={{ backgroundColor: hairTones[hair] }} />
          </div>
        </div>
      </div>
    </section>
  );
}
