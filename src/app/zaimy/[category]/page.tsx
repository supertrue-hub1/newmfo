import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS, type LoanCategorySlug, type CitySlug } from '@/lib/seo/slugs';
import { generateCategoryMetadata, generateCanonicalUrl, generateBreadcrumb } from '@/lib/seo/metadata';
import { SimpleOfferCard } from '@/lib/adapters/offer-adapter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, CreditCard, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Отключаем кэш
export const revalidate = 0;

// Генерация статических параметров
export async function generateStaticParams() {
  const params = [];
  
  // Все категории
  for (const slug of Object.keys(LOAN_CATEGORIES)) {
    params.push({ category: slug });
  }
  
  return params;
}

// Генерация мета-данных
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category } = await params;
  
  if (!(category in LOAN_CATEGORIES)) {
    return { title: 'Категория не найдена' };
  }
  
  return generateCategoryMetadata(category as LoanCategorySlug);
}

// Получить данные займов для категории
async function getLoansByCategory(categorySlug: LoanCategorySlug) {
  const category = LOAN_CATEGORIES[categorySlug];
  if (!category) return { offers: [], category: null };
  
  const offers = await db.loanOffer.findMany({
    where: {
      status: 'published',
      // Фильтрация по категории (если есть поле category)
    },
    orderBy: { rating: 'desc' },
    take: 20,
  });
  
  return { offers, category };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category: categorySlug } = await params;
  
  // Проверка категории
  if (!(categorySlug in LOAN_CATEGORIES)) {
    notFound();
  }
  
  const category = LOAN_CATEGORIES[categorySlug as LoanCategorySlug];
  const { offers } = await getLoansByCategory(categorySlug as LoanCategorySlug);
  
  // Breadcrumb
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'Займы', url: '/zaimy' },
    { name: category.name, url: `/zaimy/${categorySlug}` },
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />
      
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/zaimy" className="hover:text-primary transition-colors">Займы</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {category.h1}
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              {category.description}
            </p>
            
            {/* Quick stats */}
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
                От {offers[0]?.rating || 4.5} баллов
              </Badge>
            </div>
          </div>
        </section>

        {/* Filters sidebar + Offers */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* Sidebar filters */}
              <aside className="space-y-6">
                {/* Cities */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Город
                  </h3>
                  <div className="space-y-1">
                    {Object.entries(CITIES).slice(0, 10).map(([slug, city]) => (
                      <Link
                        key={slug}
                        href={`/zaimy/${categorySlug}/v-${slug}`}
                        className="block py-1.5 px-2 rounded-lg text-sm text-muted-foreground hover:bg-white hover:text-primary transition-colors"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Amounts */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Сумма займа
                  </h3>
                  <div className="space-y-1">
                    {AMOUNTS.slice(0, 6).map(amount => (
                      <Link
                        key={amount.slug}
                        href={`/zaimy/${categorySlug}/do-${amount.slug}-rublei`}
                        className="block py-1.5 px-2 rounded-lg text-sm text-muted-foreground hover:bg-white hover:text-primary transition-colors"
                      >
                        {amount.display}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Back to all loans */}
                <Link
                  href="/zaimy"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-slate-50 transition-colors"
                >
                  Все займы
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>

              {/* Offers grid */}
              <div className="space-y-4">
                {offers.length > 0 ? (
                  offers.map(offer => (
                    <SimpleOfferCard key={offer.id} offer={offer} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      В данной категории пока нет предложений
                    </p>
                    <Button asChild>
                      <Link href="/zaimy">Смотреть все займы</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
