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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#110d18]">
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
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(10,14,24,0.58)_0%,rgba(25,16,44,0.34)_34%,rgba(72,44,15,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(144,96,255,0.34),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,184,76,0.20),transparent_26%),radial-gradient(circle_at_bottom_center,rgba(17,107,119,0.18),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,249,242,0.08)_0%,rgba(255,248,238,0.18)_18%,rgba(250,244,236,0.38)_42%,rgba(247,241,232,0.58)_100%)]" />
    </div>
  );
}
