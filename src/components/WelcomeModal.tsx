import { useState, useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { AvatarCustomizer } from './AvatarCustomizer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import type { AvatarCustomization } from '../types'
import { useTranslation } from 'react-i18next'

export function WelcomeModal() {
  const { t } = useTranslation()
  const { user, setUser, isAuthenticated } = useUserStore()
  const [open, setOpen] = useState(!isAuthenticated)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState<AvatarCustomization>({
    head: 'none',
    body: 'default',
  })

  useEffect(() => {
    setOpen(!isAuthenticated)
  }, [isAuthenticated])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nickname.trim()) return

    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      nickname: nickname.trim(),
      avatar,
      createdAt: Date.now(),
    }

    setUser(newUser)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">
            {t('welcome.title')}
          </DialogTitle>
          <DialogDescription>
            {t('welcome.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              {t('welcome.nickname')}
            </label>
            <Input
              id="nickname"
              placeholder={t('welcome.nicknamePlaceholder')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('welcome.customizeAvatar')}</label>
            <AvatarCustomizer value={avatar} onChange={setAvatar} />
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t('welcome.start')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
