'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty, CommandSeparator, CommandGroup } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCity } from '@/contexts/city-context';
import { findCityGrouped, POPULAR_CITIES, OTHER_CITIES } from '@/lib/cities';
import type { CitySlug } from '@/lib/seo/slugs';
import type { City } from '@/lib/cities';

export function CitySelector() {
  const { city, citySlug, changeCity, isLoading } = useCity();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Поиск с группировкой
  const { popular, other } = React.useMemo(() => {
    if (!search.trim()) {
      return {
        popular: POPULAR_CITIES.map(([_, c]) => c),
        other: OTHER_CITIES.map(([_, c]) => c),
      };
    }
    return findCityGrouped(search);
  }, [search]);

  const handleSelect = (slug: CitySlug) => {
    changeCity(slug);
    setOpen(false);
    setSearch('');
  };

  // Рендер списка городов
  const renderCityItem = (c: City) => (
    <CommandItem
      key={c.slug}
      value={c.name}
      onSelect={() => handleSelect(c.slug)}
      className="flex items-center gap-2"
    >
      <Check
        className={cn(
          'h-4 w-4 flex-shrink-0',
          c.slug === citySlug ? 'opacity-100' : 'opacity-0'
        )}
      />
      <span>{c.name}</span>
    </CommandItem>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-1.5 h-9 px-3',
            'text-muted-foreground hover:text-foreground',
            'border border-transparent hover:border-border',
            'transition-colors'
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MapPin className="h-3.5 w-3.5" />
          )}
          <span className="text-sm font-medium">{city.name}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 p-0"
        sideOffset={8}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск города..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {search && <p className="py-4 text-center text-sm text-muted-foreground">Город не найден</p>}
            </CommandEmpty>

            {/* Популярные города */}
            {popular.length > 0 && (
              <CommandGroup heading="Популярные">
                {popular.map(renderCityItem)}
              </CommandGroup>
            )}

            {/* Остальные города */}
            {other.length > 0 && (
              <>
                <CommandSeparator />
                <ScrollArea className="h-48">
                  <CommandGroup heading="Все города">
                    {other.map(renderCityItem)}
                  </CommandGroup>
                </ScrollArea>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
