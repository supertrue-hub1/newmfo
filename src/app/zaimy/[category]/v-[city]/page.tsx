import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS, type LoanCategorySlug, type CitySlug } from '@/lib/seo/slugs';
import { generateCategoryMetadata, generateBreadcrumb } from '@/lib/seo/metadata';
import { OfferCard } from '@/components/home/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, CreditCard, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export async function generateStaticParams() {
  const params = [];
  
  // Категории + топ-15 городов
  const topCities = Object.keys(CITIES).slice(0, 15);
  
  for (const categorySlug of Object.keys(LOAN_CATEGORIES)) {
    for (const citySlug of topCities) {
      params.push({ category: categorySlug, city: citySlug });
    }
  }
  
  return params;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string; city: string }> 
}): Promise<Metadata> {
  const { category, city } = await params;
  
  if (!(category in LOAN_CATEGORIES) || !(city in CITIES)) {
    return { title: 'Страница не найдена' };
  }
  
  return generateCategoryMetadata(category as LoanCategorySlug, city as CitySlug);
}

async function getLoansByCategoryAndCity(categorySlug: LoanCategorySlug, citySlug: CitySlug) {
  const category = LOAN_CATEGORIES[categorySlug];
  const city = CITIES[citySlug];
  
  const offers = await db.loanOffer.findMany({
    where: { status: 'published' },
    orderBy: { rating: 'desc' },
    take: 20,
  });
  
  return { offers, category, city };
}

export default async function CategoryCityPage({ 
  params 
}: { 
  params: Promise<{ category: string; city: string }> 
}) {
  const { category: categorySlug, city: citySlug } = await params;
  
  if (!(categorySlug in LOAN_CATEGORIES) || !(citySlug in CITIES)) {
    notFound();
  }
  
  const category = LOAN_CATEGORIES[categorySlug as LoanCategorySlug];
  const city = CITIES[citySlug as CitySlug];
  const { offers } = await getLoansByCategoryAndCity(
    categorySlug as LoanCategorySlug,
    citySlug as CitySlug
  );
  
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'Займы', url: '/zaimy' },
    { name: category.name, url: `/zaimy/${categorySlug}` },
    { name: `${city.preposition}`, url: `/zaimy/${categorySlug}/v-${citySlug}` },
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
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/zaimy" className="hover:text-primary transition-colors">Займы</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/zaimy/${categorySlug}`} className="hover:text-primary transition-colors">
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{city.preposition}</span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {category.name} {city.preposition}
            </h1>
            
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              {category.description} Доступно в {city.name}.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                {offers.length} предложений
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
                    В данной категории и городе пока нет предложений
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
