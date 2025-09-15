// stores/authStore.ts
import { create } from "zustand";

type Credentials = {
  phone: string;   // 10-digit India number
  aadhaar: string; // 12-digit
};

interface AuthState {
  credentials: Credentials;
  isAuthenticated: boolean;
  updateCredentials: (partial: Partial<Credentials>) => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  credentials: { phone: "", aadhaar: "" },
  isAuthenticated: false,

  updateCredentials: (partial) =>
    set((state) => ({
      credentials: { ...state.credentials, ...partial },
    })),


  login: () => set({ isAuthenticated: true }),

  logout: () =>
    set({
      isAuthenticated: false,
      credentials: { phone: "", aadhaar: "" },
    }),
}));
