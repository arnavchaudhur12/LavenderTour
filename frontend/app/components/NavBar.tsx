'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

export function NavBar() {
  const [isAgent, setIsAgent] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 backdrop-blur bg-white/70 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-lavender-500 text-white flex items-center justify-center font-bold">LT</div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-lavender-700">lavender tour</p>
          <p className="text-sm text-night">Travel, simplified.</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm text-night/80">
        <Link href="#forest">Forests</Link>
        <Link href="#beach">Beaches</Link>
        <Link href="#mountain">Mountains</Link>
        <Link href="#abroad">Abroad</Link>
        <Link href="#india-destinations">Gallery</Link>
      </nav>

      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-night/70 cursor-pointer">
          <input
            type="checkbox"
            className="accent-lavender-600"
            checked={isAgent}
            onChange={() => setIsAgent(!isAgent)}
          />
          Agent login
        </label>
        <Link
          href="/login"
          className={clsx('px-4 py-2 rounded-full text-white bg-lavender-600 hover:bg-lavender-700 transition-colors', 'glow')}
        >
          {isAgent ? 'Agent Portal' : 'Login / Sign up'}
        </Link>
      </div>
    </header>
  );
}
