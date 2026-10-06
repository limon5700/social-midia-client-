'use client'

import { useState } from 'react'
import { 
  Bookmark, 
  Image, 
  Video, 
  Play,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Filter,
  Grid,
  List,
  Search,
  Calendar,
  User,
  Eye,
  Clock
} from 'lucide-react'
import { currentUser, users } from '@/data/mockData'
import { formatTimeAgo, formatNumber } from '@/lib/utils'

type ContentType = 'all' | 'photos' | 'videos' | 'reels'

interface SavedItem {
  id: string
  type: 'photo' | 'video' | 'reel'
  thumbnail: string
  caption: string
  creator: typeof users[0]
  savedAt: Date
  likes: number
  comments: number
  shares: number
  duration?: string // for videos/reels
  isLiked?: boolean
}

// Mock saved posts data
const savedItems: SavedItem[] = [
  {
    id: '1',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Amazing sunset view from the mountains! 🌄 Perfect hiking spot with breathtaking scenery.',
    creator: users[0],
    savedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 1247,
    comments: 89,
    shares: 23,
    isLiked: true
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    caption: 'Quick cooking tutorial: How to make the perfect pasta in 10 minutes! 🍝',
    creator: users[1],
    savedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 892,
    comments: 156,
    shares: 45,
    duration: '2:34',
    isLiked: false
  },
  {
    id: '3',
    type: 'reel',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    caption: 'Morning workout routine that changed my life 💪 #fitness #motivation',
    creator: users[2],
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 2156,
    comments: 234,
    shares: 67,
    duration: '0:45',
    isLiked: true
  },
  {
    id: '4',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    caption: 'Peaceful forest walk in the morning mist 🌲 Nature is truly healing.',
    creator: users[3],
    savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    likes: 567,
    comments: 34,
    shares: 12,
    isLiked: false
  },
  {
    id: '5',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    caption: 'Amazing street art transformation! Watch this wall come to life 🎨',
    creator: users[0],
    savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    likes: 1892,
    comments: 278,
    shares: 89,
    duration: '4:12',
    isLiked: true
  },
  {
    id: '6',
    type: 'reel',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    caption: 'Easy DIY home decoration ideas that look expensive ✨ #diy #home',
    creator: users[1],
    savedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    likes: 3421,
    comments: 445,
    shares: 123,
    duration: '1:23',
    isLiked: false
  },
  {
    id: '7',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Coffee and good books - my perfect Sunday morning ☕📚',
    creator: users[2],
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    likes: 734,
    comments: 56,
    shares: 18,
    isLiked: true
  },
  {
    id: '8',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    caption: 'Travel vlog: Exploring hidden gems in Paris 🇫🇷 #travel #paris',
    creator: users[3],
    savedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    likes: 1567,
    comments: 189,
    shares: 67,
    duration: '8:45',
    isLiked: false
  },
  {
    id: '9',
    type: 'reel',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    caption: 'Quick makeup tutorial for beginners 💄 #beauty #makeup',
    creator: users[0],
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    likes: 2891,
    comments: 334,
    shares: 156,
    duration: '0:58',
    isLiked: true
  },
  {
    id: '10',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    caption: 'Garden update: My flowers are finally blooming! 🌸 #gardening #flowers',
    creator: users[1],
    savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    likes: 423,
    comments: 28,
    shares: 9,
    isLiked: false
  },
  {
    id: '11',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    caption: 'Piano cover of my favorite song 🎹 #music #piano',
    creator: users[2],
    savedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    likes: 892,
    comments: 145,
    shares: 34,
    duration: '3:21',
    isLiked: true
  },
  {
    id: '12',
    type: 'reel',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    caption: 'Life hack: How to organize your closet in 5 minutes! 🧥 #organization',
    creator: users[3],
    savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    likes: 1234,
    comments: 167,
    shares: 78,
    duration: '0:52',
    isLiked: false
  }
]

