import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, type LoanCategorySlug, type CitySlug } from '@/lib/seo/slugs';
import { generateBreadcrumb } from '@/lib/seo/metadata';
import { SeoPageHeader } from '@/components/seo/seo-page-header';
import { OfferList } from '@/components/seo/offer-list';
import { CityStats } from '@/components/seo/stats-block';
import { RelatedLinks, SeoFooterLinks } from '@/components/seo/related-links';
import { FaqBlock } from '@/components/seo/faq-block';

// ISR: пересоздавать страницу каждый час
export const revalidate = 3600;

// Динамические параметры - не генерировать все страницы статически
export const dynamicParams = true;

// Не генерируем страницы при build - только по запросу
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string; city: string }> 
}): Promise<Metadata> {
  const { category, city } = await params;
  
  // Проверяем что категория и город существуют
  const cat = LOAN_CATEGORIES[category as LoanCategorySlug];
  const c = CITIES[city as CitySlug];
  
  if (!cat || !c) {
    return { title: 'Страница не найдена' };
  }
  
  return {
    title: `${cat.name} ${c.preposition} — ${cat.shortDesc}`,
    description: `${cat.description} Доступно в ${c.name}.`,
  };
}

export default async function CategoryCityPage({ 
  params 
}: { 
  params: Promise<{ category: string; city: string }> 
}) {
  const { category: categorySlug, city: citySlug } = await params;
  
  const category = LOAN_CATEGORIES[categorySlug as LoanCategorySlug];
  const city = CITIES[citySlug as CitySlug];
  
  if (!category || !city) {
    notFound();
  }
  
  // Получаем офферы (не блокируем рендеринг)
  let offers = [];
  try {
    offers = await db.loanOffer.findMany({
      where: { status: 'published' },
      orderBy: { rating: 'desc' },
      take: 20,
    });
  } catch (e) {
    console.error('Failed to fetch offers:', e);
  }
  
  // Breadcrumb для JSON-LD
  const breadcrumb = [
    { name: 'Главная', url: 'https://cashpeek.ru/' },
    { name: 'Займы', url: 'https://cashpeek.ru/zaimy' },
    { name: category.name, url: `https://cashpeek.ru/zaimy/${categorySlug}` },
    { name: city.preposition, url: `https://cashpeek.ru/zaimy/${categorySlug}/v-${citySlug}` },
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
        {/* SEO Header */}
        <SeoPageHeader
          h1={`${category.h1} ${city.preposition}`}
          description={`${category.description} Доступно в ${city.name}.`}
          cityName={city.name}
          cityPreposition={city.preposition}
          loanTypeName={category.name}
          offersCount={offers.length}
        />

        {/* Offers List с сортировкой по интенту */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <OfferList 
              offers={offers} 
              loanTypeSlug={categorySlug}
              showSort={true}
            />
          </div>
        </section>

        {/* City Stats (Anti-Thin Content) */}
        <CityStats cityName={city.name} citySlug={citySlug} />

        {/* FAQ Block (Anti-Thin Content) */}
        <FaqBlock loanTypeSlug={categorySlug} cityName={city.name} />

        {/* Related Links (Anti-Orphan Pages) */}
        <RelatedLinks 
          citySlug={citySlug}
          cityName={city.name}
          loanTypeSlug={categorySlug}
          loanTypeName={category.name}
        />

        {/* Footer Links */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-8">
          <SeoFooterLinks citySlug={citySlug} loanTypeSlug={categorySlug} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
