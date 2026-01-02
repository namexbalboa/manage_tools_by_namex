import type { DeckType } from '../types'

export interface DeckCard {
  value: string
  label: string
  isSpecial?: boolean
}

export interface Deck {
  id: DeckType
  name: string
  cards: DeckCard[]
}

export const DECKS: Record<DeckType, Deck> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    cards: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '5', label: '5' },
      { value: '8', label: '8' },
      { value: '13', label: '13' },
      { value: '21', label: '21' },
      { value: '34', label: '34' },
      { value: '55', label: '55' },
      { value: '89', label: '89' },
      { value: '?', label: '?', isSpecial: true },
      { value: '☕', label: '☕', isSpecial: true },
    ],
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Sizes',
    cards: [
      { value: 'XS', label: 'XS' },
      { value: 'S', label: 'S' },
      { value: 'M', label: 'M' },
      { value: 'L', label: 'L' },
      { value: 'XL', label: 'XL' },
      { value: 'XXL', label: 'XXL' },
      { value: '?', label: '?', isSpecial: true },
      { value: '☕', label: '☕', isSpecial: true },
    ],
  },
  linear: {
    id: 'linear',
    name: 'Linear (1-10)',
    cards: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '?', label: '?', isSpecial: true },
      { value: '☕', label: '☕', isSpecial: true },
    ],
  },
}

export const getDeck = (deckType: DeckType = 'fibonacci'): Deck => {
  return DECKS[deckType]
}
