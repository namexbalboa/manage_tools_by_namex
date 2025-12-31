import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Target, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

export function Sidebar() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['prioritization'])
  const location = useLocation()

  const menuItems = [
    {
      key: 'prioritization',
      title: t('sidebar.prioritization'),
      icon: Target,
      children: [
        { title: t('rice.title'), path: '/rice' },
        { title: t('eisenhower.title'), path: '/eisenhower' },
        { title: t('gut.title'), path: '/gut' },
      ],
    },
    {
      key: 'scrumPoker',
      title: t('sidebar.scrumPoker'),
      icon: Sparkles,
      path: '/scrum-poker',
    },
  ]

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    )
  }

  return (
    <aside
      className={cn(
        'glass sticky top-16 h-[calc(100vh-4rem)] border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.key}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.key)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform',
                              expandedItems.includes(item.key) && 'rotate-90'
                            )}
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && expandedItems.includes(item.key) && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted',
                              location.pathname === child.path &&
                                'bg-primary text-primary-foreground'
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted',
                      location.pathname === item.path &&
                        'bg-primary text-primary-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
