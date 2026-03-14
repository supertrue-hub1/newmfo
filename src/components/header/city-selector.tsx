'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCity } from '@/contexts/city-context';
import { CITIES_LIST, findCity } from '@/lib/cities';

export function CitySelector() {
  const { city, setCity } = useCity();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = findCity(search);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-1">
          <MapPin className="h-4 w-4" />
          {city.name}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60">
        <Command>
          <CommandInput placeholder="Выберите город" onValueChange={setSearch} />
          <CommandList className="max-h-48">
            {filtered.map(([slug, c]) => (
              <CommandItem
                key={slug}
                onSelect={() => {
                  setCity(slug);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', slug === city.slug ? 'opacity-100' : 'opacity-0')} />
                {c.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
