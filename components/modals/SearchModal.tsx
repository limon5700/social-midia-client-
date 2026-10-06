'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, User, Hash, FileText, Users, TrendingUp, MapPin, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SearchResult {
  id: string
  type: 'user' | 'post' | 'hashtag' | 'location'
  title: string
  subtitle?: string
  avatar?: string
  count?: number
  url: string
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'hashtags'>('all')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  // Fallback mock data for when API fails
  const mockUsers = [
    { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/images/default-avatar.svg', followers: 1250 },
    { id: '2', name: 'Mike Chen', email: 'mike@example.com', avatar: '/images/default-avatar.svg', followers: 890 },
    { id: '3', name: 'Emma Davis', email: 'emma@example.com', avatar: '/images/default-avatar.svg', followers: 2100 },
    { id: '4', name: 'John Smith', email: 'john@example.com', avatar: '/images/default-avatar.svg', followers: 567 },
    { id: '5', name: 'Lisa Park', email: 'lisa@example.com', avatar: '/images/default-avatar.svg', followers: 750 },
    { id: '6', name: 'Tom Anderson', email: 'tom@example.com', avatar: '/images/default-avatar.svg', followers: 3200 },
  ]

  const mockPosts = [
    { id: '1', title: 'Amazing hike in the mountains!', author: 'Sarah Wilson', likes: 1200, comments: 89 },
    { id: '2', title: 'New recipe for homemade pasta', author: 'Mike Chen', likes: 567, comments: 45 },
    { id: '3', title: 'Travel tips for Europe', author: 'Emma Davis', likes: 890, comments: 67 },
  ]

  const mockHashtags = [
    { id: '1', name: '#adventure', posts: 125000 },
    { id: '2', name: '#food', posts: 890000 },
    { id: '3', name: '#fitness', posts: 567000 },
    { id: '4', name: '#nature', posts: 234000 },
    { id: '5', name: '#travel', posts: 456000 },
  ]

  const mockLocations = [
    { id: '1', name: 'Rocky Mountains, Colorado', posts: 1200 },
    { id: '2', name: 'Paris, France', posts: 8900 },
    { id: '3', name: 'Tokyo, Japan', posts: 5600 },
  ]

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
      // Load recent searches from localStorage
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading recent searches:', error)
        }
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const filteredResults = getFilteredResults()
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        const filteredResults = getFilteredResults()
        const selectedResult = filteredResults[selectedIndex]
        if (selectedResult) {
          window.location.href = selectedResult.url
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, selectedIndex])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    // Save to recent searches
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newRecentSearches = [query.trim(), ...recentSearches.slice(0, 4)]
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    }

    try {
      // Call real API
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data.results)
      } else {
        console.error('Search failed:', data.message)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock data if API fails
      const results: SearchResult[] = []
      const lowerQuery = query.toLowerCase()

      // Search users
      mockUsers.forEach(user => {
        if (user.name.toLowerCase().includes(lowerQuery) || user.email.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: user.id,
            type: 'user',
            title: user.name,
            subtitle: `${user.followers.toLocaleString()} followers`,
            avatar: user.avatar,
            url: `/profile/${user.id}`
          })
        }
      })

      // Search posts
      mockPosts.forEach(post => {
        if (post.title.toLowerCase().includes(lowerQuery) || post.author.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: post.id,
            type: 'post',
            title: post.title,
            subtitle: `by ${post.author} • ${post.likes} likes`,
            url: `/post/${post.id}`
          })
        }
      })

      // Search hashtags
      mockHashtags.forEach(hashtag => {
        if (hashtag.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: hashtag.id,
            type: 'hashtag',
            title: hashtag.name,
            subtitle: `${hashtag.posts.toLocaleString()} posts`,
            url: `/hashtag/${hashtag.name.replace('#', '')}`
          })
        }
      })

      // Search locations
      mockLocations.forEach(location => {
        if (location.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: location.id,
            type: 'location',
            title: location.name,
            subtitle: `${location.posts.toLocaleString()} posts`,
            url: `/location/${location.id}`
          })
        }
      })

      setSearchResults(results)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery)
      setSelectedIndex(-1) // Reset selection when search query changes
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const getFilteredResults = () => {
    if (activeTab === 'all') return searchResults
    return searchResults.filter(result => result.type === activeTab.slice(0, -1) as any)
  }

  // Re-search when tab changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }, [activeTab])

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />
      case 'post': return <FileText className="w-4 h-4" />
      case 'hashtag': return <Hash className="w-4 h-4" />
      case 'location': return <MapPin className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return 'User'
      case 'post': return 'Post'
      case 'hashtag': return 'Hashtag'
      case 'location': return 'Location'
      default: return 'Result'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users, posts, hashtags, locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All', count: searchResults.length },
              { key: 'users', label: 'Users', count: searchResults.filter(r => r.type === 'user').length },
              { key: 'posts', label: 'Posts', count: searchResults.filter(r => r.type === 'post').length },
              { key: 'hashtags', label: 'Hashtags', count: searchResults.filter(r => r.type === 'hashtag').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Searching database...</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Looking for users, posts, hashtags, and locations</p>
              </div>
            ) : searchQuery.trim() ? (
              getFilteredResults().length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {getFilteredResults().map((result, index) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.url}
                      onClick={onClose}
                      className={`flex items-center p-4 transition-colors ${
                        index === selectedIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {getIcon(result.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try different keywords, check your spelling, or search in a different category</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Searched in:</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                      {activeTab === 'all' ? 'All categories' : activeTab}
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="p-8">
                {recentSearches.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Recent Searches</h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Clock className="w-4 h-4 mr-3 text-gray-400" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Start typing to search</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Search for users, posts, hashtags, and locations</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Press Esc to close</span>
                <span>•</span>
                <span>Use ↑↓ to navigate</span>
                <span>•</span>
                <span>Press Enter to select</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>Recent searches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 