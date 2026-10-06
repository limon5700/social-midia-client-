'use client'

import { useState } from 'react'
import { 
  LogIn, 
  Edit3, 
  MessageCircle, 
  Heart, 
  UserPlus, 
  UserMinus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  Bell,
  BellOff,
  MapPin,
  Tag,
  Hash,
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  MoreHorizontal,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  Award,
  Trophy,
  Crown,
  Zap,
  Sparkles,
  Phone,
  Globe,
  Lock,
  Share2,
  Bookmark,
  Flag,
  Archive,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Star,
  Gift,
  Camera,
  Video,
  Music,
  File,
  Folder,
  Image,
  Link,
  Mail,
  Send,
  Reply,
  Forward,
  Copy,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Trash2 as Trash2Icon,
  Edit3 as Edit3Icon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Settings as SettingsIcon,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  Bell as BellIcon,
  BellOff as BellOffIcon,
  Flag as FlagIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Tag as TagIcon,
  Hash as HashIcon,
  Info as InfoIcon,
  AlertCircle as AlertCircleIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Grid as GridIcon,
  List as ListIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  ExternalLink as ExternalLinkIcon,
  RefreshCw as RefreshCwIcon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Crown as CrownIcon,
  Zap as ZapIcon,
  Sparkles as SparklesIcon,
  Phone as PhoneIcon,
  Globe as GlobeIcon
} from 'lucide-react'
import { users } from '@/data/mockData'

interface ActivityLog {
  id: string
  type: 'login' | 'post_edit' | 'comment' | 'like' | 'follow' | 'unfollow' | 'post_create' | 'post_delete' | 'profile_update' | 'settings_change' | 'report' | 'share' | 'bookmark' | 'archive'
  title: string
  description: string
  timestamp: Date
  targetUser?: typeof users[0]
  targetPost?: {
    id: string
    title: string
    content: string
  }
  metadata?: {
    ipAddress?: string
    device?: string
    location?: string
    oldValue?: string
    newValue?: string
    reason?: string
  }
}

