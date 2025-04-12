import React from 'react';
export interface User {
  id: string;
  name?: string;
  age?: number;
  height?: number;
  isActive?: boolean;
  tasks?: Task[];
}

export interface Task {
  id: string;
  description?: string;
  isComplete?: boolean;
}


export const UserComponent = () => {
  return (
    <div>
      <h1>User</h1>
    </div>
  );
};

export const TaskComponent = () => {
  return (
    <div>
      <h1>Task</h1>
    </div>
  );
};
