import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      clear: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "cevaroli.auth" },
  ),
);
