import type { BlogPost, TocItem } from '@/types/blog';

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
