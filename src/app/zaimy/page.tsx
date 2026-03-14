import { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES } from '@/lib/seo/slugs';
import { generateBreadcrumb } from '@/lib/seo/metadata';
import { OfferCard } from '@/components/home/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, CreditCard, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Займы онлайн — сравнить лучшие предложения МФО',
  description: 'Сравните лучшие займы от проверенных МФО России. Мгновенное зачисление на карту, без справок и поручителей. Выберите подходящее предложение за 5 минут.',
  alternates: {
    canonical: '/zaimy',
  },
};

async function getFeaturedOffers() {
  const offers = await db.loanOffer.findMany({
    where: { status: 'published', isFeatured: true },
    orderBy: { rating: 'desc' },
    take: 10,
  });
  
  return offers;
}

export default async function LoansPage() {
  const offers = await getFeaturedOffers();
  
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'Займы', url: '/zaimy' },
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />
      
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Займы онлайн на карту
            </h1>
            
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              Сравните лучшие предложения от проверенных МФО России. 
              Мгновенное зачисление, без справок и проверок. 
              Выберите займ за 5 минут.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                {offers.length} предложений
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                За 5 минут
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                От 0% для новых
              </Badge>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Популярные категории
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(LOAN_CATEGORIES).slice(0, 10).map(([slug, category]) => (
                <Link
                  key={slug}
                  href={`/zaimy/${slug}`}
                  className="group bg-slate-50 rounded-xl p-4 hover:bg-primary/5 hover:shadow-md transition-all border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {category.shortDesc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Популярные города
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {Object.entries(CITIES).slice(0, 15).map(([slug, city]) => (
                <Link
                  key={slug}
                  href={`/zaimy/v-${slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  {city.name}
                </Link>
              ))}
              <Link
                href="/zaimy"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Все города
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Offers */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Лучшие предложения
              </h2>
              <Button variant="outline" asChild>
                <Link href="/sravnit">
                  Сравнить все
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            
            {offers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Загрузка предложений...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
