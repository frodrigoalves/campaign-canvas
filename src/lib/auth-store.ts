import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, token: null, expiresAt: null, isAuthenticated: false }),
    }),
    {
      name: "cevaroli.auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (noopStorage as unknown as Storage),
      ),
      onRehydrateStorage: () => (state) => {
        const stored = state.getState();
        if (stored.expiresAt && Date.now() > stored.expiresAt) {
          stored.logout();
        }
      },
    },
  ),
);
