'use client';

import * as React from 'react';
import { useCity } from '@/contexts/city-context';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Компонент подтверждения города
 * Показывается при автоопределении города по IP
 */
export function CityConfirmation() {
  const { showConfirmation, city, confirmCity, changeCity } = useCity();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  // Показываем с задержкой для плавности
  React.useEffect(() => {
    if (showConfirmation && !dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [showConfirmation, dismissed]);

  const handleConfirm = () => {
    confirmCity();
    setIsOpen(false);
  };

  const handleChange = () => {
    // Открываем селектор города
    setDismissed(true);
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsOpen(false);
    confirmCity(); // Сохраняем текущий город
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80',
        'z-50',
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
    >
      <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Ваш город — {city.name}?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Мы определили его автоматически
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleConfirm}
            className="flex-1"
          >
            Да, верно
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleChange}
            className="flex-1"
          >
            Выбрать другой
          </Button>
        </div>
      </div>
    </div>
  );
}
