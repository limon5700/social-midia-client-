'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import TopNavbar from '@/components/navigation/TopNavbar'
import Sidebar from '@/components/navigation/Sidebar'
import MobileNavbar from '@/components/navigation/MobileNavbar'
import PullToRefresh from '@/components/layout/PullToRefresh'
import { PULL_REFRESH_EVENT } from '@/hooks/usePullToRefresh'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const isAuthPage = pathname === '/auth'
  const isFeedPage = pathname === '/'

  const shouldShowNavigation = isAuthenticated && !isAuthPage
  const shouldShowSidebar = shouldShowNavigation && isFeedPage
  const pullRefreshEnabled = isAuthenticated && !authLoading && !isAuthPage

  const handlePullRefresh = useCallback(async () => {
    window.dispatchEvent(new CustomEvent(PULL_REFRESH_EVENT))
    router.refresh()
    setRefreshKey((key) => key + 1)
    await new Promise((resolve) => setTimeout(resolve, 400))
  }, [router])

  const mainContent = (
    <div key={refreshKey} className="min-h-full w-full min-w-0">
      {children}
    </div>
  )

  const mainClassName =
    isAuthPage || !isAuthenticated
      ? 'w-full min-w-0 max-w-full overflow-x-hidden bg-white min-h-screen'
      : shouldShowSidebar
        ? 'w-full min-w-0 max-w-full overflow-x-hidden bg-gray-100 min-h-screen pt-14 sm:pt-16 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-8 lg:ml-16'
        : 'w-full min-w-0 max-w-full overflow-x-hidden bg-gray-100 min-h-screen pt-14 sm:pt-16 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-8'

  return (
    <>
      {shouldShowNavigation && <TopNavbar />}
      {shouldShowSidebar && <Sidebar />}
      <main className={mainClassName}>
        {pullRefreshEnabled ? (
          <PullToRefresh enabled onRefresh={handlePullRefresh}>
            {mainContent}
          </PullToRefresh>
        ) : (
          mainContent
        )}
      </main>
      {shouldShowNavigation && <MobileNavbar />}
    </>
  )
}
