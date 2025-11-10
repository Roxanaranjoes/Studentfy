'use client';

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/contexts/auth-context";

type AppProvidersProps = {
  children: React.ReactNode;
};

const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";

export function AppProviders({ children }: AppProvidersProps) {
  const content = (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss={false}
        closeOnClick
        draggable
        theme="colored"
      />
    </>
  );

  return (
    <AuthProvider>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>
      ) : (
        content
      )}
    </AuthProvider>
  );
}
