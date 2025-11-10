'use client';

import { Student } from "@/lib/types";

type StudentTableProps = {
  students: Student[];
  isLoading: boolean;
  deletingId?: number | null;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
};

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "Sin datos";
  }

  return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(parsed);
}

export function StudentTable({
  students,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[--border] bg-white p-8 text-center text-sm text-slate-500">
        Cargando estudiantes...
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[--border] bg-white/70 p-8 text-center text-sm text-slate-500">
        Aún no hay registros. Usa el formulario para crear el primero.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[--border] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[--border]">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Fecha de nacimiento
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[--border]">
          {students.map((student) => (
            <tr key={student.id} className="text-sm text-slate-600">
              <td className="px-6 py-4 font-medium text-slate-900">
                {student.firstName} {student.lastName}
              </td>
              <td className="px-6 py-4">{formatDate(student.birthDate)}</td>
              <td className="flex items-center justify-end gap-3 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onEdit(student)}
                  className="rounded-full border border-[--border] px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(student)}
                  disabled={deletingId === student.id}
                  className="rounded-full border border-red-100 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                >
                  {deletingId === student.id ? "Eliminando..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
