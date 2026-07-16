import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_SPARK_IDEAS } from '../constants';
import { SparkIdea } from '../types';

interface SparkContextValue {
  ideas: SparkIdea[];
  addIdea: (text: string) => void;
  editIdea: (id: string, text: string) => void;
  removeIdea: (id: string) => void;
  replaceAll: (ideas: SparkIdea[]) => void;
}

const SparkContext = createContext<SparkContextValue | undefined>(undefined);

export function SparkProvider({ children }: { children: React.ReactNode }) {
  const [ideas, setIdeas] = useState<SparkIdea[]>(DEFAULT_SPARK_IDEAS);

  const value = useMemo<SparkContextValue>(
    () => ({
      ideas,
      addIdea: (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setIdeas((prev) => [...prev, { id: Date.now().toString(), text: trimmed }]);
      },
      editIdea: (id: string, text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, text: trimmed } : i)));
      },
      removeIdea: (id: string) => setIdeas((prev) => prev.filter((i) => i.id !== id)),
      replaceAll: (next: SparkIdea[]) => setIdeas(next),
    }),
    [ideas]
  );

  return <SparkContext.Provider value={value}>{children}</SparkContext.Provider>;
}

export function useSpark() {
  const ctx = useContext(SparkContext);
  if (!ctx) throw new Error('useSpark must be used within a SparkProvider');
  return ctx;
}
