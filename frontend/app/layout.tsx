import { AuthProvider } from './components/AuthProvider';
import { SiteChrome } from './components/SiteChrome';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lavender Tour | Travel crafted for you',
  description: 'Curated India & international journeys with tailored recommendations.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
