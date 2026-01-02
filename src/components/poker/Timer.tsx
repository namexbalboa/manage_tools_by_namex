import { useEffect, useState } from 'react'
import { Clock, Play, Square } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import type { Timer as TimerType } from '../../types'

interface TimerProps {
  timer?: TimerType
  isFacilitator: boolean
  onStart: (duration: number) => void
  onStop: () => void
}

export function Timer({ timer, isFacilitator, onStart, onStop }: TimerProps) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState(5)

  useEffect(() => {
    if (!timer?.active || !timer.startedAt) {
      setTimeLeft(0)
      return
    }

    const calculateTimeLeft = () => {
      const elapsed = Date.now() - (timer.startedAt || 0)
      const remaining = timer.duration * 1000 - elapsed
      return Math.max(0, Math.floor(remaining / 1000))
    }

    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)

      if (remaining === 0 && timer.active) {
        onStop()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [timer, onStop])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!timer?.active || !timer.duration) return 0
    return (timeLeft / timer.duration) * 100
  }

  const isLowTime = timeLeft > 0 && timeLeft <= 30

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t('scrumPoker.timer')}
        </span>
      </div>

      {timer?.active ? (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center">
              <svg className="absolute h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - getProgress() / 100)}`}
                  className={`transition-all duration-300 ${
                    isLowTime ? 'text-destructive' : 'text-primary'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className={`text-xl font-bold ${
                  isLowTime ? 'text-destructive' : 'text-foreground'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          {isFacilitator && (
            <Button
              size="sm"
              variant="outline"
              onClick={onStop}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              {t('scrumPoker.stopTimer')}
            </Button>
          )}
        </div>
      ) : (
        isFacilitator && (
          <div className="flex items-center gap-2">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value={1}>1 min</option>
              <option value={2}>2 min</option>
              <option value={3}>3 min</option>
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
            </select>
            <Button
              size="sm"
              onClick={() => onStart(selectedDuration * 60)}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {t('scrumPoker.startTimer')}
            </Button>
          </div>
        )
      )}
    </div>
  )
}
