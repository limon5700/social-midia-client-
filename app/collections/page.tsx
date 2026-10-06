'use client'

import { useState, useRef } from 'react'
import { 
  Plus, 
  Folder, 
  Image, 
  Video, 
  FileText, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Share2,
  Lock,
  Globe,
  Users,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Bookmark,
  Eye,
  Calendar,
  Star,
  Sparkles,
  Camera,
  Music,
  Gamepad2,
  Palette,
  Utensils,
  Plane,
  Dumbbell,
  GraduationCap,
  Laugh
} from 'lucide-react'
import { users } from '@/data/mockData'

interface Collection {
  id: string
  name: string
  description: string
  coverImage: string
  postCount: number
  privacy: 'public' | 'private' | 'friends'
  createdAt: Date
  updatedAt: Date
  category: string
  isPinned?: boolean
  color?: string
}

interface SavedPost {
  id: string
  title: string
  content: string
  media?: string
  mediaType: 'image' | 'video' | 'text'
  author: typeof users[0]
  likes: number
  comments: number
  savedAt: Date
  collectionId: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Travel Adventures',
      description: 'Amazing travel photos and memories from around the world',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      postCount: 24,
      privacy: 'public',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      category: 'travel',
      isPinned: true,
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Food & Recipes',
      description: 'Delicious recipes and food photography',
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      postCount: 18,
      privacy: 'friends',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-18'),
      category: 'food',
      color: '#EF4444'
    },
    {
      id: '3',
      name: 'Fitness Motivation',
      description: 'Workout routines and fitness inspiration',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      postCount: 32,
      privacy: 'public',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-19'),
      category: 'fitness',
      color: '#10B981'
    },
    {
      id: '4',
      name: 'Art & Design',
      description: 'Creative artwork and design inspiration',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      postCount: 15,
      privacy: 'private',
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-03-17'),
      category: 'art',
      color: '#8B5CF6'
    },
    {
      id: '5',
      name: 'Music Vibes',
      description: 'Favorite songs and music moments',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      postCount: 28,
      privacy: 'public',
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-03-16'),
      category: 'music',
      color: '#F59E0B'
    },
    {
      id: '6',
      name: 'Gaming Highlights',
      description: 'Epic gaming moments and achievements',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      postCount: 42,
      privacy: 'friends',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-03-15'),
      category: 'gaming',
      color: '#EC4899'
    },
    {
      id: '7',
      name: 'Photography',
      description: 'Beautiful photography and camera techniques',
      coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      postCount: 19,
      privacy: 'public',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-14'),
      category: 'photography',
      color: '#06B6D4'
    },
    {
      id: '8',
      name: 'Personal Notes',
      description: 'Private thoughts and personal reflections',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      postCount: 8,
      privacy: 'private',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-13'),
      category: 'personal',
      color: '#6B7280'
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'posts'>('date')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'all', name: 'All Collections', icon: Folder },
    { id: 'travel', name: 'Travel', icon: Plane },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'art', name: 'Art', icon: Palette },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'personal', name: 'Personal', icon: Star }
  ]

  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || collection.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'posts':
          return b.postCount - a.postCount
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData ? categoryData.icon : Folder
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Globe className="h-4 w-4" />
      case 'friends':
        return <Users className="h-4 w-4" />
      case 'private':
        return <Lock className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const handleCreateCollection = () => {
    // This would typically open a modal to create a new collection
    setShowCreateModal(true)
  }

  const handleDeleteCollection = (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      setCollections(prev => prev.filter(c => c.id !== collectionId))
    }
  }

  const handlePinCollection = (collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, isPinned: !c.isPinned } : c
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Saved Collections</h1>
                <p className="text-gray-600 mt-2">
                  Organize your saved posts into beautiful collections
                </p>
              </div>
              <button
                onClick={handleCreateCollection}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Collection</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  )
                })}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Recently Updated</option>
                <option value="name">Name A-Z</option>
                <option value="posts">Most Posts</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors duration-200 ${
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

          {/* Collections Grid/List */}
          {filteredCollections.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredCollections.map((collection) => {
                const CategoryIcon = getCategoryIcon(collection.category)
                
                return viewMode === 'grid' ? (
                  // Grid View
                  <div key={collection.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Cover Image */}
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <img
                        src={collection.coverImage}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                      {collection.isPinned && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-yellow-500 text-white p-1 rounded-full">
                            <Star className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          {getPrivacyIcon(collection.privacy)}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          {collection.postCount} posts
                        </div>
                      </div>
                    </div>

                    {/* Collection Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{collection.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{collection.description}</p>
                        </div>
                        <div className="ml-2 flex items-center space-x-1">
                          <button
                            onClick={() => handlePinCollection(collection.id)}
                            className={`p-1 rounded-full transition-colors duration-200 ${
                              collection.isPinned 
                                ? 'text-yellow-500 hover:text-yellow-600' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-3 w-3" />
                          <span className="capitalize">{collection.category}</span>
                        </div>
                        <span>Updated {formatDate(collection.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div key={collection.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      {/* Cover Image */}
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={collection.coverImage}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                        {collection.isPinned && (
                          <div className="absolute top-1 left-1">
                            <div className="bg-yellow-500 text-white p-0.5 rounded-full">
                              <Star className="h-2 w-2" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Collection Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={() => handlePinCollection(collection.id)}
                              className={`p-1 rounded-full transition-colors duration-200 ${
                                collection.isPinned 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{collection.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CategoryIcon className="h-3 w-3" />
                            <span className="capitalize">{collection.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getPrivacyIcon(collection.privacy)}
                            <span className="capitalize">{collection.privacy}</span>
                          </div>
                          <span>{collection.postCount} posts</span>
                          <span>Updated {formatDate(collection.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first collection to organize your saved posts'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <button
                  onClick={handleCreateCollection}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Collection</span>
                </button>
              )}
            </div>
          )}

          {/* Stats */}
          {filteredCollections.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Collection Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{filteredCollections.length}</div>
                  <div className="text-sm text-gray-500">Total Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {filteredCollections.reduce((sum, c) => sum + c.postCount, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {filteredCollections.filter(c => c.isPinned).length}
                  </div>
                  <div className="text-sm text-gray-500">Pinned Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {filteredCollections.filter(c => c.privacy === 'private').length}
                  </div>
                  <div className="text-sm text-gray-500">Private Collections</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 