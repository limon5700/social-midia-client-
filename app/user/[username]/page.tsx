'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play,
  Video,
  Image,
  Grid,
  BookOpen,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Settings,
  Mail,
  MapPin,
  Link,
  Calendar,
  Users,
  Eye,
  Bookmark
} from 'lucide-react'
import { users, posts, reels } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface ProfilePost {
  id: string
  type: 'post' | 'reel'
  content: string
  media?: string
  likes: number
  comments: number
  views: number
  createdAt: Date
  isLiked?: boolean
  isSaved?: boolean
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFollowMenu, setShowFollowMenu] = useState(false)

  // Find user by username
  const user = users.find(u => u.username === username) || users[0]
  
  // Mock user posts and reels
  const userPosts: ProfilePost[] = posts
    .filter(post => post.user.id === user.id)
    .map(post => ({
      id: post.id,
      type: 'post' as const,
      content: post.content,
      media: post.images?.[0],
      likes: post.likes,
      comments: post.comments,
      views: post.likes * 10, // Mock views
      createdAt: post.createdAt,
      isLiked: post.isLiked,
      isSaved: post.isSaved
    }))

  const userReels: ProfilePost[] = reels
    .filter(reel => reel.user.id === user.id)
    .map(reel => ({
      id: reel.id,
      type: 'reel' as const,
      content: reel.caption,
      media: reel.video,
      likes: reel.likes,
      comments: reel.comments,
      views: reel.views,
      createdAt: reel.createdAt,
      isLiked: reel.isLiked,
      isSaved: false
    }))

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setShowFollowMenu(false)
  }

  const handleUnfollow = () => {
    setIsFollowing(false)
    setShowFollowMenu(false)
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
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 mb-8">
                <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gray-300 rounded-full mb-6 lg:mb-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="flex space-x-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentData = activeTab === 'posts' ? userPosts : activeTab === 'reels' ? userReels : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                {/* Username and Verification */}
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {user.isVerified && (
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-gray-500 text-lg">@{user.username}</span>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{userPosts.length}</div>
                    <div className="text-sm text-gray-500">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{formatNumber(user.followers)}</div>
                    <div className="text-sm text-gray-500">followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{formatNumber(user.following)}</div>
                    <div className="text-sm text-gray-500">following</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {isFollowing ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowFollowMenu(!showFollowMenu)}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Following</span>
                      </button>
                      
                      {showFollowMenu && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={handleUnfollow}
                            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            Unfollow
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </button>
                  )}
                  
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Mail className="h-4 w-4" />
                  </button>
                  
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'posts'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
                <span>Posts</span>
              </button>
              
              <button
                onClick={() => setActiveTab('reels')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'reels'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Play className="h-5 w-5" />
                <span>Reels</span>
              </button>
              
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'saved'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bookmark className="h-5 w-5" />
                <span>Saved</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {currentData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentData.map((post) => (
                    <ProfilePostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSave}
                      onShare={handleShare}
                      getContentTypeIcon={getContentTypeIcon}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    {activeTab === 'posts' && <Grid className="h-16 w-16 mx-auto" />}
                    {activeTab === 'reels' && <Play className="h-16 w-16 mx-auto" />}
                    {activeTab === 'saved' && <Bookmark className="h-16 w-16 mx-auto" />}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab} yet
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'posts' && "When you share photos and videos, they'll appear on your profile."}
                    {activeTab === 'reels' && "When you create reels, they'll appear here."}
                    {activeTab === 'saved' && "Save photos and videos that you want to see again."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile Post Card Component
interface ProfilePostCardProps {
  post: ProfilePost
  onLike: (id: string) => void
  onSave: (id: string) => void
  onShare: (id: string) => void
  getContentTypeIcon: (type: string) => React.ReactNode
}

function ProfilePostCard({ post, onLike, onSave, onShare, getContentTypeIcon }: ProfilePostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Media */}
      {post.media && (
        <div className="relative group">
          {post.type === 'post' ? (
            <img
              src={post.media}
              alt={post.content}
              className="w-full h-64 object-cover"
            />
          ) : (
            <video
              src={post.media}
              className="w-full h-64 object-cover"
              muted
            />
          )}
          
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
                onClick={() => onLike(post.id)}
                className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current text-red-500' : ''}`} />
              </button>
              <button
                onClick={() => onSave(post.id)}
                className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current text-blue-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
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
            <span className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{formatNumber(post.views)}</span>
            </span>
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