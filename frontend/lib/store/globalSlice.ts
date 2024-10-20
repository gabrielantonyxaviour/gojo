import { StateCreator } from "zustand";

interface GlobalState {
  openProjectsBar: boolean;
  conversation: any;
  balance: string;
  prompt: string;
  conversations: any[];
}

interface GlobalActions {
  setOpenProjectsBar: (value: boolean) => void;
  setBalance: (value: string) => void;
  setConversation: (value: any) => void;
  setPrompt: (value: string) => void;
  setConversations: (value: any[]) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  openProjectsBar: false,
  balance: "0",
  conversation: null,
  prompt: "",
  conversations: [],
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
  setPrompt: (value) => set((state) => ({ ...state, prompt: value })),
  setConversations: (value) =>
    set((state) => ({ ...state, conversations: value })),
});
