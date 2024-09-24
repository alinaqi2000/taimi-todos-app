import { create } from 'zustand'
import { User } from './models/User'

export const userStore = create<{
    user: User | null,
    setUser: (newUser: User | null) => void
}>((set) => ({
    user: null,
    setUser: (newUser: User | null) => set({ user: newUser })
}))
