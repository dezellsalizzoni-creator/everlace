"use client";

import { useEffect, useState } from "react";

const reviews = [
  { name: "Owner A", text: "Premium build quality and remarkable emotional responsiveness." },
  { name: "Owner B", text: "The consultation and customization process felt discreet and professional." },
  { name: "Owner C", text: "AI interaction memory creates a consistent long-term experience." },
];

export default function Reviews() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % reviews.length), 3500);
    return () => clearInterval(timer);
  }, []);
  const review = reviews[index];
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-sageGreen">VERIFIED OWNERS</p>
      <div className="mt-6 rounded-2xl bg-white/70 p-8">
        <p className="text-lg">{"★★★★★"}</p>
        <p className="mt-3 text-charcoal/80">{review.text}</p>
        <p className="mt-4 text-sm text-charcoal/60">{review.name}</p>
      </div>
    </section>
  );
}
