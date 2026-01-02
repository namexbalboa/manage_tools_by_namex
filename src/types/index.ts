export interface User {
  id: string
  nickname: string
  avatar: AvatarCustomization
  createdAt: number
}

export interface AvatarCustomization {
  head: string
  body: string
}

export interface Room {
  id: string
  type: 'scrum-poker' | 'rice' | 'eisenhower' | 'gut'
  createdBy: string
  createdAt: number
  expiresAt: number
  participants: Record<string, Participant>
  status: 'active' | 'completed' | 'expired'
}

export type UserRole = 'facilitator' | 'voter' | 'observer'
export type DeckType = 'fibonacci' | 'tshirt' | 'linear'

export interface Participant {
  userId: string
  nickname: string
  avatar: AvatarCustomization
  role?: UserRole
  joinedAt: number
}

export interface Story {
  id: string
  title: string
  description: string
  estimatedValue: string | null
  createdAt: number
}

export interface Timer {
  active: boolean
  duration: number
  startedAt: number | null
}

export interface Reaction {
  emoji: string
  timestamp: number
}

export interface ScrumPokerRoom extends Room {
  type: 'scrum-poker'
  deck?: DeckType
  currentStory: string
  currentStoryId?: string | null
  stories?: Record<string, Story>
  timer?: Timer
  reactions?: Record<string, Reaction>
  votes: Record<string, string>
  revealed: boolean
}

export interface PrioritizationItem {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: number
}

export interface RiceItem extends PrioritizationItem {
  reach: number
  impact: number
  confidence: number
  effort: number
  score?: number
}

export interface EisenhowerItem extends PrioritizationItem {
  urgency: 'high' | 'low'
  importance: 'high' | 'low'
  quadrant: 1 | 2 | 3 | 4
}

export interface GutItem extends PrioritizationItem {
  gravity: number
  urgency: number
  tendency: number
  score?: number
}
