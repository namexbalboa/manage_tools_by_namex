import { useState } from 'react'
import { Plus, Trash2, Play } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useTranslation } from 'react-i18next'
import type { Story } from '../../types'
import { cn } from '../../lib/utils'

interface BacklogPanelProps {
  stories: Record<string, Story>
  currentStoryId: string | null
  isFacilitator: boolean
  onAddStory: (story: Omit<Story, 'id' | 'createdAt'>) => void
  onDeleteStory: (storyId: string) => void
  onSelectStory: (storyId: string) => void
}

export function BacklogPanel({
  stories,
  currentStoryId,
  isFacilitator,
  onAddStory,
  onDeleteStory,
  onSelectStory,
}: BacklogPanelProps) {
  const { t } = useTranslation()
  const [isAdding, setIsAdding] = useState(false)
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
  })

  const handleAdd = () => {
    if (!newStory.title.trim()) return

    onAddStory({
      title: newStory.title,
      description: newStory.description,
      estimatedValue: null,
    })

    setNewStory({ title: '', description: '' })
    setIsAdding(false)
  }

  const storiesArray = Object.values(stories).sort(
    (a, b) => a.createdAt - b.createdAt
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {t('scrumPoker.backlog')}
        </h3>
        {isFacilitator && !isAdding && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {isAdding && (
          <div className="card-refined space-y-3 p-3">
            <Input
              placeholder={t('scrumPoker.storyTitle')}
              value={newStory.title}
              onChange={(e) =>
                setNewStory({ ...newStory, title: e.target.value })
              }
              autoFocus
            />
            <Input
              placeholder={t('scrumPoker.storyDescription')}
              value={newStory.description}
              onChange={(e) =>
                setNewStory({ ...newStory, description: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1">
                {t('common.add')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewStory({ title: '', description: '' })
                }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        )}

        {storiesArray.length === 0 && !isAdding && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {t('scrumPoker.noStories')}
          </div>
        )}

        {storiesArray.map((story) => {
          const isCurrent = story.id === currentStoryId
          const isEstimated = !!story.estimatedValue

          return (
            <div
              key={story.id}
              className={cn(
                'card-refined group relative cursor-pointer p-3 transition-all hover:ring-2 hover:ring-primary/50',
                isCurrent && 'ring-2 ring-primary'
              )}
              onClick={() => isFacilitator && onSelectStory(story.id)}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold">
                      {story.title}
                    </h4>
                    {isEstimated && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
                        {story.estimatedValue}
                      </span>
                    )}
                  </div>
                  {story.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {story.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {isCurrent && (
                    <div className="flex h-6 w-6 items-center justify-center">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    </div>
                  )}
                  {isFacilitator && !isCurrent && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectStory(story.id)
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  {isFacilitator && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteStory(story.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
