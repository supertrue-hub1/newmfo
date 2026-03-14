'use client';

import * as React from 'react';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calculator,
  Clock,
  Coins,
  Zap,
  Star,
  ChevronRight,
  Flame,
  Calendar,
  TrendingDown,
  TrendingUp,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import { mockOffers } from '@/data/mock-offers';
import type { Offer } from '@/types/offer';
import { cn } from '@/lib/utils';

type SortType = 'min_overpayment' | 'max_amount' | 'quick_approval';

interface CompareOffer extends Offer {
  calculatedOverpayment: number;
  calculatedTotal: number;
  returnDate: string;
  isEligible: boolean;
}

// Default rate for calculation (0.8% per day)
const DEFAULT_RATE = 0.8;

// Calculate overpayment (0.8% per day)
function calculateOverpayment(amount: number, days: number, firstLoanRate: number): number {
  if (firstLoanRate === 0) return 0;
  return Math.round(amount * (DEFAULT_RATE / 100) * days);
}

// Format return date
function formatReturnDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

// Generate MFO logo placeholder
function MFOLogo({ name, className }: { name: string; className?: string }) {
  const colors: Record<string, string> = {
    'Займер': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'MoneyMan': 'bg-gradient-to-br from-green-500 to-green-600',
    'еКапуста': 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'Турбозайм': 'bg-gradient-to-br from-orange-500 to-orange-600',
    'Moneza': 'bg-gradient-to-br from-purple-500 to-purple-600',
    'Webbankir': 'bg-gradient-to-br from-sky-500 to-sky-600',
    'До зарплаты': 'bg-gradient-to-br from-amber-500 to-amber-600',
    'Lime': 'bg-gradient-to-br from-lime-500 to-lime-600',
  };
  const bgColor = colors[name] || 'bg-gradient-to-br from-slate-500 to-slate-600';
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className={cn('flex items-center justify-center rounded-xl text-white font-bold text-sm', bgColor, className)}>
      {initials}
    </div>
  );
}

