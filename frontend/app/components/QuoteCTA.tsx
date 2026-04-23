'use client';

export function QuoteCTA() {
  return (
    <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-night p-8 text-white md:flex-row md:items-center md:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-lavender-200">Talk to a person</p>
        <h3 className="text-3xl font-semibold">Ready to move? Get a curated quote.</h3>
        <p className="max-w-xl text-sm text-white/80">
          Reach our support team directly on WhatsApp or email. Every enquiry can also be sent to{' '}
          <span className="font-semibold text-white">helpdesk@lavendertour.in</span> and our team will respond within
          business hours.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href="https://wa.me/919830462675"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-lavender-500 px-4 py-3 font-semibold text-night transition-colors hover:bg-lavender-600"
        >
          WhatsApp support
        </a>
        <a
          href="mailto:helpdesk@lavendertour.in"
          className="rounded-full border border-white/40 px-4 py-3 font-semibold transition-colors hover:bg-white/10"
        >
          Email helpdesk@lavendertour.in
        </a>
      </div>
    </section>
  );
}
