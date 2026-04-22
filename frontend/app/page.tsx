import { HeroBackgroundSlideshow } from './components/HeroBackgroundSlideshow';
import { NavBar } from './components/NavBar';
import { Survey } from './components/Survey';
import { DestinationGrid } from './components/DestinationGrid';
import { QuoteCTA } from './components/QuoteCTA';

export default function HomePage() {
  return (
    <main className="relative min-h-screen text-night">
      <HeroBackgroundSlideshow />
      <div className="relative z-10">
        <NavBar />
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <section className="grid items-start gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-[2rem] border border-white/30 bg-[rgba(255,252,248,0.78)] p-8 shadow-[0_30px_90px_rgba(8,10,18,0.20)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-lavender-800">Lavender Tour</p>
            <h1 className="text-4xl font-semibold leading-tight text-night md:text-6xl">
              Travel that fits you. India and beyond.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-night/85">
              High-touch itineraries, verified local partners, and transparent quotes. Start with a short survey and let us
              shortlist options.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-night/80">
              <span className="rounded-full border border-night/10 bg-white/85 px-4 py-2">Customer login ready</span>
              <span className="rounded-full border border-night/10 bg-white/85 px-4 py-2">21 India destinations</span>
              <span className="rounded-full border border-night/10 bg-white/85 px-4 py-2">USA, Australia, Europe galleries</span>
              <span className="rounded-full border border-night/10 bg-white/85 px-4 py-2">Live rotating destination backdrop</span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/25 bg-[rgba(12,16,27,0.66)] p-6 text-white shadow-[0_30px_90px_rgba(8,10,18,0.26)] backdrop-blur-xl">
            <p className="mb-2 text-sm uppercase tracking-[0.22em] text-white/60">Quick Overview</p>
            <ul className="space-y-3 text-sm leading-7 text-white/88">
              <li>• Email/password login for travelers</li>
              <li>• Recommendations engine based on your answers</li>
              <li>• 7 forests, 7 beaches, and 7 mountain destinations from India</li>
              <li>• 20 publicly available Wikimedia Commons images per destination</li>
              <li>• Rapidly rotating background photography across coast, forest, and mountain themes</li>
              <li>• USA, Australia, and Europe gallery coverage for outbound discovery</li>
              <li>• Hand-off to WhatsApp/Instagram/email for quotes</li>
            </ul>
          </div>
        </section>

        <Survey />
        <DestinationGrid />
        <QuoteCTA />
        </div>
      </div>
    </main>
  );
}
