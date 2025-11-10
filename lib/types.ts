export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  username?: string | null;
  role?: string | null;
  expiresAtUtc?: string | null;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
};

export type StudentPayload = {
  firstName: string;
  lastName: string;
  birthDate: string;
};
