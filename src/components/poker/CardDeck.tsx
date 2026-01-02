import { cn } from '../../lib/utils'
import { getDeck, type Deck } from '../../config/decks'
import type { DeckType } from '../../types'

interface CardDeckProps {
  deckType: DeckType
  selectedValue: string | null
  onSelectCard: (value: string) => void
  disabled?: boolean
}

export function CardDeck({
  deckType,
  selectedValue,
  onSelectCard,
  disabled = false,
}: CardDeckProps) {
  const deck = getDeck(deckType)

  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {deck.cards.map((card) => {
        const isSelected = selectedValue === card.value
        const isSpecial = card.isSpecial

        return (
          <button
            key={card.value}
            onClick={() => !disabled && onSelectCard(card.value)}
            disabled={disabled}
            className={cn(
              'poker-card group relative flex h-24 w-16 items-center justify-center rounded-lg border-2 font-bold shadow-lg transition-all duration-200',
              'hover:scale-110 hover:-translate-y-2 hover:shadow-2xl',
              'active:scale-95',
              disabled && 'cursor-not-allowed opacity-50',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/30'
                : isSpecial
                ? 'border-muted-foreground/30 bg-gradient-to-br from-muted to-muted/50 text-foreground hover:border-primary/50'
                : 'border-primary/30 bg-gradient-to-br from-background to-primary/5 text-foreground hover:border-primary',
              !disabled && 'cursor-pointer'
            )}
          >
            <span
              className={cn(
                'text-2xl transition-transform duration-200 group-hover:scale-125',
                isSpecial && 'text-3xl'
              )}
            >
              {card.label}
            </span>
            {isSelected && !disabled && (
              <div className="absolute inset-0 animate-pulse rounded-lg bg-primary/20" />
            )}
          </button>
        )
      })}
    </div>
  )
}
