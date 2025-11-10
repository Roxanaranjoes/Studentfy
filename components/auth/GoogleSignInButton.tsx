'use client';

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export function GoogleSignInButton() {
  const router = useRouter();
  const { applySession } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div className="rounded-2xl border border-dashed border-[--border] bg-slate-50/70 p-4 text-center text-xs text-slate-500">
        Configura <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> para habilitar el acceso con Google.
      </div>
    );
  }

  const handleCredential = async (credential: string | undefined) => {
    if (!credential) {
      toast.error("No recibimos la respuesta de Google. Intenta nuevamente.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/oauth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          (errorPayload && typeof errorPayload.message === "string" && errorPayload.message) ||
          DEFAULT_ERROR_MESSAGE;
        toast.error(message);
        return;
      }

      const session = await response.json();
      applySession(session);
      toast.success("Sesión iniciada con Google.");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[--border] bg-slate-50/60 p-5">
      <div className="relative flex items-center justify-center">
        <span className="h-px w-full bg-slate-200" />
        <span className="absolute rounded-full bg-white px-2 text-xs font-semibold text-slate-400">
          o
        </span>
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          text="continue_with"
          onSuccess={(credentialResponse) => handleCredential(credentialResponse.credential)}
          onError={() => toast.error("No se pudo conectar con Google. Intenta de nuevo.")}
          theme="outline"
          shape="pill"
          width="320"
          logo_alignment="center"
        />
      </div>
      {isProcessing && (
        <p className="text-center text-xs text-slate-400">Confirmando acceso...</p>
      )}
    </div>
  );
}
