export type TodoPriority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  label: string;
  done: boolean;
  priority: TodoPriority;
  dueDate: string | null; // YYYY-MM-DD, null = no due date
  createdAt: number;
}

export interface PriorityOption {
  id: TodoPriority;
  label: string;
  color: string;
  softColor: string;
}
