import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { AMOUNTS, CITIES, type CitySlug } from '@/lib/seo/slugs';
import { SeoPageHeader } from '@/components/seo/seo-page-header';
import { OfferList } from '@/components/seo/offer-list';
import { CityStats } from '@/components/seo/stats-block';
import { RelatedLinks, SeoFooterLinks } from '@/components/seo/related-links';
import { FaqBlock } from '@/components/seo/faq-block';

export const revalidate = 3600;
export const dynamicParams = true;

// Генерируем статические параметры для топ-сумм и городов
export async function generateStaticParams() {
  const params = [];
  const topAmounts = AMOUNTS.slice(0, 5);
  const topCities = Object.keys(CITIES).slice(0, 10);
  
  for (const amount of topAmounts) {
    for (const citySlug of topCities) {
      params.push({ amount: amount.slug, city: citySlug });
    }
  }
  
  return params;
}

// Получаем данные страницы из БД
async function getSeoPageData(amountSlug: string, citySlug: string) {
  const seoPage = await db.seoPage.findFirst({
    where: {
      amountSlug,
      city: { slug: citySlug },
    },
    include: {
      city: true,
      loanType: true,
    },
  });
  
  return seoPage;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ amount: string; city: string }> 
}): Promise<Metadata> {
  const { amount, city } = await params;
  
  const seoPage = await getSeoPageData(amount, city);
  
  if (seoPage) {
    return {
      title: seoPage.pageTitle,
      description: seoPage.pageDescription || undefined,
    };
  }
  
  // Fallback
  const cityData = CITIES[city as CitySlug];
  const amountData = AMOUNTS.find(a => a.slug === amount);
  
  if (!cityData || !amountData) {
    return { title: 'Страница не найдена' };
  }
  
  return {
    title: `Займы ${amountData.display} ${cityData.preposition}`,
    description: `Займы ${amountData.title} ${cityData.preposition}. Быстрое одобрение, низкие ставки.`,
  };
}

export default async function AmountCityPage({ 
  params 
}: { 
  params: Promise<{ amount: string; city: string }> 
}) {
  const { amount: amountSlug, city: citySlug } = await params;
  
  const city = CITIES[citySlug as CitySlug];
  const amountData = AMOUNTS.find(a => a.slug === amountSlug);
  
  if (!city || !amountData) {
    notFound();
  }
  
  // Получаем SEO-данные из БД
  const seoPage = await getSeoPageData(amountSlug, citySlug);
  
  // Получаем офферы
  const offers = await db.loanOffer.findMany({
    where: { 
      status: 'published',
      minAmount: { lte: amountData.value },
    },
    orderBy: { rating: 'desc' },
    take: 20,
  });
  
  const h1 = seoPage?.h1 || `Займы ${amountData.display} ${city.preposition}`;
  const description = seoPage?.pageDescription || `Займы ${amountData.title} ${city.preposition}. Быстрое одобрение за 5 минут.`;
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <SeoPageHeader
          h1={h1}
          description={description}
          cityName={city.name}
          cityPreposition={city.preposition}
          loanTypeName={`Займы ${amountData.display}`}
          offersCount={offers.length}
        />

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <OfferList 
              offers={offers} 
              showSort={true}
            />
          </div>
        </section>

        <CityStats cityName={city.name} citySlug={citySlug} />
        
        <FaqBlock cityName={city.name} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-8">
          <SeoFooterLinks citySlug={citySlug} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
