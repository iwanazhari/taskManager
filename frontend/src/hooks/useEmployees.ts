import { useEffect, useState } from "react";

export interface EmployeeOption {
  id: number;
  name: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees`
      );
      const json = await res.json();
      if (Array.isArray(json)) setEmployees(json);
      else console.error("Invalid employee data format:", json);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading };
}
