import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/api";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  setAuth: (user: any, token: string | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, token) => set({ user, accessToken: token }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: async () => {
        try {
          // 1. Clear the HttpOnly cookie on the Render Backend
          await api.post("/auth/logout");

          // 2. Clear the "Bridge" cookie on the Vercel Domain
          // This calls your local Next.js proxy DELETE handler
          await fetch("/api/auth/proxy", { method: "DELETE" });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          // 3. Reset local Zustand state
          set({ user: null, accessToken: null });

          // 4. Force a hard redirect to Login
          // This ensures all middleware and states are reset
          window.location.href = "/login";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
