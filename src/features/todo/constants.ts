import { PriorityOption, TodoItem } from './types';

/**
 * Priority colors are fixed, not theme-driven — a "high" tag should read
 * the same regardless of which of the 9 home themes is active, the same
 * way a stop sign stays red. Pulled from the warm pastel palette in the
 * design brief so they still sit comfortably next to any theme.
 */
export const PRIORITIES: PriorityOption[] = [
  { id: 'low', label: 'Low', color: '#8FAE88', softColor: '#DCE8D8' },
  { id: 'medium', label: 'Medium', color: '#D9A05C', softColor: '#F0D9C4' },
  { id: 'high', label: 'High', color: '#C97B7B', softColor: '#F0D3D3' },
];

export function priorityOptionFor(id: TodoItem['priority']): PriorityOption {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];
}

export const MOCK_TODOS: TodoItem[] = [
  {
    id: 't1',
    label: 'Book dentist appointment',
    done: false,
    priority: 'medium',
    dueDate: null,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 't2',
    label: 'Reply to Maya about the trip',
    done: false,
    priority: 'high',
    dueDate: null,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 't3',
    label: 'Return library books',
    done: true,
    priority: 'low',
    dueDate: null,
    createdAt: Date.now() - 86400000 * 3,
  },
];
