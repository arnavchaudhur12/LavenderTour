'use client';

const indiaSegments = [
  { title: 'Char Dham & Jyotirling', desc: 'Spiritual circuits with trusted ground ops.' },
  { title: 'National Parks', desc: 'Kaziranga, Jim Corbett, Ranthambore, Bandhavgarh.' },
  { title: 'Himalayan Treks', desc: 'Kedarkantha, Kashmir Great Lakes, Sandakphu, Valley of Flowers.' },
  { title: 'City & Culture', desc: 'Jaipur, Udaipur, Varanasi, Kochi, Pondicherry.' }
];

const intlSegments = [
  { title: 'Thailand', desc: 'Phuket, Krabi, Bangkok street food trails.' },
  { title: 'Vietnam', desc: 'Hanoi, Ha Long Bay cruises, Da Nang beach stays.' },
  { title: 'Philippines', desc: 'El Nido lagoons, Siargao surf, Cebu sharks.' },
  { title: 'Dubai', desc: 'City luxe, desert safaris, theme parks.' },
  { title: 'Singapore', desc: 'City blends, Sentosa, family friendly.' },
  { title: 'Sri Lanka', desc: 'Tea country, Galle, Yala safaris.' },
  { title: 'Laos', desc: 'Luang Prabang slow travel, waterfalls.' },
  { title: 'Cambodia', desc: 'Angkor touch points + island hops.' }
];

export function DestinationGrid() {
  return (
    <div className="space-y-10">
      <section id="india" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">India</p>
            <h2 className="text-3xl font-semibold text-night">Across India</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {indiaSegments.map((item) => (
            <div key={item.title} className="p-5 rounded-2xl border border-night/5 bg-white/70 shadow-sm">
              <p className="text-lg font-semibold text-night">{item.title}</p>
              <p className="text-sm text-night/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="international" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">International</p>
            <h2 className="text-3xl font-semibold text-night">Abroad picks</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {intlSegments.map((item) => (
            <div key={item.title} className="p-5 rounded-2xl border border-night/5 bg-white/70 shadow-sm">
              <p className="text-lg font-semibold text-night">{item.title}</p>
              <p className="text-sm text-night/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
