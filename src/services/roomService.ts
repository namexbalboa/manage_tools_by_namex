import { ref, set, onValue, off, update, remove } from 'firebase/database'
import { rtdb } from './firebase'
import type { Room, ScrumPokerRoom } from '../types'

const ROOM_EXPIRY_TIME = 24 * 60 * 60 * 1000

export const createRoom = async (room: Omit<Room, 'id' | 'createdAt' | 'expiresAt'>): Promise<string> => {
  const roomId = Math.random().toString(36).substring(2, 15)
  const now = Date.now()
  
  const newRoom: Room = {
    ...room,
    id: roomId,
    createdAt: now,
    expiresAt: now + ROOM_EXPIRY_TIME,
  }

  await set(ref(rtdb, `rooms/${roomId}`), newRoom)
  return roomId
}

export const joinRoom = async (roomId: string, participant: any) => {
  const participantRef = ref(rtdb, `rooms/${roomId}/participants/${participant.userId}`)
  await set(participantRef, participant)
}

export const leaveRoom = async (roomId: string, userId: string) => {
  await remove(ref(rtdb, `rooms/${roomId}/participants/${userId}`))
}

export const subscribeToRoom = (roomId: string, callback: (room: Room | null) => void) => {
  const roomRef = ref(rtdb, `rooms/${roomId}`)
  
  onValue(roomRef, (snapshot) => {
    const data = snapshot.val()
    
    if (data && data.expiresAt > Date.now()) {
      callback(data)
    } else if (data && data.expiresAt <= Date.now()) {
      remove(roomRef)
      callback(null)
    } else {
      callback(null)
    }
  })
  
  return () => off(roomRef)
}

export const updateRoomData = async (roomId: string, updates: Partial<Room>) => {
  await update(ref(rtdb, `rooms/${roomId}`), updates)
}

export const updateScrumPokerVote = async (
  roomId: string,
  userId: string,
  vote: string
) => {
  await set(ref(rtdb, `rooms/${roomId}/votes/${userId}`), vote)
}

export const revealScrumPokerVotes = async (roomId: string) => {
  await update(ref(rtdb, `rooms/${roomId}`), { revealed: true })
}

export const resetScrumPoker = async (roomId: string) => {
  await update(ref(rtdb, `rooms/${roomId}`), {
    votes: {},
    revealed: false,
    currentStory: '',
  })
}
