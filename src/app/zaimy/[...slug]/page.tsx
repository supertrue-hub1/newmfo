import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS, type LoanCategorySlug, type CitySlug } from '@/lib/seo/slugs';
import { generateBreadcrumb } from '@/lib/seo/metadata';
import { SeoPageHeader } from '@/components/seo/seo-page-header';
import { OfferList } from '@/components/seo/offer-list';
import { CityStats } from '@/components/seo/stats-block';
import { SeoFooterLinks } from '@/components/seo/related-links';
import { FaqBlock } from '@/components/seo/faq-block';

// Принудительный динамический рендеринг
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Парсинг slug для определения типа страницы
function parseSlug(slug: string[]) {
  // Варианты:
  // [category] -> /zaimy/bez-otkaza
  // [category, v-city] -> /zaimy/bez-otkaza/v-moskva
  // [do-amount-rublei] -> /zaimy/do-1000-rublei
  // [do-amount-rublei, v-city] -> /zaimy/do-1000-rublei/v-moskva
  // [v-city] -> /zaimy/v-moskva

  if (slug.length === 1) {
    const first = slug[0];
    
    // v-city -> город
    if (first.startsWith('v-')) {
      const citySlug = first.slice(2);
      return { type: 'city', citySlug };
    }
    
    // do-amount-rublei -> сумма
    if (first.startsWith('do-') && first.endsWith('-rublei')) {
      const amountSlug = first.slice(3, -7);
      return { type: 'amount', amountSlug };
    }
    
    // category
    return { type: 'category', categorySlug: first };
  }
  
  if (slug.length === 2) {
    const [first, second] = slug;
    
    // [category, v-city]
    if (second.startsWith('v-')) {
      const citySlug = second.slice(2);
      
      // [do-amount-rublei, v-city]
      if (first.startsWith('do-') && first.endsWith('-rublei')) {
        const amountSlug = first.slice(3, -7);
        return { type: 'amount-city', amountSlug, citySlug };
      }
      
      // [category, v-city]
      return { type: 'category-city', categorySlug: first, citySlug };
    }
  }
  
  return { type: 'unknown' };
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (parsed.type === 'category') {
    const cat = LOAN_CATEGORIES[parsed.categorySlug as LoanCategorySlug];
    if (!cat) return { title: 'Страница не найдена' };
    return {
      title: `${cat.name} — ${cat.shortDesc}`,
      description: cat.description,
    };
  }
  
  if (parsed.type === 'city') {
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!city) return { title: 'Страница не найдена' };
    return {
      title: `Займы ${city.preposition} — сравнить условия онлайн`,
      description: `Лучшие займы ${city.preposition}. Быстрое одобрение за 5 минут.`,
    };
  }
  
  if (parsed.type === 'category-city') {
    const cat = LOAN_CATEGORIES[parsed.categorySlug as LoanCategorySlug];
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!cat || !city) return { title: 'Страница не найдена' };
    return {
      title: `${cat.name} ${city.preposition} — ${cat.shortDesc}`,
      description: `${cat.description} Доступно в ${city.name}.`,
    };
  }
  
  if (parsed.type === 'amount') {
    const amount = AMOUNTS.find(a => a.slug === parsed.amountSlug);
    if (!amount) return { title: 'Страница не найдена' };
    return {
      title: `Займы ${amount.display} — быстрое одобрение онлайн`,
      description: `Займы ${amount.title}. Сравните условия от лучших МФО.`,
    };
  }
  
  if (parsed.type === 'amount-city') {
    const amount = AMOUNTS.find(a => a.slug === parsed.amountSlug);
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!amount || !city) return { title: 'Страница не найдена' };
    return {
      title: `Займы ${amount.display} ${city.preposition}`,
      description: `Займы ${amount.title} ${city.preposition}. Быстрое одобрение.`,
    };
  }
  
  return { title: 'Страница не найдена' };
}

export default async function DynamicSeoPage({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  // Получаем офферы
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
  
  // Рендерим по типу страницы
  if (parsed.type === 'category') {
    const category = LOAN_CATEGORIES[parsed.categorySlug as LoanCategorySlug];
    if (!category) notFound();
    
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <SeoPageHeader
            h1={category.h1}
            description={category.description}
            loanTypeName={category.name}
            offersCount={offers.length}
          />
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <OfferList offers={offers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (parsed.type === 'city') {
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!city) notFound();
    
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <SeoPageHeader
            h1={`Займы ${city.preposition}`}
            description={`Лучшие займы ${city.preposition}. Быстрое одобрение за 5 минут.`}
            cityName={city.name}
            offersCount={offers.length}
          />
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <OfferList offers={offers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (parsed.type === 'category-city') {
    const category = LOAN_CATEGORIES[parsed.categorySlug as LoanCategorySlug];
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!category || !city) notFound();
    
    const breadcrumb = [
      { name: 'Главная', url: 'https://cashpeek.ru/' },
      { name: 'Займы', url: 'https://cashpeek.ru/zaimy' },
      { name: category.name, url: `https://cashpeek.ru/zaimy/${parsed.categorySlug}` },
      { name: city.preposition, url: `https://cashpeek.ru/zaimy/${parsed.categorySlug}/v-${parsed.citySlug}` },
    ];
    
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
        />
        <Header />
        <main className="flex-1">
          <SeoPageHeader
            h1={`${category.h1} ${city.preposition}`}
            description={`${category.description} Доступно в ${city.name}.`}
            cityName={city.name}
            cityPreposition={city.preposition}
            loanTypeName={category.name}
            offersCount={offers.length}
          />
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <OfferList offers={offers} loanTypeSlug={parsed.categorySlug} showSort={true} />
            </div>
          </section>
          <CityStats cityName={city.name} citySlug={parsed.citySlug} />
          <FaqBlock loanTypeSlug={parsed.categorySlug} cityName={city.name} />
          <SeoFooterLinks citySlug={parsed.citySlug} loanTypeSlug={parsed.categorySlug} />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (parsed.type === 'amount') {
    const amount = AMOUNTS.find(a => a.slug === parsed.amountSlug);
    if (!amount) notFound();
    
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <SeoPageHeader
            h1={`Займы ${amount.display}`}
            description={`Подберите займ ${amount.title} от проверенных МФО.`}
            loanTypeName={`Займы ${amount.display}`}
            offersCount={offers.length}
          />
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <OfferList offers={offers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (parsed.type === 'amount-city') {
    const amount = AMOUNTS.find(a => a.slug === parsed.amountSlug);
    const city = CITIES[parsed.citySlug as CitySlug];
    if (!amount || !city) notFound();
    
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <SeoPageHeader
            h1={`Займы ${amount.display} ${city.preposition}`}
            description={`Займы ${amount.title} ${city.preposition}. Быстрое одобрение.`}
            cityName={city.name}
            loanTypeName={`Займы ${amount.display}`}
            offersCount={offers.length}
          />
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <OfferList offers={offers} showSort={true} />
            </div>
          </section>
          <CityStats cityName={city.name} citySlug={parsed.citySlug} />
          <FaqBlock cityName={city.name} />
          <SeoFooterLinks citySlug={parsed.citySlug} />
        </main>
        <Footer />
      </div>
    );
  }
  
  notFound();
}
