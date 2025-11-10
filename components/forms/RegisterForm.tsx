'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

const initialState = {
  username: "",
  email: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      await register(form);
      toast.success("Cuenta creada con exito");
      toast.info("Te enviamos un correo de bienvenida con proximos pasos.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    !form.username.trim() || !form.email.trim() || form.password.length < 4 || isSubmitting;

  return (
    <div className="w-full max-w-md rounded-2xl border border-[--border] bg-white p-8 shadow-xl shadow-slate-100">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Studentfy
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Crea tu cuenta</h1>
        <p className="text-slate-500">
          Gestiona estudiantes, clases y reportes en un panel seguro y profesional.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[--primary]"
            value={form.username}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[--primary]"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                email: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={4}
            required
            autoComplete="new-password"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[--primary]"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-xl bg-[--primary] py-3 text-base font-semibold text-white transition hover:bg-[--primary-dark] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Confirmando..." : "Confirmar registro"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Ya tienes un usuario?{" "}
        <Link className="font-semibold text-[--primary]" href="/login">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