export default function ComparePage() {
  const [amount, setAmount] = React.useState(15000);
  const [term, setTerm] = React.useState(14);
  const [sortBy, setSortBy] = React.useState<SortType>('min_overpayment');
  const [compareList, setCompareList] = React.useState<string[]>([]);

  // Handle amount change
  const handleAmountChange = React.useCallback((values: number[]) => {
    if (values[0] !== undefined) {
      setAmount(values[0]);
    }
  }, []);

  // Handle term change
  const handleTermChange = React.useCallback((values: number[]) => {
    if (values[0] !== undefined) {
      setTerm(values[0]);
    }
  }, []);

  // Calculator total
  const calculatorOverpayment = calculateOverpayment(amount, term, 1);
  const calculatorTotal = amount + calculatorOverpayment;

  // Process offers with calculations
  const processedOffers: CompareOffer[] = React.useMemo(() => {
    return mockOffers.map((offer) => {
      const isEligible = amount >= offer.minAmount && amount <= offer.maxAmount && term >= offer.minTerm && term <= offer.maxTerm;
      const calculatedOverpayment = calculateOverpayment(amount, term, offer.firstLoanRate);
      const calculatedTotal = amount + calculatedOverpayment;
      const returnDate = formatReturnDate(term);

      return {
        ...offer,
        calculatedOverpayment,
        calculatedTotal,
        returnDate,
        isEligible,
      };
    });
  }, [amount, term]);

  // Sort offers
  const sortedOffers = React.useMemo(() => {
    const sorted = [...processedOffers];

    switch (sortBy) {
      case 'min_overpayment':
        return sorted.sort((a, b) => a.calculatedOverpayment - b.calculatedOverpayment);
      case 'max_amount':
        return sorted.sort((a, b) => b.maxAmount - a.maxAmount);
      case 'quick_approval':
        return sorted.sort((a, b) => a.decisionTime - b.decisionTime);
      default:
        return sorted;
    }
  }, [processedOffers, sortBy]);

  // Hot offer (first eligible with 0% first loan)
  const hotOffer = sortedOffers.find((o) => o.isEligible && o.firstLoanRate === 0);

  // Toggle compare
  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="flex-1">
        {/* Calculator Section */}
        <section className="bg-background border-b border-border sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Сравнение займов</h1>
                <p className="text-sm text-muted-foreground">Настройте параметры и выберите лучший займ</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] items-end">
              {/* Amount Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    Сумма займа
                  </label>
                  <div className="text-lg font-bold text-primary">
                    {amount.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={handleAmountChange}
                  min={1000}
                  max={100000}
                  step={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 000 ₽</span>
                  <span>100 000 ₽</span>
                </div>
              </div>

              {/* Term Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Срок займа
                  </label>
                  <div className="text-lg font-bold text-primary">
                    {term} {term === 1 ? 'день' : term < 5 ? 'дня' : 'дней'}
                  </div>
                </div>
                <Slider
                  value={[term]}
                  onValueChange={handleTermChange}
                  min={1}
                  max={30}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 день</span>
                  <span>30 дней</span>
                </div>
              </div>

              {/* Return Info */}
              <Card className="bg-primary/5 border-primary/20 lg:min-w-[220px]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    К возврату {formatReturnDate(term)}
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {calculatorTotal.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Переплата: {calculatorOverpayment.toLocaleString('ru-RU')} ₽ (0,8% в день)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sorting Buttons */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy('min_overpayment')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                sortBy === 'min_overpayment'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <TrendingDown className="h-4 w-4" />
              Минимальная переплата
            </button>
            <button
              onClick={() => setSortBy('max_amount')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                sortBy === 'max_amount'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Максимальная сумма
            </button>
            <button
              onClick={() => setSortBy('quick_approval')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                sortBy === 'quick_approval'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Timer className="h-4 w-4" />
              Быстрое одобрение
            </button>
          </div>
        </section>

        {/* Hot Offer */}
        {hotOffer && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-orange-700 dark:text-orange-400">Горячее предложение</span>
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white ml-2">
                    Акция: 0%
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <MFOLogo name={hotOffer.name} className="h-14 w-14 text-lg" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{hotOffer.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{hotOffer.rating}</span>
                        <span>•</span>
                        <span>Решение за {hotOffer.decisionTime === 0 ? 'мгновенно' : `${hotOffer.decisionTime} мин`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Сумма</div>
                      <div className="text-lg font-bold text-foreground">{amount.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Переплата</div>
                      <div className="text-lg font-bold text-green-600">0 ₽</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">К возврату</div>
                      <div className="text-lg font-bold text-foreground">{amount.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                      Получить сейчас
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Offers List */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {sortedOffers.length} предложений
            </h2>
            {compareList.length > 0 && (
              <Button variant="outline" className="gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Сравнить ({compareList.length})
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {sortedOffers.map((offer, index) => (
              <Card
                key={offer.id}
                className={cn(
                  'border-border hover:border-primary/30 transition-colors',
                  !offer.isEligible && 'opacity-60',
                  offer.isFeatured && 'ring-1 ring-primary/20'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    {/* Rank & Logo */}
                    <div className="flex items-center gap-3 lg:w-[200px]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <MFOLogo name={offer.name} className="h-12 w-12" />
                      <div>
                        <h3 className="font-semibold text-foreground">{offer.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{offer.rating}</span>
                          {offer.isNew && (
                            <Badge variant="secondary" className="text-xs ml-1">Новый</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 sm:gap-8 flex-1">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Сумма</div>
                        <div className="font-semibold text-foreground">
                          {offer.minAmount.toLocaleString('ru-RU')} - {offer.maxAmount.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Ставка</div>
                        <div className="font-semibold text-foreground">
                          {offer.firstLoanRate === 0 ? (
                            <span className="text-green-600">0% (первый займ)</span>
                          ) : (
                            <span>0,8% в день</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Срок</div>
                        <div className="font-semibold text-foreground">
                          {offer.minTerm}-{offer.maxTerm} дней
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Одобрение
                        </div>
                        <div className="font-semibold text-foreground">
                          {offer.decisionTime === 0 ? 'Мгновенно' : `${offer.decisionTime} мин`}
                        </div>
                      </div>
                    </div>

                    {/* When Pay & Actions */}
                    <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4">
                      <div className="text-center min-w-[120px]">
                        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3" />
                          К возврату
                        </div>
                        <div className="font-bold text-foreground">
                          {offer.calculatedTotal.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {offer.returnDate}
                        </div>
                        <div className="text-xs mt-1">
                          {offer.isEligible ? (
                            offer.calculatedOverpayment === 0 ? (
                              <span className="text-green-600 font-medium">Без переплаты</span>
                            ) : (
                              <span className="text-muted-foreground">+{offer.calculatedOverpayment.toLocaleString('ru-RU')} ₽</span>
                            )
                          ) : (
                            <span className="text-destructive">Не подходит</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto lg:ml-0">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={compareList.includes(offer.id)}
                            onCheckedChange={() => toggleCompare(offer.id)}
                          />
                          <span className="text-sm text-muted-foreground hidden sm:inline">Сравнить</span>
                        </label>
                        <Button className="gap-2">
                          Оформить
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    {offer.firstLoanRate === 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        0% первый займ
                      </Badge>
                    )}
                    {offer.badCreditOk && (
                      <Badge variant="outline" className="border-border">
                        С плохой КИ
                      </Badge>
                    )}
                    {offer.noCalls && (
                      <Badge variant="outline" className="border-border">
                        Без звонков
                      </Badge>
                    )}
                    {offer.roundTheClock && (
                      <Badge variant="outline" className="border-border">
                        24/7
                      </Badge>
                    )}
                    {offer.approvalRate >= 90 && (
                      <Badge variant="outline" className="border-border">
                        {offer.approvalRate}% одобрение
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
