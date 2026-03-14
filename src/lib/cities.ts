import type { CitySlug } from './seo/slugs';
import { CITIES } from './seo/slugs';

export type City = {
  slug: CitySlug;
  name: string;
  preposition: string;
};

export const CITIES_LIST = Object.entries(CITIES) as [CitySlug, City][];
export const DEFAULT_CITY: CitySlug = 'moskva';

export function findCity(search: string): City[] {
  return CITIES_LIST.filter(([slug, city]) => city.name.toLowerCase().includes(search.toLowerCase()));
}
