"use client";

import { useEffect, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { usePageFAQ, type FAQItem } from '@/contexts/page-faq-context';

export interface ContextualFAQProps {
  /**
   * Массив вопросов и ответов
   */
  items: FAQItem[];

  /**
   * Заголовок блока (опционально)
   */
  title?: string;

  /**
   * Подзаголовок или описание (опционально)
   */
  description?: string;

  /**
   * Тип аккордеона: single (один открытый) или multiple (несколько)
   */
  type?: 'single' | 'multiple';

  /**
   * Индекс открытого по умолчанию элемента (для type="single")
   */
  defaultExpanded?: string;

  /**
   * Дополнительные CSS-классы для контейнера
   */
  className?: string;

  /**
   * Вариант стиля: default (серый фон), bordered (рамка), minimal (минимальный)
   */
  variant?: 'default' | 'bordered' | 'minimal';

  /**
   * Уникальный ID для аккордеона (генерируется автоматически, если не указан)
   */
  accordionId?: string;
}

const variantStyles = {
  default: 'bg-muted/50 rounded-xl p-4 md:p-6 border border-border/50',
  bordered: 'border-2 border-primary/20 rounded-xl p-4 md:p-6 bg-background',
  minimal: 'bg-background rounded-lg p-3 md:p-4',
};

/**
 * Контекстный FAQ-блок для вставки внутрь статьи
 *
 * Автоматически регистрирует вопросы в глобальном контексте для SEO Schema
 */
export function ContextualFAQ({
  items,
  title,
  description,
  type = 'single',
  defaultExpanded,
  className,
  variant = 'default',
  accordionId,
}: ContextualFAQProps) {
  const { registerFAQs, unregisterFAQs } = usePageFAQ();

  // Регистрируем FAQ в глобальном контексте при монтировании
  useEffect(() => {
    registerFAQs(items);
    return () => unregisterFAQs(items);
  }, [items, registerFAQs, unregisterFAQs]);

  const uniqueId = accordionId || `faq-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={cn('my-6 md:my-8', className)}>
      <div className={cn(variantStyles[variant])}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}

        <Accordion
          type={type}
          collapsible={type === 'single'}
          defaultValue={defaultExpanded}
          className="w-full"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={`${uniqueId}-${index}`}
              value={`${uniqueId}-${index}`}
              className="border-border/50 last:border-b-0"
            >
              <AccordionTrigger className="text-left text-sm md:text-base py-3 md:py-4 hover:no-underline">
                <span className="pr-4">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-muted-foreground">
                <FAQAnswer content={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

/**
 * Компонент для рендеринга ответа с поддержкой HTML-разметки
 */
function FAQAnswer({ content }: { content: string }) {
  // Если контент содержит HTML-теги, рендерим как HTML
  if (content.includes('<') && content.includes('>')) {
    return (
      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Иначе рендерим как текст с поддержкой переносов
  return (
    <div className="whitespace-pre-wrap">
      {content.split('\n').map((paragraph, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default ContextualFAQ;
