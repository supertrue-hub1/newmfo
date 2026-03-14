/**
 * Компонент списка предложений с сортировкой по интенту страницы
 * Anti-Thin Content: разная сортировка для разных типов страниц
 */

'use client';

import { useState, useMemo } from 'react';
import { SimpleOfferCard } from '@/lib/adapters/offer-adapter';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowUpDown, Star, Clock, Percent, TrendingUp } from 'lucide-react';

type LoanOffer = {
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
  interestRate: number;
  decisionTime?: string | null;
  features?: string[];
  [key: string]: any;
};

type SortOption = 'rating' | 'rate' | 'amount' | 'term' | 'approval';

interface OfferListProps {
  offers: LoanOffer[];
  loanTypeSlug?: string;
  showSort?: boolean;
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'По рейтингу', icon: Star },
  { value: 'rate', label: 'По ставке', icon: Percent },
  { value: 'amount', label: 'По сумме', icon: TrendingUp },
  { value: 'term', label: 'По сроку', icon: Clock },
];

// Сортировка по умолчанию в зависимости от типа займа
function getDefaultSort(loanTypeSlug?: string): SortOption {
  switch (loanTypeSlug) {
    case 'bez-procentov':
    case 'bez-otkaza':
      return 'approval'; // Сначала одобряемые
    case 'na-kartu':
      return 'rate'; // Сначала с низкой ставкой
    default:
      return 'rating';
  }
}

// Фильтрация и сортировка офферов под интент
function sortOffersByIntent(offers: LoanOffer[], intent?: string): LoanOffer[] {
  const sorted = [...offers];
  
  switch (intent) {
    case 'bez-procentov':
      // Сначала офферы с 0%
      sorted.sort((a, b) => {
        const aZero = a.firstLoanRate === 0 ? 0 : 1;
        const bZero = b.firstLoanRate === 0 ? 0 : 1;
        if (aZero !== bZero) return aZero - bZero;
        return b.rating - a.rating;
      });
      break;
      
    case 'bez-otkaza':
      // Сначала с высоким approvalRate
      sorted.sort((a, b) => {
        const aApproval = (a as any).approvalRate || 85;
        const bApproval = (b as any).approvalRate || 85;
        return bApproval - aApproval || b.rating - a.rating;
      });
      break;
      
    case 'na-kartu':
      // Сначала с payout на карту
      sorted.sort((a, b) => {
        const aCard = a.payoutMethods?.includes('card') ? 0 : 1;
        const bCard = b.payoutMethods?.includes('card') ? 0 : 1;
        if (aCard !== bCard) return aCard - bCard;
        return b.rating - a.rating;
      });
      break;
      
    case 'bez-proverki-ki':
      // Сначала с плохой КИ
      sorted.sort((a, b) => {
        const aBadCredit = a.badCreditOk ? 0 : 1;
        const bBadCredit = b.badCreditOk ? 0 : 1;
        if (aBadCredit !== bBadCredit) return aBadCredit - bBadCredit;
        return b.rating - a.rating;
      });
      break;
      
    default:
      // По умолчанию - рейтинг
      sorted.sort((a, b) => b.rating - a.rating);
  }
  
  return sorted;
}

export function OfferList({ offers, loanTypeSlug, showSort = true }: OfferListProps) {
  const [sortBy, setSortBy] = useState<SortOption>(getDefaultSort(loanTypeSlug));
  
  // Мемоизируем отсортированный список
  const sortedOffers = useMemo(() => {
    // Сначала применяем сортировку по интенту
    let result = sortOffersByIntent(offers, loanTypeSlug);
    
    // Затем дополнительная сортировка пользователя
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rate':
        result.sort((a, b) => (a.firstLoanRate || a.interestRate) - (b.firstLoanRate || b.interestRate));
        break;
      case 'amount':
        result.sort((a, b) => b.maxAmount - a.maxAmount);
        break;
      case 'term':
        result.sort((a, b) => b.maxTerm - a.maxTerm);
        break;
      case 'approval':
        result.sort((a, b) => ((b as any).approvalRate || 90) - ((a as any).approvalRate || 90));
        break;
    }
    
    return result;
  }, [offers, sortBy, loanTypeSlug]);
  
  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          В данной категории пока нет предложений
        </p>
        <Button asChild>
          <Link href="/zaimy">Смотреть все займы</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      {showSort && (
        <div className="flex items-center justify-between py-4 border-b">
          <span className="text-sm text-muted-foreground">
            Найдено {offers.length} предложений
          </span>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* Offers List */}
      <div className="space-y-4">
        {sortedOffers.map((offer) => (
          <SimpleOfferCard key={offer.id} offer={offer as any} />
        ))}
      </div>
    </div>
  );
}

// Server component wrapper
import Link from 'next/link';
