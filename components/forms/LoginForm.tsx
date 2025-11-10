'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentials.usernameOrEmail.trim() || credentials.password.length < 4) {
      setFormError("Completa usuario y contraseña (mínimo 4 caracteres).");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await login(credentials);
      toast.success("Bienvenido de nuevo");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    !credentials.usernameOrEmail.trim() || credentials.password.length < 4 || isSubmitting;

  return (
    <div className="w-full max-w-md rounded-2xl border border-[--border] bg-white p-8 shadow-xl shadow-slate-100">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Studentfy
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Inicia sesión</h1>
        <p className="text-slate-500">
          Accede al panel para administrar estudiantes con unos pocos clics.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="usernameOrEmail">
            Usuario o correo
          </label>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[--primary]"
            value={credentials.usernameOrEmail}
            onChange={(event) =>
              setCredentials((prev) => ({ ...prev, usernameOrEmail: event.target.value }))
            }
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-600 flex items-center justify-between"
            htmlFor="password"
          >
            <span>Contraseña</span>
            <button
              type="button"
              className="text-xs font-semibold text-[--primary]"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={4}
            autoComplete="current-password"
            className="w-full rounded-xl border border-[--border] px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[--primary]"
            value={credentials.password}
            onChange={(event) =>
              setCredentials((prev) => ({ ...prev, password: event.target.value }))
            }
          />
        </div>
        {formError && (
          <p className="text-sm text-red-500" role="alert">
            {formError}
          </p>
        )}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-xl bg-[--primary] py-3 text-base font-semibold text-white transition hover:bg-[--primary-dark] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Confirmando..." : "Confirmar inicio de sesión"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Aún no tienes cuenta?{" "}
        <Link className="font-semibold text-[--primary]" href="/register">
          Crea una gratis
        </Link>
      </p>
    </div>
  );
}