export default function ActivityPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      type: 'login',
      title: 'Logged in',
      description: 'Successfully logged in from new device',
      timestamp: new Date('2024-04-20T08:30:00'),
      metadata: {
        ipAddress: '192.168.1.100',
        device: 'iPhone 15 Pro',
        location: 'New York, NY'
      }
    },
    {
      id: '2',
      type: 'post_create',
      title: 'Created new post',
      description: 'Shared a new post about weekend adventures',
      timestamp: new Date('2024-04-20T09:15:00'),
      targetPost: {
        id: 'post-123',
        title: 'Weekend Adventures in the Mountains',
        content: 'Had an amazing time hiking this weekend...'
      }
    },
    {
      id: '3',
      type: 'like',
      title: 'Liked a post',
      description: 'Liked Sarah\'s post about photography tips',
      timestamp: new Date('2024-04-20T10:00:00'),
      targetUser: users[1],
      targetPost: {
        id: 'post-456',
        title: 'Photography Tips for Beginners',
        content: 'Here are some essential tips...'
      }
    },
    {
      id: '4',
      type: 'comment',
      title: 'Commented on a post',
      description: 'Left a comment on Mike\'s tech review',
      timestamp: new Date('2024-04-20T10:30:00'),
      targetUser: users[2],
      targetPost: {
        id: 'post-789',
        title: 'Latest Smartphone Review',
        content: 'After testing the new model...'
      }
    },
    {
      id: '5',
      type: 'follow',
      title: 'Started following',
      description: 'Started following Emma Wilson',
      timestamp: new Date('2024-04-20T11:00:00'),
      targetUser: users[3]
    },
    {
      id: '6',
      type: 'post_edit',
      title: 'Edited post',
      description: 'Updated the recipe post with better instructions',
      timestamp: new Date('2024-04-20T12:15:00'),
      targetPost: {
        id: 'post-101',
        title: 'Homemade Pizza Recipe',
        content: 'Updated with better cooking times...'
      },
      metadata: {
        oldValue: 'Cook for 15 minutes',
        newValue: 'Cook for 18-20 minutes until golden brown'
      }
    },
    {
      id: '7',
      type: 'share',
      title: 'Shared a post',
      description: 'Shared Alex\'s travel post with friends',
      timestamp: new Date('2024-04-20T13:00:00'),
      targetUser: users[4],
      targetPost: {
        id: 'post-202',
        title: 'Amazing Sunset in Bali',
        content: 'Captured this beautiful moment...'
      }
    },
    {
      id: '8',
      type: 'bookmark',
      title: 'Bookmarked post',
      description: 'Saved Lisa\'s workout routine for later',
      timestamp: new Date('2024-04-20T14:30:00'),
      targetUser: users[5],
      targetPost: {
        id: 'post-303',
        title: '30-Day Fitness Challenge',
        content: 'Complete workout routine...'
      }
    },
    {
      id: '9',
      type: 'profile_update',
      title: 'Updated profile',
      description: 'Changed profile picture and bio',
      timestamp: new Date('2024-04-20T15:00:00'),
      metadata: {
        oldValue: 'Old bio text',
        newValue: 'New updated bio with more details'
      }
    },
    {
      id: '10',
      type: 'report',
      title: 'Reported content',
      description: 'Reported inappropriate content',
      timestamp: new Date('2024-04-20T16:00:00'),
      targetUser: users[6],
      targetPost: {
        id: 'post-404',
        title: 'Inappropriate Post',
        content: 'Content that violates guidelines...'
      },
      metadata: {
        reason: 'Inappropriate content'
      }
    },
    {
      id: '11',
      type: 'settings_change',
      title: 'Changed privacy settings',
      description: 'Updated account privacy to private',
      timestamp: new Date('2024-04-20T17:00:00'),
      metadata: {
        oldValue: 'Public',
        newValue: 'Private'
      }
    },
    {
      id: '12',
      type: 'unfollow',
      title: 'Unfollowed user',
      description: 'Unfollowed John Doe',
      timestamp: new Date('2024-04-20T18:00:00'),
      targetUser: users[7]
    },
    {
      id: '13',
      type: 'archive',
      title: 'Archived post',
      description: 'Moved old post to archive',
      timestamp: new Date('2024-04-20T19:00:00'),
      targetPost: {
        id: 'post-505',
        title: 'Old Travel Post',
        content: 'This was from last year...'
      }
    },
    {
      id: '14',
      type: 'login',
      title: 'Logged in',
      description: 'Logged in from desktop computer',
      timestamp: new Date('2024-04-20T20:00:00'),
      metadata: {
        ipAddress: '192.168.1.101',
        device: 'MacBook Pro',
        location: 'New York, NY'
      }
    },
    {
      id: '15',
      type: 'like',
      title: 'Liked multiple posts',
      description: 'Liked 5 posts from various users',
      timestamp: new Date('2024-04-20T21:00:00')
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'Logins' },
    { value: 'post_create', label: 'Post Creation' },
    { value: 'post_edit', label: 'Post Edits' },
    { value: 'comment', label: 'Comments' },
    { value: 'like', label: 'Likes' },
    { value: 'follow', label: 'Follows' },
    { value: 'unfollow', label: 'Unfollows' },
    { value: 'share', label: 'Shares' },
    { value: 'bookmark', label: 'Bookmarks' },
    { value: 'report', label: 'Reports' },
    { value: 'archive', label: 'Archives' },
    { value: 'profile_update', label: 'Profile Updates' },
    { value: 'settings_change', label: 'Settings Changes' }
  ]

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const filteredActivities = activityLogs.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.targetUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    
    const matchesType = selectedType === 'all' || activity.type === selectedType
    
    const matchesDate = selectedDate === 'all' || (() => {
      const now = new Date()
      const activityDate = new Date(activity.timestamp)
      
      switch (selectedDate) {
        case 'today':
          return activityDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return activityDate >= weekAgo
        case 'month':
          return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear()
        case 'year':
          return activityDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesType && matchesDate
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return LogIn
      case 'post_create':
        return Plus
      case 'post_edit':
        return Edit3
      case 'post_delete':
        return Trash2
      case 'comment':
        return MessageCircle
      case 'like':
        return Heart
      case 'follow':
        return UserPlus
      case 'unfollow':
        return UserMinus
      case 'share':
        return Share2
      case 'bookmark':
        return Bookmark
      case 'report':
        return Flag
      case 'archive':
        return Archive
      case 'profile_update':
        return User
      case 'settings_change':
        return Settings
      default:
        return Info
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-100 text-green-700'
      case 'post_create':
        return 'bg-blue-100 text-blue-700'
      case 'post_edit':
        return 'bg-yellow-100 text-yellow-700'
      case 'post_delete':
        return 'bg-red-100 text-red-700'
      case 'comment':
        return 'bg-purple-100 text-purple-700'
      case 'like':
        return 'bg-pink-100 text-pink-700'
      case 'follow':
        return 'bg-indigo-100 text-indigo-700'
      case 'unfollow':
        return 'bg-gray-100 text-gray-700'
      case 'share':
        return 'bg-teal-100 text-teal-700'
      case 'bookmark':
        return 'bg-orange-100 text-orange-700'
      case 'report':
        return 'bg-red-100 text-red-700'
      case 'archive':
        return 'bg-gray-100 text-gray-700'
      case 'profile_update':
        return 'bg-cyan-100 text-cyan-700'
      case 'settings_change':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStats = () => {
    const total = activityLogs.length
    const today = activityLogs.filter(a => {
      const today = new Date()
      const activityDate = new Date(a.timestamp)
      return activityDate.toDateString() === today.toDateString()
    }).length
    const thisWeek = activityLogs.filter(a => {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return new Date(a.timestamp) >= weekAgo
    }).length
    const logins = activityLogs.filter(a => a.type === 'login').length

    return { total, today, thisWeek, logins }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            </div>
            <p className="text-gray-600">
              Track all your activities and interactions on the platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <LogIn className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Logins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.logins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-2 rounded-l-lg transition-colors duration-200 ${
                      viewMode === 'timeline' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 rounded-r-lg transition-colors duration-200 ${
                      viewMode === 'table' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'all' || selectedDate !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'No activities recorded yet.'
                }
              </p>
            </div>
          ) : viewMode === 'timeline' ? (
            /* Timeline View */
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{activity.description}</p>

                        {/* Target User/Post */}
                        {(activity.targetUser || activity.targetPost) && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            {activity.targetUser && (
                              <div className="flex items-center space-x-2 mb-2">
                                <img
                                  src={activity.targetUser.avatar}
                                  alt={activity.targetUser.name}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {activity.targetUser.name}
                                </span>
                              </div>
                            )}
                            {activity.targetPost && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Post:</span> {activity.targetPost.title}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Metadata */}
                        {activity.metadata && (
                          <div className="text-xs text-gray-500 space-y-1">
                            {activity.metadata.ipAddress && (
                              <div>IP: {activity.metadata.ipAddress}</div>
                            )}
                            {activity.metadata.device && (
                              <div>Device: {activity.metadata.device}</div>
                            )}
                            {activity.metadata.location && (
                              <div>Location: {activity.metadata.location}</div>
                            )}
                            {activity.metadata.oldValue && activity.metadata.newValue && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                                <div className="font-medium text-yellow-800 mb-1">Changes:</div>
                                <div className="text-yellow-700">
                                  <div>From: {activity.metadata.oldValue}</div>
                                  <div>To: {activity.metadata.newValue}</div>
                                </div>
                              </div>
                            )}
                            {activity.metadata.reason && (
                              <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                                <div className="font-medium text-red-800 mb-1">Reason:</div>
                                <div className="text-red-700">{activity.metadata.reason}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivities.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type)
                      return (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                <ActivityIcon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {activity.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.targetUser ? (
                              <div className="flex items-center space-x-2">
                                <img
                                  src={activity.targetUser.avatar}
                                  alt={activity.targetUser.name}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-900">
                                  {activity.targetUser.name}
                                </span>
                              </div>
                            ) : activity.targetPost ? (
                              <span className="text-sm text-gray-900">
                                {activity.targetPost.title}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 