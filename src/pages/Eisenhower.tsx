import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import type { EisenhowerItem } from '../types'
import { useTranslation } from 'react-i18next'

export function Eisenhower() {
  const { t } = useTranslation()

  const quadrants = [
    { id: 1, title: t('eisenhower.q1Title'), subtitle: t('eisenhower.q1Subtitle'), color: 'bg-destructive/10 border-destructive' },
    { id: 2, title: t('eisenhower.q2Title'), subtitle: t('eisenhower.q2Subtitle'), color: 'bg-warning/10 border-warning' },
    { id: 3, title: t('eisenhower.q3Title'), subtitle: t('eisenhower.q3Subtitle'), color: 'bg-info/10 border-info' },
    { id: 4, title: t('eisenhower.q4Title'), subtitle: t('eisenhower.q4Subtitle'), color: 'bg-muted border-border' },
  ]
  const [items, setItems] = useState<EisenhowerItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    urgency: 'high' as 'high' | 'low',
    importance: 'high' as 'high' | 'low',
  })

  const getQuadrant = (urgency: 'high' | 'low', importance: 'high' | 'low'): 1 | 2 | 3 | 4 => {
    if (urgency === 'high' && importance === 'high') return 1
    if (urgency === 'low' && importance === 'high') return 2
    if (urgency === 'high' && importance === 'low') return 3
    return 4
  }

  const handleAdd = () => {
    if (!newItem.title.trim()) return

    const item: EisenhowerItem = {
      id: Math.random().toString(36).substring(2, 15),
      ...newItem,
      quadrant: getQuadrant(newItem.urgency, newItem.importance),
      createdBy: 'current-user',
      createdAt: Date.now(),
    }

    setItems([...items, item])
    setNewItem({ title: '', description: '', urgency: 'high', importance: 'high' })
    setShowForm(false)
  }

  const getItemsByQuadrant = (quadrant: number) => {
    return items.filter((item) => item.quadrant === quadrant)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{t('eisenhower.title')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('eisenhower.description')}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('eisenhower.newTask')}
        </Button>
      </div>

      {showForm && (
        <div className="card-refined p-6">
          <h2 className="mb-4 text-xl font-semibold">{t('eisenhower.addNewTask')}</h2>
          <div className="space-y-4">
            <Input
              placeholder={t('eisenhower.titlePlaceholder')}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Input
              placeholder={t('eisenhower.descriptionPlaceholder')}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">{t('eisenhower.urgency')}</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewItem({ ...newItem, urgency: 'high' })}
                    className={cn(
                      "flex-1",
                      newItem.urgency === 'high'
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:text-foreground"
                    )}
                  >
                    {t('eisenhower.high')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewItem({ ...newItem, urgency: 'low' })}
                    className={cn(
                      "flex-1",
                      newItem.urgency === 'low'
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:text-foreground"
                    )}
                  >
                    {t('eisenhower.low')}
                  </Button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{t('eisenhower.importance')}</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewItem({ ...newItem, importance: 'high' })}
                    className={cn(
                      "flex-1",
                      newItem.importance === 'high'
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:text-foreground"
                    )}
                  >
                    {t('eisenhower.high')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewItem({ ...newItem, importance: 'low' })}
                    className={cn(
                      "flex-1",
                      newItem.importance === 'low'
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-foreground hover:text-foreground"
                    )}
                  >
                    {t('eisenhower.low')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1">
                {t('eisenhower.add')}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                {t('eisenhower.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {quadrants.map((quadrant) => {
          const quadrantItems = getItemsByQuadrant(quadrant.id)
          return (
            <div
              key={quadrant.id}
              className={cn('rounded-xl border-2 p-4', quadrant.color)}
            >
              <div className="mb-3">
                <h3 className="font-semibold">{quadrant.title}</h3>
                <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
              </div>
              <div className="space-y-2">
                {quadrantItems.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t('eisenhower.noTasks')}
                  </p>
                ) : (
                  quadrantItems.map((item) => (
                    <div key={item.id} className="rounded-lg bg-card p-3 shadow-sm">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
