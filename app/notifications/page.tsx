'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  AtSign,
  Tag,
  Share2,
  Check,
  Bell,
  BellOff,
  Clock,
  Loader2,
  ShieldAlert,
  FileText,
  Camera,
  CornerDownLeft,
  CheckCircle,
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const DEFAULT_AVATAR = '/images/default-avatar.svg'

type FilterTab = 'all' | 'mentions' | 'follows'

interface NotificationSender {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  isVerified?: boolean
}

interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
  sender: NotificationSender | null
  data: {
    postId?: string | null
    commentId?: string | null
    conversationId?: string | null
    storyId?: string | null
    commentContent?: string | null
    postImage?: string | null
    action?: string | null
  }
}

function senderName(sender: NotificationSender | null) {
  if (!sender) return 'System'
  const name = [sender.firstName, sender.lastName].filter(Boolean).join(' ').trim()
  return name || sender.username || 'User'
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500 fill-current" />
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case 'reply':
      return <CornerDownLeft className="h-4 w-4 text-blue-500" />
    case 'follow':
    case 'friend_request':
      return <UserPlus className="h-4 w-4 text-green-500" />
    case 'friend_accepted':
      return <UserCheck className="h-4 w-4 text-green-600" />
    case 'mention':
      return <AtSign className="h-4 w-4 text-purple-500" />
    case 'tag':
      return <Tag className="h-4 w-4 text-purple-500" />
    case 'share':
      return <Share2 className="h-4 w-4 text-indigo-500" />
    case 'message':
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case 'post_published':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />
    case 'story_published':
      return <Camera className="h-4 w-4 text-pink-500" />
    case 'friend_post':
      return <FileText className="h-4 w-4 text-sky-500" />
    case 'security_alert':
      return <ShieldAlert className="h-4 w-4 text-amber-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

function actionHref(notification: AppNotification) {
  if (notification.type === 'message') return '/messages'
  if (notification.type === 'friend_request' || notification.type === 'friend_accepted') {
    return '/friends'
  }
  if (notification.type === 'security_alert') return '/profile/account'
  if (notification.actionUrl) return notification.actionUrl
  if (notification.sender?.username) return `/profile/${notification.sender.username}`
  return '/'
}

export default function NotificationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [authLoading, isAuthenticated, router])

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (activeFilter !== 'all') params.set('type', activeFilter)
      if (showUnreadOnly) params.set('isRead', 'false')

      const response = await fetch(`/api/notifications?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setNotifications(data.data.notifications || [])
      } else {
        setError(data.message || 'Failed to load notifications')
        setNotifications([])
      }
    } catch {
      setError('Failed to load notifications')
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }, [activeFilter, showUnreadOnly])

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadNotifications()
    }
  }, [isAuthenticated, authLoading, loadNotifications])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(loadNotifications, 15000)
    return () => clearInterval(interval)
  }, [isAuthenticated, loadNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      )
    } catch {
      setError('Could not mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      setError('Could not mark all as read')
    }
  }

  const counts = {
    all: notifications.length,
    mentions: notifications.filter((n) => n.type === 'mention' || n.type === 'tag').length,
    follows: notifications.filter((n) =>
      ['follow', 'friend_request', 'friend_accepted'].includes(n.type),
    ).length,
  }

  if (authLoading || (isLoading && notifications.length === 0)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with your latest activity</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Mark all as read"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`p-2 rounded-lg ${
                showUnreadOnly
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showUnreadOnly ? 'Show all' : 'Unread only'}
            >
              {showUnreadOnly ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {(
              [
                { id: 'all' as const, label: 'All', count: counts.all },
                { id: 'mentions' as const, label: 'Mentions', count: counts.mentions },
                { id: 'follows' as const, label: 'Follows', count: counts.follows },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-medium transition-colors ${
                  activeFilter === tab.id
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/40'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.sender ? (
                        <img
                          src={notification.sender.avatar || DEFAULT_AVATAR}
                          alt={senderName(notification.sender)}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 truncate">
                              {senderName(notification.sender)}
                            </span>
                            {getNotificationIcon(notification.type)}
                          </div>

                          <p className="text-sm text-gray-600 mb-1">{notification.title}</p>
                          {notification.message !== notification.title && (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          {notification.data.commentContent && (
                            <p className="text-sm text-gray-500 italic mb-2 line-clamp-2">
                              &ldquo;{notification.data.commentContent}&rdquo;
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs text-gray-400 flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(new Date(notification.createdAt))}</span>
                            </span>

                            <div className="flex items-center space-x-2">
                              <Link
                                href={actionHref(notification)}
                                onClick={() => {
                                  if (!notification.isRead) handleMarkAsRead(notification.id)
                                }}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                              >
                                {notification.actionText || 'View'}
                              </Link>

                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {notification.data.postImage && (
                          <div className="flex-shrink-0 ml-1">
                            <img
                              src={String(notification.data.postImage)}
                              alt="Post"
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Bell className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {showUnreadOnly
                  ? "You're all caught up!"
                  : "You'll see real notifications here for login, friends, posts, reactions, comments, and more."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
