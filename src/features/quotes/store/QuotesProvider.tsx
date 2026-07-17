import React, { createContext, useContext, useMemo, useState } from 'react';
import { getDayOfYear } from '@/utils/date';
import { DEFAULT_QUOTES } from '../constants';
import { QuoteItem } from '../types';

interface QuotesContextValue {
  quotes: QuoteItem[];
  quoteOfTheDay: QuoteItem | null;
  addQuote: (quote: string, author: string) => void;
  editQuote: (id: string, quote: string, author: string) => void;
  removeQuote: (id: string) => void;
  replaceAll: (quotes: QuoteItem[]) => void;
}

const QuotesContext = createContext<QuotesContextValue | undefined>(undefined);

export function QuotesProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<QuoteItem[]>(DEFAULT_QUOTES);

  const value = useMemo<QuotesContextValue>(() => {
    // Deterministic pick per day-of-year so it stays the same all day
    // and rotates tomorrow, without needing any stored "last shown" state.
    const dayOfYear = getDayOfYear();
    const quoteOfTheDay = quotes.length > 0 ? quotes[dayOfYear % quotes.length] : null;

    return {
      quotes,
      quoteOfTheDay,
      addQuote: (quote: string, author: string) => {
        const trimmed = quote.trim();
        if (!trimmed) return;
        setQuotes((prev) => [
          ...prev,
          { id: Date.now().toString(), quote: trimmed, author: author.trim() || 'Unknown' },
        ]);
      },
      editQuote: (id: string, quote: string, author: string) => {
        const trimmed = quote.trim();
        if (!trimmed) return;
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, quote: trimmed, author: author.trim() || 'Unknown' } : q))
        );
      },
      removeQuote: (id: string) => setQuotes((prev) => prev.filter((q) => q.id !== id)),
      replaceAll: (next: QuoteItem[]) => setQuotes(next),
    };
  }, [quotes]);

  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>;
}

export function useQuotes() {
  const ctx = useContext(QuotesContext);
  if (!ctx) throw new Error('useQuotes must be used within a QuotesProvider');
  return ctx;
}
