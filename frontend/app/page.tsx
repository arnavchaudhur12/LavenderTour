import Link from 'next/link';
import { Survey } from './components/Survey';
import { QuoteCTA } from './components/QuoteCTA';
import { TravelQuoteRotator } from './components/TravelQuoteRotator';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 text-night">
      <div className="space-y-16">
        <section className="grid items-start gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-[2rem] border border-white/30 bg-[rgba(255,252,248,0.82)] p-8 shadow-[0_30px_90px_rgba(8,10,18,0.20)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-lavender-800">Lavender Tour</p>
            <h1 className="text-4xl font-semibold leading-tight text-night md:text-6xl">
              Travel that fits you. India and beyond.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-night/85">
              High-touch itineraries, verified local partners, and thoughtful support from the first enquiry to the final
              trip confirmation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#enquire"
                className="rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lavender-700"
              >
                Start your enquiry
              </Link>
              <Link
                href="/destinations"
                className="rounded-full border border-night/12 bg-white px-5 py-3 text-sm font-semibold text-night transition-colors hover:bg-sand/80"
              >
                Explore destinations
              </Link>
            </div>
          </div>

          <TravelQuoteRotator />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/destinations"
            className="rounded-[1.75rem] border border-white/30 bg-[rgba(255,252,248,0.8)] p-6 shadow-[0_20px_60px_rgba(8,10,18,0.14)] backdrop-blur-xl transition-transform hover:-translate-y-1"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-lavender-700">Destinations</p>
            <h2 className="mt-3 text-2xl font-semibold text-night">Forests, beaches, mountains, and abroad</h2>
            <p className="mt-3 text-sm leading-7 text-night/75">
              Browse places separately, see travel guidance for each destination, and then view the image gallery.
            </p>
          </Link>
          <Link
            href="/reviews"
            className="rounded-[1.75rem] border border-white/30 bg-[rgba(255,252,248,0.8)] p-6 shadow-[0_20px_60px_rgba(8,10,18,0.14)] backdrop-blur-xl transition-transform hover:-translate-y-1"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-lavender-700">What people say</p>
            <h2 className="mt-3 text-2xl font-semibold text-night">Read realistic client feedback</h2>
            <p className="mt-3 text-sm leading-7 text-night/75">
              Explore 20 traveler reviews and share your own experience with the Lavender Tour team.
            </p>
          </Link>
          <Link
            href="/newsletter"
            className="rounded-[1.75rem] border border-white/30 bg-[rgba(255,252,248,0.8)] p-6 shadow-[0_20px_60px_rgba(8,10,18,0.14)] backdrop-blur-xl transition-transform hover:-translate-y-1"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-lavender-700">Newsletter</p>
            <h2 className="mt-3 text-2xl font-semibold text-night">Travel ideas straight to your inbox</h2>
            <p className="mt-3 text-sm leading-7 text-night/75">
              Subscribe for destination ideas, planning guidance, and curated travel inspiration worth opening.
            </p>
          </Link>
        </section>

        <div id="enquire">
          <Survey />
        </div>

        <QuoteCTA />
      </div>
    </main>
  );
}
