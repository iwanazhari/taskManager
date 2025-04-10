import { useState } from "react";
import { Task } from "@/types/task";

export function useTaskActions(initialData: Task[] = []) {
  const [data, setData] = useState<Task[]>(initialData);

  const addTask = (task: Task) => setData((prev) => [task, ...prev]);
  const updateTask = (task: Task) =>
    setData((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  const deleteTask = (taskId: number) =>
    setData((prev) => prev.filter((t) => t.id !== taskId));
  const optimisticStatusChange = (taskId: number, status: string) => {
    setData((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  return {
    data,
    setData,
    addTask,
    updateTask,
    deleteTask,
    optimisticStatusChange,
  };
}
