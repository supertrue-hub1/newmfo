'use client';

import * as React from 'react';
import { Star, Clock, Zap, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TopOffer {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  rating: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  firstLoanRate?: number | null;
  baseRate: number;
  decisionTime: number;
  approvalRate?: number;
  features: string[];
  editorNote?: string | null;
  affiliateUrl?: string | null;
  tags?: { name: string; slug: string }[];
}

interface TopOffersProps {
  offers: TopOffer[];
  title?: string;
}

// Цвета для логотипов МФО
const MFO_COLORS: Record<string, string> = {
  'Займер': 'from-blue-500 to-blue-600',
  'MoneyMan': 'from-green-500 to-green-600',
  'еКапуста': 'from-emerald-500 to-emerald-600',
  'Турбозайм': 'from-orange-500 to-orange-600',
  'Moneza': 'from-purple-500 to-purple-600',
  'Webbankir': 'from-sky-500 to-sky-600',
  'До зарплаты': 'from-amber-500 to-amber-600',
  'Lime': 'from-lime-500 to-lime-600',
  'Займоград': 'from-red-500 to-red-600',
  'Credit7': 'from-indigo-500 to-indigo-600',
};

function MFOLogo({ name, logo, className }: { name: string; logo?: string | null; className?: string }) {
  const gradient = MFO_COLORS[name] || 'from-slate-500 to-slate-600';
  const initials = name.slice(0, 2).toUpperCase();

  if (logo) {
    return (
      <div className={cn('flex items-center justify-center rounded-xl bg-slate-50 p-1', className)}>
        <img src={logo} alt={name} className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center rounded-xl text-white font-bold', `bg-gradient-to-br ${gradient}`, className)}>
      {initials}
    </div>
  );
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function formatDecisionTime(minutes: number) {
  if (minutes === 0) return 'Мгновенно';
  if (minutes < 60) return `${minutes} мин`;
  return `${Math.floor(minutes / 60)} ч`;
}

// Рейтинг звёздами
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export function TopOffers({ offers, title = 'Лучшие предложения' }: TopOffersProps) {
  if (offers.length === 0) return null;

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            Рекомендуем
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.slice(0, 3).map((offer, index) => (
            <Card
              key={offer.id}
              className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border',
                index === 0 && 'ring-2 ring-primary/30'
              )}
            >
              {/* Рейтинг позиции */}
              {index === 0 && (
                <div className="absolute right-3 top-3 z-10">
                  <Badge className="bg-yellow-500 text-white border-0 text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Топ-1
                  </Badge>
                </div>
              )}

              <CardContent className="p-5">
                {/* Заголовок */}
                <div className="flex items-start gap-3 mb-4">
                  <MFOLogo name={offer.name} logo={offer.logo} className="h-12 w-12 text-base flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-base">{offer.name}</h3>
                    <StarRating rating={offer.rating} />
                  </div>
                </div>

                {/* Условия */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <div className="text-xs text-muted-foreground mb-0.5">Сумма</div>
                    <div className="text-sm font-semibold text-foreground">
                      {formatAmount(offer.minAmount)}–{formatAmount(offer.maxAmount)} ₽
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <div className="text-xs text-muted-foreground mb-0.5">Срок</div>
                    <div className="text-sm font-semibold text-foreground">
                      {offer.minTerm}–{offer.maxTerm} дней
                    </div>
                  </div>
                </div>

                {/* Ставка */}
                <div className="flex items-center justify-between mb-4 p-2.5 rounded-lg bg-green-50 border border-green-100">
                  <span className="text-sm text-green-700">Ставка</span>
                  <span className="text-lg font-bold text-green-600">
                    {offer.firstLoanRate === 0 ? '0%' : `от ${offer.firstLoanRate || offer.baseRate}%`}
                  </span>
                  {offer.firstLoanRate === 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-xs">
                      новым
                    </Badge>
                  )}
                </div>

                {/* Особенности */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {offer.decisionTime <= 5 && (
                    <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-0">
                      <Zap className="h-3 w-3 mr-1" />
                      {formatDecisionTime(offer.decisionTime)}
                    </Badge>
                  )}
                  {offer.features?.includes('first_loan_zero') && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-0">
                      0% первый займ
                    </Badge>
                  )}
                </div>

                {/* Мнение редакции */}
                {offer.editorNote && (
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">
                    {offer.editorNote}
                  </p>
                )}

                {/* CTA */}
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1 h-9"
                    size="sm"
                  >
                    <a href={offer.affiliateUrl || `/mfo/${offer.slug}`} target={offer.affiliateUrl ? '_blank' : undefined} rel={offer.affiliateUrl ? 'noopener noreferrer' : undefined}>
                      Получить деньги
                      {offer.affiliateUrl && <ExternalLink className="ml-1.5 h-3.5 w-3.5" />}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    asChild
                  >
                    <a href={`/mfo/${offer.slug}`}>
                      Подробнее
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
