import { RegisterForm } from "@/components/forms/RegisterForm";

const highlights = [
  {
    title: "Onboarding en minutos",
    copy: "Crea tu cuenta, invita a tu equipo y comienza a cargar estudiantes sin pasos confusos.",
  },
  {
    title: "Alertas proactivas",
    copy: "Recibe avisos instantáneos cuando haya cambios importantes o tareas pendientes.",
  },
  {
    title: "Siempre listo",
    copy: "Todo queda preparado para trabajar desde casa, la oficina o donde lo necesites.",
  },
];

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-stretch">
        <div className="flex-1 space-y-8 rounded-3xl border border-[--border] bg-white/80 p-8 shadow-lg shadow-slate-100 backdrop-blur">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Nuevo lanzamiento
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Lanza experiencias educativas memorables con Studentfy.
          </h1>
          <p className="text-lg text-slate-600">
            Sin configuraciones raras ni lenguaje complicado. Administra estudiantes, clases y
            reportes con una pantalla clara y amigable.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-[--border] p-4">
                <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{highlight.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <RegisterForm />
      </div>
    </section>
  );
}
