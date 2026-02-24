import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/api";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setAuth: (user: any, token: string | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
  setHasHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,

      setAuth: (user, token) => set({ user, accessToken: token }),
      setAccessToken: (token) => set({ accessToken: token }),
      setHasHydrated: () => set({ hasHydrated: true }),

      logout: async () => {
        try {
          await api.post("/auth/logout");

          await fetch("/api/auth/proxy", { method: "DELETE" });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({ user: null, accessToken: null });

          //window.location.href = "/login";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    },
  ),
);
