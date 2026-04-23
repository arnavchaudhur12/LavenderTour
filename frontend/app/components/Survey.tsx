'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { indiaLocationOptions, internationalLocationOptions } from '../data/locationOptions';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  indie: z.enum(['yes', 'no']),
  region: z.enum(['india', 'abroad']),
  destinationType: z.enum(['forest', 'beach', 'mountain']).optional(),
  travelCountry: z.string().min(1, 'Please select a country'),
  travelState: z.string().optional(),
  travelCity: z.string().min(1, 'Please select a city'),
  departureDate: z.string().min(1, 'Please select your preferred date'),
  groupSize: z.enum(['solo', 'couple', 'family', 'friends', 'corporate']),
  days: z.enum(['3-5', '6-8', '9-12', '13+']),
  budget: z.number().min(10000).max(200000),
  hotel: z.enum(['homestay', '3-star', '4-star', '5-star', 'villa']),
  groupTravel: z.enum(['yes', 'no']),
  newsletterOptIn: z.boolean(),
  comments: z.string().max(1000).optional(),
});

type SurveyForm = z.infer<typeof schema>;

type Suggestion = {
  title: string;
  tag: string;
  region: 'india' | 'abroad';
  days: string;
  budget: string;
};

const suggestions: Suggestion[] = [
  { title: 'Char Dham Circuit', tag: 'Spiritual', region: 'india', days: '9-12', budget: 'comfort' },
  { title: 'Great Himalayan Trek', tag: 'Trekking', region: 'india', days: '6-8', budget: 'budget' },
  { title: 'Kaziranga + Shillong', tag: 'Wildlife', region: 'india', days: '6-8', budget: 'comfort' },
  { title: 'Phuket + Krabi', tag: 'Thailand', region: 'abroad', days: '6-8', budget: 'comfort' },
  { title: 'Bali & Ubud Retreat', tag: 'Island', region: 'abroad', days: '6-8', budget: 'premium' },
  { title: 'Dubai City Rush', tag: 'City Luxe', region: 'abroad', days: '3-5', budget: 'premium' },
];

const indiaLocations: Record<string, string[]> = indiaLocationOptions;
const internationalLocations: Record<string, string[]> = internationalLocationOptions;

const indiaStates = Object.keys(indiaLocations);
const internationalCountries = Object.keys(internationalLocations);

