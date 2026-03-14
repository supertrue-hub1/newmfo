import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS, type LoanCategorySlug, type CitySlug } from '@/lib/seo/slugs';
import { getCategoryConfig } from '@/lib/category/category-config';
import { generateBreadcrumb } from '@/lib/seo/metadata';
import {
  CategoryHero,
  QuickScenarios,
  TopOffers,
  OffersComparisonTable,
  HowToChoose,
  WhoSuits,
  CategoryFaq,
  InternalLinks,
  TrustBlock,
} from '@/components/category';
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
    const config = getCategoryConfig(parsed.categorySlug);
    if (config) {
      return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
      };
    }
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

// Получение офферов
async function getOffers() {
  try {
    return await db.loanOffer.findMany({
      where: { status: 'published' },
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
      take: 20,
      include: {
        tags: { include: { tag: true } },
      },
    });
  } catch (e) {
    console.error('Failed to fetch offers:', e);
    return [];
  }
}
  
// Форматирование оффера для компонентов
function formatOffer(offer: Awaited<ReturnType<typeof db.loanOffer.findMany>>[0]): import('@/types/offer').Offer {
  // Безопасный парсинг JSON полей
  const parseJsonArray = (value: unknown): string[] => {
    if (!value) return ['passport'];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : ['passport'];
      } catch {
        return ['passport'];
      }
    }
    return ['passport'];
  };

  return {
    id: offer.id,
    name: offer.name,
    slug: offer.slug,
    logo: offer.logo || undefined,
    rating: offer.rating,
    minAmount: offer.minAmount,
    maxAmount: offer.maxAmount,
    minTerm: offer.minTerm || 1,
    maxTerm: offer.maxTerm || 30,
    baseRate: offer.baseRate || 0.8,
    firstLoanRate: offer.firstLoanRate ?? undefined,
    decisionTime: offer.decisionTime || 15,
    approvalRate: offer.approvalRate || 85,
    features: offer.tags?.map((t) => {
      const slugToFeature: Record<string, import('@/types/offer').OfferFeature> = {
        'first-loan-zero': 'first_loan_zero',
        'no-overpayments': 'no_overpayments',
        'prolongation': 'prolongation',
        'early-repayment': 'early_repayment',
        'no-hidden-fees': 'no_hidden_fees',
        'online-approval': 'online_approval',
        'one-document': 'one_document',
        'loyalty-program': 'loyalty_program',
      };
      return slugToFeature[t.tag.slug];
    }).filter(Boolean) || ['online_approval'],
    payoutMethods: parseJsonArray(offer.payoutMethods) as import('@/types/offer').PayoutMethod[],
    badCreditOk: offer.badCreditOk ?? false,
    noCalls: offer.noCalls ?? false,
    roundTheClock: offer.roundTheClock ?? false,
    minAge: offer.minAge || 18,
    documents: parseJsonArray(offer.documents) as import('@/types/offer').DocumentRequirement[],
    editorNote: offer.editorNote || offer.customDescription || undefined,
    affiliateUrl: offer.affiliateUrl || '#',
    isFeatured: offer.isFeatured ?? false,
    isNew: offer.isNew ?? false,
    isPopular: offer.isPopular ?? false,
  };
}
  
export default async function DynamicSeoPage({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const rawOffers = await getOffers();
  
  // Форматируем офферы для компонентов
  const offers = rawOffers.map(formatOffer);
  
  // ============================================
  // КАТЕГОРИЯ (новый дизайн)
  // ============================================
  if (parsed.type === 'category') {
    const config = getCategoryConfig(parsed.categorySlug);
    
    // Если есть конфиг — используем новый дизайн
    if (config) {
      const topOffers = offers.slice(0, 3);
      
      const breadcrumb = [
        { name: 'Главная', url: 'https://cashpeek.ru/' },
        { name: 'Займы', url: 'https://cashpeek.ru/zaimy' },
        { name: config.name, url: `https://cashpeek.ru/zaimy/${parsed.categorySlug}` },
      ];
      
      const seoContent = `
        <p><strong>${config.name}</strong> — удобный способ получить деньги на банковскую карту без визита в офис и справок о доходах.</p>
        <h3>Как получить займ ${config.namePrepositional}?</h3>
        <p>Процесс оформления занимает 5–10 минут. Выберите предложение, заполните анкету на сайте МФО и получите деньги на карту.</p>
        <h3>Требования к заёмщику</h3>
        <ul>
          <li>Гражданство РФ</li>
          <li>Возраст от 18 до 75 лет</li>
          <li>Постоянная регистрация</li>
          <li>Паспорт и банковская карта</li>
        </ul>
      `;

      return (
        <div className="flex min-h-screen flex-col bg-white">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
          />
          <Header />
          <main className="flex-1">
            <CategoryHero config={config} offersCount={offers.length} />
            <QuickScenarios scenarios={config.scenarios} />
            <TopOffers offers={topOffers} title="Рекомендуемые предложения" />
            <TrustBlock />
            <section id="offers" className="py-8 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Все предложения</h2>
                <OffersComparisonTable offers={offers} />
              </div>
            </section>
            <HowToChoose steps={config.howToChoose} />
            <WhoSuits items={config.whoSuits} />
            <div
              className="prose prose-slate max-w-none container mx-auto px-4 sm:px-6 lg:px-8 py-10"
              dangerouslySetInnerHTML={{ __html: seoContent }}
            />
            <CategoryFaq items={config.faq} />
            <InternalLinks currentCategory={parsed.categorySlug} />
          </main>
          <Footer />
        </div>
      );
    }
    
    // Fallback на старый дизайн
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
              <OfferList offers={rawOffers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  // ============================================
  // ГОРОД
  // ============================================
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
              <OfferList offers={rawOffers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  // ============================================
  // КАТЕГОРИЯ + ГОРОД
  // ============================================
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
              <OfferList offers={rawOffers} loanTypeSlug={parsed.categorySlug} showSort={true} />
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
  
  // ============================================
  // СУММА
  // ============================================
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
              <OfferList offers={rawOffers} showSort={true} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  
  // ============================================
  // СУММА + ГОРОД
  // ============================================
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
              <OfferList offers={rawOffers} showSort={true} />
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
