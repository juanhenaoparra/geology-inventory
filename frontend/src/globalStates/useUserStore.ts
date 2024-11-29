import { create } from 'zustand'
import { User } from '@/models/business/user.model'
import { StorageService } from '@/services/StorageService'

interface UserState {
    user: User
    setUser: (user: User) => void
    clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
    user: StorageService.getUser() || {} as User,
    setUser: (user) => {
        StorageService.setUser(user)
        set({ user })
    },
    clearUser: () => {
        StorageService.clearUser()
        set({ user: {} as User })
    },
}))
