'use client';

import { FormEvent, useState } from 'react';
import { testimonials } from '../data/travelContent';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export function ReviewHub() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [tripType, setTripType] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/engagement/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city,
          trip_type: tripType || null,
          rating,
          comment,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { detail?: string; message?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.detail ?? 'We could not save your feedback right now.');
      }
      setMessage(payload?.message ?? 'Thank you for sharing your experience with Lavender Tour.');
      setName('');
      setCity('');
      setTripType('');
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">What people say about us</p>
        <h1 className="text-4xl font-semibold text-night md:text-5xl">Honest travel feedback from Indian travelers</h1>
        <p className="text-base leading-7 text-night/75 md:text-lg">
          Realistic review-style snippets to show how customers describe planning quality, responsiveness, and overall trip experience.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {testimonials.map((testimonial) => (
          <article key={`${testimonial.name}-${testimonial.trip}`} className="rounded-[1.5rem] border border-white/35 bg-[rgba(255,252,248,0.82)] p-5 shadow-[0_18px_50px_rgba(8,10,18,0.12)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.18em] text-lavender-700">{testimonial.city}</p>
            <h2 className="mt-3 text-xl font-semibold text-night">{testimonial.name}</h2>
            <p className="mt-1 text-sm font-medium text-night/70">{testimonial.trip}</p>
            <p className="mt-4 text-sm leading-7 text-night/80">{testimonial.review}</p>
          </article>
        ))}
      </div>

      <section id="share-feedback" className="rounded-[2rem] border border-white/35 bg-[rgba(255,252,248,0.82)] p-8 shadow-[0_24px_70px_rgba(8,10,18,0.16)] backdrop-blur-xl">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">Share your experience</p>
          <h2 className="text-3xl font-semibold text-night">Add your own feedback</h2>
          <p className="text-sm leading-7 text-night/75">
            Tell us how your trip felt, what worked well, and what other travelers should know.
          </p>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Your city" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" required />
          <input value={tripType} onChange={(event) => setTripType(event.target.value)} placeholder="Trip type (optional)" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 md:col-span-2" />
          <label className="flex flex-col gap-2 text-sm text-night/85 md:col-span-2">
            <span className="font-semibold text-night">Rating</span>
            <input type="range" min={1} max={5} value={rating} onChange={(event) => setRating(Number(event.target.value))} className="accent-lavender-600" />
            <span className="text-sm text-night/70">{rating} / 5</span>
          </label>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={5} placeholder="Share your feedback in under 100 words" className="rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 md:col-span-2" maxLength={500} required />
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</p> : null}
          <button type="submit" disabled={loading} className="rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:opacity-70 md:col-span-2">
            {loading ? 'Sending feedback...' : 'Share feedback'}
          </button>
        </form>
      </section>
    </section>
  );
}
