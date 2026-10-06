'use client'

import { useState } from 'react'
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Clock, 
  Image,
  Video,
  Music,
  File,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  Archive,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
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

interface Draft {
  id: string
  title: string
  content: string
  thumbnail?: string
  mediaType?: 'image' | 'video' | 'audio' | 'document'
  tags: string[]
  category: string
  isPublic: boolean
  createdAt: Date
  lastEdited: Date
  wordCount: number
  estimatedReadTime: number
  hasMedia: boolean
  mediaCount: number
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: '1',
      title: 'My Travel Adventures in Europe',
      content: 'I recently had the most amazing trip to Europe. From the historic streets of Rome to the modern architecture of Barcelona, every moment was magical. The food was incredible, the people were friendly, and the experiences were unforgettable...',
      thumbnail: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      mediaType: 'image',
      tags: ['travel', 'europe', 'adventure', 'vacation'],
      category: 'Travel',
      isPublic: false,
      createdAt: new Date('2024-04-15T10:00:00'),
      lastEdited: new Date('2024-04-20T14:30:00'),
      wordCount: 450,
      estimatedReadTime: 2,
      hasMedia: true,
      mediaCount: 3
    },
    {
      id: '2',
      title: 'Recipe: Homemade Pizza from Scratch',
      content: 'Making pizza at home is easier than you think! Here\'s my secret recipe that has been perfected over years of practice. The key is in the dough preparation and the right temperature for baking...',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      mediaType: 'image',
      tags: ['recipe', 'pizza', 'cooking', 'homemade'],
      category: 'Food',
      isPublic: false,
      createdAt: new Date('2024-04-18T16:00:00'),
      lastEdited: new Date('2024-04-19T09:15:00'),
      wordCount: 320,
      estimatedReadTime: 1,
      hasMedia: true,
      mediaCount: 2
    },
    {
      id: '3',
      title: 'Tech Review: Latest Smartphone Comparison',
      content: 'After testing the latest smartphones for a month, here are my detailed thoughts on their performance, camera quality, battery life, and overall user experience. This comprehensive review covers...',
      mediaType: 'video',
      tags: ['tech', 'review', 'smartphone', 'comparison'],
      category: 'Technology',
      isPublic: false,
      createdAt: new Date('2024-04-12T11:30:00'),
      lastEdited: new Date('2024-04-20T16:45:00'),
      wordCount: 780,
      estimatedReadTime: 4,
      hasMedia: true,
      mediaCount: 1
    },
    {
      id: '4',
      title: 'Workout Routine for Beginners',
      content: 'Starting your fitness journey? Here\'s a simple but effective workout routine that helped me get started and build consistency. This program is designed for complete beginners and focuses on...',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      mediaType: 'image',
      tags: ['fitness', 'workout', 'beginners', 'health'],
      category: 'Health',
      isPublic: false,
      createdAt: new Date('2024-04-10T08:00:00'),
      lastEdited: new Date('2024-04-17T12:20:00'),
      wordCount: 620,
      estimatedReadTime: 3,
      hasMedia: true,
      mediaCount: 4
    },
    {
      id: '5',
      title: 'Book Review: The Great Novel',
      content: 'Just finished reading this amazing book and I had to share my thoughts. The character development and plot twists were absolutely brilliant. The author\'s writing style is captivating and...',
      tags: ['book-review', 'reading', 'literature', 'fiction'],
      category: 'Books',
      isPublic: false,
      createdAt: new Date('2024-04-14T15:45:00'),
      lastEdited: new Date('2024-04-16T10:30:00'),
      wordCount: 280,
      estimatedReadTime: 1,
      hasMedia: false,
      mediaCount: 0
    },
    {
      id: '6',
      title: 'Photography Tips for Beginners',
      content: 'Learning photography has been an amazing journey. Here are some essential tips that helped me improve my skills and capture better photos. From composition to lighting, these fundamentals...',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      mediaType: 'image',
      tags: ['photography', 'tips', 'beginners', 'camera'],
      category: 'Photography',
      isPublic: false,
      createdAt: new Date('2024-04-08T13:20:00'),
      lastEdited: new Date('2024-04-19T17:00:00'),
      wordCount: 890,
      estimatedReadTime: 4,
      hasMedia: true,
      mediaCount: 6
    },
    {
      id: '7',
      title: 'Weekend Getaway Ideas',
      content: 'Looking for some inspiration for your next weekend trip? Here are some amazing destinations that are perfect for a short escape from the daily routine. These locations offer...',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      mediaType: 'image',
      tags: ['weekend', 'travel', 'getaway', 'destinations'],
      category: 'Travel',
      isPublic: false,
      createdAt: new Date('2024-04-05T09:00:00'),
      lastEdited: new Date('2024-04-18T11:45:00'),
      wordCount: 540,
      estimatedReadTime: 3,
      hasMedia: true,
      mediaCount: 2
    },
    {
      id: '8',
      title: 'Personal Reflection: Life Lessons Learned',
      content: 'Over the past year, I\'ve learned some valuable lessons about life, relationships, and personal growth. These insights have changed my perspective and helped me become a better person...',
      tags: ['personal', 'reflection', 'life-lessons', 'growth'],
      category: 'Personal',
      isPublic: false,
      createdAt: new Date('2024-04-01T20:30:00'),
      lastEdited: new Date('2024-04-15T14:15:00'),
      wordCount: 1200,
      estimatedReadTime: 6,
      hasMedia: false,
      mediaCount: 0
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  const categories = ['all', 'Travel', 'Food', 'Technology', 'Health', 'Books', 'Photography', 'Personal']
  const mediaTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Documents' },
    { value: 'none', label: 'No Media' }
  ]

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || draft.category === selectedCategory
    const matchesMediaType = selectedMediaType === 'all' || 
                           (selectedMediaType === 'none' ? !draft.hasMedia : draft.mediaType === selectedMediaType)
    
    return matchesSearch && matchesCategory && matchesMediaType
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

  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return Image
      case 'video':
        return Video
      case 'audio':
        return Music
      case 'document':
        return File
      default:
        return FileText
    }
  }

  const getMediaColor = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return 'bg-blue-100 text-blue-700'
      case 'video':
        return 'bg-purple-100 text-purple-700'
      case 'audio':
        return 'bg-green-100 text-green-700'
      case 'document':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStats = () => {
    const total = drafts.length
    const withMedia = drafts.filter(d => d.hasMedia).length
    const totalWords = drafts.reduce((sum, d) => sum + d.wordCount, 0)
    const totalReadTime = drafts.reduce((sum, d) => sum + d.estimatedReadTime, 0)

    return { total, withMedia, totalWords, totalReadTime }
  }

  const stats = getStats()

  const handleDelete = (draftId: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== draftId))
    setShowDeleteModal(null)
    // Here you would typically make an API call to delete the draft
    console.log('Deleting draft:', draftId)
  }

  const handleEdit = (draftId: string) => {
    // Here you would typically navigate to the edit page
    console.log('Editing draft:', draftId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-gray-600" />
                <h1 className="text-3xl font-bold text-gray-900">Drafts</h1>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>New Draft</span>
              </button>
            </div>
            <p className="text-gray-600">
              Manage your saved content and continue writing where you left off.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">With Media</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withMedia}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Words</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Read Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReadTime} min</p>
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
                    placeholder="Search drafts..."
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
                  value={selectedMediaType}
                  onChange={(e) => setSelectedMediaType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {mediaTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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

          {/* Drafts Grid/List */}
          {filteredDrafts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' || selectedMediaType !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'You don\'t have any drafts yet.'
                }
              </p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 mx-auto">
                <Plus className="h-4 w-4" />
                <span>Create Your First Draft</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredDrafts.map((draft) => {
                const MediaIcon = getMediaIcon(draft.mediaType)
                return (
                  <div key={draft.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Thumbnail */}
                    {draft.thumbnail ? (
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={draft.thumbnail}
                          alt={draft.title}
                          className="w-full h-full object-cover"
                        />
                        {draft.hasMedia && (
                          <div className="absolute top-2 right-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMediaColor(draft.mediaType)}`}>
                              {draft.mediaCount} {draft.mediaType}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <MediaIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No thumbnail</p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMediaColor(draft.mediaType)}`}>
                            {draft.category}
                          </span>
                          {draft.hasMedia && (
                            <div className={`p-1 rounded ${getMediaColor(draft.mediaType)}`}>
                              <MediaIcon className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(draft.lastEdited)}</span>
                        </div>
                      </div>

                      {/* Title and Content */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{draft.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{draft.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {draft.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {draft.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{draft.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-3">
                          <span>{draft.wordCount} words</span>
                          <span>{draft.estimatedReadTime} min read</span>
                        </div>
                        {draft.hasMedia && (
                          <span>{draft.mediaCount} media</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(draft.id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(draft.id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Draft</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this draft? This action cannot be undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 