import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { getCategoryConfig, type CategorySlug } from '@/lib/category/category-config';
import {
  CategoryHero,
  QuickScenarios,
  TopOffers,
  OffersFilter,
  OffersComparisonTable,
  HowToChoose,
  WhoSuits,
  CategoryFaq,
  InternalLinks,
  TrustBlock,
} from '@/components/category';
import { generateBreadcrumb } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// ============================================
// METADATA
// ============================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getCategoryConfig(slug);

  if (!config) {
    return { title: 'Страница не найдена' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: `/zaimy/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      locale: 'ru_RU',
    },
  };
}

// ============================================
// DATA FETCHING
// ============================================

async function getOffersForCategory(categorySlug: string) {
  try {
    const offers = await db.loanOffer.findMany({
      where: {
        status: 'published',
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
      ],
      take: 20,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return offers.map((offer) => ({
      ...offer,
      features: offer.tags?.map((t) => t.tag.slug) || [],
    }));
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getCategoryConfig(slug);

  if (!config) {
    notFound();
  }

  const offers = await getOffersForCategory(slug);

  // Топ-3 оффера
  const topOffers = offers.slice(0, 3);
  const allOffers = offers;

  // Breadcrumbs
  const breadcrumb = [
    { name: 'Главная', url: 'https://cashpeek.ru/' },
    { name: 'Займы', url: 'https://cashpeek.ru/zaimy' },
    { name: config.name, url: `https://cashpeek.ru/zaimy/${slug}` },
  ];

  // SEO-контент
  const seoContent = `
    <p><strong>${config.name}</strong> — удобный способ получить деньги на банковскую карту без визита в офис и справок о доходах. 
    Мы собрали лучшие предложения от проверенных микрофинансовых организаций России.</p>
    
    <h3>Как получить займ ${config.namePrepositional}?</h3>
    <p>Процесс оформления занимает 5–10 минут:</p>
    <ul>
      <li>Выберите подходящее предложение из списка выше</li>
      <li>Нажмите «Получить» и перейдите на сайт МФО</li>
      <li>Заполните анкету — понадобятся только паспорт и карта</li>
      <li>Дождитесь решения — обычно 5–15 минут</li>
      <li>Деньги придут на карту мгновенно после одобрения</li>
    </ul>
    
    <h3>Требования к заёмщику</h3>
    <p>Большинство МФО предъявляют минимальные требования:</p>
    <ul>
      <li>Гражданство РФ</li>
      <li>Возраст от 18 до 75 лет</li>
      <li>Постоянная регистрация на территории России</li>
      <li>Действующий паспорт гражданина РФ</li>
      <li>Банковская карта любого банка</li>
    </ul>
    
    <h3>Преимущества онлайн-займов</h3>
    <p>Оформление через интернет имеет ряд преимуществ перед традиционными кредитами:</p>
    <ul>
      <li><strong>Скорость</strong> — заявка рассматривается за 5–15 минут</li>
      <li><strong>Доступность</strong> — не нужны справки о доходах и поручители</li>
      <li><strong>Удобство</strong> — оформление из дома 24/7</li>
      <li><strong>Прозрачность</strong> — все условия указаны до подписания</li>
    </ul>
    
    <p>Выбирайте подходящее предложение и подавайте заявку прямо сейчас. Первый займ может быть бесплатным — ищите метку «0% новым».</p>
  `;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Breadcrumbs Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <CategoryHero config={config} offersCount={offers.length} />

        {/* Быстрые сценарии */}
        <QuickScenarios scenarios={config.scenarios} />

        {/* Топ-3 оффера */}
        <TopOffers offers={topOffers} title="Рекомендуемые предложения" />

        {/* Trust block */}
        <TrustBlock />

        {/* Все офферы с фильтрами */}
        <section id="offers" className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Все предложения
            </h2>
            <OffersComparisonTable offers={allOffers} />
          </div>
        </section>

        {/* Как выбрать */}
        <HowToChoose steps={config.howToChoose} />

        {/* Кому подходит */}
        <WhoSuits items={config.whoSuits} />

        {/* SEO-контент */}
        <div
          className="prose prose-slate max-w-none container mx-auto px-4 sm:px-6 lg:px-8 py-10"
          dangerouslySetInnerHTML={{ __html: seoContent }}
        />

        {/* FAQ */}
        <CategoryFaq items={config.faq} />

        {/* Внутренние ссылки */}
        <InternalLinks currentCategory={slug} />
      </main>

      <Footer />
    </div>
  );
}

// ============================================
// STATIC PARAMS
// ============================================

export function generateStaticParams() {
  const slugs = ['na-kartu', 'bez-otkaza', 'bez-proverki-ki', 'bez-procentov'];
  
  return slugs.map((slug) => ({
    slug,
  }));
}
