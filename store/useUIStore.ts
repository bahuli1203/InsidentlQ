"use client";
import { create } from "zustand";

interface UIState {
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notifications: Notification[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notifications: [],
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...n, id: Math.random().toString(36).slice(2), timestamp: new Date() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
