import { mockRequest } from "@/lib/api/client";
import { mockUsers } from "@/lib/mocks/users";
import type { User, UserRole } from "@/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

const PASSWORD_TO_ROLE: Record<string, UserRole> = {
  cevaroli: "admin",
  admin: "admin",
  marketing: "marketing",
  comercial: "commercial",
  commercial: "commercial",
  comprador: "buyer",
  buyer: "buyer",
  designer: "designer",
  diretoria: "board",
  board: "board",
  auditoria: "audit",
};

export const authService = {
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error("Informe email e senha.");
    }
    const role = PASSWORD_TO_ROLE[password.toLowerCase()] ?? "buyer";
    const user =
      mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
      mockUsers.find((u) => u.role === role) ??
      mockUsers[0];

    const session: LoginResponse = {
      token: `mock-token-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-${user.id}`,
      user: { ...user, role, lastAccess: new Date().toISOString() },
    };
    return mockRequest(session, 450);
  },
  async logout(): Promise<void> {
    return mockRequest(undefined, 120);
  },
};
