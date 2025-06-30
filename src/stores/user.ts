import { CompanyUser } from "@/types";
import { create } from "zustand";

type UserStore = {
  user: CompanyUser | null;
  setUser: (user: CompanyUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
