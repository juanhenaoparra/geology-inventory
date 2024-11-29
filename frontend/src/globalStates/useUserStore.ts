import { create } from 'zustand'
import { User } from '@/models/business/user.model'

interface UserState {
    user: User
    setUser: (user: User) => void
    clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
    user: {} as User,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: {} as User }),
}))
