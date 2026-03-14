import type { BlogPost, TocItem } from '@/types/blog';
import type { FAQItem } from '@/contexts/page-faq-context';

// Calculate reading time from content
export function calculateReadingTime(content: string): number {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Format reading time
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '1 мин чтения';
  if (minutes === 1) return '1 мин чтения';
  if (minutes < 5) return `${minutes} мин чтения`;
  return `${minutes} мин чтения`;
}

// Format date
export function formatPostDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Extract headings from HTML content for TOC
export function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const regex = /<h([2-4])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    
    headings.push({ id, text, level });
  }
  
  return headings;
}

// Extract FAQ blocks from HTML content
export function extractFAQsFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Pattern 1: <div data-faq="true" data-question="..." data-answer="...">
  const divPattern = /<div[^>]*data-faq="true"[^>]*data-question="([^"]*)"[^>]*data-answer="([^"]*)"[^>]*><\/div>/gi;
  
  let match;
  while ((match = divPattern.exec(content)) !== null) {
    faqs.push({
      question: decodeHTMLEntities(match[1]),
      answer: decodeHTMLEntities(match[2]),
    });
  }
  
  // Pattern 2: <faq-block question="..." answer="..."></faq-block>
  const faqBlockPattern = /<faq-block[^>]*question="([^"]*)"[^>]*answer="([^"]*)"[^>]*><\/faq-block>/gi;
  
  while ((match = faqBlockPattern.exec(content)) !== null) {
    faqs.push({
      question: decodeHTMLEntities(match[1]),
      answer: decodeHTMLEntities(match[2]),
    });
  }
  
  // Pattern 3: JSON-LD embedded FAQ
  const jsonPattern = /<script[^>]*type="application\/faq\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  
  while ((match = jsonPattern.exec(content)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.question && item.answer) {
            faqs.push(item);
          }
        });
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return faqs;
}

// Helper to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };
  
  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Get estimated post views formatted
export function formatViewsCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Clean HTML for Schema.org
export function cleanHtmlForSchema(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
