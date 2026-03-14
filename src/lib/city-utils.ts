import { cookies } from 'next/headers';
import type { CitySlug } from './seo/slugs';

const CITY_COOKIE = 'geo_city';

export function getSelectedCity(): CitySlug {
  return (cookies().get(CITY_COOKIE)?.value as CitySlug) || 'moskva';
}

export function setCityCookie(city: CitySlug, headers: Headers) {
  headers.set('Set-Cookie', `${CITY_COOKIE}=${city}; Path=/; Max-Age=31536000`);
}
