import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { CITIES, type CitySlug } from '@/lib/seo/slugs';
import { generateCityMetadata, generateBreadcrumb } from '@/lib/seo/metadata';
import { OfferCard } from '@/components/home/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, CreditCard, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ city: string }> 
}): Promise<Metadata> {
  const { city } = await params;
  
  if (!(city in CITIES)) {
    return { title: 'Город не найден' };
  }
  
  return generateCityMetadata(city as CitySlug);
}

async function getLoansByCity(citySlug: CitySlug) {
  const city = CITIES[citySlug];
  
  const offers = await db.loanOffer.findMany({
    where: { status: 'published' },
    orderBy: { rating: 'desc' },
    take: 30,
  });
  
  return { offers, city };
}

export default async function CityPage({ 
  params 
}: { 
  params: Promise<{ city: string }> 
}) {
  const { city: citySlug } = await params;
  
  if (!(citySlug in CITIES)) {
    notFound();
  }
  
  const city = CITIES[citySlug as CitySlug];
  const { offers } = await getLoansByCity(citySlug as CitySlug);
  
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'Займы', url: '/zaimy' },
    { name: city.name, url: `/zaimy/v-${citySlug}` },
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />
      
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-slate-50 to-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/zaimy" className="hover:text-primary transition-colors">Займы</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{city.name}</span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Займы {city.preposition}
            </h1>
            
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              Сравните лучшие займы {city.preposition}. Мгновенное зачисление на карту, 
              без справок и поручителей. Выберите подходящее предложение.
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
                <MapPin className="h-3.5 w-3.5" />
                {city.name}
              </Badge>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="space-y-4">
              {offers.length > 0 ? (
                offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    В этом городе пока нет предложений
                  </p>
                  <Button asChild>
                    <Link href="/zaimy">Смотреть все займы</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
