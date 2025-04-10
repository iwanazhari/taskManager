<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'note'
    ];

    /**
     * Get the tasks assigned to the employee.
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignments')
            ->withPivot('hours_worked', 'note')
            ->withTimestamps();
    }


}
