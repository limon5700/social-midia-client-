'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Hash, 
  Flame, 
  Zap,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  User,
  Clock,
  ArrowUp,
  TrendingDown,
  Minus,
  Crown,
  Star,
  Users,
  Video,
  Image,
  Music,
  Globe,
  Calendar,
  MapPin
} from 'lucide-react'
import { users, posts, reels } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface TrendingHashtag {
  id: string
  name: string
  posts: number
  views: number
  trend: 'up' | 'down' | 'stable'
  change: number
  category: 'general' | 'entertainment' | 'sports' | 'technology' | 'fashion' | 'food'
}

interface TrendingPost {
  id: string
  type: 'post' | 'reel' | 'video'
  content: string
  media?: string
  creator: typeof users[0]
  likes: number
  comments: number
  shares: number
  views: number
  createdAt: Date
  trending: boolean
  hashtags: string[]
}

interface TrendingUser {
  user: typeof users[0]
  followers: number
  posts: number
  trending: boolean
  category: string
  recentActivity: string
}

// Mock trending data
const trendingHashtags: TrendingHashtag[] = [
  { id: '1', name: 'TechTrends2024', posts: 15420, views: 8900000, trend: 'up', change: 23, category: 'technology' },
  { id: '2', name: 'FitnessGoals', posts: 8920, views: 5600000, trend: 'up', change: 18, category: 'sports' },
  { id: '3', name: 'FoodieLife', posts: 12340, views: 7200000, trend: 'up', change: 15, category: 'food' },
  { id: '4', name: 'FashionWeek', posts: 6780, views: 4200000, trend: 'down', change: -8, category: 'fashion' },
  { id: '5', name: 'MovieNight', posts: 9870, views: 6100000, trend: 'up', change: 12, category: 'entertainment' },
  { id: '6', name: 'TravelDiaries', posts: 11230, views: 6800000, trend: 'up', change: 9, category: 'general' },
  { id: '7', name: 'GamingLife', posts: 7560, views: 4800000, trend: 'stable', change: 0, category: 'entertainment' },
  { id: '8', name: 'ArtInspiration', posts: 5430, views: 3200000, trend: 'up', change: 6, category: 'general' }
]

const trendingPosts: TrendingPost[] = [
  {
    id: '1',
    type: 'reel',
    content: 'This workout routine changed my life! 💪 #FitnessGoals #Motivation',
    media: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    creator: users[0],
    likes: 89234,
    comments: 1234,
    shares: 567,
    views: 1200000,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    trending: true,
    hashtags: ['FitnessGoals', 'Motivation', 'Workout']
  },
  {
    id: '2',
    type: 'post',
    content: 'Just launched my new tech startup! 🚀 The future of AI is here. #TechTrends2024 #StartupLife',
    creator: users[1],
    likes: 45678,
    comments: 892,
    shares: 234,
    views: 890000,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    trending: true,
    hashtags: ['TechTrends2024', 'StartupLife', 'AI']
  },
  {
    id: '3',
    type: 'video',
    content: 'Amazing street food tour in Bangkok! 🍜 The flavors are incredible #FoodieLife #Travel',
    media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    creator: users[2],
    likes: 67890,
    comments: 1456,
    shares: 789,
    views: 1500000,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    trending: true,
    hashtags: ['FoodieLife', 'Travel', 'Bangkok']
  },
  {
    id: '4',
    type: 'reel',
    content: 'Quick makeup tutorial for beginners! 💄 #BeautyTips #Makeup',
    media: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
    creator: users[3],
    likes: 34567,
    comments: 678,
    shares: 345,
    views: 750000,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    trending: true,
    hashtags: ['BeautyTips', 'Makeup', 'Tutorial']
  }
]

