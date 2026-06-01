import { mockRequest } from "@/lib/api/client";
import { mockUsers } from "@/lib/mocks/users";
import type { PaginatedResponse } from "@/types/api.types";
import type { User, UserRole, UserStatus } from "@/types/user.types";

export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: UserStatus;
  storeId?: string | null;
  allowedStores?: string[];
  allowedClusters?: string[];
  allowedCategories?: string[];
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  storeId?: string | null;
  allowedStores?: string[];
  allowedClusters?: string[];
  allowedCategories?: string[];
}

const auditEvents: Array<{ id: string; userId: string; action: string; description: string; createdAt: string }> = [
  {
    id: "audit-1",
    userId: "u-1",
    action: "login",
    description: "Acesso realizado com sucesso.",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "audit-2",
    userId: "u-3",
    action: "user.update",
    description: "Atualizou perfil de usuário.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "audit-3",
    userId: "u-5",
    action: "slot.assign",
    description: "Slot atribuído a comprador.",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

export const usersService = {
  async listUsers(params: UserListParams = {}): Promise<PaginatedResponse<User>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    let data = [...mockUsers];

    if (params.search) {
      const query = params.search.toLowerCase();
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.toLowerCase().includes(query),
      );
    }

    if (params.role) {
      data = data.filter((user) => user.role === params.role);
    }

    if (params.status) {
      data = data.filter((user) => user.status === params.status);
    }

    const total = data.length;
    const start = (page - 1) * pageSize;
    const pageItems = data.slice(start, start + pageSize);

    return mockRequest({
      data: pageItems,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  },

  async createUser(data: CreateUserData): Promise<User> {
    const user: User = {
      id: `u-${mockUsers.length + 1}`,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      role: data.role,
      status: data.status ?? "active",
      storeId: data.storeId ?? null,
      allowedStores: data.allowedStores ?? [],
      allowedClusters: data.allowedClusters ?? [],
      allowedCategories: data.allowedCategories ?? [],
      lastAccess: null,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(user);
    return mockRequest(user);
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado.");
    }
    const updated: User = {
      ...mockUsers[userIndex],
      ...data,
      email: data.email ? data.email.toLowerCase() : mockUsers[userIndex].email,
    };
    mockUsers[userIndex] = updated;
    return mockRequest(updated);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado.");
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], status };
    return mockRequest(mockUsers[userIndex]);
  },

  async listAuditLogs(params: { page?: number; pageSize?: number; userId?: string } = {}) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    let data = [...auditEvents];
    if (params.userId) {
      data = data.filter((event) => event.userId === params.userId);
    }
    const total = data.length;
    const start = (page - 1) * pageSize;
    const pageItems = data.slice(start, start + pageSize);
    return mockRequest({
      data: pageItems,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  },
};
