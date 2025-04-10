"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RemunerationData } from "@/types/task";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  remuneration: RemunerationData | null;
}

export function TaskRemunerationDialog({ open, setOpen, remuneration }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-neutral-200 dark:border-zinc-700 transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
            📊 Rincian Remunerasi
          </DialogTitle>
        </DialogHeader>
        {remuneration && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">Total Jam: {remuneration.total_hours}</p>
            <p className="font-medium">
              Total Pembayaran:{" "}
              <span className="text-blue-600 font-semibold">
                Rp {remuneration.total_payment.toLocaleString("id-ID")}
              </span>
            </p>
            <ul className="list-disc ml-4 space-y-1">
              {remuneration.details.map((d) => (
                <li key={d.employee_id}>
                  {d.employee_name} - {d.hours_worked} jam - Rp{" "}
                  {d.remuneration.toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
