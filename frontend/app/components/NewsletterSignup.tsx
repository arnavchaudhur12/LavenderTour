'use client';

import { FormEvent, useState } from 'react';
import { newsletterTopics } from '../data/travelContent';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export function NewsletterSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(newsletterTopics.slice(0, 2));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/engagement/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, interests: selectedTopics }),
      });
      const payload = (await response.json().catch(() => null)) as { detail?: string; message?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.detail ?? 'We could not subscribe you right now.');
      }
      setMessage(payload?.message ?? 'Thanks for subscribing. We will share travel ideas with you soon.');
      setName('');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">Travel newsletter</p>
        <h1 className="text-4xl font-semibold text-night md:text-5xl">Subscribe for travel ideas that are actually useful</h1>
        <p className="text-base leading-7 text-night/75 md:text-lg">
          Sign up for trip ideas, seasonal suggestions, practical planning notes, and destination inspiration from Lavender Tour.
        </p>
      </div>

      <section className="rounded-[2rem] border border-white/35 bg-[rgba(255,252,248,0.82)] p-8 shadow-[0_24px_70px_rgba(8,10,18,0.16)] backdrop-blur-xl">
        <form className="grid gap-5" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
          </div>

          <div>
            <p className="text-sm font-semibold text-night">What would you like to receive?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {newsletterTopics.map((topic) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${active ? 'border-lavender-500 bg-lavender-100 text-lavender-900' : 'border-night/10 bg-white text-night/75 hover:bg-sand/80'}`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button type="submit" disabled={loading} className="w-full rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:opacity-70">
            {loading ? 'Subscribing...' : 'Subscribe to newsletter'}
          </button>
        </form>
      </section>
    </section>
  );
}
