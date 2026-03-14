import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Блокируем параметры фильтрации
        disallow: [
          '/api/',
          '/admin/',
          '/cabinet/',
          '/*?utm_',
          '/*?ref=',
          '/*?source=',
        ],
      },
      {
        // Googlebot может сканировать больше
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/cabinet/',
        ],
      },
    ],
    sitemap: 'https://cashpeek.ru/sitemap.xml',
    host: 'https://cashpeek.ru',
  };
}
