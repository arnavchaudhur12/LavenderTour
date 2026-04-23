'use client';

import { useEffect, useMemo, useState } from 'react';
import { destinationGuides } from '../data/destinationGuides';
import { destinationSections, indiaDestinations, type DestinationEntry, type DestinationKind } from '../data/indiaDestinations';
import { fetchWikimediaImages, type WikimediaImage } from '../lib/wikimedia';

export function DestinationExplorer() {
  const [activeDestination, setActiveDestination] = useState<DestinationEntry | null>(null);

  const grouped = useMemo(
    () =>
      destinationSections.map((section) => ({
        ...section,
        items: indiaDestinations.filter((destination) => destination.kind === section.id),
      })),
    []
  );

  return (
    <section className="space-y-10" id="destinations-atlas">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">Destination atlas</p>
        <h2 className="text-3xl font-semibold text-night md:text-4xl">Explore places first, then open the full travel brief</h2>
        <p className="text-base text-night/75 md:text-lg">
          Browse destinations by theme. Each place opens a detailed panel with arrival guidance and a visual gallery.
        </p>
      </div>

      {grouped.map((section) => (
        <DestinationSection key={section.id} section={section} activeSlug={activeDestination?.slug} onSelect={setActiveDestination} />
      ))}

      {activeDestination ? <DestinationGallery destination={activeDestination} onClose={() => setActiveDestination(null)} /> : null}
    </section>
  );
}

function DestinationSection({
  section,
  activeSlug,
  onSelect,
}: {
  section: { id: DestinationKind; eyebrow: string; title: string; intro: string; items: DestinationEntry[] };
  activeSlug?: string;
  onSelect: (destination: DestinationEntry) => void;
}) {
  return (
    <section id={section.id} className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">{section.eyebrow}</p>
          <h3 className="text-2xl font-semibold text-night md:text-3xl">{section.title}</h3>
        </div>
        <p className="max-w-2xl text-sm text-night/65 md:text-base">{section.intro}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((destination) => {
          const isActive = activeSlug === destination.slug;
          return (
            <button
              key={destination.slug}
              type="button"
              onClick={() => onSelect(destination)}
              className={`rounded-[1.75rem] border p-5 text-left transition-all ${
                isActive
                  ? 'border-lavender-500 bg-white shadow-[0_24px_70px_rgba(124,72,245,0.20)]'
                  : 'border-night/12 bg-white shadow-[0_20px_52px_rgba(15,16,36,0.12)] hover:-translate-y-0.5 hover:border-night/20 hover:bg-white hover:shadow-[0_24px_60px_rgba(15,16,36,0.16)]'
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sand px-3 py-1 text-xs uppercase tracking-[0.18em] text-night/80">{destination.state}</span>
              </div>
              <h4 className="text-xl font-semibold text-night">{destination.title}</h4>
              <p className="mt-2 text-sm font-medium text-night/80">{destination.tagline}</p>
              <p className="mt-4 text-sm leading-6 text-night/85">{destination.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {destination.bestFor.map((item) => (
                  <span key={item} className="rounded-full border border-night/10 bg-white px-3 py-1 text-xs text-night/75">
                    {item}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DestinationGallery({
  destination,
  onClose,
}: {
  destination: DestinationEntry;
  onClose: () => void;
}) {
  const [images, setImages] = useState<WikimediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const guide = destinationGuides[destination.slug];

  useEffect(() => {
    let isCancelled = false;

    async function loadImages() {
      setLoading(true);
      setError('');
      try {
        const results = await fetchWikimediaImages(destination.commonsCategories);
        if (!isCancelled) {
          setImages(results);
          if (!results.length) {
            setError('No image gallery was returned for this destination yet.');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load image gallery.');
          setImages([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [destination]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night/70 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#fffdf9] shadow-[0_32px_120px_rgba(0,0,0,0.28)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-6 rounded-t-[2rem] border-b border-night/8 bg-[#fffdf9]/95 px-6 py-5 backdrop-blur md:px-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">{destination.state}</p>
            <h3 className="text-2xl font-semibold text-night md:text-3xl">{destination.title}</h3>
            <p className="max-w-3xl text-sm leading-6 text-night/70 md:text-base">{destination.blurb}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-night/10 px-4 py-2 text-sm text-night/70 transition hover:bg-night hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-8 px-6 py-6 md:px-8 md:py-8">
          <section className="rounded-[1.75rem] border border-night/8 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-lavender-700">How to reach</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TravelGuideCard label="Nearest airport / by flight" detail={guide?.byAir ?? 'Please confirm the best airport based on your final route.'} />
              <TravelGuideCard label="Nearest station / by train" detail={guide?.byRail ?? 'Rail access depends on the route; we will guide you during planning.'} />
              <TravelGuideCard label="By road / private car" detail={guide?.byRoad ?? 'A private road transfer is usually the easiest option.'} />
              <TravelGuideCard label="Local transport" detail={guide?.localTransit ?? 'Local travel is usually managed by hotel transfers or private cabs.'} />
            </div>
          </section>

          <section>
            {loading ? <GalleryStatus text="Loading destination gallery..." /> : null}
            {error ? <GalleryStatus text={error} error /> : null}
            {!loading && !error ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {images.map((image) => (
                  <div key={image.title} className="overflow-hidden rounded-[1.5rem] border border-night/8 bg-white shadow-sm">
                    <div className="aspect-[4/3] overflow-hidden bg-sand">
                      <img
                        src={image.thumbUrl}
                        alt={image.title.replace(/^File:/, '').replace(/_/g, ' ')}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-medium text-night">
                        {image.title.replace(/^File:/, '').replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

function TravelGuideCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-night/8 bg-sand/40 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-lavender-700">{label}</p>
      <p className="mt-2 text-sm leading-6 text-night/80">{detail}</p>
    </div>
  );
}

function GalleryStatus({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div className={`rounded-2xl px-4 py-4 text-sm ${error ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-night/8 bg-white text-night/70'}`}>
      {text}
    </div>
  );
}
