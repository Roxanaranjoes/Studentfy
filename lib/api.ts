import { DEFAULT_ERROR_MESSAGE, getApiBaseUrl } from "@/lib/constants";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Student,
  StudentPayload,
} from "@/lib/types";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload =
    response.status === 204
      ? undefined
      : isJson
        ? await response.json().catch(() => undefined)
        : await response.text().catch(() => undefined);

  if (!response.ok) {
    const message =
      (typeof payload === "string" && payload) ||
      (typeof payload === "object" && payload !== null && "detail" in payload
        ? String(payload.detail)
        : undefined) ||
      DEFAULT_ERROR_MESSAGE;
    throw new Error(message);
  }

  return payload as T;
}

export const authApi = {
  login: (credentials: LoginRequest) =>
    request<LoginResponse>("/api/Auth/login", { method: "POST", body: credentials }),
  register: (data: RegisterRequest) =>
    request<void>("/api/Auth/register", { method: "POST", body: data }),
};

export const studentsApi = {
  list: (token: string | null) => request<Student[]>("/api/Students", { token }),
  create: (payload: StudentPayload, token: string | null) =>
    request<Student | undefined>("/api/Students", { method: "POST", body: payload, token }),
  update: (id: number, payload: StudentPayload, token: string | null) =>
    request<void>(`/api/Students/${id}`, { method: "PUT", body: payload, token }),
  remove: (id: number, token: string | null) =>
    request<void>(`/api/Students/${id}`, { method: "DELETE", token }),
};
