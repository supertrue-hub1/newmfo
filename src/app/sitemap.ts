import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS } from '@/lib/seo/slugs';

const BASE_URL = 'https://cashpeek.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // === ГЛАВНЫЕ СТРАНИЦЫ ===
  urls.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1,
  });

  urls.push({
    url: `${BASE_URL}/sravnit`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  });

  urls.push({
    url: `${BASE_URL}/blog`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  });

  // === КАТЕГОРИИ ЗАЙМОВ ===
  Object.entries(LOAN_CATEGORIES).forEach(([slug, category]) => {
    urls.push({
      url: `${BASE_URL}/zaimy/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Категория + каждый город
    Object.keys(CITIES).slice(0, 15).forEach(citySlug => {
      urls.push({
        url: `${BASE_URL}/zaimy/${slug}/v-${citySlug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // === ГОРОДА (все займы в городе) ===
  Object.keys(CITIES).forEach(citySlug => {
    urls.push({
      url: `${BASE_URL}/zaimy/v-${citySlug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // === СУММЫ ===
  AMOUNTS.forEach(amount => {
    urls.push({
      url: `${BASE_URL}/zaimy/do-${amount.slug}-rublei`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });

    // Сумма + каждый город (топ-15)
    Object.keys(CITIES).slice(0, 15).forEach(citySlug => {
      urls.push({
        url: `${BASE_URL}/zaimy/do-${amount.slug}-rublei/v-${citySlug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    });
  });

  // === МФО (бренды) ===
  try {
    const mfos = await db.loanOffer.findMany({
      where: { status: 'published' },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { rating: 'desc' },
      take: 200,
    });

    mfos.forEach(mfo => {
      urls.push({
        url: `${BASE_URL}/mfo/${mfo.slug}`,
        lastModified: mfo.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('[Sitemap] Error fetching MFO:', error);
  }

  // === БЛОГ ===
  try {
    const posts = await db.blogPost.findMany({
      where: { status: 'published' },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 500,
    });

    posts.forEach(post => {
      urls.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    });

    // Категории блога
    const categories = await db.blogCategory.findMany({
      select: { slug: true },
    });

    categories.forEach(cat => {
      urls.push({
        url: `${BASE_URL}/blog/${cat.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('[Sitemap] Error fetching blog:', error);
  }

  // === INFO СТРАНИЦЫ (высокий приоритет) ===
  const infoPages = [
    { url: '/info/o-nas', priority: 0.7, changefreq: 'monthly' as const },
    { url: '/info/kontakty', priority: 0.7, changefreq: 'monthly' as const },
    { url: '/info/sotrudnichestvo', priority: 0.6, changefreq: 'monthly' as const },
  ];

  infoPages.forEach(page => {
    urls.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  // === LEGAL / DOCS СТРАНИЦЫ (низкий приоритет) ===
  const legalPages = [
    { url: '/docs/privacy', priority: 0.3, changefreq: 'yearly' as const },
    { url: '/docs/terms', priority: 0.3, changefreq: 'yearly' as const },
    { url: '/docs/offerta', priority: 0.3, changefreq: 'yearly' as const },
  ];

  legalPages.forEach(page => {
    urls.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  console.log(`[Sitemap] Generated ${urls.length} URLs`);

  return urls;
}