const trendingUsers: TrendingUser[] = [
  {
    user: users[0],
    followers: 890000,
    posts: 234,
    trending: true,
    category: 'Fitness Influencer',
    recentActivity: 'Posted a viral workout video'
  },
  {
    user: users[1],
    followers: 567000,
    posts: 156,
    trending: true,
    category: 'Tech Entrepreneur',
    recentActivity: 'Launched new AI startup'
  },
  {
    user: users[2],
    followers: 1234000,
    posts: 445,
    trending: true,
    category: 'Travel Blogger',
    recentActivity: 'Shared Bangkok food tour'
  },
  {
    user: users[3],
    followers: 789000,
    posts: 289,
    trending: true,
    category: 'Beauty Creator',
    recentActivity: 'Posted makeup tutorial'
  }
]

const categories = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'entertainment', label: 'Entertainment', icon: Star },
  { id: 'sports', label: 'Sports', icon: Zap },
  { id: 'technology', label: 'Technology', icon: TrendingUp },
  { id: 'fashion', label: 'Fashion', icon: Crown },
  { id: 'food', label: 'Food', icon: Heart }
]

export default function TrendingPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today')

  const filteredHashtags = activeCategory === 'all' 
    ? trendingHashtags 
    : trendingHashtags.filter(tag => tag.category === activeCategory)

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800',
      sports: 'bg-green-100 text-green-800',
      food: 'bg-orange-100 text-orange-800',
      fashion: 'bg-pink-100 text-pink-800',
      entertainment: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Trending Now</h1>
            </div>
            <p className="text-gray-600">Discover what's hot and happening right now</p>
          </div>

          {/* Time Filter */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 border border-gray-200 shadow-sm">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id as 'today' | 'week' | 'month')}
                className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                  timeFilter === filter.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Trending Hashtags Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Hash className="h-5 w-5 text-orange-500" />
                <span>Trending Hashtags</span>
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isActive = activeCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Hashtags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredHashtags.map((hashtag, index) => (
                <div
                  key={hashtag.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                    index < 3 ? 'ring-2 ring-orange-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-gray-900">#{hashtag.name}</span>
                      {index < 3 && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    {getTrendIcon(hashtag.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-semibold text-gray-900">{formatNumber(hashtag.posts)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Views</span>
                      <span className="font-semibold text-gray-900">{formatNumber(hashtag.views)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trend</span>
                      <span className={`font-semibold ${
                        hashtag.trend === 'up' ? 'text-green-600' : 
                        hashtag.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {hashtag.trend === 'up' ? '+' : ''}{hashtag.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(hashtag.category)}`}>
                      {hashtag.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Posts Section */}
          <div className="mb-8">
                         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
               <Flame className="h-5 w-5 text-red-500" />
               <span>Viral Content</span>
             </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.creator.avatar}
                        alt={post.creator.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                                                 <div className="flex items-center space-x-2">
                           <h3 className="font-semibold text-gray-900">{post.creator.name}</h3>
                           {post.trending && <Flame className="h-4 w-4 text-red-500" />}
                         </div>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-900 mb-3">{post.content}</p>
                    
                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-blue-500 text-sm">#{tag}</span>
                      ))}
                    </div>

                    {/* Media */}
                    {post.media && (
                      <div className="relative mb-4">
                        <img
                          src={post.media}
                          alt="Post media"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {post.type === 'video' && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                            <div className="bg-white bg-opacity-90 rounded-full p-2">
                              <Play className="h-6 w-6 text-gray-800 ml-1" />
                            </div>
                          </div>
                        )}
                        {post.type === 'reel' && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            REEL
                          </div>
                        )}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{formatNumber(post.likes)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatNumber(post.comments)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{formatNumber(post.shares)}</span>
                        </span>
                      </div>
                      <span className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(post.views)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Users Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Trending Creators</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingUsers.map((trendingUser, index) => (
                <div
                  key={trendingUser.user.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                    index < 2 ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      <img
                        src={trendingUser.user.avatar}
                        alt={trendingUser.user.name}
                        className="h-16 w-16 rounded-full object-cover mx-auto"
                      />
                      {trendingUser.trending && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                          HOT
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{trendingUser.user.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{trendingUser.category}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Followers</span>
                        <span className="font-semibold">{formatNumber(trendingUser.followers)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posts</span>
                        <span className="font-semibold">{trendingUser.posts}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">{trendingUser.recentActivity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 