export function Survey() {
  const [popupMessage, setPopupMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SurveyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      email: '',
      phone: '',
      indie: 'yes',
      region: 'india',
      destinationType: 'mountain',
      travelCountry: 'India',
      travelState: indiaStates[0],
      travelCity: indiaLocations[indiaStates[0]][0],
      departureDate: '',
      groupSize: 'couple',
      days: '6-8',
      budget: 60000,
      hotel: '4-star',
      groupTravel: 'no',
      newsletterOptIn: true,
      comments: '',
    }
  });

  const current = watch();

  const availableCities = useMemo(() => {
    if (current.region === 'india') {
      const state = current.travelState && indiaLocations[current.travelState] ? current.travelState : indiaStates[0];
      return indiaLocations[state];
    }

    const country = current.travelCountry && internationalLocations[current.travelCountry] ? current.travelCountry : internationalCountries[0];
    return internationalLocations[country];
  }, [current.region, current.travelCountry, current.travelState]);

  const filtered = useMemo(() => {
    return suggestions.filter((suggestion) =>
      suggestion.region === current.region && suggestion.days === current.days ? true : suggestion.region === current.region
    );
  }, [current.days, current.region]);

  const onSubmit = async (data: SurveyForm) => {
    setSubmitError('');

    const response = await fetch(`${apiBaseUrl}/quotes/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: data.firstName,
        email: data.email,
        phone: data.phone,
        indie: data.indie,
        region: data.region,
        destination_type: data.region === 'india' ? data.destinationType : null,
        travel_country: data.region === 'india' ? 'India' : data.travelCountry,
        travel_state: data.region === 'india' ? data.travelState : null,
        travel_city: data.travelCity,
        departure_date: data.departureDate,
        group_size: data.groupSize,
        days: data.days,
        budget_per_person_inr: data.budget,
        hotel: data.hotel,
        group_travel: data.groupTravel,
        comments: data.comments,
        newsletter_opt_in: data.newsletterOptIn,
        suggested_trips: filtered.slice(0, 3).map((trip) => trip.title),
      })
    });

    const payload = (await response.json().catch(() => null)) as { detail?: string; message?: string } | null;
    if (!response.ok) {
      throw new Error(payload?.detail ?? 'We could not send your enquiry right now.');
    }

    setPopupMessage(payload?.message ?? 'Thanks, your request has been sent to our customer care team. We will assist you within 24 hours.');
    reset({
      firstName: '',
      email: '',
      phone: '',
      indie: 'yes',
      region: 'india',
      destinationType: 'mountain',
      travelCountry: 'India',
      travelState: indiaStates[0],
      travelCity: indiaLocations[indiaStates[0]][0],
      departureDate: '',
      groupSize: 'couple',
      days: '6-8',
      budget: 60000,
      hotel: '4-star',
      groupTravel: 'no',
      newsletterOptIn: true,
      comments: '',
    });
  };

  const handleRegionChange = (nextRegion: 'india' | 'abroad') => {
    setValue('region', nextRegion);
    if (nextRegion === 'india') {
      setValue('travelCountry', 'India');
      setValue('travelState', indiaStates[0]);
      setValue('travelCity', indiaLocations[indiaStates[0]][0]);
    } else {
      setValue('travelCountry', internationalCountries[0]);
      setValue('travelState', '');
      setValue('travelCity', internationalLocations[internationalCountries[0]][0]);
    }
  };

  const handleIndiaStateChange = (state: string) => {
    setValue('travelState', state);
    setValue('travelCity', indiaLocations[state][0]);
  };

  const handleCountryChange = (country: string) => {
    setValue('travelCountry', country);
    setValue('travelCity', internationalLocations[country][0]);
  };

  const renderSelect = (
    name: keyof SurveyForm,
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <label className="flex flex-col gap-2 text-sm text-night/85">
      <span className="font-semibold text-night">{label}</span>
      <select
        className={clsx('w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500')}
        {...register(name as never)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] ? <span className="text-xs text-red-600">Required</span> : null}
    </label>
  );

  return (
    <>
      <section className="grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-lavender-800">Enquire now</p>
          <h1 className="text-4xl font-semibold text-night md:text-5xl">Tell us where you want to go.</h1>
          <p className="max-w-2xl text-lg leading-8 text-night/80">
            Share your route, timing, budget, and preferences. Our customer care team receives the complete travel brief in
            the helpdesk inbox and gets back to you within 24 hours.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit, () => setSubmitError('Please complete the required fields before sending your enquiry.'))}
            className="grid gap-4 rounded-[2rem] border border-white/40 bg-[rgba(255,252,248,0.84)] p-6 shadow-[0_28px_80px_rgba(8,10,18,0.15)] backdrop-blur-xl"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm text-night/85">
                <span className="font-semibold text-night">First name</span>
                <input className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" {...register('firstName')} />
                {errors.firstName ? <span className="text-xs text-red-600">{errors.firstName.message}</span> : null}
              </label>
              <label className="flex flex-col gap-2 text-sm text-night/85">
                <span className="font-semibold text-night">Email address</span>
                <input type="email" className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" {...register('email')} />
                {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
              </label>
              <label className="flex flex-col gap-2 text-sm text-night/85">
                <span className="font-semibold text-night">Phone number</span>
                <input type="tel" className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" {...register('phone')} />
                {errors.phone ? <span className="text-xs text-red-600">{errors.phone.message}</span> : null}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {renderSelect('indie', 'Are you an indie traveler?', [
                { value: 'yes', label: 'Yes, I explore on my own' },
                { value: 'no', label: 'Prefer guided travel' },
              ])}
              <label className="flex flex-col gap-2 text-sm text-night/85">
                <span className="font-semibold text-night">Where do you want to travel?</span>
                <select
                  className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                  value={current.region}
                  onChange={(event) => handleRegionChange(event.target.value as 'india' | 'abroad')}
                >
                  <option value="india">India</option>
                  <option value="abroad">International</option>
                </select>
              </label>
            </div>

            {current.region === 'india' ? (
              <div className="grid gap-4 md:grid-cols-3">
                {renderSelect('destinationType', 'What kind of place do you want?', [
                  { value: 'forest', label: 'Forest' },
                  { value: 'beach', label: 'Beach' },
                  { value: 'mountain', label: 'Mountain' },
                ])}
                <label className="flex flex-col gap-2 text-sm text-night/85">
                  <span className="font-semibold text-night">State</span>
                  <select
                    className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                    value={current.travelState}
                    onChange={(event) => handleIndiaStateChange(event.target.value)}
                  >
                    {indiaStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-night/85">
                  <span className="font-semibold text-night">City / place</span>
                  <select
                    className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                    value={current.travelCity}
                    onChange={(event) => setValue('travelCity', event.target.value)}
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-night/85">
                  <span className="font-semibold text-night">Country</span>
                  <select
                    className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                    value={current.travelCountry}
                    onChange={(event) => handleCountryChange(event.target.value)}
                  >
                    {internationalCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-night/85">
                  <span className="font-semibold text-night">City</span>
                  <select
                    className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                    value={current.travelCity}
                    onChange={(event) => setValue('travelCity', event.target.value)}
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm text-night/85">
                <span className="font-semibold text-night">Preferred travel date</span>
                <input type="date" className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" {...register('departureDate')} />
                {errors.departureDate ? <span className="text-xs text-red-600">{errors.departureDate.message}</span> : null}
              </label>
              {renderSelect('groupSize', 'Group size', [
                { value: 'solo', label: 'Solo' },
                { value: 'couple', label: 'Couple' },
                { value: 'family', label: 'Family' },
                { value: 'friends', label: 'Friends' },
                { value: 'corporate', label: 'Corporate' },
              ])}
              {renderSelect('days', 'How many days?', [
                { value: '3-5', label: '3-5 days' },
                { value: '6-8', label: '6-8 days' },
                { value: '9-12', label: '9-12 days' },
                { value: '13+', label: '13+ days' },
              ])}
            </div>

            <label className="flex flex-col gap-3 text-sm text-night/85">
              <span className="font-semibold text-night">Budget per person</span>
              <div className="rounded-2xl border border-night/10 bg-white px-4 py-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-night/80">
                  <span>INR 10,000</span>
                  <span>Selected: INR {current.budget.toLocaleString('en-IN')}</span>
                  <span>INR 2,00,000</span>
                </div>
                <input type="range" min={10000} max={200000} step={5000} className="w-full accent-lavender-600" {...register('budget', { valueAsNumber: true })} />
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              {renderSelect('hotel', 'Stay preference', [
                { value: 'homestay', label: 'Homestay' },
                { value: '3-star', label: '3-star' },
                { value: '4-star', label: '4-star' },
                { value: '5-star', label: '5-star' },
                { value: 'villa', label: 'Villa' },
              ])}
              {renderSelect('groupTravel', 'Join curated groups?', [
                { value: 'yes', label: 'Yes, open to group travel' },
                { value: 'no', label: 'No, private only' },
              ])}
            </div>

            <label className="flex flex-col gap-2 text-sm text-night/85">
              <span className="font-semibold text-night">Special requests (optional)</span>
              <textarea rows={4} className="w-full rounded-xl border border-night/10 bg-white px-4 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-500" {...register('comments')} />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-night/10 bg-white px-4 py-3 text-sm text-night/80 shadow-sm">
              <input type="checkbox" className="accent-lavender-600" {...register('newsletterOptIn')} />
              Keep me subscribed to travel ideas, destination tips, and newsletter updates.
            </label>

            {submitError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p> : null}

            <button type="submit" disabled={isSubmitting} className="mt-2 w-full rounded-full bg-night py-3 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Sending enquiry...' : 'Enquire now'}
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/35 bg-[rgba(255,252,248,0.82)] p-6 shadow-[0_28px_80px_rgba(8,10,18,0.15)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-night/60">Suggested directions</p>
              <p className="text-2xl font-semibold text-night">Ideas that fit your current choices</p>
            </div>
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-xs text-lavender-700">Updated live</span>
          </div>
          <div className="grid gap-3">
            {filtered.map((suggestion) => (
              <div key={suggestion.title} className="flex items-center justify-between rounded-2xl border border-night/5 bg-white p-4 shadow-sm">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">{suggestion.tag}</p>
                  <p className="text-lg font-semibold text-night">{suggestion.title}</p>
                  <p className="text-xs text-night/60">{suggestion.days} days • {suggestion.budget} pace</p>
                </div>
                <span className="rounded-full bg-night px-4 py-2 text-sm font-medium text-white">Included in enquiry</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {popupMessage ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-night/55 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/20 bg-white p-8 text-center shadow-[0_30px_90px_rgba(8,10,18,0.28)]">
            <p className="text-sm uppercase tracking-[0.28em] text-lavender-700">Request sent</p>
            <h3 className="mt-3 text-3xl font-semibold text-night">Thank you.</h3>
            <p className="mt-4 text-base leading-7 text-night/75">{popupMessage}</p>
            <button type="button" onClick={() => setPopupMessage('')} className="mt-6 rounded-full bg-lavender-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lavender-700">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
