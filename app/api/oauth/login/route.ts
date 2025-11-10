import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

import { DEFAULT_ERROR_MESSAGE, REMOTE_API_BASE_URL } from "@/lib/constants";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const oauthClient = googleClientId ? new OAuth2Client(googleClientId) : null;
const passwordSalt = process.env.GOOGLE_PASSWORD_SALT ?? "studentfy-google";

async function callAuth(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; payload: unknown }> {
  const response = await fetch(`${REMOTE_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => ({}));

  return { ok: response.ok, status: response.status, payload };
}

async function loginWithApi(email: string, password: string) {
  return callAuth("/api/Auth/login", {
    usernameOrEmail: email,
    password,
  });
}

async function registerWithApi(username: string, email: string, password: string) {
  return callAuth("/api/Auth/register", {
    username,
    email,
    password,
  });
}

export async function POST(request: NextRequest) {
  if (!oauthClient || !googleClientId) {
    return NextResponse.json(
      { message: "Google OAuth no está configurado." },
      { status: 500 },
    );
  }

  try {
    const { credential } = (await request.json()) as { credential?: string };

    if (!credential) {
      return NextResponse.json(
        { message: "No recibimos la respuesta de Google. Intenta nuevamente." },
        { status: 400 },
      );
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub) {
      return NextResponse.json(
        { message: "Tu cuenta de Google no tiene un correo válido." },
        { status: 400 },
      );
    }

    const password = `${payload.sub}.${passwordSalt}`;
    const baseUsername = payload.name?.replace(/\s+/g, "") || payload.email.split("@")[0];

    // Intentar login directo
    let loginResult = await loginWithApi(payload.email, password);
    if (loginResult.ok) {
      return NextResponse.json(loginResult.payload);
    }

    // Si no existe, intentamos registrarlo
    if (loginResult.status === 401 || loginResult.status === 404) {
      let attempts = 0;
      let registered = false;

      while (attempts < 3 && !registered) {
        const username =
          attempts === 0 ? baseUsername : `${baseUsername}${Math.floor(Math.random() * 9999)}`;

        const registerResult = await registerWithApi(username, payload.email, password);

        if (registerResult.ok || registerResult.status === 201) {
          registered = true;
          break;
        }

        if (registerResult.status !== 409) {
          return NextResponse.json(
            {
              message:
                registerResult.payload?.title ||
                registerResult.payload?.detail ||
                DEFAULT_ERROR_MESSAGE,
            },
            { status: registerResult.status },
          );
        }

        attempts += 1;
      }

      loginResult = await loginWithApi(payload.email, password);
      if (loginResult.ok) {
        return NextResponse.json(loginResult.payload);
      }
    }

    return NextResponse.json(
      {
        message:
          loginResult.payload?.detail || loginResult.payload?.title || DEFAULT_ERROR_MESSAGE,
      },
      { status: loginResult.status },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE;
    return NextResponse.json({ message }, { status: 500 });
  }
}
