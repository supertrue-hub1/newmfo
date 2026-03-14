import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { LOAN_CATEGORIES, CITIES, AMOUNTS } from '@/lib/seo/slugs';

const BASE_URL = 'https://cashpeek.ru';
const MAX_URLS_PER_SITEMAP = 45000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // === HIGH PRIORITY STATIC PAGES ===
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' as const },
    { url: '/zaimy', priority: 0.95, changefreq: 'daily' as const },
    { url: '/sravnit', priority: 0.9, changefreq: 'daily' as const },
    { url: '/mfo', priority: 0.9, changefreq: 'daily' as const },
    { url: '/blog', priority: 0.8, changefreq: 'daily' as const },
  ];

  staticPages.forEach(page => {
    urls.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  // === CATEGORIES ===
  Object.keys(LOAN_CATEGORIES).forEach(slug => {
    urls.push({
      url: `${BASE_URL}/zaimy/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    });
  });

  // === CITIES (top 15) ===
  Object.keys(CITIES).slice(0, 15).forEach(slug => {
    urls.push({
      url: `${BASE_URL}/zaimy/v-${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });
  });

  // === CATEGORY + CITY (150 pages) ===
  Object.keys(LOAN_CATEGORIES).forEach(catSlug => {
    Object.keys(CITIES).slice(0, 15).forEach(citySlug => {
      urls.push({
        url: `${BASE_URL}/zaimy/${catSlug}/v-${citySlug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    });
  });

  // === AMOUNTS ===
  AMOUNTS.forEach(amount => {
    urls.push({
      url: `${BASE_URL}/zaimy/do-${amount.slug}-rublei`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  });

  // === SEO PAGES FROM DATABASE (Programmatic SEO) ===
  try {
    const seoPages = await db.seoPage.findMany({
      where: {
        isIndexable: true,
        noIndex: false,
        status: 'published',
      },
      select: {
        urlPath: true,
        priority: true,
        updatedAt: true,
      },
      orderBy: { priority: 'desc' },
      take: MAX_URLS_PER_SITEMAP,
    });

    seoPages.forEach(page => {
      urls.push({
        url: `${BASE_URL}${page.urlPath}`,
        lastModified: page.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: page.priority / 10,
      });
    });
  } catch (error) {
    console.error('[Sitemap] Error fetching SEO pages:', error);
  }

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
