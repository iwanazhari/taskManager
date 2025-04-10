"use client";

import { Task } from "@/types/task";
import { toast } from "sonner";

export async function handleEditSubmit(
  e: React.FormEvent,
  editTask: Task | null,
  editForm: {
    description: string;
    hourly_rate: string;
    additional_fee: string;
  },
  setEditTask: (task: Task | null) => void,
  setData: React.Dispatch<React.SetStateAction<Task[]>>
) {
  e.preventDefault();
  if (!editTask) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${editTask.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      }
    );

    if (!res.ok) throw new Error("Gagal update task");

    const json = await res.json();
    setData((prev) =>
      prev.map((task) =>
        task.id === json.data.id ? { ...task, ...json.data } : task
      )
    );
    toast.success("Task berhasil diperbarui");
    setEditTask(null);
  } catch (err) {
    console.error(err);
    toast.error("Terjadi kesalahan saat update task");
  }
}

export async function handleDelete(
  id: number,
  data: Task[],
  setData: React.Dispatch<React.SetStateAction<Task[]>>,
  toastId: string | number
) {
  const previous = [...data];
  setData((prev) => prev.filter((task) => task.id !== id));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Failed to delete task");
    toast.success("Task berhasil dihapus.");
  } catch (error) {
    console.error("Delete error:", error);
    setData(previous);
    toast.error("Gagal menghapus task.");
  } finally {
    toast.dismiss(toastId);
  }
}

export async function handleStatusChange(
  taskId: number,
  newStatus: string,
  setData: React.Dispatch<React.SetStateAction<Task[]>>,
  fetchTasks: () => Promise<void>
) {
  setData((prev) =>
    prev.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) throw new Error("Gagal mengubah status");
    toast.success("Status berhasil diperbarui");
  } catch (err) {
    console.error(err);
    toast.error("Gagal mengupdate status");
    fetchTasks();
  }
}

export async function handleCreateTask(
  createForm: {
    description: string;
    hourly_rate: string;
    additional_fee: string;
    assignments: {
      employee_id: number;
      hours_worked: number;
      note: string;
    }[];
  },
  setData: React.Dispatch<React.SetStateAction<Task[]>>,
  setCreateDialogOpen: (val: boolean) => void
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...createForm,
        hourly_rate: Number(createForm.hourly_rate),
        additional_fee: Number(createForm.additional_fee),
      }),
    });

    if (!res.ok) throw new Error("Gagal menambah task");

    const json = await res.json();
    setData((prev) => [json.data, ...prev]);
    toast.success("Task berhasil ditambahkan");
    setCreateDialogOpen(false);
  } catch (err) {
    console.error(err);
    toast.error("Gagal menambah task");
  }
}

export async function handleRemuneration(
  taskId: number,
  setRemuneration: (val: any) => void,
  setRemunerationDialogOpen: (val: boolean) => void
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/remuneration`
    );
    const json = await res.json();
    setRemuneration(json.data);
    setRemunerationDialogOpen(true);
  } catch {
    toast.error("Gagal menghitung remunerasi");
  }
}
