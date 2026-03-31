"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Hero() {
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.16;
    btnRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1800x1200.png?text=Morning+Coffee+Companion')] bg-cover bg-center opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-warmStone/80" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="relative z-10 max-w-3xl px-6 text-center text-charcoal"
      >
        <h1 className="font-[var(--font-cormorant)] text-5xl md:text-7xl">Intelligence That Understands You</h1>
        <p className="mx-auto mt-6 max-w-xl text-base md:text-lg">
          Advanced companion technology designed for meaningful connection
        </p>
        <Link
          ref={btnRef}
          href="#companions"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="mt-10 inline-block rounded-full bg-burnishedGold px-7 py-3 text-sm text-charcoal transition-transform duration-300"
        >
          Meet Your Companion
        </Link>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-8 text-xs tracking-[0.3em] text-charcoal/70"
      >
        SCROLL
      </motion.div>
    </section>
  );
}
