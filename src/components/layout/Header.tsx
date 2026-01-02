import { useUserStore } from '../../store/useUserStore'
import { LanguageSelector } from '../LanguageSelector'
import { Avatar } from '../Avatar'
import { Edit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { user, setIsEditingProfile } = useUserStore()
  const { t } = useTranslation()

  return (
    <header className="glass sticky top-0 z-40 border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img
            src="/logo/logo.png"
            alt={t('header.title')}
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'block'
            }}
          />
          <h1 className="text-2xl font-bold text-gradient hidden">{t('header.title')}</h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {user && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-1.5 transition-all hover:bg-muted hover:scale-105"
            >
              <Avatar customization={user.avatar} size="sm" />
              <span className="font-medium text-sm">{user.nickname}</span>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
