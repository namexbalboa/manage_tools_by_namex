import type { AvatarCustomization } from '../types'
import { getAvatarPath } from '../config/avatars'

interface AvatarProps {
  customization: AvatarCustomization
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-[40.8px] w-[40.8px]',
  md: 'h-[81.6px] w-[81.6px]',
  lg: 'h-[108.8px] w-[108.8px]',
}

export function Avatar({ customization, size = 'md', className = '' }: AvatarProps) {
  const headPath = getAvatarPath('head', customization.head)
  const bodyPath = getAvatarPath('body', customization.body)

  // girl_1 e girl_2 precisam de tamanho maior
  const isLargerHead = customization.head === 'girl_1' || customization.head === 'girl_2'
  const headSize = isLargerHead ? 'h-[46%] w-[46%]' : 'h-[38%] w-[38%]'

  return (
    <div className={'relative ' + sizeClasses[size] + ' ' + className}>
      <div className="absolute inset-0 flex flex-col items-center justify-start rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-1">
        {headPath || bodyPath ? (
          <>
            {headPath && (
              <img
                src={headPath}
                alt="Head"
                className={headSize + ' object-contain'}
                style={{ zIndex: 2 }}
              />
            )}
            {bodyPath && (
              <img
                src={bodyPath}
                alt="Body"
                className="h-full w-full object-contain"
                style={{ marginTop: isLargerHead ? '-15%' : '-5%', zIndex: 1 }}
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">👤</span>
          </div>
        )}
      </div>
    </div>
  )
}
