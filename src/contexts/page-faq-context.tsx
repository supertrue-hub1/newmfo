"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface PageFAQContextValue {
  faqs: FAQItem[];
  registerFAQs: (items: FAQItem[]) => void;
  unregisterFAQs: (items: FAQItem[]) => void;
  getAllFAQs: () => FAQItem[];
}

const PageFAQContext = createContext<PageFAQContextValue | null>(null);

interface PageFAQProviderProps {
  children: ReactNode;
  initialFAQs?: FAQItem[];
}

export function PageFAQProvider({ children, initialFAQs = [] }: PageFAQProviderProps) {
  const [faqs, setFAQs] = useState<FAQItem[]>(initialFAQs);

  const registerFAQs = useCallback((items: FAQItem[]) => {
    setFAQs((prev) => {
      // Избегаем дубликатов по вопросу
      const newItems = items.filter(
        (item) => !prev.some((existing) => existing.question === item.question)
      );
      return [...prev, ...newItems];
    });
  }, []);

  const unregisterFAQs = useCallback((items: FAQItem[]) => {
    setFAQs((prev) =>
      prev.filter(
        (existing) => !items.some((item) => item.question === existing.question)
      )
    );
  }, []);

  const getAllFAQs = useCallback(() => faqs, [faqs]);

  return (
    <PageFAQContext.Provider
      value={{
        faqs,
        registerFAQs,
        unregisterFAQs,
        getAllFAQs,
      }}
    >
      {children}
    </PageFAQContext.Provider>
  );
}

export function usePageFAQ() {
  const context = useContext(PageFAQContext);
  if (!context) {
    throw new Error('usePageFAQ must be used within a PageFAQProvider');
  }
  return context;
}

/**
 * Хук для использования вне провайдера (например, в серверных компонентах)
 * Возвращает функцию для получения текущих FAQ
 */
export function usePageFAQOptional() {
  const context = useContext(PageFAQContext);
  return context;
}
