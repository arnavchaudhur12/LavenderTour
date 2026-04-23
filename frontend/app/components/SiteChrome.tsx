'use client';

import { usePathname } from 'next/navigation';
import { HeroBackgroundSlideshow } from './HeroBackgroundSlideshow';
import { NavBar } from './NavBar';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/login';

  return (
    <>
      <HeroBackgroundSlideshow />
      <div className="relative z-10 min-h-screen">
        {!hideNav ? <NavBar /> : null}
        {children}
      </div>
    </>
  );
}
