import { Smile } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { cn } from '../../lib/utils'

interface ReactionPickerProps {
  onReact: (emoji: string) => void
}

const QUICK_REACTIONS = ['👍', '👏', '🎉', '❤️', '🤔', '😂', '🔥', '✨']

export function ReactionPicker({ onReact }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReact = (emoji: string) => {
    onReact(emoji)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Smile className="h-4 w-4" />
        Reagir
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Reaction picker */}
          <div className="absolute bottom-full left-0 z-50 mb-2 rounded-lg border border-border bg-background p-2 shadow-xl">
            <div className="flex gap-1">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md text-2xl transition-all',
                    'hover:scale-125 hover:bg-primary/10',
                    'active:scale-95'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
