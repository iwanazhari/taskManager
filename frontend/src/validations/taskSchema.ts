// validations/taskSchema.ts
import { z } from "zod";

export const taskFormSchema = z.object({
  description: z.string().min(1, "Deskripsi wajib diisi"),
  hourly_rate: z.string().min(1, "Rate wajib diisi"),
  additional_fee: z.string().min(1, "Biaya tambahan wajib diisi"),
});
