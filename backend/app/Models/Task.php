<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'description',
        'hourly_rate',
        'additional_fee',
        'status',
    ];

    /**
     * Get the employees assigned to this task.
     */
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'task_assignments')
            ->withPivot('hours_worked', 'note')
            ->withTimestamps(); // penting jika pivot ada created_at dan updated_at
    }





}


