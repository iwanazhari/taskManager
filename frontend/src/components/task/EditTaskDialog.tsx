// components/tasks/TaskEditDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "@/hooks/useTasks";
import { Dispatch, SetStateAction, FormEvent } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editTask: Task | null;
  editForm: {
    description: string;
    hourly_rate: string;
    additional_fee: string;
  };
  setEditForm: Dispatch<
    SetStateAction<{
      description: string;
      hourly_rate: string;
      additional_fee: string;
    }>
  >;
  handleEditSubmit: (e: FormEvent) => void;
}

export function TaskEditDialog({
  open,
  setOpen,
  editTask,
  editForm,
  setEditForm,
  handleEditSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-neutral-200 dark:border-zinc-700 transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            ✏️ Edit Tugas
          </DialogTitle>
        </DialogHeader>
        {editTask && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Deskripsi</label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Masukkan deskripsi tugas"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Rate / Jam</label>
              <Input
                type="number"
                value={editForm.hourly_rate}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    hourly_rate: e.target.value,
                  }))
                }
                placeholder="Masukkan rate per jam"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Biaya Tambahan</label>
              <Input
                type="number"
                value={editForm.additional_fee}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    additional_fee: e.target.value,
                  }))
                }
                placeholder="Masukkan biaya tambahan"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Simpan Perubahan
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
