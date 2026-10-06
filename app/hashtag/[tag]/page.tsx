'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Hash, 
  TrendingUp, 
  Users, 
  Grid, 
  List, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Play,
  Image,
  Eye,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Calendar,
  MapPin,
  ArrowLeft
} from 'lucide-react'
import { users, posts, reels } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface HashtagPost {
  id: string
  type: 'post' | 'reel'
  content: string
  media?: string
  user: typeof users[0]
  likes: number
  comments: number
  views?: number
  createdAt: Date
  isLiked?: boolean
  isSaved?: boolean
  hashtags: string[]
}

export default function HashtagPage() {
  const params = useParams()
  const hashtag = params.tag as string
  
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mock hashtag data
  const hashtagData = {
    name: hashtag,
    postsCount: 125000,
    isTrending: true,
    trendGrowth: 15.5,
    description: `Discover amazing content tagged with #${hashtag}`,
    relatedTags: ['adventure', 'travel', 'explore', 'nature', 'outdoors']
  }

  // Mock posts using this hashtag
  const hashtagPosts: HashtagPost[] = [
    {
      id: '1',
      type: 'post',
      content: `Just finished an amazing hike in the mountains! The views were absolutely breathtaking. 🏔️ #${hashtag} #adventure #nature #hiking`,
      media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      user: users[0],
      likes: 1247,
      comments: 89,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLiked: true,
      isSaved: false,
      hashtags: [hashtag, 'adventure', 'nature', 'hiking']
    },
    {
      id: '2',
      type: 'reel',
      content: `Quick morning routine that changed my productivity! ⚡ #${hashtag} #Productivity #MorningRoutine #LifeHack`,
      media: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
      user: users[1],
      likes: 2156,
      comments: 123,
      views: 45000,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isLiked: false,
      isSaved: true,
      hashtags: [hashtag, 'Productivity', 'MorningRoutine', 'LifeHack']
    },
    {
      id: '3',
      type: 'post',
      content: `Beautiful sunset at the beach today! 🌅 Nature never fails to amaze me #${hashtag} #Sunset #Beach #Nature #Photography`,
      media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      user: users[2],
      likes: 892,
      comments: 45,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isLiked: false,
      isSaved: false,
      hashtags: [hashtag, 'Sunset', 'Beach', 'Nature', 'Photography']
    },
    {
      id: '4',
      type: 'reel',
      content: `Amazing street food tour in Bangkok! 🍜 The flavors are incredible #${hashtag} #FoodieLife #Travel #Bangkok #StreetFood`,
      media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      user: users[3],
      likes: 3456,
      comments: 234,
      views: 67000,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isLiked: true,
      isSaved: false,
      hashtags: [hashtag, 'FoodieLife', 'Travel', 'Bangkok', 'StreetFood']
    },
    {
      id: '5',
      type: 'post',
      content: `Working from my favorite coffee shop today! ☕ #${hashtag} #WorkFromAnywhere #CoffeeShop #Productivity`,
      media: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      user: users[0],
      likes: 567,
      comments: 23,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isLiked: false,
      isSaved: true,
      hashtags: [hashtag, 'WorkFromAnywhere', 'CoffeeShop', 'Productivity']
    },
    {
      id: '6',
      type: 'reel',
      content: `Piano cover of my favorite song 🎹 #${hashtag} #Music #Piano #Cover #Art`,
      media: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
      user: users[1],
      likes: 1234,
      comments: 67,
      views: 32000,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      isLiked: true,
      isSaved: false,
      hashtags: [hashtag, 'Music', 'Piano', 'Cover', 'Art']
    }
  ]

  // Sort posts based on selected criteria
  const sortedPosts = [...hashtagPosts].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime()
    } else {
      return b.likes - a.likes
    }
  })

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId)
  }

  const handleSave = (postId: string) => {
    console.log('Saved post:', postId)
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
  }

  const handleViewPost = (postId: string) => {
    console.log('View post:', postId)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Play className="h-4 w-4" />
      case 'post':
        return <Image className="h-4 w-4" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-300 rounded-xl mb-6"></div>
              <div className="h-24 bg-gray-300 rounded-xl mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Trending Banner */}
          {hashtagData.isTrending && (
            <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-xl p-4 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Trending Now</h3>
                    <p className="text-sm opacity-90">
                      #{hashtag} is trending with {hashtagData.trendGrowth}% growth
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{hashtagData.trendGrowth}%</div>
                  <div className="text-sm opacity-90">Growth</div>
                </div>
              </div>
            </div>
          )}

          {/* Hashtag Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Hash className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">#{hashtag}</h1>
                  <p className="text-gray-600 mt-1">{hashtagData.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{formatNumber(hashtagData.postsCount)} posts</span>
                    </span>
                    {hashtagData.isTrending && (
                      <span className="flex items-center space-x-1 text-red-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>Trending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? (
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Following</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </div>
                  )}
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Related Tags */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {hashtagData.relatedTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('feed')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'feed' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                  <HashtagPostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
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
                  <HashtagPostFeed
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={handleShare}
                    onViewPost={handleViewPost}
                    getContentTypeIcon={getContentTypeIcon}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hashtag Post Card Component
interface HashtagPostCardProps {
  post: HashtagPost
  onLike: (id: string) => void
  onSave: (id: string) => void
  onShare: (id: string) => void
  onViewPost: (id: string) => void
  getContentTypeIcon: (type: string) => React.ReactNode
}

function HashtagPostCard({ post, onLike, onSave, onShare, onViewPost, getContentTypeIcon }: HashtagPostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Media */}
      {post.media && (
        <div className="relative group">
          <img
            src={post.media}
            alt={post.content}
            className="w-full h-64 object-cover"
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
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onLike(post.id)}
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
        {/* User info */}
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">{post.user.name}</span>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>

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
            {post.views && (
              <span className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(post.views)}</span>
              </span>
            )}
          </div>
          <span className="text-gray-400">{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-1 transition-colors duration-200 ${
              post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">Like</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSave(post.id)}
              className={`p-1 transition-colors duration-200 ${
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

// Hashtag Post Feed Component
function HashtagPostFeed({ post, onLike, onSave, onShare, onViewPost, getContentTypeIcon }: HashtagPostCardProps) {
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
          {/* User info */}
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-900">{post.user.name}</span>
          </div>

          {/* Caption */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>

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
              {post.views && (
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatNumber(post.views)}</span>
                </span>
              )}
            </div>
            <span className="text-gray-400">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewPost(post.id)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onLike(post.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              post.isLiked 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
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