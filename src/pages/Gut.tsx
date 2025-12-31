import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import type { GutItem } from '../types'
import { useTranslation } from 'react-i18next'

export function Gut() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GutItem[]>([])
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    gravity: 1,
    urgency: 1,
    tendency: 1,
  })

  const calculateScore = (item: Omit<GutItem, 'id' | 'createdBy' | 'createdAt'>) => {
    return item.gravity * item.urgency * item.tendency
  }

  const handleAdd = () => {
    if (!newItem.title.trim()) return

    const item: GutItem = {
      id: Math.random().toString(36).substring(2, 15),
      ...newItem,
      createdBy: 'current-user',
      createdAt: Date.now(),
      score: calculateScore(newItem),
    }

    setItems([...items, item].sort((a, b) => (b.score || 0) - (a.score || 0)))
    setNewItem({
      title: '',
      description: '',
      gravity: 1,
      urgency: 1,
      tendency: 1,
    })
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient">{t('gut.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('gut.description')}
        </p>
      </div>

      <div className="card-refined p-6">
        <h2 className="mb-4 text-xl font-semibold">{t('gut.addNew')}</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder={t('gut.titlePlaceholder')}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Input
              placeholder={t('gut.descriptionPlaceholder')}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('gut.gravity')}
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                {t('gut.gravityDesc')}
              </p>
              <Input
                type="number"
                placeholder="1-5"
                min="1"
                max="5"
                value={newItem.gravity}
                onChange={(e) => setNewItem({ ...newItem, gravity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('gut.urgency')}
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                {t('gut.urgencyDesc')}
              </p>
              <Input
                type="number"
                placeholder="1-5"
                min="1"
                max="5"
                value={newItem.urgency}
                onChange={(e) => setNewItem({ ...newItem, urgency: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('gut.tendency')}
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                {t('gut.tendencyDesc')}
              </p>
              <Input
                type="number"
                placeholder="1-5"
                min="1"
                max="5"
                value={newItem.tendency}
                onChange={(e) => setNewItem({ ...newItem, tendency: Number(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {t('gut.addProblem')}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{t('gut.prioritizedProblems')}</h2>
        {items.length === 0 ? (
          <div className="card-refined p-8 text-center text-muted-foreground">
            {t('gut.noProblems')}
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="card-refined p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-6 text-sm">
                    <span>{t('gut.gravityLabel')}: <strong>{item.gravity}</strong></span>
                    <span>{t('gut.urgencyLabel')}: <strong>{item.urgency}</strong></span>
                    <span>{t('gut.tendencyLabel')}: <strong>{item.tendency}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t('gut.score')}</div>
                    <div className="text-2xl font-bold text-primary">
                      {item.score}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
