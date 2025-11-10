'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { StudentTable } from "@/components/dashboard/StudentTable";
import { StudentForm } from "@/components/forms/StudentForm";
import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
import { studentsApi } from "@/lib/api";
import { Student, StudentPayload } from "@/lib/types";

export default function DashboardPage() {
  const { user, token, logout, isReady } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [createFormVersion, setCreateFormVersion] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadStudents = useCallback(async () => {
    if (!token) {
      return;
    }
    setIsFetching(true);
    try {
      const data = await studentsApi.list(token);
      setStudents(data);
      setLastSync(new Date());
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isReady || !token) {
      return;
    }

    loadStudents();
  }, [isReady, token, loadStudents]);

  const handleCreate = async (payload: StudentPayload) => {
    if (!token) {
      toast.error("Tu acceso venció. Ingresa nuevamente para continuar.");
      return;
    }

    setIsCreating(true);
    try {
      await studentsApi.create(payload, token);
      toast.success("Estudiante creado correctamente.");
      setCreateFormVersion((prev) => prev + 1);
      await loadStudents();
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (payload: StudentPayload) => {
    if (!token || !editingStudent) {
      return;
    }

    setIsUpdating(true);
    try {
      await studentsApi.update(editingStudent.id, payload, token);
      toast.success("Cambios guardados.");
      setEditingStudent(null);
      await loadStudents();
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (student: Student) => {
    if (!token) {
      toast.error("Tu acceso venció. Ingresa nuevamente para continuar.");
      return;
    }

    const shouldDelete = window.confirm(
      `¿Seguro que deseas eliminar a ${student.firstName} ${student.lastName}?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(student.id);
    try {
      await studentsApi.remove(student.id, token);
      toast.success("Estudiante eliminado.");
      await loadStudents();
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-6 rounded-3xl border border-[--border] bg-white p-8 shadow-sm shadow-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {greeting}, {user?.username ?? "equipo"} 👋
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Panel de estudiantes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Última actualización:{" "}
              {lastSync
                ? lastSync.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })
                : "pendiente"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[--border] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Perfil: {user?.role ?? "equipo"}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-[--border] px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[--border] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Total estudiantes
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{students.length}</p>
              </div>
              <div className="rounded-2xl border border-[--border] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Cambios hoy
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {isUpdating || isCreating || deletingId ? "1" : "0"}
                </p>
              </div>
              <div className="rounded-2xl border border-[--border] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Estado del servicio
                </p>
                <p className="mt-2 text-sm font-semibold text-green-600">Activo</p>
              </div>
            </div>

            <StudentTable
              students={students}
              isLoading={isFetching}
              deletingId={deletingId}
              onEdit={(student) => setEditingStudent(student)}
              onDelete={handleDelete}
            />

            {editingStudent && (
              <StudentForm
                key={editingStudent.id}
                mode="edit"
                defaultValues={editingStudent}
                isSubmitting={isUpdating}
                onSubmit={handleUpdate}
                onCancel={() => setEditingStudent(null)}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[--border] bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Buenas prácticas</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Revisa la lista antes de cada entrega o reunión.</li>
                <li>• Comparte el panel solo con quienes acompañan a las familias.</li>
                <li>• Elimina registros antiguos para mantener la vista despejada.</li>
              </ul>
            </div>

            <StudentForm
              key={createFormVersion}
              mode="create"
              isSubmitting={isCreating}
              onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
