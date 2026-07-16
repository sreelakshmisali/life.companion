import React, { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_TODOS } from '../constants';
import { TodoItem, TodoPriority } from '../types';

interface TodoContextValue {
  todos: TodoItem[];
  activeTodos: TodoItem[];
  completedTodos: TodoItem[];
  addTodo: (label: string, priority: TodoPriority) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, label: string) => void;
  setPriority: (id: string, priority: TodoPriority) => void;
  removeTodo: (id: string) => void;
  replaceAll: (todos: TodoItem[]) => void;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>(MOCK_TODOS);

  const value = useMemo<TodoContextValue>(() => {
    // Newest first within each group; open tasks surface above done ones.
    const sorted = [...todos].sort((a, b) => b.createdAt - a.createdAt);
    return {
      todos: sorted,
      activeTodos: sorted.filter((t) => !t.done),
      completedTodos: sorted.filter((t) => t.done),
      addTodo: (label: string, priority: TodoPriority) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setTodos((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            label: trimmed,
            done: false,
            priority,
            dueDate: null,
            createdAt: Date.now(),
          },
        ]);
      },
      toggleTodo: (id: string) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
      editTodo: (id: string, label: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, label: trimmed } : t)));
      },
      setPriority: (id: string, priority: TodoPriority) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t))),
      removeTodo: (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id)),
      replaceAll: (next: TodoItem[]) => setTodos(next),
    };
  }, [todos]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within a TodoProvider');
  return ctx;
}
