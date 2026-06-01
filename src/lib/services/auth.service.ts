import type { User } from "@/types/user.types";
import { mockUsers } from "@/lib/mocks/users";
import { mockRequest } from "@/lib/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

const PASSWORD_ROLE_MAP: Record<string, User["role"]> = {
  cevaroli: "admin",
  comprador: "buyer",
  marketing: "marketing",
  designer: "designer",
};

const API_BASE = import.meta.env.VITE_API_URL;

function createToken(user: User) {
  return btoa(`${user.id}:${user.email}:${Date.now()}`);
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    throw new Error("Não foi possível conectar ao servidor de autenticação.");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      (body as Record<string, unknown>)?.error ||
      response.statusText ||
      "Erro ao processar a requisição.";
    throw new Error(errorMessage);
  }

  return body as T;
}

export const authService = {
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error("Informe email e senha.");
    }

    const normalizedPassword = password.trim().toLowerCase();
    const role = PASSWORD_ROLE_MAP[normalizedPassword];

    if (role) {
      const user = mockUsers.find((item) => item.role === role) ?? mockUsers[0];
      return mockRequest({ token: createToken(user), user }, 300);
    }

    if (API_BASE) {
      return fetchJson<LoginResponse>(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    }

    throw new Error(
      "Senha inválida. Use cevaroli, comprador, marketing ou designer, ou configure VITE_API_URL para um backend válido.",
    );
  },

  async logout(): Promise<void> {
    return Promise.resolve();
  },
};
