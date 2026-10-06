'use client'

import { Loader2 } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'

interface PullToRefreshProps {
  children: React.ReactNode
  enabled?: boolean
  onRefresh: () => void | Promise<void>
}

export default function PullToRefresh({
  children,
  enabled = true,
  onRefresh,
}: PullToRefreshProps) {
  const { pullDistance, isRefreshing, PULL_THRESHOLD } = usePullToRefresh(onRefresh, enabled)

  return (
    <div
      className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden transition-transform duration-200 ease-out"
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
      }}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="sticky top-14 sm:top-16 z-30 flex items-center justify-center gap-2 py-2 text-sm text-blue-600 bg-white/90 backdrop-blur-sm border-b border-gray-100"
          style={{ opacity: isRefreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1) }}
        >
          <Loader2 className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>
            {isRefreshing
              ? 'Refreshing...'
              : pullDistance >= PULL_THRESHOLD
                ? 'Release to refresh'
                : 'Pull to refresh'}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}
