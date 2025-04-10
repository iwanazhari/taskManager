export interface EmployeePivot {
  task_id: number;
  employee_id: number;
  hours_worked: number;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: EmployeePivot;
}

export interface Task {
  id: number;
  description: string;
  status: string;
  hourly_rate: string;
  additional_fee: string;
  created_at: string;
  updated_at: string;
  employees: Employee[];
}

export interface RemunerationDetail {
  employee_id: number;
  employee_name: string;
  hours_worked: number;
  remuneration: number;
}

export interface RemunerationData {
  total_hours: number;
  total_payment: number;
  details: RemunerationDetail[];
}

export interface EmployeeOption {
  id: number;
  name: string;
}

export interface Assignment {
  employee_id: number;
  hours_worked: number;
  note: string;
}

export interface CreateForm {
  description: string;
  hourly_rate: string;
  additional_fee: string;
  assignments: Assignment[];
}
