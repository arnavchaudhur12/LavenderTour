'use client';

import { useEffect, useMemo, useState } from 'react';
import { destinationSections, indiaDestinations, type DestinationEntry, type DestinationKind } from '../data/indiaDestinations';
import { fetchWikimediaImages, type WikimediaImage } from '../lib/wikimedia';

const IMAGE_LIMIT = 20;

export function DestinationExplorer() {
  const [activeDestination, setActiveDestination] = useState<DestinationEntry | null>(indiaDestinations[0] ?? null);

  const grouped = useMemo(
    () =>
      destinationSections.map((section) => ({
        ...section,
        items: indiaDestinations.filter((destination) => destination.kind === section.id),
      })),
    []
  );

  return (
    <section className="space-y-10" id="india-destinations">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-lavender-700">India destination atlas</p>
        <h2 className="text-3xl font-semibold text-night md:text-4xl">Forests, beaches, and mountain stays with real image depth</h2>
        <p className="text-base text-night/70 md:text-lg">
          We’ve expanded the site with 21 India-first destinations. Open any place to browse up to 20 publicly available
          images pulled from Wikimedia Commons, then use the itinerary form to turn that place into a quote request.
        </p>
      </div>

      {grouped.map((section) => (
        <DestinationSection
          key={section.id}
          section={section}
          activeSlug={activeDestination?.slug}
          onSelect={setActiveDestination}
        />
      ))}

      {activeDestination ? (
        <DestinationGallery destination={activeDestination} onClose={() => setActiveDestination(null)} />
      ) : null}
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((destination) => {
          const isActive = activeSlug === destination.slug;
          return (
            <button
              key={destination.slug}
              type="button"
              onClick={() => onSelect(destination)}
              className={`rounded-[1.75rem] border p-5 text-left transition-all ${
                isActive
                  ? 'border-lavender-500 bg-white shadow-[0_22px_60px_rgba(124,72,245,0.18)]'
                  : 'border-night/8 bg-white/72 hover:-translate-y-0.5 hover:border-night/15 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,16,36,0.08)]'
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sand px-3 py-1 text-xs uppercase tracking-[0.18em] text-night/70">
                  {destination.state}
                </span>
                <span className="text-xs font-medium text-lavender-700">20 public images</span>
              </div>
              <h4 className="text-xl font-semibold text-night">{destination.title}</h4>
              <p className="mt-2 text-sm text-night/70">{destination.tagline}</p>
              <p className="mt-4 text-sm leading-6 text-night/75">{destination.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {destination.bestFor.map((item) => (
                  <span key={item} className="rounded-full border border-night/8 px-3 py-1 text-xs text-night/65">
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
            setError('No public image set was returned for this destination.');
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

        <div className="px-6 py-6 md:px-8 md:py-8">
          {loading ? <GalleryStatus text="Loading Wikimedia Commons gallery..." /> : null}
          {error ? <GalleryStatus text={error} error /> : null}
          {!loading && !error ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {images.map((image) => (
                <a
                  key={image.title}
                  href={image.descriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[1.5rem] border border-night/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,16,36,0.12)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-sand">
                    <img
                      src={image.thumbUrl}
                      alt={image.title.replace(/^File:/, '').replace(/_/g, ' ')}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="line-clamp-2 text-sm font-medium text-night">
                      {image.title.replace(/^File:/, '').replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-night/55">
                      <span>Source: Wikimedia Commons</span>
                      <span>Open</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GalleryStatus({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 text-sm ${
        error ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-night/8 bg-white text-night/70'
      }`}
    >
      {text}
    </div>
  );
}
