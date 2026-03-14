'use client';

import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import type { CitySlug } from '@/lib/seo/slugs';

type CityContextType = {
  city: CitySlug;
  setCity: (slug: CitySlug) => void;
};

const CityCtx = createContext<CityContextType | null>(null);

export function CityProvider({ children }: PropsWithChildren) {
  const [city, setCityInternal] = useState<CitySlug>('moskva');

  const setCity = (slug: CitySlug) => {
    setCityInternal(slug);
    document.cookie = `geo_city=${slug}; path=/; max-age=31536000`;
  };

  return (
    <CityCtx.Provider value={{ city, setCity }}>
      {children}
    </CityCtx.Provider>
  );
}

export const useCity = () => {
  const ctx = useContext(CityCtx);
  if (!ctx) throw new Error('useCity outside Provider');
  return ctx;
};
