import type { FAQItem } from '@/contexts/page-faq-context';

/**
 * Типы для блога и FAQ системы
 */

export type { FAQItem } from '@/contexts/page-faq-context';

/**
 * Варианты стилизации FAQ-блока
 */
export type FAQVariant = 'default' | 'bordered' | 'minimal';

/**
 * Тип секции статьи (для CMS/MDX)
 */
export interface ArticleSection {
  type: 'text' | 'heading' | 'faq' | 'image' | 'quote' | 'code' | 'list';
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  items?: FAQItem[];
  src?: string;
  alt?: string;
  author?: string;
  language?: string;
  listItems?: string[];
}

/**
 * Метаданные статьи
 */
export interface ArticleMetadata {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featured?: boolean;
  tags?: string[];
  coverImage?: string;
}

/**
 * Полная статья с контентом
 */
export interface Article extends ArticleMetadata {
  sections: ArticleSection[];
}

/**
 * Пропсы для MDX-компонента FAQ
 */
export interface MDXFAQProps {
  items: Array<{
    q: string;  // Сокращение для question
    a: string;  // Сокращение для answer
  }>;
  title?: string;
  variant?: FAQVariant;
}

/**
 * Преобразует MDX-формат в стандартный FAQItem
 */
export function normalizeMDXFAQ(items: Array<{ q: string; a: string }>): FAQItem[] {
  return items.map((item) => ({
    question: item.q,
    answer: item.a,
  }));
}
