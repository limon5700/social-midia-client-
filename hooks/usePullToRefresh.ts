'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const PULL_THRESHOLD = 72
const MAX_PULL = 100

export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  enabled = true,
) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pullStartY = useRef(0)
  const isPullActive = useRef(false)
  const isPulling = useRef(false)
  const isRefreshingRef = useRef(false)

  const triggerRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return
    isRefreshingRef.current = true
    setIsRefreshing(true)
    setPullDistance(0)
    try {
      await onRefresh()
    } finally {
      isRefreshingRef.current = false
      setIsRefreshing(false)
    }
  }, [onRefresh])

  useEffect(() => {
    if (!enabled) return

    const canStartPull = () => window.scrollY <= 5 && !isRefreshingRef.current

    const onPointerDown = (e: PointerEvent) => {
      if (!canStartPull()) return
      isPullActive.current = true
      isPulling.current = false
      pullStartY.current = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPullActive.current || isRefreshingRef.current) return

      if (window.scrollY > 5) {
        isPullActive.current = false
        isPulling.current = false
        setPullDistance(0)
        return
      }

      const delta = e.clientY - pullStartY.current
      if (delta <= 0) {
        setPullDistance(0)
        return
      }

      if (delta > 8) {
        isPulling.current = true
      }

      if (isPulling.current) {
        setPullDistance(Math.min(delta * 0.45, MAX_PULL))
        if (e.cancelable) {
          e.preventDefault()
        }
      }
    }

    const finishPull = () => {
      if (!isPullActive.current) return
      isPullActive.current = false

      if (isPulling.current) {
        setPullDistance((distance) => {
          if (distance >= PULL_THRESHOLD) {
            void triggerRefresh()
          }
          return 0
        })
      } else {
        setPullDistance(0)
      }

      isPulling.current = false
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', finishPull)
    window.addEventListener('pointercancel', finishPull)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', finishPull)
      window.removeEventListener('pointercancel', finishPull)
    }
  }, [enabled, triggerRefresh])

  return { pullDistance, isRefreshing, PULL_THRESHOLD }
}

export const PULL_REFRESH_EVENT = 'app:pull-refresh'
