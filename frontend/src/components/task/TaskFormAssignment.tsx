import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EmployeeOption } from "@/hooks/useEmployees";
import React from "react";

type Assignment = {
  employee_id: number;
  hours_worked: number;
  note: string;
};

type Props = {
  employees: EmployeeOption[];
  assignments: Assignment[];
  onChange: (newAssignments: Assignment[]) => void;
};

export function TaskFormAssignment({
  employees,
  assignments,
  onChange,
}: Props) {
  const updateAssignment = (
    index: number,
    field: keyof Assignment,
    value: string | number
  ) => {
    const updated = [...assignments];

    if (field === "employee_id" || field === "hours_worked") {
      updated[index][field] = Number(value) as never;
    } else if (field === "note") {
      updated[index][field] = value as never;
    }

    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <span className="font-medium text-sm">Penugasan</span>
      {assignments.map((a, i) => (
        <div key={i} className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm flex-1"
            value={a.employee_id}
            onChange={(e) =>
              updateAssignment(i, "employee_id", Number(e.target.value))
            }
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
            onChange={(e) =>
              updateAssignment(i, "hours_worked", Number(e.target.value))
            }
          />
          <Input
            placeholder="Catatan"
            value={a.note}
            onChange={(e) => updateAssignment(i, "note", e.target.value)}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...assignments,
            { employee_id: 0, hours_worked: 1, note: "" },
          ])
        }
      >
        Tambah Karyawan
      </Button>
    </div>
  );
}
