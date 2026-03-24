'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

const schema = z.object({
  indie: z.enum(['yes', 'no']),
  region: z.enum(['india', 'abroad']),
  groupSize: z.enum(['solo', 'couple', 'family', 'friends', 'corporate']),
  days: z.enum(['3-5', '6-8', '9-12', '13+']),
  budget: z.enum(['budget', 'comfort', 'premium', 'luxury']),
  hotel: z.enum(['homestay', '3-star', '4-star', '5-star', 'villa']),
  groupTravel: z.enum(['yes', 'no'])
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
  { title: 'Dubai City Rush', tag: 'City Luxe', region: 'abroad', days: '3-5', budget: 'premium' }
];

export function Survey() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SurveyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      indie: 'yes',
      region: 'india',
      groupSize: 'couple',
      days: '6-8',
      budget: 'comfort',
      hotel: '4-star',
      groupTravel: 'no'
    }
  });

  const current = watch();

  const filtered = useMemo(() => {
    return suggestions.filter((s) => s.region === current.region && s.days === current.days ? true : s.region === current.region);
  }, [current]);

  const onSubmit = (data: SurveyForm) => {
    console.log('survey submitted', data);
  };

  const renderSelect = (
    name: keyof SurveyForm,
    label: string,
    options: { value: SurveyForm[keyof SurveyForm]; label: string }[]
  ) => (
    <label className="flex flex-col gap-2 text-sm text-night/80">
      <span className="font-semibold text-night">{label}</span>
      <select
        className={clsx(
          'w-full rounded-lg border border-night/10 bg-white/80 px-3 py-3 text-night shadow-sm focus:outline-none focus:ring-2 focus:ring-lavender-400'
        )}
        {...register(name)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errors[name] && <span className="text-xs text-red-600">Required</span>}
    </label>
  );

  return (
    <section className="grid gap-10 lg:grid-cols-2 items-start">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-lavender-700">Start with you</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-night">Plan the journey that fits you.</h1>
        <p className="text-lg text-night/70 max-w-2xl">
          Answer a few questions and we will surface India and international ideas you will actually enjoy.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 bg-white/70 rounded-2xl p-6 border border-night/5 shadow-md">
          {renderSelect('indie', 'Are you an indie traveler?', [
            { value: 'yes', label: 'Yes, I explore on my own' },
            { value: 'no', label: 'Prefer guided' }
          ])}
          {renderSelect('region', 'Where do you want to go?', [
            { value: 'india', label: 'India' },
            { value: 'abroad', label: 'International' }
          ])}
          {renderSelect('groupSize', 'Group size', [
            { value: 'solo', label: 'Solo' },
            { value: 'couple', label: 'Couple' },
            { value: 'family', label: 'Family' },
            { value: 'friends', label: 'Friends' },
            { value: 'corporate', label: 'Corporate' }
          ])}
          {renderSelect('days', 'How many days?', [
            { value: '3-5', label: '3-5 days' },
            { value: '6-8', label: '6-8 days' },
            { value: '9-12', label: '9-12 days' },
            { value: '13+', label: '13+ days' }
          ])}
          {renderSelect('budget', 'Budget per person', [
            { value: 'budget', label: 'Value' },
            { value: 'comfort', label: 'Comfort' },
            { value: 'premium', label: 'Premium' },
            { value: 'luxury', label: 'Luxury' }
          ])}
          {renderSelect('hotel', 'Stay preference', [
            { value: 'homestay', label: 'Homestay' },
            { value: '3-star', label: '3-star' },
            { value: '4-star', label: '4-star' },
            { value: '5-star', label: '5-star' },
            { value: 'villa', label: 'Villa' }
          ])}
          {renderSelect('groupTravel', 'Join curated groups?', [
            { value: 'yes', label: 'Yes, open to group travel' },
            { value: 'no', label: 'No, private only' }
          ])}
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-night text-white py-3 text-sm font-semibold hover:bg-lavender-700 transition-colors"
          >
            See recommendations
          </button>
        </form>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 border border-night/5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-night/60">Top picks for you</p>
            <p className="text-2xl font-semibold text-night">Tailored ideas</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 text-xs">Beta</span>
        </div>
        <div className="grid gap-3">
          {filtered.map((s) => (
            <div key={s.title} className="flex items-center justify-between rounded-xl border border-night/5 p-4 bg-sand/60">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">{s.tag}</p>
                <p className="text-lg font-semibold text-night">{s.title}</p>
                <p className="text-xs text-night/60">{s.days} days • {s.budget} comfort</p>
              </div>
              <button className="text-sm px-3 py-2 rounded-full bg-lavender-600 text-white hover:bg-lavender-700">Get quote</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
