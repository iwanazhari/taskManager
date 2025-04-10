<?php

namespace App\Services;

use App\Models\Task;

class RemunerationService
{
    public function calculate(Task $task): array
    {
        $totalHours = $task->employees->sum(fn($e) => $e->pivot->hours_worked);
        $basePay = $totalHours * $task->hourly_rate;
        $totalPay = $basePay + $task->additional_fee;


        return [
            'total_hours' => $totalHours,
            'total_payment' => round($totalPay, 2),
            'details' => $task->employees->map(function ($employee) use ($totalHours, $totalPay) {
                $share = $employee->pivot->hours_worked / $totalHours;
                return [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'hours_worked' => $employee->pivot->hours_worked,
                    'remuneration' => round($totalPay * $share, 2),
                ];
            })->toArray()
        ]; // ✅ fix: convert Collection to array
    }
}
