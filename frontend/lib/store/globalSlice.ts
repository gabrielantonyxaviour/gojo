import { StateCreator } from "zustand";

interface GlobalState {
  openProjectsBar: boolean;
  balance: string;
}

interface GlobalActions {
  setOpenProjectsBar: (value: boolean) => void;
  setBalance: (value: string) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  openProjectsBar: false,
  balance: "0",
};

export const createGlobalSlice: StateCreator<
  GlobalSlice,
  [],
  [],
  GlobalSlice
> = (set) => ({
  ...initialGlobalState,
  setOpenProjectsBar: (value) =>
    set((state) => ({ ...state, openProjectsBar: value })),
  setBalance: (value) => set((state) => ({ ...state, balance: value })),
});
