import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Users, Eye, RefreshCw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useUserStore } from '../store/useUserStore'
import { useRoomStore } from '../store/useRoomStore'
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  updateScrumPokerVote,
  revealScrumPokerVotes,
  resetScrumPoker,
  updateRoomData,
} from '../services/roomService'
import { toast } from 'sonner'
import type { ScrumPokerRoom } from '../types'
import { useTranslation } from 'react-i18next'

const POKER_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕']

export function ScrumPoker() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const roomIdFromUrl = searchParams.get('room')

  const { user } = useUserStore()
  const { currentRoom, setCurrentRoom } = useRoomStore()
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState('')
  const [myVote, setMyVote] = useState<string | null>(null)

  const room = currentRoom as ScrumPokerRoom | null

  useEffect(() => {
    if (roomIdFromUrl && !currentRoom) {
      handleJoinRoom(roomIdFromUrl)
    }
  }, [roomIdFromUrl])

  useEffect(() => {
    if (!room) return

    const unsubscribe = subscribeToRoom(room.id, (updatedRoom) => {
      if (updatedRoom) {
        setCurrentRoom(updatedRoom)
      } else {
        toast.error(t('scrumPoker.roomExpired'))
        setCurrentRoom(null)
        setSearchParams({})
      }
    })

    return unsubscribe
  }, [room?.id])

  const handleCreateRoom = async () => {
    if (!user) return

    setLoading(true)
    try {
      const roomId = await createRoom({
        type: 'scrum-poker',
        createdBy: user.id,
        participants: [],
        status: 'active',
      })

      await joinRoom(roomId, {
        userId: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        joinedAt: Date.now(),
      })

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

  const handleUpdateStory = async () => {
    if (!room || !story.trim()) return
    await updateRoomData(room.id, { currentStory: story })
    setStory('')
  }

  const copyRoomLink = () => {
    const link = window.location.origin + window.location.pathname + '?room=' + room?.id
    navigator.clipboard.writeText(link)
    toast.success(t('scrumPoker.linkCopied'))
  }

  const getVoteCount = () => {
    if (!room?.votes) return 0
    return Object.keys(room.votes).length
  }

  const calculateAverage = () => {
    if (!room?.votes) return null
    const numericVotes = Object.values(room.votes)
      .filter((v) => !isNaN(Number(v)))
      .map(Number)
    if (numericVotes.length === 0) return null
    return (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
  }

  if (!room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card-refined w-full max-w-md p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gradient">{t('scrumPoker.title')}</h1>
          <p className="mb-6 text-muted-foreground">
            {t('scrumPoker.subtitle')}
          </p>
          <Button onClick={handleCreateRoom} disabled={loading} size="lg" className="w-full">
            {t('scrumPoker.createRoom')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{t('scrumPoker.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('scrumPoker.room')}: {room.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyRoomLink}>
            <Copy className="mr-2 h-4 w-4" />
            {t('scrumPoker.copyLink')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-refined p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span className="text-sm">{t('scrumPoker.participants')}</span>
          </div>
          <div className="mt-1 text-2xl font-bold">{room.participants?.length || 0}</div>
        </div>

        <div className="card-refined p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-5 w-5" />
            <span className="text-sm">{t('scrumPoker.votes')}</span>
          </div>
          <div className="mt-1 text-2xl font-bold">{getVoteCount()}</div>
        </div>

        {room.revealed && (
          <div className="card-refined p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">{t('scrumPoker.average')}</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {calculateAverage() || 'N/A'}
            </div>
          </div>
        )}
      </div>

      <div className="card-refined p-6">
        <h2 className="mb-4 text-xl font-semibold">{t('scrumPoker.currentStory')}</h2>
        {room.currentStory ? (
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">{room.currentStory}</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder={t('scrumPoker.storyPlaceholder')}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateStory()}
            />
            <Button onClick={handleUpdateStory}>{t('scrumPoker.setStory')}</Button>
          </div>
        )}
      </div>

      <div className="card-refined p-6">
        <h2 className="mb-4 text-xl font-semibold">{t('scrumPoker.chooseVote')}</h2>
        <div className="grid grid-cols-6 gap-3 md:grid-cols-11">
          {POKER_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => handleVote(value)}
              disabled={room.revealed}
              className={'card-refined aspect-[3/4] p-4 text-2xl font-bold transition-all hover:scale-105 disabled:opacity-50 ' +
                (myVote === value ? 'ring-2 ring-primary ring-offset-2' : '')}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {room.votes && Object.keys(room.votes).length > 0 && (
        <div className="card-refined p-6">
          <h2 className="mb-4 text-xl font-semibold">{t('scrumPoker.votesTitle')}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(room.votes).map(([userId, vote]) => {
              const participant = room.participants?.find((p) => p.userId === userId)
              return (
                <div key={userId} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <div className="font-medium">{participant?.nickname || t('scrumPoker.anonymous')}</div>
                  <div className="ml-auto text-xl font-bold">
                    {room.revealed ? vote : '?'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!room.revealed ? (
          <Button onClick={handleReveal} size="lg" className="flex-1">
            <Eye className="mr-2 h-5 w-5" />
            {t('scrumPoker.revealVotes')}
          </Button>
        ) : (
          <Button onClick={handleReset} size="lg" className="flex-1">
            <RefreshCw className="mr-2 h-5 w-5" />
            {t('scrumPoker.newVoting')}
          </Button>
        )}
      </div>
    </div>
  )
}
