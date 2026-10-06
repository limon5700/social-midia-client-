'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  MessageCircle,
  Settings,
  Loader2,
  Heart,
  Bell,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import PageContainer from '@/components/layout/PageContainer'

interface DashboardStats {
  postCount: number
  followerCount: number
  followingCount: number
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return

    async function loadStats() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          const me = data.data.user
          setStats({
            postCount: me.postCount ?? 0,
            followerCount: me.followerCount ?? me.followers?.length ?? 0,
            followingCount: me.followingCount ?? me.following?.length ?? 0,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isAuthenticated])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User'

  const statCards = [
    { label: 'Posts', value: stats.postCount, icon: FileText, href: '/profile' },
    { label: 'Followers', value: stats.followerCount, icon: Users, href: '/followers' },
    { label: 'Following', value: stats.followingCount, icon: UserPlus, href: '/followers' },
  ]

  const quickLinks = [
    { label: 'Profile', href: '/profile', icon: LayoutDashboard },
    { label: 'Friends', href: '/friends', icon: Users },
    { label: 'Messages', href: '/messages', icon: MessageCircle },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Liked Posts', href: '/liked', icon: Heart },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <PageContainer variant="wide" className="bg-[#f0f2f5] min-h-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back, {displayName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors min-w-0"
              >
                <Icon className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
