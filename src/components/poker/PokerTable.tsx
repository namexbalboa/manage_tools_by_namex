import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../Avatar'
import type { Participant } from '../../types'
import { cn } from '../../lib/utils'

interface PokerTableProps {
  participants: Record<string, Participant>
  votes: Record<string, string>
  revealed: boolean
  currentUserId: string
}

export function PokerTable({
  participants,
  votes,
  revealed,
  currentUserId,
}: PokerTableProps) {
  const { t } = useTranslation()
  const [showConfetti, setShowConfetti] = useState(false)

  // Convert participants object to array
  const participantsArray = Object.values(participants || {})

  // Calculate statistics
  const voteValues = Object.values(votes).filter(
    (v) => v !== '?' && v !== '☕' && !isNaN(Number(v))
  )
  const numericVotes = voteValues.map(Number)
  const average =
    numericVotes.length > 0
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(
          1
        )
      : null

  // Check consensus (all non-special votes are the same)
  const uniqueVotes = new Set(voteValues)
  const hasConsensus = revealed && uniqueVotes.size === 1 && voteValues.length > 0

  useEffect(() => {
    if (hasConsensus) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [hasConsensus])

  // Filter voters only
  const voters = participantsArray.filter((p) => p.role === 'voter')
  const totalVoters = voters.length
  const votedCount = voters.filter((p) => votes[p.userId]).length

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 p-8">
      {/* Confetti effect on consensus */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Status Banner */}
      <div className="flex items-center gap-4">
        {revealed ? (
          <>
            {hasConsensus ? (
              <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-green-600 dark:text-green-400">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">{t('scrumPoker.consensus')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-600 dark:text-yellow-400">
                <TrendingDown className="h-5 w-5" />
                <span className="font-semibold">{t('scrumPoker.divergence')}</span>
              </div>
            )}
            {average && (
              <div className="flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2">
                <span className="text-xs text-muted-foreground">
                  {t('scrumPoker.average')}
                </span>
                <span className="text-2xl font-bold text-primary">{average}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="font-medium">
                {votedCount === totalVoters
                  ? t('scrumPoker.allVoted')
                  : t('scrumPoker.waitingForVotes')}
              </span>
            </div>
            <span className="text-sm">
              ({votedCount}/{totalVoters})
            </span>
          </div>
        )}
      </div>

      {/* Poker Table */}
      <div className="relative">
        {/* Table surface */}
        <div className="h-64 w-96 rounded-full border-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-2xl" />

        {/* Cards arranged in circle */}
        <div className="absolute inset-0">
          {voters.map((participant, index) => {
            const vote = votes[participant.userId]
            const hasVoted = !!vote
            const angle = (index / voters.length) * 2 * Math.PI - Math.PI / 2
            const radius = 140
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const isCurrentUser = participant.userId === currentUserId

            return (
              <div
                key={participant.userId}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Avatar */}
                  <div
                    className={cn(
                      'rounded-full p-1 transition-all',
                      isCurrentUser && 'ring-2 ring-primary ring-offset-2',
                      hasVoted && !revealed && 'ring-2 ring-green-500'
                    )}
                  >
                    <Avatar
                      customization={participant.avatar}
                      size="sm"
                    />
                  </div>

                  {/* Card */}
                  {hasVoted && (
                    <div
                      className={cn(
                        'poker-card-on-table flex h-16 w-12 items-center justify-center rounded-lg border-2 font-bold shadow-lg transition-all duration-500',
                        revealed
                          ? 'card-flip border-primary bg-gradient-to-br from-background to-primary/10 text-foreground'
                          : 'border-primary/30 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                      )}
                    >
                      {revealed ? (
                        <span className="text-xl">{vote}</span>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-foreground/30" />
                      )}
                    </div>
                  )}

                  {/* Nickname */}
                  <span className="max-w-[80px] truncate text-xs font-medium text-muted-foreground">
                    {participant.nickname}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
