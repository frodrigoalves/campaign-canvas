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
  email: string; // sensitive
  phone: string; // sensitive
  role: UserRole;
  status: UserStatus;
  storeId: string | null;
  allowedStores: string[]; // sensitive
  allowedClusters: string[];
  allowedCategories: string[]; // sensitive
  lastAccess: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
