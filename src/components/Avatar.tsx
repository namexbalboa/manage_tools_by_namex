import type { AvatarCustomization } from '../types'
import { getAvatarPath } from '../config/avatars'

interface AvatarProps {
  customization: AvatarCustomization
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
}

export function Avatar({ customization, size = 'md', className = '' }: AvatarProps) {
  const headPath = getAvatarPath('head', customization.head)
  const bodyPath = getAvatarPath('body', customization.body)

  return (
    <div className={'relative ' + sizeClasses[size] + ' ' + className}>
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="relative h-full w-full">
          {bodyPath && (
            <img
              src={bodyPath}
              alt="Body"
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
          {headPath && (
            <img
              src={headPath}
              alt="Head"
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
          {!bodyPath && !headPath && (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              <span className="text-2xl">👤</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
