// components/tasks/TaskCreateDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeOption, CreateForm } from "@/types/task";
import { Dispatch, SetStateAction, FormEvent } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  createForm: CreateForm;
  setCreateForm: Dispatch<SetStateAction<CreateForm>>;
  handleCreateTask: () => void;
  employees: EmployeeOption[];
}

export function TaskCreateDialog({
  open,
  setOpen,
  createForm,
  setCreateForm,
  handleCreateTask,
  employees,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-neutral-200 dark:border-zinc-700 transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
            Tambah Tugas
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleCreateTask();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Deskripsi"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm({ ...createForm, description: e.target.value })
            }
          />
          <Input
            placeholder="Rate / Jam"
            type="number"
            value={createForm.hourly_rate}
            onChange={(e) =>
              setCreateForm({ ...createForm, hourly_rate: e.target.value })
            }
          />
          <Input
            placeholder="Biaya Tambahan"
            type="number"
            value={createForm.additional_fee}
            onChange={(e) =>
              setCreateForm({ ...createForm, additional_fee: e.target.value })
            }
          />

          <div className="space-y-2">
            <span className="font-medium text-sm">Penugasan</span>
            {createForm.assignments.map((a, i) => (
              <div key={i} className="flex gap-2">
                <select
                  className="border rounded px-2 py-1 text-sm flex-1"
                  value={a.employee_id}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const assignments = [...createForm.assignments];
                    assignments[i].employee_id = val;
                    setCreateForm({ ...createForm, assignments });
                  }}
                >
                  <option value="">Pilih Karyawan</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Jam Kerja"
                  value={a.hours_worked}
                  onChange={(e) => {
                    const assignments = [...createForm.assignments];
                    assignments[i].hours_worked = Number(e.target.value);
                    setCreateForm({ ...createForm, assignments });
                  }}
                />
                <Input
                  placeholder="Catatan"
                  value={a.note}
                  onChange={(e) => {
                    const assignments = [...createForm.assignments];
                    assignments[i].note = e.target.value;
                    setCreateForm({ ...createForm, assignments });
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCreateForm((prev) => ({
                  ...prev,
                  assignments: [
                    ...prev.assignments,
                    { employee_id: 0, hours_worked: 1, note: "" },
                  ],
                }))
              }
            >
              Tambah Karyawan
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Simpan Tugas
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
