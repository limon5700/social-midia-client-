'use client'

import { useState } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Play,
  Video,
  Image,
  Grid,
  List,
  Search,
  Filter,
  Calendar,
  User,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Bookmark
} from 'lucide-react'
import { users, posts, reels } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface LikedPost {
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
  likedAt: Date
  hashtags: string[]
  isSaved?: boolean
}

// Mock liked posts data
const likedPosts: LikedPost[] = [
  {
    id: '1',
    type: 'reel',
    content: 'This workout routine changed my life! 💪 #FitnessGoals #Motivation #Workout',
    media: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    creator: users[0],
    likes: 89234,
    comments: 1234,
    shares: 567,
    views: 1200000,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    hashtags: ['FitnessGoals', 'Motivation', 'Workout'],
    isSaved: true
  },
  {
    id: '2',
    type: 'post',
    content: 'Just launched my new tech startup! 🚀 The future of AI is here. #TechTrends2024 #StartupLife #AI #Innovation',
    creator: users[1],
    likes: 45678,
    comments: 892,
    shares: 234,
    views: 890000,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hashtags: ['TechTrends2024', 'StartupLife', 'AI', 'Innovation']
  },
  {
    id: '3',
    type: 'video',
    content: 'Amazing street food tour in Bangkok! 🍜 The flavors are incredible #FoodieLife #Travel #Bangkok #StreetFood',
    media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    creator: users[2],
    likes: 67890,
    comments: 1456,
    shares: 789,
    views: 1500000,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    hashtags: ['FoodieLife', 'Travel', 'Bangkok', 'StreetFood'],
    isSaved: false
  },
  {
    id: '4',
    type: 'reel',
    content: 'Quick makeup tutorial for beginners! 💄 #BeautyTips #Makeup #Tutorial #Beauty',
    media: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
    creator: users[3],
    likes: 34567,
    comments: 678,
    shares: 345,
    views: 750000,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hashtags: ['BeautyTips', 'Makeup', 'Tutorial', 'Beauty'],
    isSaved: true
  },
  {
    id: '5',
    type: 'post',
    content: 'Beautiful sunset at the beach today! 🌅 Nature never fails to amaze me #Sunset #Beach #Nature #Photography',
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    creator: users[0],
    likes: 23456,
    comments: 456,
    shares: 123,
    views: 450000,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    hashtags: ['Sunset', 'Beach', 'Nature', 'Photography']
  },
  {
    id: '6',
    type: 'video',
    content: 'Piano cover of my favorite song 🎹 #Music #Piano #Cover #Art',
    media: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    creator: users[1],
    likes: 56789,
    comments: 789,
    shares: 234,
    views: 980000,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    hashtags: ['Music', 'Piano', 'Cover', 'Art'],
    isSaved: false
  },
  {
    id: '7',
    type: 'reel',
    content: 'Life hack: How to organize your closet in 5 minutes! 🧥 #Organization #LifeHack #Home #Tips',
    media: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    creator: users[2],
    likes: 12345,
    comments: 234,
    shares: 89,
    views: 320000,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    hashtags: ['Organization', 'LifeHack', 'Home', 'Tips'],
    isSaved: true
  },
  {
    id: '8',
    type: 'post',
    content: 'Coffee and good books - my perfect Sunday morning ☕📚 #Coffee #Books #Sunday #Relaxation',
    creator: users[3],
    likes: 18923,
    comments: 345,
    shares: 156,
    views: 280000,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    hashtags: ['Coffee', 'Books', 'Sunday', 'Relaxation']
  },
  {
    id: '9',
    type: 'video',
    content: 'DIY home decoration ideas that look expensive ✨ #DIY #Home #Decoration #Creative',
    media: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
    creator: users[0],
    likes: 45678,
    comments: 567,
    shares: 234,
    views: 650000,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hashtags: ['DIY', 'Home', 'Decoration', 'Creative'],
    isSaved: false
  },
  {
    id: '10',
    type: 'reel',
    content: 'Morning meditation routine for beginners 🧘‍♀️ #Meditation #Wellness #Mindfulness #Health',
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    creator: users[1],
    likes: 23456,
    comments: 345,
    shares: 123,
    views: 420000,
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
    likedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    hashtags: ['Meditation', 'Wellness', 'Mindfulness', 'Health'],
    isSaved: true
  }
]