export default function SavedPage() {
  const [activeFilter, setActiveFilter] = useState<ContentType>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular'>('recent')

  const filters = [
    { id: 'all', label: 'All', icon: Bookmark, count: savedItems.length },
    { id: 'photos', label: 'Photos', icon: Image, count: savedItems.filter(item => item.type === 'photo').length },
    { id: 'videos', label: 'Videos', icon: Video, count: savedItems.filter(item => item.type === 'video').length },
    { id: 'reels', label: 'Reels', icon: Play, count: savedItems.filter(item => item.type === 'reel').length }
  ]

  const filteredItems = savedItems.filter(item => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'photos' && item.type === 'photo') ||
      (activeFilter === 'videos' && item.type === 'video') ||
      (activeFilter === 'reels' && item.type === 'reel')
    const matchesSearch = searchQuery === '' || 
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.savedAt.getTime() - a.savedAt.getTime()
      case 'oldest':
        return a.savedAt.getTime() - b.savedAt.getTime()
      case 'popular':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const handleLike = (itemId: string) => {
    // In a real app, this would update the backend
    console.log('Liked item:', itemId)
  }

  const handleShare = (itemId: string) => {
    // In a real app, this would open share dialog
    console.log('Share item:', itemId)
  }

  const handleRemove = (itemId: string) => {
    // In a real app, this would remove from saved items
    console.log('Remove item:', itemId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Bookmark className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
            </div>
            <p className="text-gray-600">Your collection of favorite content</p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'popular')}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 border border-gray-200">
            {filters.map((filter) => {
              const IconComponent = filter.icon
              const isActive = activeFilter === filter.id
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as ContentType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 justify-center ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{filter.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {sortedItems.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeFilter === 'all' ? 'All Saved Posts' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`} ({sortedItems.length})
                  </h2>
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedItems.map((item) => (
                      <SavedItemCard
                        key={item.id}
                        item={item}
                        onLike={handleLike}
                        onShare={handleShare}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedItems.map((item) => (
                      <SavedItemList
                        key={item.id}
                        item={item}
                        onLike={handleLike}
                        onShare={handleShare}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Bookmark className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No saved posts found' : 'No saved posts yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search or filters'
                    : 'Start saving posts you love to see them here'
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

// Saved Item Card Component
interface SavedItemCardProps {
  item: SavedItem
  onLike: (id: string) => void
  onShare: (id: string) => void
  onRemove: (id: string) => void
}

function SavedItemCard({ item, onLike, onShare, onRemove }: SavedItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative group">
        <img
          src={item.thumbnail}
          alt={item.caption}
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay for videos/reels */}
        {(item.type === 'video' || item.type === 'reel') && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <Play className="h-6 w-6 text-gray-800 ml-1" />
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {item.duration}
              </div>
            )}
          </div>
        )}

        {/* Action buttons on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onLike(item.id)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                item.isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onShare(item.id)}
              className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Bookmark className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Content type badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            {item.type === 'photo' && <Image className="h-3 w-3" />}
            {item.type === 'video' && <Video className="h-3 w-3" />}
            {item.type === 'reel' && <Play className="h-3 w-3" />}
            <span className="capitalize">{item.type}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Creator info */}
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={item.creator.avatar}
            alt={item.creator.name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">{item.creator.name}</span>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.caption}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{formatNumber(item.likes)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{formatNumber(item.comments)}</span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(item.savedAt)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Saved Item List Component
function SavedItemList({ item, onLike, onShare, onRemove }: SavedItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={item.thumbnail}
            alt={item.caption}
            className="w-24 h-24 object-cover rounded-lg"
          />
          
          {(item.type === 'video' || item.type === 'reel') && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
              <div className="bg-white bg-opacity-90 rounded-full p-1">
                <Play className="h-4 w-4 text-gray-800 ml-0.5" />
              </div>
            </div>
          )}

          {/* Content type badge */}
          <div className="absolute top-1 left-1">
            <div className="bg-white bg-opacity-90 text-gray-700 text-xs px-1 py-0.5 rounded flex items-center space-x-1">
              {item.type === 'photo' && <Image className="h-2 w-2" />}
              {item.type === 'video' && <Video className="h-2 w-2" />}
              {item.type === 'reel' && <Play className="h-2 w-2" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Creator info */}
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={item.creator.avatar}
              alt={item.creator.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-900">{item.creator.name}</span>
          </div>

          {/* Caption */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.caption}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(item.likes)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(item.comments)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{formatNumber(item.shares)}</span>
              </span>
            </div>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(item.savedAt)}</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onLike(item.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              item.isLiked 
                ? 'bg-red-50 text-red-500' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onShare(item.id)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Bookmark className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
} 