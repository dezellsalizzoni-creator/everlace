"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "everlace_age_verified_until";
const COOKIE_KEY = "everlace_age_verified_until";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function AgeVerification() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const now = Date.now();
    const fromStorage = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    const fromCookie = Number(
      document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${COOKIE_KEY}=`))
        ?.split("=")[1] ?? 0
    );

    if (fromStorage > now || fromCookie > now) {
      setIsOpen(false);
    }
  }, []);

  const onConfirm = () => {
    const expiresAt = Date.now() + ONE_DAY_MS;
    localStorage.setItem(STORAGE_KEY, String(expiresAt));
    document.cookie = `${COOKIE_KEY}=${expiresAt}; max-age=${60 * 60 * 24}; path=/; samesite=lax`;
    setIsOpen(false);
  };

  const onLeave = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-warmStone p-8 text-charcoal shadow-2xl">
        <p className="text-xs tracking-[0.25em] text-charcoal/60">AGE VERIFICATION</p>
        <h2 className="mt-3 font-[var(--font-cormorant)] text-4xl">You must be 18+</h2>
        <p className="mt-3 text-sm text-charcoal/75">
          This website contains mature companion technology content. By continuing, you confirm you are at least 18 years old.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onConfirm} className="flex-1 rounded-full bg-burnishedGold px-4 py-3 text-sm">
            I am 18 or older
          </button>
          <button onClick={onLeave} className="flex-1 rounded-full bg-black/10 px-4 py-3 text-sm text-charcoal/75">
            Leave Site
          </button>
        </div>
      </div>
    </div>
  );
}
