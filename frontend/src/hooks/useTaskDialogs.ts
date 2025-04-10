import { useState } from "react";
import type { Task, RemunerationData } from "@/types/task";

export function useTaskDialogs() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [remunerationDialogOpen, setRemunerationDialogOpen] = useState(false);
  const [remuneration, setRemuneration] = useState<RemunerationData | null>(
    null
  );

  return {
    createDialogOpen,
    setCreateDialogOpen,
    editTask,
    setEditTask,
    remunerationDialogOpen,
    setRemunerationDialogOpen,
    remuneration,
    setRemuneration,
  };
}
