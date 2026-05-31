export type UserRole =
  | "admin"
  | "marketing"
  | "commercial"
  | "buyer"
  | "designer"
  | "board"
  | "audit";

export type UserStatus = "active" | "inactive" | "pending" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  storeId: string | null;
  allowedStores: string[];
  allowedClusters: string[];
  allowedCategories: string[];
  lastAccess: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