export default function LikedPostsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular'>('recent')
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'videos' | 'reels'>('all')

  const filteredPosts = likedPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType =
      filterType === 'all' ||
      (filterType === 'posts' && post.type === 'post') ||
      (filterType === 'videos' && post.type === 'video') ||
      (filterType === 'reels' && post.type === 'reel')
    
    return matchesSearch && matchesType
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.likedAt.getTime() - a.likedAt.getTime()
      case 'oldest':
        return a.likedAt.getTime() - b.likedAt.getTime()
      case 'popular':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const handleUnlike = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Unliked post:', postId)
  }

  const handleSave = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Saved post:', postId)
  }

  const handleShare = (postId: string) => {
    // In a real app, this would open share dialog
    console.log('Share post:', postId)
  }

  const handleViewPost = (postId: string) => {
    // In a real app, this would navigate to the full post
    console.log('View post:', postId)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'reel':
        return <Play className="h-4 w-4" />
      case 'post':
        return <Image className="h-4 w-4" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Liked Posts</h1>
            </div>
            <p className="text-gray-600">All the content you've loved and saved</p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search liked posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'posts' | 'videos' | 'reels')}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="posts">Posts</option>
                <option value="videos">Videos</option>
                <option value="reels">Reels</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'popular')}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {sortedPosts.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Liked Posts ({sortedPosts.length})
                  </h2>
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedPosts.map((post) => (
                      <LikedPostCard
                        key={post.id}
                        post={post}
                        onUnlike={handleUnlike}
                        onSave={handleSave}
                        onShare={handleShare}
                        onViewPost={handleViewPost}
                        getContentTypeIcon={getContentTypeIcon}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedPosts.map((post) => (
                      <LikedPostList
                        key={post.id}
                        post={post}
                        onUnlike={handleUnlike}
                        onSave={handleSave}
                        onShare={handleShare}
                        onViewPost={handleViewPost}
                        getContentTypeIcon={getContentTypeIcon}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Heart className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No liked posts found' : 'No liked posts yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search or filters'
                    : 'Start liking posts to see them here'
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

// Liked Post Card Component
interface LikedPostCardProps {
  post: LikedPost
  onUnlike: (id: string) => void
  onSave: (id: string) => void
  onShare: (id: string) => void
  onViewPost: (id: string) => void
  getContentTypeIcon: (type: string) => React.ReactNode
}

function LikedPostCard({ post, onUnlike, onSave, onShare, onViewPost, getContentTypeIcon }: LikedPostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Media */}
      {post.media && (
        <div className="relative group">
          <img
            src={post.media}
            alt={post.content}
            className="w-full h-48 object-cover"
          />
          
          {/* Content type badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              {getContentTypeIcon(post.type)}
              <span className="capitalize">{post.type}</span>
            </div>
          </div>

          {/* Action buttons on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={() => onViewPost(post.id)}
                className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => onUnlike(post.id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Creator info */}
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={post.creator.avatar}
            alt={post.creator.name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">{post.creator.name}</span>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-blue-500 text-xs">#{tag}</span>
          ))}
          {post.hashtags.length > 3 && (
            <span className="text-gray-400 text-xs">+{post.hashtags.length - 3} more</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Heart className="h-3 w-3 fill-current text-red-500" />
              <span>{formatNumber(post.likes)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{formatNumber(post.comments)}</span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatTimeAgo(post.likedAt)}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onUnlike(post.id)}
            className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <Heart className="h-4 w-4 fill-current" />
            <span className="text-sm">Unlike</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSave(post.id)}
              className={`p-1 rounded transition-colors duration-200 ${
                post.isSaved 
                  ? 'text-blue-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Liked Post List Component
function LikedPostList({ post, onUnlike, onSave, onShare, onViewPost, getContentTypeIcon }: LikedPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        {/* Media */}
        {post.media && (
          <div className="relative flex-shrink-0">
            <img
              src={post.media}
              alt={post.content}
              className="w-24 h-24 object-cover rounded-lg"
            />
            
            {/* Content type badge */}
            <div className="absolute top-1 left-1">
              <div className="bg-white bg-opacity-90 text-gray-700 text-xs px-1 py-0.5 rounded flex items-center space-x-1">
                {getContentTypeIcon(post.type)}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Creator info */}
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={post.creator.avatar}
              alt={post.creator.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-900">{post.creator.name}</span>
          </div>

          {/* Caption */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {post.hashtags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-blue-500 text-xs">#{tag}</span>
            ))}
            {post.hashtags.length > 3 && (
              <span className="text-gray-400 text-xs">+{post.hashtags.length - 3} more</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3 fill-current text-red-500" />
                <span>{formatNumber(post.likes)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(post.comments)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{formatNumber(post.shares)}</span>
              </span>
            </div>
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatTimeAgo(post.likedAt)}</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewPost(post.id)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={() => onUnlike(post.id)}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Heart className="h-4 w-4 fill-current" />
          </button>
          <button
            onClick={() => onSave(post.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              post.isSaved 
                ? 'text-blue-500 hover:bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onShare(post.id)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 