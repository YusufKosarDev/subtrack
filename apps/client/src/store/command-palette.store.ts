import { create } from "zustand";

interface CommandPaletteState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  addSubscriptionOpen: boolean;
  setAddSubscriptionOpen: (open: boolean) => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
  addSubscriptionOpen: false,
  setAddSubscriptionOpen: (open) => set({ addSubscriptionOpen: open }),
}));
