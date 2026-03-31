"use client";

import { motion } from "framer-motion";

const features = ["Adaptive Personality", "Voice Interaction", "Emotional Memory"];

export default function TechSection() {
  return (
    <section id="technology" className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-xs tracking-[0.2em] text-sageGreen">TECHNOLOGY</p>
        <h2 className="mt-3 font-[var(--font-cormorant)] text-5xl">She Learns. She Remembers. She Responds.</h2>
        <ul className="mt-6 space-y-3 text-charcoal/80">
          {features.map((f) => (
            <li key={f}>- {f}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-black/10 bg-white/70 p-6"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-warmStone p-3 text-sm">You remembered I prefer quiet evenings.</div>
          <div className="ml-8 rounded-xl bg-sageGreen/20 p-3 text-sm">Noted. I can shift to a calmer response profile tonight.</div>
          <div className="rounded-xl bg-warmStone p-3 text-sm">Let us continue where we left off yesterday.</div>
        </div>
      </motion.div>
    </section>
  );
}
