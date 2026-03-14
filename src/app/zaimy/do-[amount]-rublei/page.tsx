import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { AMOUNTS, CITIES } from '@/lib/seo/slugs';
import { SeoPageHeader } from '@/components/seo/seo-page-header';
import { OfferList } from '@/components/seo/offer-list';

// Принудительный динамический рендеринг
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ amount: string }> 
}): Promise<Metadata> {
  const { amount } = await params;
  const amountData = AMOUNTS.find(a => a.slug === amount);
  
  if (!amountData) {
    return { title: 'Страница не найдена' };
  }
  
  return {
    title: `Займы ${amountData.display} — быстрое одобрение онлайн`,
    description: `Займы ${amountData.title}. Сравните условия от лучших МФО. Быстрое одобрение за 5 минут.`,
  };
}

export default async function AmountPage({ 
  params 
}: { 
  params: Promise<{ amount: string }> 
}) {
  const { amount: amountSlug } = await params;
  const amountData = AMOUNTS.find(a => a.slug === amountSlug);
  
  if (!amountData) {
    notFound();
  }
  
  // Получаем офферы
  let offers = [];
  try {
    offers = await db.loanOffer.findMany({
      where: { 
        status: 'published',
        minAmount: { lte: amountData.value },
      },
      orderBy: { rating: 'desc' },
      take: 20,
    });
  } catch (e) {
    console.error('Failed to fetch offers:', e);
  }
  
  const h1 = `Займы ${amountData.display}`;
  const description = `Подберите займ ${amountData.title} от проверенных МФО. Быстрое онлайн-оформление, деньги на карту за 15 минут.`;
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <SeoPageHeader
          h1={h1}
          description={description}
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

        <section className="py-8 border-t bg-slate-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Займы {amountData.display} в городах
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(CITIES).slice(0, 15).map(([slug, city]) => (
                <a
                  key={slug}
                  href={`/zaimy/do-${amountSlug}-rublei/v-${slug}`}
                  className="px-3 py-2 bg-white border rounded-lg text-sm text-slate-600 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {city.preposition}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
