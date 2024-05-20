export interface Task {
  id: number;
  task: string;
  status: string;
}

export const readTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('/tasks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks: Task[] = await response.json();
    return tasks;
    
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};