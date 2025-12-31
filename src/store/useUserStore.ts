import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AvatarCustomization } from '../types'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  updateAvatar: (avatar: AvatarCustomization) => void
  clearUser: () => void
  isAuthenticated: boolean
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      updateAvatar: (avatar) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatar } : null,
        })),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'scrum-user-storage',
    }
  )
)
