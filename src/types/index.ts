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
  participants: Participant[]
  status: 'active' | 'completed' | 'expired'
}

export interface Participant {
  userId: string
  nickname: string
  avatar: AvatarCustomization
  joinedAt: number
}

export interface ScrumPokerRoom extends Room {
  type: 'scrum-poker'
  currentStory: string
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
