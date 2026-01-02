import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Eye, RefreshCw, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useUserStore } from '../store/useUserStore'
import { useRoomStore } from '../store/useRoomStore'
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  updateScrumPokerVote,
  revealScrumPokerVotes,
  resetScrumPoker,
  setUserRole,
  addStory,
  setCurrentStory,
  startTimer,
  stopTimer,
  addReaction,
  acceptEstimate,
  deleteStory,
} from '../services/roomService'
import { toast } from 'sonner'
import type { ScrumPokerRoom, Story, UserRole } from '../types'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

// Import new components
import { Timer } from '../components/poker/Timer'
import { StoryCard } from '../components/poker/StoryCard'
import { ParticipantsList } from '../components/poker/ParticipantsList'
import { BacklogPanel } from '../components/poker/BacklogPanel'
import { CardDeck } from '../components/poker/CardDeck'
import { PokerTable } from '../components/poker/PokerTable'
import { ReactionPicker } from '../components/poker/ReactionPicker'

export function ScrumPoker() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const roomIdFromUrl = searchParams.get('room')

  const { user } = useUserStore()
  const { currentRoom, setCurrentRoom } = useRoomStore()
  const [loading, setLoading] = useState(false)
  const [myVote, setMyVote] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const room = currentRoom as ScrumPokerRoom | null

  // Get current user's role
  const currentParticipant = room?.participants && user?.id
    ? room.participants[user.id]
    : undefined
  const userRole = currentParticipant?.role || selectedRole
  const isFacilitator = userRole === 'facilitator'
  const isVoter = userRole === 'voter'
  const isCreator = room?.createdBy === user?.id

  // Get current story
  const currentStory = room?.currentStoryId && room?.stories?.[room.currentStoryId]
    ? room.stories[room.currentStoryId]
    : null

  useEffect(() => {
    if (roomIdFromUrl && !currentRoom) {
      handleJoinRoom(roomIdFromUrl)
    }
  }, [roomIdFromUrl])

  useEffect(() => {
    if (!roomIdFromUrl) return

    const unsubscribe = subscribeToRoom(roomIdFromUrl, (updatedRoom) => {
      if (updatedRoom) {
        setCurrentRoom(updatedRoom)
      } else {
        toast.error(t('scrumPoker.roomExpired'))
        setCurrentRoom(null)
        setSearchParams({})
      }
    })

    return unsubscribe
  }, [roomIdFromUrl])

  // Auto-set facilitator role for creator
  useEffect(() => {
    if (room && user && isCreator && !currentParticipant?.role) {
      handleSelectRole('facilitator')
    }
  }, [room?.id, user?.id, isCreator, currentParticipant?.role])

  const handleCreateRoom = async () => {
    if (!user) return

    setLoading(true)
    try {
      const roomId = await createRoom({
        type: 'scrum-poker',
        createdBy: user.id,
        participants: {},
        status: 'active',
      })

      // Join the room with facilitator role
      await joinRoom(roomId, {
        userId: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        joinedAt: Date.now(),
        role: 'facilitator', // Creator is auto-facilitator
      })

      // Update URL - the useEffect will handle subscription
      setSearchParams({ room: roomId })
      toast.success(t('scrumPoker.roomCreated'))
    } catch (error) {
      toast.error(t('scrumPoker.createError'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (roomId: string) => {
    if (!user) return

    setLoading(true)
    try {
      await joinRoom(roomId, {
        userId: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        joinedAt: Date.now(),
      })
      toast.success(t('scrumPoker.joinedRoom'))
    } catch (error) {
      toast.error(t('scrumPoker.joinError'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRole = async (role: UserRole) => {
    if (!room || !user) return
    setSelectedRole(role)
    await setUserRole(room.id, user.id, role)
  }

  const handleAddStory = async (storyData: Omit<Story, 'id' | 'createdAt'>) => {
    if (!room) return

    const story: Story = {
      id: Math.random().toString(36).substring(2, 15),
      ...storyData,
      createdAt: Date.now(),
    }

    await addStory(room.id, story)
  }

  const handleSelectStory = async (storyId: string) => {
    if (!room) return
    setMyVote(null)
    await setCurrentStory(room.id, storyId)
  }

  const handleDeleteStory = async (storyId: string) => {
    if (!room) return
    await deleteStory(room.id, storyId)
  }

  const handleVote = async (value: string) => {
    if (!room || !user) return

    setMyVote(value)
    await updateScrumPokerVote(room.id, user.id, value)
  }

  const handleReveal = async () => {
    if (!room) return
    await revealScrumPokerVotes(room.id)
  }

  const handleReset = async () => {
    if (!room) return
    setMyVote(null)
    await resetScrumPoker(room.id)
  }

  const handleStartTimer = async (duration: number) => {
    if (!room) return
    await startTimer(room.id, duration)
  }

  const handleStopTimer = async () => {
    if (!room) return
    await stopTimer(room.id)
  }

  const handleReaction = async (emoji: string) => {
    if (!room || !user) return
    await addReaction(room.id, user.id, emoji)
  }

  const handleAcceptEstimate = async () => {
    if (!room || !currentStory) return

    const votes = Object.values(room.votes || {}).filter(
      (v) => v !== '?' && v !== '☕'
    )
    const uniqueVotes = new Set(votes)

    if (uniqueVotes.size === 1 && votes.length > 0) {
      // Consensus - use the agreed value
      await acceptEstimate(room.id, currentStory.id, votes[0])
      toast.success(t('scrumPoker.consensus'))
    } else if (votes.length > 0) {
      // No consensus - calculate average for numeric votes
      const numericVotes = votes.filter((v) => !isNaN(Number(v))).map(Number)
      if (numericVotes.length > 0) {
        const avg = (
          numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length
        ).toFixed(1)
        await acceptEstimate(room.id, currentStory.id, avg)
      }
    }
  }

  const copyRoomLink = () => {
    const link =
      window.location.origin + window.location.pathname + '?room=' + room?.id
    navigator.clipboard.writeText(link)
    toast.success(t('scrumPoker.linkCopied'))
  }

  // Role selection screen
  if (room && user && !userRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card-refined w-full max-w-md p-8 text-center">
          <h2 className="mb-6 text-2xl font-bold">{t('scrumPoker.selectRole')}</h2>
          <div className="space-y-3">
            <Button
              onClick={() => handleSelectRole('facilitator')}
              disabled={!isCreator}
              size="lg"
              variant={isCreator ? 'default' : 'outline'}
              className="w-full"
            >
              {t('scrumPoker.facilitator')}
              {isCreator && (
                <span className="ml-2 text-xs opacity-80">
                  ({t('scrumPoker.creator')})
                </span>
              )}
            </Button>
            <Button
              onClick={() => handleSelectRole('voter')}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {t('scrumPoker.voter')}
            </Button>
            <Button
              onClick={() => handleSelectRole('observer')}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {t('scrumPoker.observer')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Create room screen
  if (!room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card-refined w-full max-w-md p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gradient">
            {t('scrumPoker.title')}
          </h1>
          <p className="mb-6 text-muted-foreground">{t('scrumPoker.createNew')}</p>
          <Button
            onClick={handleCreateRoom}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {t('scrumPoker.createRoom')}
          </Button>
        </div>
      </div>
    )
  }

  // Main poker interface
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Sidebar - Backlog (Facilitator only) */}
      {isFacilitator && (
        <div className="card-refined w-80 overflow-hidden">
          <BacklogPanel
            stories={room.stories || {}}
            currentStoryId={room.currentStoryId || null}
            isFacilitator={isFacilitator}
            onAddStory={handleAddStory}
            onDeleteStory={handleDeleteStory}
            onSelectStory={handleSelectStory}
          />
        </div>
      )}

      {/* Center - Main poker area */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="card-refined flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">{t('scrumPoker.title')}</h1>
              <p className="text-xs text-muted-foreground">
                {t('scrumPoker.room')}: {room.id}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyRoomLink}>
              <Copy className="mr-2 h-3 w-3" />
              {t('scrumPoker.copyLink')}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <ReactionPicker onReact={handleReaction} />
            <Timer
              timer={room.timer}
              isFacilitator={isFacilitator}
              onStart={handleStartTimer}
              onStop={handleStopTimer}
            />
          </div>
        </div>

        {/* Current Story */}
        <StoryCard story={currentStory} />

        {/* Poker Table */}
        <div className="card-refined flex-1 overflow-auto">
          <PokerTable
            participants={room.participants || {}}
            votes={room.votes || {}}
            revealed={room.revealed || false}
            currentUserId={user?.id || ''}
          />
        </div>

        {/* Card Deck (Voters only) */}
        {isVoter && (
          <div className="card-refined">
            <CardDeck
              deckType={room.deck || 'fibonacci'}
              selectedValue={myVote}
              onSelectCard={handleVote}
              disabled={room.revealed || false}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isFacilitator && !room.revealed && (
            <Button onClick={handleReveal} size="lg" className="flex-1">
              <Eye className="mr-2 h-5 w-5" />
              {t('scrumPoker.revealVotes')}
            </Button>
          )}
          {isFacilitator && room.revealed && (
            <>
              <Button
                onClick={handleAcceptEstimate}
                size="lg"
                variant="default"
                className="flex-1"
                disabled={!currentStory}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {t('scrumPoker.acceptEstimate')}
              </Button>
              <Button onClick={handleReset} size="lg" variant="outline">
                <RefreshCw className="mr-2 h-5 w-5" />
                {t('scrumPoker.newVoting')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar - Participants */}
      <div className="card-refined w-80 overflow-hidden p-4">
        <ParticipantsList
          participants={room.participants || {}}
          votes={room.votes || {}}
          reactions={room.reactions}
          revealed={room.revealed || false}
          currentUserId={user?.id || ''}
        />
      </div>
    </div>
  )
}
