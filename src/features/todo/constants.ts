import { PriorityOption, TodoItem } from './types';

/**
 * Priority colors are fixed, not theme-driven — a "high" tag should read
 * the same regardless of which home theme is active, the same way a stop
 * sign stays red. Pulled from the warm pastel palette in the design brief.
 */
export const PRIORITIES: PriorityOption[] = [
  { id: 'low', label: 'Low', color: '#8FAE88', softColor: '#DCE8D8' },
  { id: 'medium', label: 'Medium', color: '#D9A05C', softColor: '#F0D9C4' },
  { id: 'high', label: 'High', color: '#C97B7B', softColor: '#F0D3D3' },
];

export function priorityOptionFor(id: TodoItem['priority']): PriorityOption {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];
}
