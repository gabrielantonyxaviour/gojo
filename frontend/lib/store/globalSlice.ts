import { StateCreator } from "zustand";

interface GlobalState {
  openProjectsBar: boolean;
  conversation: any;
  balance: string;
}

interface GlobalActions {
  setOpenProjectsBar: (value: boolean) => void;
  setBalance: (value: string) => void;
  setConversation: (value: any) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  openProjectsBar: false,
  balance: "0",
  conversation: null,
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
  setConversation: (value) =>
    set((state) => ({ ...state, conversation: value })),
});
