'use client';

import { FormEvent, useMemo, useState } from "react";

import { Student, StudentPayload } from "@/lib/types";

type StudentFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Student | null;
  isSubmitting?: boolean;
  onSubmit: (payload: StudentPayload) => Promise<void> | void;
  onCancel?: () => void;
};

const template: StudentPayload = {
  firstName: "",
  lastName: "",
  birthDate: "",
};

function normalizeDate(date?: string | null) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}

export function StudentForm({
  mode = "create",
  defaultValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentPayload>(() =>
    defaultValues
      ? {
          firstName: defaultValues.firstName ?? "",
          lastName: defaultValues.lastName ?? "",
          birthDate: normalizeDate(defaultValues.birthDate),
        }
      : template,
  );

  const title =
    mode === "edit" ? "Editar estudiante" : "Crea un estudiante en segundos";
  const description =
    mode === "edit"
      ? "Actualiza nombres o fecha de nacimiento. Guarda los cambios cuando termines."
      : "Registra estudiantes con la información mínima necesaria.";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  const isDisabled =
    !form.firstName.trim() || !form.lastName.trim() || !form.birthDate || isSubmitting;

  const actionLabel = useMemo(() => {
    if (isSubmitting && mode === "create") {
      return "Guardando...";
    }
    if (isSubmitting && mode === "edit") {
      return "Actualizando...";
    }

    return mode === "edit" ? "Guardar cambios" : "Crear estudiante";
  }, [mode, isSubmitting]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-[--border] bg-white p-6 shadow-sm"
    >
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Nombre</span>
          <input
            type="text"
            value={form.firstName}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                firstName: event.target.value,
              }))
            }
            placeholder="Daniela"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-slate-900 outline-none focus:border-[--primary]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Apellidos</span>
          <input
            type="text"
            value={form.lastName}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                lastName: event.target.value,
              }))
            }
            placeholder="Ramos Pérez"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-slate-900 outline-none focus:border-[--primary]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Fecha de nacimiento</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                birthDate: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-slate-900 outline-none focus:border-[--primary]"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[--border] px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isDisabled}
          className="rounded-xl bg-[--primary] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[--primary-dark] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLabel}
        </button>
      </div>
    </form>
  );
}
