"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import { MoreHorizontal, CheckCircle, Loader2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo } from "react";

interface Props {
  data: Task[];
  filter: string;
  onFilterChange: (val: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onRemuneration: (id: number) => void;
}

export function TaskTable({
  data,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
  onStatusChange,
  onRemuneration,
}: Props) {
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;
          const style = {
            Done: "bg-green-100 text-green-800 border-green-200",
            Onprogress: "bg-blue-100 text-blue-800 border-blue-200",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };

          const statusIcon = {
            Done: <CheckCircle className="w-4 h-4 text-green-600" />,
            Onprogress: (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            ),
            Pending: <Clock className="w-4 h-4 text-yellow-600" />,
          };

          return (
            <div className="flex items-center gap-1">
              {statusIcon[task.status as keyof typeof statusIcon]}
              <select
                className={`capitalize text-xs font-medium rounded-md border px-2 py-1 ${style[task.status as keyof typeof style]}`}
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
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
        cell: ({ cell }) => {
          const value = parseFloat(cell.getValue() as string) || 0;
          return `Rp ${value.toLocaleString("id-ID")}`;
        },
      },
      {
        accessorKey: "additional_fee",
        header: "Biaya Tambahan",
        cell: ({ cell }) => {
          const value = parseFloat(cell.getValue() as string) || 0;
          return `Rp ${value.toLocaleString("id-ID")}`;
        },
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
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRemuneration(row.original.id)}
                >
                  Hitung Remunerasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onStatusChange, onEdit, onDelete, onRemuneration]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: onFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-2">
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
    </div>
  );
}
