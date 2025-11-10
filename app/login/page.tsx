import Link from "next/link";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/forms/LoginForm";

const highlights = [
  {
    title: "Sesiones seguras",
    copy: "Tus credenciales y registros se encriptan y se guardan solo cuando tú lo decides.",
  },
  {
    title: "Acceso inmediato",
    copy: "Continúa listo donde lo dejaste: listas de alumnos, notas y recordatorios.",
  },
  {
    title: "Acompañamiento real",
    copy: "Pensado para familias y coordinaciones que necesitan respuestas claras.",
  },
];

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#e9efff] via-white to-slate-100 py-16">
      <div className="mx-auto w-full max-w-5xl rounded-[40px] border border-white/60 bg-white/90 shadow-[0_40px_140px_rgba(15,23,42,0.15)] backdrop-blur">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 space-y-6 border-b border-white/60 px-10 py-12 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-[--primary]">
              Bienvenido de nuevo
            </p>
            <h1 className="text-4xl font-semibold text-slate-900">Inicia sesión</h1>
            <p className="text-lg text-slate-600">
              Guarda tus alumnos, actualiza datos y vuelve cuando quieras. Todo se mantiene seguro
              en tu cuenta de Studentfy.
            </p>
            <div className="rounded-2xl border border-[--border] bg-slate-50/80 p-4 text-sm text-slate-600">
              “Desde que usamos Studentfy, informes y reuniones fluyen sin estrés.” – Coordinación,
              2025
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[--border] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.copy}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              ¿Aún no tienes usuario?{" "}
              <Link href="/register" className="font-semibold text-[--primary]">
                Crea uno aquí
              </Link>
            </p>
          </div>

          <div className="w-full max-w-md space-y-6 rounded-[40px] border-white/60 bg-white/95 px-8 py-10">
            <LoginForm />
            <GoogleSignInButton />
            <p className="text-center text-xs text-slate-400">
              Al continuar aceptas nuestro uso de datos para notificarte sobre tu cuenta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
