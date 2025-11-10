import Link from "next/link";

const metrics = [
  { label: "Equipos felices", value: "150+" },
  { label: "Minutos para comenzar", value: "5" },
  { label: "Satisfacción promedio", value: "98%" },
];

const steps = [
  {
    title: "1. Regístrate",
    description: "Abre tu cuenta en pocos pasos y recibe la bienvenida automáticamente.",
  },
  {
    title: "2. Invita a tu equipo",
    description: "Comparte accesos con coordinadores y docentes para mantenerlos sincronizados.",
  },
  {
    title: "3. Organiza estudiantes",
    description: "Carga, edita o elimina perfiles desde un panel claro y pensado para el día a día.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-24 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-[--border] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Edtech ready
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Gestiona estudiantes, tareas y recordatorios sin hojas de cálculo eternas.
          </h1>
          <p className="text-lg text-slate-600">
            Studentfy reúne toda la información importante en un solo lugar para que tu equipo
            atienda familias, clases y actividades con calma.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-[--primary] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[--primary-dark]"
            >
              Explorar dashboard
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full border border-[--border] px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Crear cuenta gratuita
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-[--border] bg-white p-4">
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="text-sm text-slate-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-[32px] border border-[--border] bg-white/80 p-8 shadow-2xl shadow-slate-200 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Flujo principal
          </p>
          <div className="mt-8 space-y-6">
            {steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-[--border] bg-slate-50/60 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-dashed border-[--border] bg-white/40 p-5 text-sm text-slate-500">
            Todo queda listo para que informes avances, compartas listas actualizadas y mantengas a
            las familias al tanto sin dolores de cabeza.
          </div>
        </div>
      </section>
    </main>
  );
}
