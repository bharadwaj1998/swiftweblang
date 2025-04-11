export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: number;
  value: number;
  tags: string;
  subtasks: Task;
}

export interface User {
  id: string;
  tasks: Task;
}

