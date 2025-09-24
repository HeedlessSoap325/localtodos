import {create} from "zustand";
import type {TodoSuper} from "./utils/types.ts";
import {persist} from "zustand/middleware";

interface UserState{
    username: string;
    passphrase: string | undefined;
    setUsername: (username: string) => void;
    setPassphrase: (passphrase: string) => void;
    clearUser: () => void;
}

interface TodoState{
    tree: TodoSuper[] | undefined;
    setTree: (newTree: TodoSuper[]) => void;
    clearTree: () => void;
    appendToTree: (item: TodoSuper) => void;
    deleteFromTree: (id: number) => void;
    updateInTree: (id: number, updates: Partial<TodoSuper>) => void;
}

export const useTodoStore = create<TodoState>()(
    persist((set) => (
        {
            tree: undefined,
            setTree: (newTree: TodoSuper[]) => set({ tree: newTree }),
            clearTree: () => set({ tree: undefined }),
            appendToTree: (item: TodoSuper) => {
                set((state) => ({
                    tree: [...(state.tree ?? []), item]
                }));
            },
            deleteFromTree: (id: number) => {
                set((state) => ({
                    tree: (state.tree ?? []).filter((item) => item.id !== id),
                }));
            },

            updateInTree: (id: number, updates: Partial<TodoSuper>) => {
                set((state) => ({
                    tree: (state.tree ?? []).map((item) =>
                        item.id === id ? {...item, ...updates} : item
                    ),
                }));
            }
        }),
        {
            name: "tree-storage",
            partialize: (state: TodoState) => ({tree: state.tree}),
        })
);

export const useUserStore = create<UserState>()(
    persist((set) => (
        {
            username: "",
            passphrase: undefined,
            setUsername: (username: string) => set({username: username}),
            setPassphrase: (passphrase: string) => set({passphrase: passphrase}),
            clearUser: () => set({ username: "" , passphrase: undefined})
        }),
        {
            name: "user-storage",
            partialize: (state: UserState) => ({username: state.username, passphrase: state.passphrase}),
        })
);