import { Check, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Participant, Reaction } from '../../types'
import { Avatar } from '../Avatar'

interface ParticipantsListProps {
  participants: Record<string, Participant>
  votes: Record<string, string>
  reactions?: Record<string, Reaction>
  revealed: boolean
  currentUserId: string
}

export function ParticipantsList({
  participants,
  votes,
  reactions,
  revealed,
  currentUserId,
}: ParticipantsListProps) {
  const { t } = useTranslation()

  // Convert participants object to array
  const participantsArray = Object.values(participants || {})

  const getRoleLabel = (role?: string) => {
    if (!role) return ''
    return t(`scrumPoker.${role}`)
  }

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'facilitator':
        return 'bg-primary/20 text-primary'
      case 'voter':
        return 'bg-blue-500/20 text-blue-600'
      case 'observer':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t('scrumPoker.participants')} ({participantsArray.length})
      </h3>
      <div className="space-y-2">
        {participantsArray.map((participant) => {
          const hasVoted = !!votes[participant.userId]
          const reaction = reactions?.[participant.userId]
          const isCurrentUser = participant.userId === currentUserId

          return (
            <div
              key={participant.userId}
              className={`card-refined relative overflow-hidden p-3 transition-all ${
                isCurrentUser ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    customization={participant.avatar}
                    size="sm"
                  />
                  {reaction && (
                    <div className="absolute -right-1 -top-1 animate-bounce text-xl">
                      {reaction.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-sm">
                      {participant.nickname}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (você)
                        </span>
                      )}
                    </p>
                  </div>
                  {participant.role && (
                    <span
                      className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                        participant.role
                      )}`}
                    >
                      {getRoleLabel(participant.role)}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {participant.role === 'voter' && (
                    <div className="flex items-center gap-2">
                      {revealed && votes[participant.userId] && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                          {votes[participant.userId]}
                        </div>
                      )}
                      {!revealed && (
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            hasVoted
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {hasVoted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
