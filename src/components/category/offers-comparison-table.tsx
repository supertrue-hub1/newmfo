'use client';

import * as React from 'react';
import { Star, Clock, Zap, ExternalLink, ChevronDown, ChevronUp, CreditCard, ShieldCheck, Moon, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OfferForTable {
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
  approvalRate: number;
  features: string[];
  badCreditOk?: boolean;
  noCalls?: boolean;
  roundTheClock?: boolean;
  payoutMethods?: string[];
  editorNote?: string | null;
  affiliateUrl?: string | null;
}

interface OffersComparisonTableProps {
  offers: OfferForTable[];
  className?: string;
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
};

function MFOLogo({ name, logo, className }: { name: string; logo?: string | null; className?: string }) {
  const gradient = MFO_COLORS[name] || 'from-slate-500 to-slate-600';
  const initials = name.slice(0, 2).toUpperCase();

  if (logo) {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-slate-50 p-1', className)}>
        <img src={logo} alt={name} className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center rounded-lg text-white font-bold text-xs', `bg-gradient-to-br ${gradient}`, className)}>
      {initials}
    </div>
  );
}

function formatAmount(value: number) {
  if (value >= 1000) {
    return `${value / 1000}к`;
  }
  return value;
}

function formatDecisionTime(minutes: number) {
  if (minutes === 0) return 'Мгновенно';
  if (minutes < 60) return `${minutes} мин`;
  return `${Math.floor(minutes / 60)} ч`;
}

// Мобильная карточка
function MobileOfferCard({ offer }: { offer: OfferForTable }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border border-border rounded-xl p-4 mb-3 bg-white">
      {/* Заголовок */}
      <div className="flex items-start gap-3 mb-3">
        <MFOLogo name={offer.name} logo={offer.logo} className="h-11 w-11 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{offer.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">{offer.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {offer.firstLoanRate === 0 ? '0%' : `${offer.firstLoanRate || offer.baseRate}%`}
              </div>
              <div className="text-xs text-muted-foreground">в день</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основные данные */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <div className="text-xs text-muted-foreground">Сумма</div>
          <div className="text-sm font-semibold">{formatAmount(offer.minAmount)}-{formatAmount(offer.maxAmount)}к</div>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <div className="text-xs text-muted-foreground">Срок</div>
          <div className="text-sm font-semibold">{offer.maxTerm} дн</div>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <div className="text-xs text-muted-foreground">Решение</div>
          <div className="text-sm font-semibold">{formatDecisionTime(offer.decisionTime)}</div>
        </div>
      </div>

      {/* Быстрые теги */}
      <div className="flex flex-wrap gap-1 mb-3">
        {offer.firstLoanRate === 0 && (
          <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-0">0%</Badge>
        )}
        {offer.badCreditOk && (
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-0">Плохая КИ</Badge>
        )}
        {offer.decisionTime <= 5 && (
          <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-0">
            <Zap className="h-3 w-3 mr-0.5" />
            Быстро
          </Badge>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-2">
        <Button asChild className="flex-1 h-9" size="sm">
          <a href={offer.affiliateUrl || `/mfo/${offer.slug}`} target={offer.affiliateUrl ? '_blank' : undefined}>
            Получить
            {offer.affiliateUrl && <ExternalLink className="ml-1 h-3 w-3" />}
          </a>
        </Button>
        <Button variant="outline" size="sm" className="h-9" asChild>
          <a href={`/mfo/${offer.slug}`}>Подробнее</a>
        </Button>
      </div>
    </div>
  );
}

export function OffersComparisonTable({ offers, className }: OffersComparisonTableProps) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет предложений для отображения</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px] font-semibold">МФО</TableHead>
              <TableHead className="font-semibold text-center">Сумма</TableHead>
              <TableHead className="font-semibold text-center">Срок</TableHead>
              <TableHead className="font-semibold text-center">Ставка</TableHead>
              <TableHead className="font-semibold text-center">Решение</TableHead>
              <TableHead className="font-semibold text-center">Особенности</TableHead>
              <TableHead className="w-[140px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <MFOLogo name={offer.name} logo={offer.logo} className="h-10 w-10 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{offer.name}</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{offer.rating}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {offer.minAmount.toLocaleString()}–{offer.maxAmount.toLocaleString()} ₽
                </TableCell>
                <TableCell className="text-center">
                  {offer.minTerm}–{offer.maxTerm} дней
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    'font-semibold',
                    offer.firstLoanRate === 0 ? 'text-green-600' : 'text-foreground'
                  )}>
                    {offer.firstLoanRate === 0 ? '0%' : `${offer.firstLoanRate || offer.baseRate}%`}
                  </span>
                  {offer.firstLoanRate === 0 && (
                    <span className="text-xs text-muted-foreground block">новым</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {offer.decisionTime <= 5 && <Zap className="h-3 w-3 text-amber-500" />}
                    <span>{formatDecisionTime(offer.decisionTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {offer.badCreditOk && (
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Плохая КИ
                      </Badge>
                    )}
                    {offer.roundTheClock && (
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                        <Moon className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                    {offer.noCalls && (
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                        <PhoneOff className="h-3 w-3 mr-1" />
                        Без звонков
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" className="w-full">
                    <a href={offer.affiliateUrl || `/mfo/${offer.slug}`} target={offer.affiliateUrl ? '_blank' : undefined}>
                      Получить
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {offers.map((offer) => (
          <MobileOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
