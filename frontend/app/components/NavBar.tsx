'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export function NavBar() {
  const { session, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-[rgba(13,17,28,0.62)] px-6 py-4 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-lavender-400 via-lavender-500 to-amber-300 font-bold text-white shadow-[0_10px_30px_rgba(124,72,245,0.35)]">
          LT
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-lavender-200">lavender tour</p>
          <p className="text-sm text-white/80">Travel, simplified.</p>
        </div>
      </div>

      <nav className="hidden items-center gap-6 text-sm font-medium text-white/85 md:flex">
        <Link href="#forest" className="transition-colors hover:text-white">
          Forests
        </Link>
        <Link href="#beach" className="transition-colors hover:text-white">
          Beaches
        </Link>
        <Link href="#mountain" className="transition-colors hover:text-white">
          Mountains
        </Link>
        <Link href="#abroad" className="transition-colors hover:text-white">
          Abroad
        </Link>
        <Link href="#india-destinations" className="transition-colors hover:text-white">
          Gallery
        </Link>
      </nav>

      <div className="flex items-center gap-3 text-sm">
        {session ? (
          <>
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              Welcome {session.displayName || session.email}
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/20 bg-white px-4 py-2 font-medium text-night transition-colors hover:bg-lavender-100"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-lavender-500 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-[0_12px_35px_rgba(124,72,245,0.32)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Login / Sign up
          </Link>
        )}
      </div>
      </div>
    </header>
  );
}
