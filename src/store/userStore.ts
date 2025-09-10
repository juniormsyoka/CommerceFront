import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResult } from "../types/auth";
import { User } from "../types/types";

interface UserState {
  token: string | null;
  userId: string | null;
  user: User | null; 
  setUser: (auth: AuthResult, userInfo?: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      user: null,
      setUser: (auth, userInfo) =>
        set({
          token: auth.token || null,
          userId: auth.userId || null,
          user: userInfo || null,
        }),
      clearUser: () => set({ token: null, userId: null, user: null }),
    }),
    {
      name: "user-storage", // 🔑 key in localStorage
    }
  )
);
