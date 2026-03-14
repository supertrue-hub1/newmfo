'use client';

import { useMemo } from 'react';
import { ContextualFAQ } from '@/components/blog/contextual-faq';
import { PageFAQProvider } from '@/contexts/page-faq-context';
import type { FAQItem } from '@/contexts/page-faq-context';

interface ContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Парсит HTML контент и извлекает FAQ блоки
 * Форматы поддерживаемых FAQ в контенте:
 * 
 * 1. HTML комментарий с JSON:
 *    <!-- FAQ: [{"question": "...", "answer": "..."}] -->
 * 
 * 2. Custom element:
 *    <faq-block question="..." answer="..."></faq-block>
 * 
 * 3. Data attribute:
 *    <div data-faq="true" data-question="..." data-answer="..."></div>
 */
function parseContentWithFAQs(content: string): {
  segments: Array<{ type: 'html' | 'faq'; content: string; faqs?: FAQItem[] }>;
  allFAQs: FAQItem[];
} {
  const segments: Array<{ type: 'html' | 'faq'; content: string; faqs?: FAQItem[] }> = [];
  const allFAQs: FAQItem[] = [];
  
  // Pattern 1: HTML комментарии с JSON
  const commentPattern = /<!--\s*FAQ:\s*(\[[\s\S]*?\])\s*-->/gi;
  
  // Pattern 2: <faq-block> elements
  const faqBlockPattern = /<faq-block[^>]*question="([^"]*)"[^>]*answer="([^"]*)"[^>]*>\s*<\/faq-block>/gi;
  
  // Pattern 3: <div data-faq>
  const divFaqPattern = /<div[^>]*data-faq="true"[^>]*data-question="([^"]*)"[^>]*data-answer="([^"]*)"[^>]*>\s*<\/div>/gi;
  
  // Объединяем все паттерны
  const allPatterns = [
    { pattern: commentPattern, type: 'comment' as const },
    { pattern: faqBlockPattern, type: 'faqblock' as const },
    { pattern: divFaqPattern, type: 'divfaq' as const },
  ];
  
  // Находим все совпадения
  const matches: Array<{ index: number; length: number; faqs: FAQItem[] }> = [];
  
  let match;
  
  // Комментарии с JSON
  while ((match = commentPattern.exec(content)) !== null) {
    try {
      const faqData = JSON.parse(match[1]);
      if (Array.isArray(faqData) && faqData.length > 0) {
        matches.push({
          index: match.index,
          length: match[0].length,
          faqs: faqData.map(f => ({
            question: f.question || f.q,
            answer: f.answer || f.a,
          })),
        });
        allFAQs.push(...faqData.map((f: any) => ({
          question: f.question || f.q,
          answer: f.answer || f.a,
        })));
      }
    } catch (e) {
      console.error('Failed to parse FAQ JSON:', e);
    }
  }
  
  // FAQ-block elements
  while ((match = faqBlockPattern.exec(content)) !== null) {
    const faq: FAQItem = {
      question: decodeHTMLEntities(match[1]),
      answer: decodeHTMLEntities(match[2]),
    };
    matches.push({
      index: match.index,
      length: match[0].length,
      faqs: [faq],
    });
    allFAQs.push(faq);
  }
  
  // Div FAQ elements
  while ((match = divFaqPattern.exec(content)) !== null) {
    const faq: FAQItem = {
      question: decodeHTMLEntities(match[1]),
      answer: decodeHTMLEntities(match[2]),
    };
    matches.push({
      index: match.index,
      length: match[0].length,
      faqs: [faq],
    });
    allFAQs.push(faq);
  }
  
  // Сортируем по позиции
  matches.sort((a, b) => a.index - b.index);
  
  // Разбиваем контент на сегменты
  let lastIndex = 0;
  
  matches.forEach((m) => {
    // Добавляем HTML до FAQ
    if (m.index > lastIndex) {
      segments.push({
        type: 'html',
        content: content.slice(lastIndex, m.index),
      });
    }
    
    // Добавляем FAQ
    segments.push({
      type: 'faq',
      content: '',
      faqs: m.faqs,
    });
    
    lastIndex = m.index + m.length;
  });
  
  // Добавляем оставшийся HTML
  if (lastIndex < content.length) {
    segments.push({
      type: 'html',
      content: content.slice(lastIndex),
    });
  }
  
  return { segments, allFAQs };
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
  };
  
  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Рендерит контент статьи с поддержкой встроенных FAQ блоков
 */
export function ContentRenderer({ content, className }: ContentRendererProps) {
  const { segments, allFAQs } = useMemo(() => parseContentWithFAQs(content), [content]);
  
  return (
    <PageFAQProvider initialFAQs={allFAQs}>
      <div className={className}>
        {segments.map((segment, index) => {
          if (segment.type === 'html') {
            return (
              <div
                key={index}
                className="prose-segment"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            );
          }
          
          if (segment.type === 'faq' && segment.faqs) {
            return (
              <ContextualFAQ
                key={index}
                items={segment.faqs}
                title="Часто задаваемые вопросы"
                variant="default"
              />
            );
          }
          
          return null;
        })}
      </div>
    </PageFAQProvider>
  );
}

/**
 * Серверная функция для извлечения всех FAQ из контента
 * Используется для генерации Schema.org
 */
export function extractAllFAQs(content: string): FAQItem[] {
  const { allFAQs } = parseContentWithFAQs(content);
  return allFAQs;
}
