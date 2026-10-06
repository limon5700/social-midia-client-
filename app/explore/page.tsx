'use client'
import { useState } from 'react'
import { Search, Filter, Grid, List, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = ['All', 'Photos', 'Videos', 'Reels', 'Trending', 'Popular', 'Recent']

const explorePosts = [
  {
    id: 1,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    caption: 'Amazing sunset at the beach! 🌅',
    author: 'travel_lover',
    likes: 1240,
    comments: 89,
    shares: 45
  },
  {
    id: 2,
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    caption: 'Cooking tutorial: Perfect pasta! 🍝',
    author: 'chef_mike',
    likes: 890,
    comments: 67,
    shares: 23,
    duration: '2:34'
  },
  {
    id: 3,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop',
    caption: 'New coffee shop in town ☕',
    author: 'coffee_addict',
    likes: 567,
    comments: 34,
    shares: 12
  },
  {
    id: 4,
    type: 'reel',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    caption: 'Dance challenge! 💃',
    author: 'dance_star',
    likes: 2340,
    comments: 156,
    shares: 89,
    duration: '0:45'
  },
  {
    id: 5,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    caption: 'Hiking adventure in the mountains 🏔️',
    author: 'adventure_seeker',
    likes: 789,
    comments: 45,
    shares: 18
  },
  {
    id: 6,
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    caption: 'Guitar cover: Wonderwall 🎸',
    author: 'music_lover',
    likes: 1456,
    comments: 123,
    shares: 67,
    duration: '3:12'
  }
]

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing content from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, hashtags, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className={cn(
          'grid gap-6',
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        )}>
          {explorePosts.map((post) => (
            <div
              key={post.id}
              className={cn(
                'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform hover:scale-105 hover:shadow-lg',
                viewMode === 'list' && 'flex'
              )}
            >
              {/* Post Image/Thumbnail */}
              <div className={cn(
                'relative overflow-hidden',
                viewMode === 'grid' ? 'aspect-square' : 'w-48 h-32 flex-shrink-0'
              )}>
                <img
                  src={post.type === 'video' ? post.thumbnail : post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                {post.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
                {post.type === 'reel' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    REEL
                  </div>
                )}
                {post.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {post.duration}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    @{post.author}
                  </p>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {post.caption}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Share2 className="w-3 h-3" />
                      <span>{post.shares}</span>
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
} 