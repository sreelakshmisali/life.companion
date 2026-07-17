import React, { createContext, useContext, useMemo, useState } from 'react';
import { getDayOfYear } from '@/utils/date';
import { DEFAULT_SPARK_IDEAS } from '../constants';
import { SparkIdea } from '../types';

interface SparkContextValue {
  ideas: SparkIdea[];
  addIdea: (text: string) => void;
  editIdea: (id: string, text: string) => void;
  removeIdea: (id: string) => void;
  replaceAll: (ideas: SparkIdea[]) => void;
  todaysSpark: SparkIdea | null;
  canReroll: boolean;
  reroll: () => void;
  rerolledIdeaId: string | null;
  /** Set once per session when the reroll is used, so it can be restored on import. */
  replaceRerollState: (rerolledIdeaId: string | null) => void;
}

const SparkContext = createContext<SparkContextValue | undefined>(undefined);

export function SparkProvider({ children }: { children: React.ReactNode }) {
  const [ideas, setIdeas] = useState<SparkIdea[]>(DEFAULT_SPARK_IDEAS);
  // Today's pick can be overridden once, by the person's one allowed reroll.
  const [rerolledIdeaId, setRerolledIdeaId] = useState<string | null>(null);

  const value = useMemo<SparkContextValue>(() => {
    const dayOfYear = getDayOfYear();
    const deterministicPick = ideas.length > 0 ? ideas[dayOfYear % ideas.length] : null;
    const rerolledPick = rerolledIdeaId ? ideas.find((i) => i.id === rerolledIdeaId) ?? null : null;
    const todaysSpark = rerolledPick ?? deterministicPick;
    const canReroll = rerolledIdeaId === null && ideas.length > 1;

    return {
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
      todaysSpark,
      canReroll,
      rerolledIdeaId,
      reroll: () => {
        if (rerolledIdeaId !== null || ideas.length < 2) return;
        const currentId = deterministicPick?.id;
        const options = ideas.filter((i) => i.id !== currentId);
        const next = options[Math.floor(Math.random() * options.length)] ?? deterministicPick;
        if (next) setRerolledIdeaId(next.id);
      },
      replaceRerollState: (id: string | null) => setRerolledIdeaId(id),
    };
  }, [ideas, rerolledIdeaId]);

  return <SparkContext.Provider value={value}>{children}</SparkContext.Provider>;
}

export function useSpark() {
  const ctx = useContext(SparkContext);
  if (!ctx) throw new Error('useSpark must be used within a SparkProvider');
  return ctx;
}
