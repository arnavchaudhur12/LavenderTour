'use client';

import { useEffect, useState } from 'react';
import { travelQuotes } from '../data/travelContent';

export function TravelQuoteRotator() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % travelQuotes.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 rounded-[2rem] border border-white/30 bg-[rgba(12,16,27,0.72)] p-8 text-white shadow-[0_30px_90px_rgba(8,10,18,0.26)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.22em] text-white/60">Travel note</p>
      <blockquote className="min-h-[160px] text-2xl font-semibold leading-10 md:text-3xl">
        “{travelQuotes[activeIndex]}”
      </blockquote>
      <p className="text-sm text-white/70">A new travel thought appears every 10 seconds.</p>
    </div>
  );
}
