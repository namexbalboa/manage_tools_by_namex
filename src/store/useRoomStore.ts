import { create } from 'zustand'
import type { Room } from '../types'

interface RoomStore {
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  updateRoom: (updates: Partial<Room>) => void
  clearRoom: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  updateRoom: (updates) =>
    set((state) => ({
      currentRoom: state.currentRoom
        ? { ...state.currentRoom, ...updates }
        : null,
    })),
  clearRoom: () => set({ currentRoom: null }),
}))
