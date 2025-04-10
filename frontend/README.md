# 📘 Dokumentasi Proyek Task Manager

## 🧱 Arsitektur Solusi

### Alur Data Backend ke Frontend

```
[Browser]
   ↓   Fetch API
[Next.js Frontend - page.tsx]
   ↓   Komponen Modular: TaskTable, Dialogs
[TanStack Table + UI Interaction]
   ↓   Trigger Fetch / Mutation
[API Handler]
   ↓   REST API
[Laravel Backend - routes/api.php → Controller]
   ↓   Eloquent ORM + DB Query
[MySQL Database]
```

**Penjelasan:**

- Pengguna mengakses aplikasi di browser
- Halaman utama memuat `TaskPage` yang mengambil data `task` & `employee` dari API
- Komponen seperti `TaskCreateDialog`, `TaskEditDialog`, dan tabel utama berinteraksi menggunakan props + TanStack Table
- Interaksi seperti update status atau delete task langsung memicu permintaan ke endpoint Laravel yang sudah dibuat modular di `api/tasks` dan `api/employees`
- Semua handler frontend dikumpulkan di `lib/tasks/handlers.ts` untuk keterpisahan logic

---

## 🎨 Penjelasan Desain

### Kenapa Pendekatan Ini?

- **Modular**: Komponen dialog dan logic dipisah untuk kemudahan testing dan maintainability
- **Reusable**: Handler seperti `handleCreateTask`, `handleDelete`, dsb digunakan lintas komponen
- **Efisien**: Update status, delete, hingga perhitungan remunerasi dilakukan dengan fetch langsung (tanpa refetch keseluruhan jika tidak perlu)

### Perhitungan Remunerasi

- Endpoint: `GET /api/tasks/{id}/remuneration`
- Logic perhitungan di-backend:
  ```php
  $total = $task->employees->sum(function ($emp) {
    return ($emp->pivot->hours_worked * $task->hourly_rate) + $task->additional_fee;
  });
  ```
- Nilai total dikembalikan sebagai response JSON dan ditampilkan di dialog `TaskRemunerationDialog`

---

## ⚙️ Setup & Deploy

### Persiapan Backend (Laravel)

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Persiapan Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

### Konfigurasi Environment

**.env.local (frontend):**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**.env (backend):**

```
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🧩 Tantangan & Solusi

### 1. **Masalah: Status Tidak Update Otomatis**

**Solusi:** Gunakan `setData(prev => ...)` untuk local update status, lalu `fetch()` update ke API. Jika gagal, rollback dengan `fetchTasks()`.

### 2. **Redundansi Logic di Komponen**

**Solusi:** Pindahkan semua logic seperti `handleEditSubmit`, `handleDelete` ke `lib/handlers.ts` agar bersih dan testable.

### 3. **Form Assignment Nested (employee_id, jam kerja, catatan)**

**Solusi:** Buat komponen terpisah `TaskFormAssignment` agar lebih modular dan bisa digunakan kembali.

### 4. **Validasi Form**

**Solusi (berjalan):** Implementasi `zod` untuk validasi schema-based, integrasi dengan `react-hook-form` direncanakan untuk skalabilitas.

### 5. **Initial Page Load Tidak Menampilkan Halaman Task**

**Solusi:** Pastikan `/app/page.tsx` merender ulang komponen `TaskPage` dari `/components/task/page.tsx`.

---

## ✅ Next Plan

- Integrasi Zod + react-hook-form untuk validasi
- Tambah fitur export (Excel/PDF)
- Unit Test dengan Vitest
- Auth dan role-based access (admin/karyawan)
