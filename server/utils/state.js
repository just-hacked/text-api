import { create } from 'zustand'

export const useStore = create((set) => ({
    clientId: null,
    setClientId: (data) => set({ clientId: data }),

    data: [],
    setData: (data) => set({ data: data }),
}))