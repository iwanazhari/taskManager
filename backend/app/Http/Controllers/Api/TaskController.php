<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\RemunerationService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Menampilkan semua task beserta relasi pegawai.
     */
    public function index()
    {
        $tasks = Task::with('employees')->get();

        return response()->json([
            'data' => $tasks
        ]);
    }


    /**
     * Menyimpan task baru dan assign ke pegawai.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'description' => 'required|string',
            'hourly_rate' => 'required|numeric',
            'additional_fee' => 'nullable|numeric',
            'status' => 'nullable|in:Pending,Onprogress,Approved,Done',
            'assignments' => 'required|array',
            'assignments.*.employee_id' => 'required|exists:employees,id',
            'assignments.*.hours_worked' => 'required|numeric|min:1',
            'assignments.*.note' => 'nullable|string',
        ]);

        $task = Task::create([
            'description' => $data['description'],
            'hourly_rate' => $data['hourly_rate'],
            'additional_fee' => $data['additional_fee'] ?? 0,
            'status' => $data['status'] ?? 'Pending',
        ]);

        // Tidak perlu menyimpan task_date karena akan menggunakan created_at

        foreach ($data['assignments'] as $assignment) {
            $task->employees()->attach($assignment['employee_id'], [
                'hours_worked' => $assignment['hours_worked'],
                'note' => $assignment['note'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task->load('employees')
        ], 201);
    }


    /**
     * Menampilkan detail satu task.
     */
    public function show(Task $task)
    {
        return response()->json([
            'data' => $task->load('employees')
        ]);
    }

    /**
     * Update data task.
     */
    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'description' => 'sometimes|string',
            'hourly_rate' => 'sometimes|nullable|numeric',
            'additional_fee' => 'sometimes|nullable|numeric',
            'status' => 'sometimes|in:Pending,Onprogress,Approved,Done',
        ]);

        $task->update($data);

        return response()->json([
            'message' => 'Task updated successfully',
            'data' => $task->load('employees')
        ]);
    }

    /**
     * Menghapus task.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * Hitung remunerasi per pegawai.
     */
    public function remuneration(Task $task, RemunerationService $service)
    {
        $task->load('employees');

        return response()->json([
            'data' => $service->calculate($task)
        ]);
    }



    /**
     * Menampilkan laporan task berdasarkan bulan & status.
     */
    public function reportByMonth(string $month, ?string $status = null)
    {
        // Validasi format bulan MM-YYYY
        if (!preg_match('/^(0[1-9]|1[0-2])-\d{4}$/', $month)) {
            return response()->json([
                'message' => 'Format bulan tidak valid. Gunakan MM-YYYY (contoh: 04-2025).'
            ], 422);
        }

        [$monthNumber, $yearNumber] = explode('-', $month);

        $allowedStatuses = ['Pending', 'Onprogress', 'Approved', 'Done'];
        if ($status && !in_array($status, $allowedStatuses)) {
            return response()->json([
                'message' => 'Status tidak valid. Gunakan salah satu dari: ' . implode(', ', $allowedStatuses)
            ], 422);
        }

        $tasks = Task::with('employees')
            ->whereMonth('created_at', $monthNumber)
            ->whereYear('created_at', $yearNumber)
            ->when($status, fn($q) => $q->where('status', ucfirst(strtolower($status))))
            ->get();


        return response()->json([
            'month' => $month,
            'count' => $tasks->count(),
            'data' => $tasks
        ]);
    }

}
