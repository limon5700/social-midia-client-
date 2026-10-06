'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Search, 
  Users, 
  Hash, 
  Image, 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  MapPin, 
  Calendar,
  TrendingUp,
  Eye,
  Bookmark,
  Filter,
  X,
  ArrowRight
} from 'lucide-react'
import { users, posts, reels, hashtags } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'user' | 'post' | 'hashtag' | 'reel'
  title: string
  subtitle?: string
  image?: string
  stats?: {
    followers?: number
    posts?: number
    likes?: number
    comments?: number
    views?: number
    postsCount?: number
  }
  metadata?: {
    location?: string
    createdAt?: Date
    isFollowing?: boolean
    isLiked?: boolean
    isSaved?: boolean
  }
  content?: string
  hashtags?: string[]
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const query = searchParams.get('q') || ''
  
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'hashtags' | 'reels'>('all')
  const [searchQuery, setSearchQuery] = useState(query)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null // Will redirect to auth page
  }

  // Simulate search results based on query
  const searchResults: SearchResult[] = [
    // User results
    {
      id: 'user1',
      type: 'user',
      title: 'Sarah Wilson',
      subtitle: '@sarahwilson',
      image: users[0].avatar,
      stats: {
        followers: 8920,
        posts: 156
      },
      metadata: {
        location: 'San Francisco, CA',
        isFollowing: false
      }
    },
    {
      id: 'user2',
      type: 'user',
      title: 'Mike Chen',
      subtitle: '@mikechen',
      image: users[1].avatar,
      stats: {
        followers: 15670,
        posts: 234
      },
      metadata: {
        location: 'New York, NY',
        isFollowing: true
      }
    },
    // Post results
    {
      id: 'post1',
      type: 'post',
      title: 'Amazing mountain hike!',
      subtitle: 'Sarah Wilson',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      stats: {
        likes: 1247,
        comments: 89
      },
      metadata: {
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isLiked: true,
        isSaved: false
      },
      content: 'Just finished an amazing hike in the mountains! The views were absolutely breathtaking. 🏔️ #adventure #nature #hiking',
      hashtags: ['adventure', 'nature', 'hiking']
    },
    {
      id: 'post2',
      type: 'post',
      title: 'Homemade ramen',
      subtitle: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      stats: {
        likes: 892,
        comments: 45
      },
      metadata: {
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isLiked: false,
        isSaved: true
      },
      content: 'Today\'s special: Homemade ramen with fresh ingredients! The broth took 8 hours to make, but it was totally worth it. 🍜',
      hashtags: ['food', 'ramen', 'homemade']
    },
    // Hashtag results
    {
      id: 'hashtag1',
      type: 'hashtag',
      title: '#adventure',
      subtitle: 'Adventure & Travel',
      stats: {
        postsCount: 125000
      },
      metadata: {
        isFollowing: false
      }
    },
    {
      id: 'hashtag2',
      type: 'hashtag',
      title: '#food',
      subtitle: 'Food & Cooking',
      stats: {
        postsCount: 890000
      },
      metadata: {
        isFollowing: true
      }
    },
    {
      id: 'hashtag3',
      type: 'hashtag',
      title: '#fitness',
      subtitle: 'Health & Fitness',
      stats: {
        postsCount: 567000
      },
      metadata: {
        isFollowing: false
      }
    },
    // Reel results
    {
      id: 'reel1',
      type: 'reel',
      title: 'Morning workout routine',
      subtitle: 'Emma Davis',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop',
      stats: {
        likes: 2156,
        comments: 123,
        views: 45000
      },
      metadata: {
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isLiked: false,
        isSaved: false
      },
      content: 'Quick morning routine that changed my productivity! ⚡ #Productivity #MorningRoutine #LifeHack'
    },
    {
      id: 'reel2',
      type: 'reel',
      title: 'Cooking tutorial',
      subtitle: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
      stats: {
        likes: 3456,
        comments: 234,
        views: 67000
      },
      metadata: {
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isLiked: true,
        isSaved: true
      },
      content: 'Learn how to make the perfect pasta! 🍝 #Cooking #Pasta #Tutorial'
    }
  ]

  // Filter results based on active tab
  const filteredResults = searchResults.filter(result => {
    if (activeTab === 'all') return true
    if (activeTab === 'users') return result.type === 'user'
    if (activeTab === 'posts') return result.type === 'post'
    if (activeTab === 'hashtags') return result.type === 'hashtag'
    if (activeTab === 'reels') return result.type === 'reel'
    return true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would trigger a new search
      console.log('Searching for:', searchQuery)
    }
  }

  const handleFollow = (resultId: string) => {
    console.log('Follow:', resultId)
  }

  const handleLike = (resultId: string) => {
    console.log('Like:', resultId)
  }

  const handleSave = (resultId: string) => {
    console.log('Save:', resultId)
  }

  const handleShare = (resultId: string) => {
    console.log('Share:', resultId)
  }

  const handleViewProfile = (userId: string) => {
    console.log('View profile:', userId)
  }

  const handleViewPost = (postId: string) => {
    console.log('View post:', postId)
  }

  const getTabCount = (type: string) => {
    return searchResults.filter(result => result.type === type).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Header */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users, posts, hashtags, or reels..."
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600">
                {filteredResults.length} results for "{query}"
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'all', label: 'All', icon: Search },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'posts', label: 'Posts', icon: Image },
                { id: 'hashtags', label: 'Hashtags', icon: Hash },
                { id: 'reels', label: 'Reels', icon: Play }
              ].map((tab) => {
                const Icon = tab.icon
                const count = tab.id === 'all' ? searchResults.length : getTabCount(tab.id)
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 whitespace-nowrap ${
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

          {/* Search Results */}
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <SearchResultCard
                  key={result.id}
                  result={result}
                  onFollow={handleFollow}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                  onViewProfile={handleViewProfile}
                  onViewPost={handleViewPost}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse our trending content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Search Result Card Component
interface SearchResultCardProps {
  result: SearchResult
  onFollow: (id: string) => void
  onLike: (id: string) => void
  onSave: (id: string) => void
  onShare: (id: string) => void
  onViewProfile: (id: string) => void
  onViewPost: (id: string) => void
}

function SearchResultCard({ 
  result, 
  onFollow, 
  onLike, 
  onSave, 
  onShare, 
  onViewProfile, 
  onViewPost 
}: SearchResultCardProps) {
  const renderUserCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <img
          src={result.image}
          alt={result.title}
          className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
              <p className="text-gray-500">{result.subtitle}</p>
            </div>
            <button
              onClick={() => onFollow(result.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                result.metadata?.isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {result.metadata?.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{formatNumber(result.stats?.followers || 0)} followers</span>
            <span>{result.stats?.posts} posts</span>
            {result.metadata?.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{result.metadata.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPostCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={result.image}
              alt={result.title}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{result.subtitle}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{result.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(result.stats?.likes || 0)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(result.stats?.comments || 0)}</span>
              </span>
              <span>{formatTimeAgo(result.metadata?.createdAt || new Date())}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLike(result.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  result.metadata?.isLiked 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-4 w-4 ${result.metadata?.isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => onSave(result.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  result.metadata?.isSaved 
                    ? 'text-blue-500 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${result.metadata?.isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={result.image}
            alt={result.title}
            className="h-24 w-24 object-cover"
          />
        </div>
      </div>
    </div>
  )

  const renderHashtagCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Hash className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
            <p className="text-gray-500 text-sm">{result.subtitle}</p>
            <p className="text-sm text-gray-600">{formatNumber(result.stats?.postsCount || 0)} posts</p>
          </div>
        </div>
        <button
          onClick={() => onFollow(result.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            result.metadata?.isFollowing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {result.metadata?.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  )

  const renderReelCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={result.image}
              alt={result.title}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{result.subtitle}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{result.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(result.stats?.likes || 0)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(result.stats?.views || 0)}</span>
              </span>
              <span>{formatTimeAgo(result.metadata?.createdAt || new Date())}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLike(result.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  result.metadata?.isLiked 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-4 w-4 ${result.metadata?.isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => onSave(result.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  result.metadata?.isSaved 
                    ? 'text-blue-500 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${result.metadata?.isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 relative">
          <img
            src={result.image}
            alt={result.title}
            className="h-24 w-24 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  )

  switch (result.type) {
    case 'user':
      return renderUserCard()
    case 'post':
      return renderPostCard()
    case 'hashtag':
      return renderHashtagCard()
    case 'reel':
      return renderReelCard()
    default:
      return null
  }
} 