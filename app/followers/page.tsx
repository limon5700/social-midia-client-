'use client'

import { useState, useMemo } from 'react'
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  MoreHorizontal,
  MapPin,
  Calendar,
  Activity,
  X,
  ChevronDown,
  UserMinus
} from 'lucide-react'
import { users } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface Follower {
  id: string
  user: typeof users[0]
  followedAt: Date
  isFollowing: boolean
  mutualFriends: number
  lastActive?: Date
  location?: string
}

export default function FollowersPage() {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'mutual'>('recent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [filterOnline, setFilterOnline] = useState(false)
  const [filterMutual, setFilterMutual] = useState(false)

  // Mock followers data
  const followers: Follower[] = [
    {
      id: '1',
      user: users[0],
      followedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 12,
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      user: users[1],
      followedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isFollowing: false,
      mutualFriends: 8,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'New York, NY'
    },
    {
      id: '3',
      user: users[2],
      followedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 15,
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: 'Los Angeles, CA'
    },
    {
      id: '4',
      user: users[3],
      followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isFollowing: false,
      mutualFriends: 3,
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      location: 'Chicago, IL'
    },
    {
      id: '5',
      user: {
        id: '5',
        name: 'Emma Davis',
        username: 'emmadavis',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        followers: 0,
        following: 0,
        verified: false
      },
      followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 20,
      lastActive: new Date(Date.now() - 15 * 60 * 1000),
      location: 'Miami, FL'
    },
    {
      id: '6',
      user: {
        id: '6',
        name: 'Alex Johnson',
        username: 'alexjohnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        followers: 0,
        following: 0,
        verified: true
      },
      followedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isFollowing: false,
      mutualFriends: 5,
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      location: 'Seattle, WA'
    }
  ]

  // Mock following data
  const following: Follower[] = [
    {
      id: '1',
      user: users[0],
      followedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 12,
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      user: users[1],
      followedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 8,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'New York, NY'
    },
    {
      id: '3',
      user: users[2],
      followedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 15,
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: 'Los Angeles, CA'
    },
    {
      id: '4',
      user: users[3],
      followedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isFollowing: true,
      mutualFriends: 3,
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      location: 'Chicago, IL'
    }
  ]

  // Get current data based on active tab
  const currentData = activeTab === 'followers' ? followers : following

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = currentData.filter(item => {
      const matchesSearch = item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesOnline = !filterOnline || (item.lastActive && 
        (Date.now() - item.lastActive.getTime()) < 5 * 60 * 1000) // Online if active in last 5 minutes
      
      const matchesMutual = !filterMutual || item.mutualFriends > 0
      
      return matchesSearch && matchesOnline && matchesMutual
    })

    // Sort data
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'recent':
          comparison = b.followedAt.getTime() - a.followedAt.getTime()
          break
        case 'name':
          comparison = a.user.name.localeCompare(b.user.name)
          break
        case 'mutual':
          comparison = b.mutualFriends - a.mutualFriends
          break
      }
      
      return sortOrder === 'desc' ? comparison : -comparison
    })

    return filtered
  }, [currentData, searchQuery, sortBy, sortOrder, filterOnline, filterMutual])

  const handleFollow = (userId: string) => {
    console.log('Follow user:', userId)
  }

  const handleUnfollow = (userId: string) => {
    console.log('Unfollow user:', userId)
  }

  const handleRemove = (userId: string) => {
    console.log('Remove follower:', userId)
  }

  const handleBlock = (userId: string) => {
    console.log('Block user:', userId)
  }

  const isOnline = (lastActive?: Date) => {
    if (!lastActive) return false
    return (Date.now() - lastActive.getTime()) < 5 * 60 * 1000 // 5 minutes
  }

  const getTabCount = (type: 'followers' | 'following') => {
    return type === 'followers' ? followers.length : following.length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Followers & Following</h1>
            <p className="text-gray-600 mt-1">
              Manage your connections and discover new people
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'followers', label: 'Followers', icon: Users },
                { id: 'following', label: 'Following', icon: UserPlus }
              ].map((tab) => {
                const Icon = tab.icon
                const count = getTabCount(tab.id as 'followers' | 'following')
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'followers' | 'following')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or username..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'mutual')}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name</option>
                  <option value="mutual">Mutual Friends</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 border rounded-lg transition-colors duration-200 ${
                    showFilters || filterOnline || filterMutual
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filterOnline}
                      onChange={(e) => setFilterOnline(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Online only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filterMutual}
                      onChange={(e) => setFilterMutual(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Mutual friends only</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-3">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => (
                <FollowerCard
                  key={item.id}
                  item={item}
                  activeTab={activeTab}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onRemove={handleRemove}
                  onBlock={handleBlock}
                  isOnline={isOnline}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} found
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No ${activeTab} match your search criteria.`
                    : `You don't have any ${activeTab} yet.`
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

// Follower Card Component
interface FollowerCardProps {
  item: Follower
  activeTab: 'followers' | 'following'
  onFollow: (userId: string) => void
  onUnfollow: (userId: string) => void
  onRemove: (userId: string) => void
  onBlock: (userId: string) => void
  isOnline: (lastActive?: Date) => boolean
}

function FollowerCard({ 
  item, 
  activeTab, 
  onFollow, 
  onUnfollow, 
  onRemove, 
  onBlock, 
  isOnline 
}: FollowerCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <img
            src={item.user.avatar}
            alt={item.user.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
          />
          {isOnline(item.lastActive) && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">{item.user.name}</h3>
            {item.user.verified && (
              <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">@{item.user.username}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            {item.mutualFriends > 0 && (
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{item.mutualFriends} mutual</span>
              </span>
            )}
            {item.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Followed {formatTimeAgo(item.followedAt)}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {activeTab === 'followers' ? (
            // Followers tab actions
            <>
              {item.isFollowing ? (
                <button
                  onClick={() => onUnfollow(item.user.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => onFollow(item.user.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                >
                  Follow
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => onRemove(item.user.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <UserMinus className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                    <button
                      onClick={() => onBlock(item.user.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Block</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Following tab actions
            <>
              <button
                onClick={() => onUnfollow(item.user.id)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Following
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => onBlock(item.user.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Block</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 