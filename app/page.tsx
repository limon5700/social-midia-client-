'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import FeedSection from '@/components/feed/FeedSection'
import PageContainer from '@/components/layout/PageContainer'

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null // Will redirect to auth page
  }

  return (
    <PageContainer variant="narrow" className="px-0 py-0 sm:px-4 sm:py-4 md:px-6">
      <FeedSection />
    </PageContainer>
  )
}