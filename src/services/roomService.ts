import { ref, set, onValue, off, update, remove } from 'firebase/database'
import { rtdb } from './firebase'
import type { Room, ScrumPokerRoom, UserRole, Story, Reaction } from '../types'

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

// New functions for enhanced Planning Poker

export const setUserRole = async (
  roomId: string,
  userId: string,
  role: UserRole
) => {
  await update(ref(rtdb, `rooms/${roomId}/participants/${userId}`), { role })
}

export const addStory = async (roomId: string, story: Story) => {
  await set(ref(rtdb, `rooms/${roomId}/stories/${story.id}`), story)
}

export const setCurrentStory = async (roomId: string, storyId: string | null) => {
  await update(ref(rtdb, `rooms/${roomId}`), {
    currentStoryId: storyId,
    votes: {},
    revealed: false,
  })
}

export const startTimer = async (roomId: string, duration: number) => {
  await update(ref(rtdb, `rooms/${roomId}/timer`), {
    active: true,
    duration,
    startedAt: Date.now(),
  })
}

export const stopTimer = async (roomId: string) => {
  await update(ref(rtdb, `rooms/${roomId}/timer`), {
    active: false,
    startedAt: null,
  })
}

export const addReaction = async (
  roomId: string,
  userId: string,
  emoji: string
) => {
  const reaction: Reaction = {
    emoji,
    timestamp: Date.now(),
  }
  await set(ref(rtdb, `rooms/${roomId}/reactions/${userId}`), reaction)

  // Auto-remove reaction after 3 seconds
  setTimeout(async () => {
    await remove(ref(rtdb, `rooms/${roomId}/reactions/${userId}`))
  }, 3000)
}

export const acceptEstimate = async (
  roomId: string,
  storyId: string,
  value: string
) => {
  await update(ref(rtdb, `rooms/${roomId}/stories/${storyId}`), {
    estimatedValue: value,
  })
}

export const deleteStory = async (roomId: string, storyId: string) => {
  await remove(ref(rtdb, `rooms/${roomId}/stories/${storyId}`))
}
