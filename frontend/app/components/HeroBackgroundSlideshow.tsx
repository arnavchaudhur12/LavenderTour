'use client';

import { useEffect, useState } from 'react';
import { fetchWikimediaImages, type WikimediaImage } from '../lib/wikimedia';

const heroCategories = [
  'Beaches in Goa',
  'Manali',
  'Jim Corbett National Park',
  'Munnar',
  'Havelock Island',
  'Kaziranga National Park',
  'Darjeeling',
  'Kovalam Beach',
];

export function HeroBackgroundSlideshow() {
  const [images, setImages] = useState<WikimediaImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchWikimediaImages(heroCategories, 8, 1800);
        if (!cancelled) {
          setImages(result);
        }
      } catch {
        if (!cancelled) {
          setImages([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2000);

    return () => {
      window.clearInterval(timer);
    };
  }, [images]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#110d18]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,72,245,0.3),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,204,128,0.22),transparent_26%)]" />
      {images.length ? (
        images.map((image, index) => (
          <img
            key={image.title}
            src={image.thumbUrl}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,249,0.88)_0%,rgba(255,253,249,0.92)_18%,rgba(255,253,249,0.95)_42%,rgba(255,253,249,0.98)_100%)]" />
    </div>
  );
}
