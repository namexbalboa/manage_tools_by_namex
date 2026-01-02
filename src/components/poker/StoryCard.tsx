import { useTranslation } from 'react-i18next'
import type { Story } from '../../types'

interface StoryCardProps {
  story: Story | null
}

export function StoryCard({ story }: StoryCardProps) {
  const { t } = useTranslation()

  if (!story) {
    return (
      <div className="card-refined p-6 text-center">
        <p className="text-muted-foreground">
          {t('scrumPoker.noStories')}
        </p>
      </div>
    )
  }

  return (
    <div className="card-refined animate-fade-in p-6">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gradient">
              {story.title}
            </h3>
            {story.description && (
              <p className="mt-2 text-muted-foreground">
                {story.description}
              </p>
            )}
          </div>
          {story.estimatedValue && (
            <div className="animate-scale-up flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2">
              <span className="text-xs text-muted-foreground">
                {t('scrumPoker.estimatedAs')}
              </span>
              <span className="text-2xl font-bold text-primary">
                {story.estimatedValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
