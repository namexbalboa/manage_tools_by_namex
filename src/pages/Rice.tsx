import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import type { RiceItem } from '../types'
import { useTranslation } from 'react-i18next'

export function Rice() {
  const { t } = useTranslation()
  const [items, setItems] = useState<RiceItem[]>([])
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    reach: 0,
    impact: 0,
    confidence: 0,
    effort: 0,
  })

  const calculateScore = (item: Omit<RiceItem, 'id' | 'createdBy' | 'createdAt'>) => {
    if (item.effort === 0) return 0
    return ((item.reach * item.impact * item.confidence) / 100) / item.effort
  }

  const handleAdd = () => {
    if (!newItem.title.trim()) return

    const item: RiceItem = {
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
      reach: 0,
      impact: 0,
      confidence: 0,
      effort: 0,
    })
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient">{t('rice.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('rice.description')}
        </p>
      </div>

      <div className="card-refined p-6">
        <h2 className="mb-4 text-xl font-semibold">{t('rice.addNew')}</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder={t('rice.titlePlaceholder')}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Input
              placeholder={t('rice.descriptionPlaceholder')}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">{t('rice.reach')}</label>
              <Input
                type="number"
                placeholder={t('rice.reach')}
                min="0"
                value={newItem.reach || ''}
                onChange={(e) => setNewItem({ ...newItem, reach: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{t('rice.impact')}</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setNewItem({ ...newItem, impact: value })}
                    className={cn(
                      "flex-1",
                      newItem.impact === value
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:text-foreground"
                    )}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{t('rice.confidence')}</label>
              <Input
                type="number"
                placeholder={t('rice.confidence')}
                min="0"
                max="100"
                value={newItem.confidence || ''}
                onChange={(e) => setNewItem({ ...newItem, confidence: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{t('rice.effort')}</label>
              <Input
                type="number"
                placeholder={t('rice.effort')}
                min="1"
                value={newItem.effort || ''}
                onChange={(e) => setNewItem({ ...newItem, effort: Number(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {t('rice.addItem')}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{t('rice.prioritizedItems')}</h2>
        {items.length === 0 ? (
          <div className="card-refined p-8 text-center text-muted-foreground">
            {t('rice.noItems')}
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
                    <span>{t('rice.reachLabel')}: <strong>{item.reach}</strong></span>
                    <span>{t('rice.impactLabel')}: <strong>{item.impact}</strong></span>
                    <span>{t('rice.confidenceLabel')}: <strong>{item.confidence}%</strong></span>
                    <span>{t('rice.effortLabel')}: <strong>{item.effort}h</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t('rice.score')}</div>
                    <div className="text-2xl font-bold text-primary">
                      {item.score?.toFixed(1)}
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
