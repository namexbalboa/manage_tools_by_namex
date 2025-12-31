import { useState } from 'react'
import type { AvatarCustomization } from '../types'
import { cn } from '../lib/utils'
import { Avatar } from './Avatar'
import { avatarOptions } from '../config/avatars'
import { useTranslation } from 'react-i18next'

interface AvatarCustomizerProps {
  value: AvatarCustomization
  onChange: (value: AvatarCustomization) => void
}

export function AvatarCustomizer({ value, onChange }: AvatarCustomizerProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'head' | 'body'>('head')

  const handleSelect = (part: 'head' | 'body', optionId: string) => {
    onChange({ ...value, [part]: optionId })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Avatar customization={value} size="lg" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          {(['head', 'body'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t('welcome.' + tab)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {avatarOptions[activeTab].map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(activeTab, option.id)}
              className={cn(
                'card-refined flex flex-col items-center gap-2 p-3 transition-all hover:scale-105',
                value[activeTab] === option.id &&
                  'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
            >
              {option.path ? (
                <img src={option.path} alt={t(`welcome.${activeTab}.${option.id}`)} className="h-12 w-12 object-contain" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center text-2xl">👤</div>
              )}
              <span className="text-xs font-medium text-center">{t(`welcome.${activeTab}.${option.id}`)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
