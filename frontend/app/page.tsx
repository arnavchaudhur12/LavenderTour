import { NavBar } from './components/NavBar';
import { Survey } from './components/Survey';
import { DestinationGrid } from './components/DestinationGrid';
import { QuoteCTA } from './components/QuoteCTA';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sand to-white text-night">
      <NavBar />
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-lavender-700">Lavender Tour</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-night leading-tight">
              Travel that fits you. India and beyond.
            </h1>
            <p className="text-lg text-night/70 max-w-2xl">
              High-touch itineraries, verified local partners, and transparent quotes. Start with a short survey and let us
              shortlist options.
            </p>
            <div className="flex gap-3 text-sm text-night/70">
              <span className="px-3 py-1 rounded-full bg-white/80 border border-night/5">Email login ready</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-night/5">Agent portal</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-night/5">21 India destinations</span>
            </div>
          </div>
          <div className="bg-white/70 border border-night/5 rounded-3xl p-6 shadow-lg glow">
            <p className="text-sm text-night/60 mb-2">Quick Overview</p>
            <ul className="space-y-2 text-night/80 text-sm">
              <li>• Email/password login for customers and agents</li>
              <li>• Recommendations engine based on your answers</li>
              <li>• 7 forests, 7 beaches, and 7 mountain destinations from India</li>
              <li>• 20 publicly available Wikimedia Commons images per destination</li>
              <li>• Hand-off to WhatsApp/Instagram/email for quotes</li>
            </ul>
          </div>
        </section>

        <Survey />
        <DestinationGrid />
        <QuoteCTA />
      </div>
    </main>
  );
}
