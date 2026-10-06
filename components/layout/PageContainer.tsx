'use client'

import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /** full = no max-width cap (messages, friends) */
  variant?: 'default' | 'narrow' | 'wide' | 'full'
}

const widthClass = {
  default: 'max-w-5xl',
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
  full: 'max-w-full',
}

export default function PageContainer({
  children,
  className,
  variant = 'default',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full min-w-0 max-w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden',
        widthClass[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
