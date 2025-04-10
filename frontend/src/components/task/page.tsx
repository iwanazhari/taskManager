// app/task/page.tsx
"use client";

import { SetStateAction, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  Loader2,
  Clock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  Task,
  EmployeeOption,
  RemunerationData,
  CreateForm,
} from "@/types/task";
import { TaskEditDialog } from "@/components/task/EditTaskDialog";
import { TaskCreateDialog } from "@/components/task/CreateTaskDialog";
import { TaskRemunerationDialog } from "@/components/task/RemunerationDialog";
import {
  handleCreateTask,
  handleDelete,
  handleEditSubmit,
  handleRemuneration,
  handleStatusChange,
} from "@/lib/handlers";

export default function TaskPage() {
  const [data, setData] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    hourly_rate: "",
    additional_fee: "",
  });
  const [createForm, setCreateForm] = useState<CreateForm>({
    description: "",
    hourly_rate: "",
    additional_fee: "",
    assignments: [{ employee_id: 0, hours_worked: 1, note: "" }],
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [remunerationDialogOpen, setRemunerationDialogOpen] = useState(false);
  const [remuneration, setRemuneration] = useState<RemunerationData | null>(
    null
  );
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees`
      );
      const json = await res.json();
      setEmployees(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
      { accessorKey: "description", header: "Deskripsi" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;
          const statusIcon = {
            Done: <CheckCircle className="w-4 h-4 text-green-600" />,
            Onprogress: (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            ),
            Pending: <Clock className="w-4 h-4 text-yellow-600" />,
          };
          const style = {
            Done: "bg-green-100 text-green-800 border-green-200",
            Onprogress: "bg-blue-100 text-blue-800 border-blue-200",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };

          return (
            <div className="flex items-center gap-1">
              {statusIcon[task.status as keyof typeof statusIcon]}
              <select
                className={`capitalize text-xs font-medium rounded-md border px-2 py-1 ${style[task.status as keyof typeof style]}`}
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(
                    task.id,
                    e.target.value,
                    setData,
                    fetchTasks
                  )
                }
              >
                <option value="Pending">Pending</option>
                <option value="Onprogress">Onprogress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          );
        },
      },
      {
        accessorKey: "hourly_rate",
        header: "Rate / Jam",
        cell: ({ cell }) =>
          `Rp ${parseFloat(cell.getValue() as string).toLocaleString("id-ID")}`,
      },
      {
        accessorKey: "additional_fee",
        header: "Biaya Tambahan",
        cell: ({ cell }) =>
          `Rp ${parseFloat(cell.getValue() as string).toLocaleString("id-ID")}`,
      },
      {
        id: "employees",
        header: "Karyawan",
        cell: ({ row }) => (
          <ul className="text-sm list-disc ml-4 space-y-1">
            {row.original.employees.map((emp) => (
              <li key={emp.id}>
                {emp.name} ({emp.pivot.hours_worked} jam)
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleDelete(row.original.id, data, setData, "delete")
                  }
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleRemuneration(
                      row.original.id,
                      setRemuneration,
                      setRemunerationDialogOpen
                    )
                  }
                >
                  Hitung Remunerasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setEditForm({
      description: task.description,
      hourly_rate: task.hourly_rate,
      additional_fee: task.additional_fee,
    });
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Cari deskripsi..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Task
          </Button>
        </div>
        <span className="text-muted-foreground text-sm">
          {data.length} data
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <TaskEditDialog
        open={!!editTask}
        setOpen={() => setEditTask(null)}
        editTask={editTask}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditSubmit={(e) =>
          handleEditSubmit(e, editTask, editForm, setEditTask, setData)
        }
      />

      <TaskRemunerationDialog
        open={remunerationDialogOpen}
        setOpen={setRemunerationDialogOpen}
        remuneration={remuneration}
      />

      <TaskCreateDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        createForm={createForm}
        setCreateForm={setCreateForm}
        handleCreateTask={() =>
          handleCreateTask(createForm, setData, setCreateDialogOpen)
        }
        employees={employees}
      />
    </main>
  );
}
