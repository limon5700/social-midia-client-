'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Clapperboard,
  DollarSign,
  Eye,
  FileText,
  Heart,
  Loader2,
  MessageCircle,
  Radio,
  Users,
  Video,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import PageContainer from '@/components/layout/PageContainer'
import { cn, formatNumber, formatTimeAgo } from '@/lib/utils'

type DashboardTab = 'content' | 'analytics' | 'monetization'
type RangeKey = '7' | '15' | '30'

interface OverviewStats {
  views: number
  reach: number
  earn: number
  posts: number
  likes: number
  comments: number
  shares: number
  saves: number
  followers: number
  following: number
}

interface ContentItem {
  _id: string
  content: string
  type: 'reel' | 'post' | 'text'
  views: number
  likes: number
  comments: number
  createdAt: string
  thumbnail?: string | null
  privacy?: string
}

interface DailyPoint {
  date: string
  views: number
  likes: number
  posts: number
}

interface MonetizationInfo {
  estimatedEarnings: number
  cpm: number
  currency: string
  views: number
  status: string
  note: string
}

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7', label: 'Last 7 days' },
  { key: '15', label: 'Last 15 days' },
  { key: '30', label: 'Last 1 month' },
]

const TABS: { key: DashboardTab; label: string; icon: typeof FileText }[] = [
  { key: 'content', label: 'Content', icon: Clapperboard },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'monetization', label: 'Monetization', icon: DollarSign },
]

function formatMoney(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<DashboardTab>('analytics')
  const [range, setRange] = useState<RangeKey>('7')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [daily, setDaily] = useState<DailyPoint[]>([])
  const [monetization, setMonetization] = useState<MonetizationInfo | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [authLoading, isAuthenticated, router])

  const loadStats = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError('')
      try {
      const res = await fetch(`/api/dashboard/stats?range=${range}`, {
        credentials: 'include',
      })
        const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to load dashboard')
        return
      }
      setOverview(data.data.overview)
      setContent(data.data.content || [])
      setDaily(data.data.daily || [])
      setMonetization(data.data.monetization || null)
    } catch (err) {
      console.error(err)
      setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
  }, [isAuthenticated, range])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User'

  const maxDailyViews = Math.max(1, ...daily.map((d) => d.views))

  const analyticsCards = [
    {
      label: 'Views',
      value: overview ? formatNumber(overview.views) : '—',
      icon: Eye,
      hint: 'Total post views',
    },
    {
      label: 'Reach',
      value: overview ? formatNumber(overview.reach) : '—',
      icon: Radio,
      hint: 'Unique accounts engaged',
    },
  ]

  const renderMetricCard = (card: {
    label: string
    value: string
    icon: typeof Eye
    hint: string
  }) => {
    const Icon = card.icon
    return (
      <div
        key={card.label}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500">{card.label}</p>
            <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 truncate">
              {card.value}
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-2">
              {card.hint}
            </p>
          </div>
          <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageContainer variant="wide" className="bg-[#f0f2f5] min-h-full pb-6">
      <div className="mb-4 sm:mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Welcome back, {displayName}
        </p>
      </div>

      {/* Top menu: Content / Analytics / Monetization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.key
          return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-colors',
                  active
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Date range filter */}
        <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setRange(opt.key)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors',
                range === opt.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={loadStats}
            className="ml-2 underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {tab === 'content' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Your content
                </h2>
                <span className="text-xs text-gray-500">
                  {overview?.posts ?? 0} posts
                </span>
              </div>

              {content.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>No posts in this period.</p>
                  <Link href="/" className="text-blue-600 font-medium mt-2 inline-block">
                    Create a post
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {content.map((item) => (
                    <li
                      key={item._id}
                      className="flex gap-3 p-3 sm:p-4 hover:bg-gray-50/80"
                    >
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : item.type === 'reel' ? (
                          <Video className="h-6 w-6 text-gray-400" />
                        ) : (
                          <FileText className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={cn(
                              'text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded',
                              item.type === 'reel'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-gray-100 text-gray-600',
                            )}
                          >
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(new Date(item.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {item.content || 'Untitled post'}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {formatNumber(item.views)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            {formatNumber(item.likes)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {formatNumber(item.comments)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
                </div>
          )}

          {tab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {analyticsCards.map(renderMetricCard)}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base mb-4">
                  Views over time
                </h2>
                {daily.every((d) => d.views === 0 && d.posts === 0) ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No activity in this period yet.
                  </p>
                ) : (
                  <div className="flex items-end gap-1 sm:gap-1.5 h-36 sm:h-44">
                    {daily.map((point) => {
                      const height = Math.max(
                        4,
                        Math.round((point.views / maxDailyViews) * 100),
                      )
                      return (
                        <div
                          key={point.date}
                          className="flex-1 flex flex-col items-center gap-1 min-w-0"
                          title={`${point.date}: ${point.views} views`}
                        >
                          <div className="w-full flex items-end justify-center h-28 sm:h-36">
                            <div
                              className="w-full max-w-[14px] sm:max-w-[20px] rounded-t bg-blue-500/90"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 truncate w-full text-center">
                            {point.date.slice(5)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
      </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Posts', value: overview?.posts ?? 0, icon: FileText },
                  { label: 'Likes', value: overview?.likes ?? 0, icon: Heart },
                  { label: 'Comments', value: overview?.comments ?? 0, icon: MessageCircle },
                  { label: 'Followers', value: overview?.followers ?? 0, icon: Users },
                ].map((item) => {
                  const Icon = item.icon
            return (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        {formatNumber(item.value)}
                      </p>
                    </div>
            )
          })}
        </div>
      </div>
          )}

          {tab === 'monetization' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {renderMetricCard({
                  label: 'Earn',
                  value: overview ? formatMoney(overview.earn) : '—',
                  icon: DollarSign,
                  hint: 'Estimated from views',
                })}
                {renderMetricCard({
                  label: 'Views',
                  value: overview ? formatNumber(overview.views) : '—',
                  icon: Eye,
                  hint: 'Views used for estimate',
                })}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  Estimated earnings
                </h2>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  {formatMoney(monetization?.estimatedEarnings ?? overview?.earn ?? 0)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Based on {formatNumber(monetization?.views ?? overview?.views ?? 0)} views
                  {' · '}
                  CPM {formatMoney(monetization?.cpm ?? 1.25)}
                </p>
                {monetization?.note && (
                  <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    {monetization.note}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">How it works</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    Post videos and reels to grow views.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    Reach grows when people like, comment, save, or share.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    Earnings here are estimates until real payouts are enabled.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}
