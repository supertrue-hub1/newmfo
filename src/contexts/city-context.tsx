'use client';

import { createContext, useContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import type { CitySlug } from '@/lib/seo/slugs';
import type { City } from '@/lib/cities';
import { getCityBySlug, DEFAULT_CITY } from '@/lib/cities';
import { getCityFromClientCookie, getCityFromLocalStorage, saveCityToClient } from '@/lib/geo/cookie';

type GeoSource = 'cookie' | 'ip' | 'default' | 'manual';

type CityContextType = {
  city: City;
  citySlug: CitySlug;
  setCity: (slug: CitySlug) => void;
  isLoading: boolean;
  showConfirmation: boolean;
  confirmCity: () => void;
  changeCity: (slug: CitySlug) => void;
  source: GeoSource;
};

const CityCtx = createContext<CityContextType | null>(null);

export function CityProvider({ children }: PropsWithChildren) {
  const [citySlug, setCitySlug] = useState<CitySlug>(DEFAULT_CITY);
  const [source, setSource] = useState<GeoSource>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Инициализация города при монтировании
  useEffect(() => {
    const initCity = async () => {
      // 1. Проверяем cookie
      const cookieCity = getCityFromClientCookie();
      if (cookieCity !== DEFAULT_CITY) {
        setCitySlug(cookieCity);
        setSource('cookie');
        setIsLoading(false);
        return;
      }

      // 2. Проверяем localStorage
      const localCity = getCityFromLocalStorage();
      if (localCity && localCity !== DEFAULT_CITY) {
        setCitySlug(localCity);
        setSource('cookie');
        setIsLoading(false);
        return;
      }

      // 3. Определяем по IP через API
      try {
        const response = await fetch('/api/geo', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCitySlug(data.city);
          setSource(data.source);

          // Если определили по IP - показываем подтверждение
          if (data.source === 'ip' && data.detected) {
            setShowConfirmation(true);
          }
        }
      } catch (error) {
        console.error('[city] Failed to detect city:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initCity();
  }, []);

  // Подтвердить автоопределённый город
  const confirmCity = useCallback(() => {
    setShowConfirmation(false);
    saveCityToClient(citySlug);
  }, [citySlug]);

  // Сменить город вручную
  const changeCity = useCallback((slug: CitySlug) => {
    setCitySlug(slug);
    setSource('manual');
    setShowConfirmation(false);
    saveCityToClient(slug);

    // Синхронизируем с сервером
    fetch('/api/geo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: slug }),
    }).catch(console.error);
  }, []);

  // Устаревший метод для обратной совместимости
  const setCity = useCallback((slug: CitySlug) => {
    changeCity(slug);
  }, [changeCity]);

  const city = getCityBySlug(citySlug) || getCityBySlug(DEFAULT_CITY)!;

  return (
    <CityCtx.Provider
      value={{
        city,
        citySlug,
        setCity,
        isLoading,
        showConfirmation,
        confirmCity,
        changeCity,
        source,
      }}
    >
      {children}
    </CityCtx.Provider>
  );
}

export const useCity = () => {
  const ctx = useContext(CityCtx);
  if (!ctx) throw new Error('useCity outside Provider');
  return ctx;
};
