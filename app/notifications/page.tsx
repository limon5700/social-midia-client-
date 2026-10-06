'use client'

import { useState } from 'react'
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign, 
  MoreHorizontal,
  Check,
  X,
  Filter,
  Clock,
  Bell,
  BellOff
} from 'lucide-react'
import { notifications, users } from '@/data/mockData'
import { formatTimeAgo } from '@/lib/utils'

interface NotificationItem {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message'
  user: typeof users[0]
  content: string
  postId?: string
  isRead: boolean
  createdAt: Date
  postImage?: string
  commentText?: string
}

// Enhanced notifications data
const notificationData: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    user: users[0],
    content: 'liked your post',
    postId: '1',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    type: 'comment',
    user: users[1],
    content: 'commented on your post',
    postId: '1',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    commentText: 'Amazing shot! Where is this?'
  },
  {
    id: '3',
    type: 'follow',
    user: users[2],
    content: 'started following you',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '4',
    type: 'mention',
    user: users[3],
    content: 'mentioned you in a comment',
    postId: '2',
    isRead: true,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    postImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop',
    commentText: 'Check out @alexjohnson\'s amazing content!'
  },
  {
    id: '5',
    type: 'like',
    user: users[0],
    content: 'liked your reel',
    postId: '3',
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    postImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
  },
  {
    id: '6',
    type: 'comment',
    user: users[1],
    content: 'replied to your comment',
    postId: '1',
    isRead: true,
    createdAt: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    commentText: 'Thanks for sharing!'
  },
  {
    id: '7',
    type: 'follow',
    user: users[2],
    content: 'started following you',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '8',
    type: 'mention',
    user: users[3],
    content: 'tagged you in a story',
    postId: '4',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    postImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
  },
  {
    id: '9',
    type: 'like',
    user: users[0],
    content: 'liked your post',
    postId: '5',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    postImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
  },
  {
    id: '10',
    type: 'comment',
    user: users[1],
    content: 'commented on your reel',
    postId: '6',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    postImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
    commentText: 'This is incredible! 🔥'
  }
]

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions' | 'follows'>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500 fill-current" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-100'
      case 'comment':
        return 'bg-blue-50 border-blue-100'
      case 'follow':
        return 'bg-green-50 border-green-100'
      case 'mention':
        return 'bg-purple-50 border-purple-100'
      case 'message':
        return 'bg-blue-50 border-blue-100'
      default:
        return 'bg-gray-50 border-gray-100'
    }
  }

  const filteredNotifications = notificationData.filter(notification => {
    // Filter by type
    if (activeFilter === 'mentions' && notification.type !== 'mention') return false
    if (activeFilter === 'follows' && notification.type !== 'follow') return false
    
    // Filter by read status
    if (showUnreadOnly && notification.isRead) return false
    
    return true
  })

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Mark as read:', notificationId)
  }

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read')
  }

  const handleFollowUser = (userId: string) => {
    console.log('Follow user:', userId)
  }

  const handleViewPost = (postId: string) => {
    console.log('View post:', postId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with your latest activity</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  showUnreadOnly 
                    ? 'text-blue-500 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {showUnreadOnly ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'all', label: 'All', count: notificationData.length },
                { id: 'mentions', label: 'Mentions', count: notificationData.filter(n => n.type === 'mention').length },
                { id: 'follows', label: 'Follows', count: notificationData.filter(n => n.type === 'follow').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 font-medium transition-colors duration-200 ${
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

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onFollowUser={handleFollowUser}
                  onViewPost={handleViewPost}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Bell className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  {showUnreadOnly 
                    ? 'You\'re all caught up!' 
                    : 'You\'ll see notifications here when people interact with your content.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Notification Item Component
interface NotificationItemProps {
  notification: NotificationItem
  onMarkAsRead: (id: string) => void
  onFollowUser: (userId: string) => void
  onViewPost: (postId: string) => void
  getNotificationIcon: (type: string) => React.ReactNode
  getNotificationColor: (type: string) => string
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onFollowUser, 
  onViewPost, 
  getNotificationIcon, 
  getNotificationColor 
}: NotificationItemProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
      notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
    }`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <img
              src={notification.user.avatar}
              alt={notification.user.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{notification.user.name}</span>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {notification.content}
                  {notification.commentText && (
                    <span className="block mt-1 text-gray-500 italic">
                      "{notification.commentText}"
                    </span>
                  )}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(notification.createdAt)}</span>
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {notification.type === 'follow' && (
                      <button
                        onClick={() => onFollowUser(notification.user.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors duration-200"
                      >
                        Follow
                      </button>
                    )}
                    
                    {notification.postId && (
                      <button
                        onClick={() => onViewPost(notification.postId!)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        View
                      </button>
                    )}

                    {!notification.isRead && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Image */}
              {notification.postImage && (
                <div className="flex-shrink-0 ml-3">
                  <img
                    src={notification.postImage}
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
  )
} 