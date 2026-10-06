'use client'

import { useState, useEffect } from 'react'
import { 
  Archive, 
  RotateCcw, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  Settings,
  Edit3,
  UserPlus,
  UserMinus,
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
  Lock
} from 'lucide-react'
import { users } from '@/data/mockData'

interface ArchivedPost {
  id: string
  title: string
  content: string
  image?: string
  author: typeof users[0]
  archivedAt: Date
  createdAt: Date
  likes: number
  comments: number
  shares: number
  tags: string[]
  category: string
  isPublic: boolean
  archiveReason: 'user_request' | 'moderation' | 'auto_archive' | 'expired'
}

export default function ArchivedPage() {
  const [archivedPosts, setArchivedPosts] = useState<ArchivedPost[]>([
    {
      id: '1',
      title: 'My First Post',
      content: 'This was my very first post on the platform. It was a great experience sharing my thoughts with everyone.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-03-15'),
      createdAt: new Date('2024-02-01'),
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ['first-post', 'experience'],
      category: 'Personal',
      isPublic: false,
      archiveReason: 'user_request'
    },
    {
      id: '2',
      title: 'Travel Adventures in Europe',
      content: 'Exploring the beautiful cities of Europe was an incredible experience. From the historic streets of Rome to the modern architecture of Barcelona, every moment was magical.',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-03-20'),
      createdAt: new Date('2024-01-15'),
      likes: 128,
      comments: 34,
      shares: 25,
      tags: ['travel', 'europe', 'adventure'],
      category: 'Travel',
      isPublic: false,
      archiveReason: 'auto_archive'
    },
    {
      id: '3',
      title: 'Recipe: Homemade Pizza',
      content: 'Here\'s my secret recipe for the perfect homemade pizza. The key is in the dough preparation and the right temperature for baking.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-03-25'),
      createdAt: new Date('2024-01-20'),
      likes: 89,
      comments: 23,
      shares: 15,
      tags: ['recipe', 'pizza', 'cooking'],
      category: 'Food',
      isPublic: false,
      archiveReason: 'user_request'
    },
    {
      id: '4',
      title: 'Tech Review: Latest Smartphone',
      content: 'After using the latest smartphone for a month, here are my thoughts on its performance, camera quality, and overall user experience.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-04-01'),
      createdAt: new Date('2024-02-10'),
      likes: 156,
      comments: 42,
      shares: 31,
      tags: ['tech', 'review', 'smartphone'],
      category: 'Technology',
      isPublic: false,
      archiveReason: 'moderation'
    },
    {
      id: '5',
      title: 'Workout Routine for Beginners',
      content: 'Starting your fitness journey? Here\'s a simple but effective workout routine that helped me get started and build consistency.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-04-05'),
      createdAt: new Date('2024-02-15'),
      likes: 203,
      comments: 67,
      shares: 45,
      tags: ['fitness', 'workout', 'beginners'],
      category: 'Health',
      isPublic: false,
      archiveReason: 'auto_archive'
    },
    {
      id: '6',
      title: 'Book Review: The Great Novel',
      content: 'Just finished reading this amazing book and I had to share my thoughts. The character development and plot twists were absolutely brilliant.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-04-10'),
      createdAt: new Date('2024-02-20'),
      likes: 78,
      comments: 19,
      shares: 12,
      tags: ['book-review', 'reading', 'literature'],
      category: 'Books',
      isPublic: false,
      archiveReason: 'user_request'
    },
    {
      id: '7',
      title: 'Photography Tips for Beginners',
      content: 'Learning photography has been an amazing journey. Here are some essential tips that helped me improve my skills and capture better photos.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-04-12'),
      createdAt: new Date('2024-02-25'),
      likes: 134,
      comments: 38,
      shares: 28,
      tags: ['photography', 'tips', 'beginners'],
      category: 'Photography',
      isPublic: false,
      archiveReason: 'expired'
    },
    {
      id: '8',
      title: 'Weekend Getaway Ideas',
      content: 'Looking for some inspiration for your next weekend trip? Here are some amazing destinations that are perfect for a short escape from the daily routine.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      author: users[0],
      archivedAt: new Date('2024-04-15'),
      createdAt: new Date('2024-03-01'),
      likes: 167,
      comments: 51,
      shares: 39,
      tags: ['weekend', 'travel', 'getaway'],
      category: 'Travel',
      isPublic: false,
      archiveReason: 'auto_archive'
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedReason, setSelectedReason] = useState<string>('all')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [showRestoreModal, setShowRestoreModal] = useState<string | null>(null)

  const categories = ['all', 'Personal', 'Travel', 'Food', 'Technology', 'Health', 'Books', 'Photography']
  const archiveReasons = [
    { value: 'all', label: 'All Reasons' },
    { value: 'user_request', label: 'User Request' },
    { value: 'moderation', label: 'Moderation' },
    { value: 'auto_archive', label: 'Auto Archive' },
    { value: 'expired', label: 'Expired' }
  ]

  const filteredPosts = archivedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesReason = selectedReason === 'all' || post.archiveReason === selectedReason
    
    return matchesSearch && matchesCategory && matchesReason
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getArchiveReasonLabel = (reason: string) => {
    switch (reason) {
      case 'user_request':
        return 'User Request'
      case 'moderation':
        return 'Moderation'
      case 'auto_archive':
        return 'Auto Archive'
      case 'expired':
        return 'Expired'
      default:
        return reason
    }
  }

  const getArchiveReasonColor = (reason: string) => {
    switch (reason) {
      case 'user_request':
        return 'bg-blue-100 text-blue-700'
      case 'moderation':
        return 'bg-yellow-100 text-yellow-700'
      case 'auto_archive':
        return 'bg-gray-100 text-gray-700'
      case 'expired':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleRestore = (postId: string) => {
    setArchivedPosts(prev => prev.filter(post => post.id !== postId))
    setShowRestoreModal(null)
    // Here you would typically make an API call to restore the post
    console.log('Restoring post:', postId)
  }

  const handleDelete = (postId: string) => {
    setArchivedPosts(prev => prev.filter(post => post.id !== postId))
    setShowDeleteModal(null)
    // Here you would typically make an API call to permanently delete the post
    console.log('Deleting post:', postId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Archive className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Archived Posts</h1>
            </div>
            <p className="text-gray-600">
              Manage your hidden posts. Restore them to make them public again or permanently delete them.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Archive className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Archived</p>
                  <p className="text-2xl font-bold text-gray-900">{archivedPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Can Restore</p>
                  <p className="text-2xl font-bold text-gray-900">{archivedPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Oldest Archive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(new Date(Math.min(...archivedPosts.map(p => p.archivedAt.getTime()))))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <EyeOff className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hidden from Public</p>
                  <p className="text-2xl font-bold text-gray-900">{archivedPosts.length}</p>
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
                    placeholder="Search archived posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {archiveReasons.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-l-lg transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-r-lg transition-colors duration-200 ${
                      viewMode === 'list' 
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

          {/* Posts Grid/List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No archived posts found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' || selectedReason !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'You haven\'t archived any posts yet.'
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Post Image */}
                  {post.image && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getArchiveReasonColor(post.archiveReason)}`}>
                        {getArchiveReasonLabel(post.archiveReason)}
                      </span>
                    </div>

                    {/* Title and Content */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </div>
                    </div>

                    {/* Archive Info */}
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Archived on {formatDate(post.archivedAt)}</p>
                      <p>Category: {post.category}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowRestoreModal(post.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(post.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Restore Post</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore this post? It will become visible to the public again.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRestoreModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestore(showRestoreModal)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 