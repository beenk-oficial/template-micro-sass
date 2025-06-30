import { Company } from "@/types";
import { create } from "zustand";

export type WhitelabelColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export const useWhitelabelStore = create<{
  colors: WhitelabelColors;
  name: string;
  logo: string;
  favicon?: string;
  company: Company | null;
  marketing_banner: {
    login: string;
    signup: string;
    change_password: string;
    request_password_reset: string;
  };
  slug?: string;
  domain?: string;
  setSlug: (slug?: string) => void;
  setDomain: (domain: string) => void;
  setColors: (newColors: Partial<WhitelabelColors>) => void;
  setCompany: (company: Company) => void;
}>((set) => ({
  colors: null as unknown as WhitelabelColors,
  name: null as unknown as string,
  logo: null as unknown as string,
  favicon: undefined,
  company: null,
  marketing_banner: {
    login: null as unknown as string,
    signup: null as unknown as string,
    change_password: null as unknown as string,
    request_password_reset: null as unknown as string,
  },
  slug: undefined,
  domain: undefined,
  setColors: (newColors) =>
    set((state) => ({ colors: { ...state.colors, ...newColors } })),
  setCompany: (company: Company) => set({ company }),
  setSlug: (slug) => set({ slug }),
  setDomain: (domain: string) => set({ domain }),
}));
