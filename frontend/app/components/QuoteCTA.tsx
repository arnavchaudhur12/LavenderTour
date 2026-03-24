'use client';

export function QuoteCTA() {
  return (
    <section className="mt-16 bg-night text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-lavender-200">Talk to a person</p>
        <h3 className="text-3xl font-semibold">Ready to move? Get a curated quote.</h3>
        <p className="text-sm text-white/80 max-w-xl">
          Connect on WhatsApp, Instagram, or email. A travel expert will refine your plan and share pricing within business hours.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <button className="px-4 py-3 rounded-full bg-lavender-500 hover:bg-lavender-600 text-night font-semibold">WhatsApp</button>
        <button className="px-4 py-3 rounded-full bg-white text-night font-semibold">Instagram</button>
        <button className="px-4 py-3 rounded-full border border-white/40 hover:bg-white/10 font-semibold">Email us</button>
      </div>
    </section>
  );
}
