'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, RefreshCw, Heart, MessageCircle, Share2, UserPlus, Hash, TrendingUp, Star, Zap, Target, Brain, Lightbulb, Eye, Scissors, Copy } from 'lucide-react'
import { users } from '@/data/mockData'

interface RecommendedPost {
  id: string
  title: string
  content: string
  image?: string
  author: typeof users[0]
  likes: number
  comments: number
  shares: number
  tags: string[]
  category: string
  relevanceScore: number
  aiReason: string
  postedAt: Date
}

interface RecommendedProfile {
  id: string
  user: typeof users[0]
  followers: number
  posts: number
  bio: string
  tags: string[]
  relevanceScore: number
  aiReason: string
  mutualConnections: number
}

interface RecommendedHashtag {
  id: string
  name: string
  posts: number
  followers: number
  description: string
  relevanceScore: number
  aiReason: string
  trending: boolean
}

interface UserInterest {
  category: string
  weight: number
  lastEngaged: Date
}

export default function DiscoverPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'profiles' | 'hashtags'>('posts')
  const [userInterests] = useState<UserInterest[]>([
    { category: 'Technology', weight: 0.9, lastEngaged: new Date('2024-04-20T10:00:00') },
    { category: 'Travel', weight: 0.8, lastEngaged: new Date('2024-04-19T15:30:00') },
    { category: 'Food', weight: 0.7, lastEngaged: new Date('2024-04-18T12:00:00') },
    { category: 'Photography', weight: 0.6, lastEngaged: new Date('2024-04-17T09:15:00') },
    { category: 'Fitness', weight: 0.5, lastEngaged: new Date('2024-04-16T07:45:00') }
  ])

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

  const [recommendedPosts, setRecommendedPosts] = useState<RecommendedPost[]>([
    {
      id: '1',
      title: 'The Future of AI in Everyday Life',
      content: 'Artificial Intelligence is transforming how we live, work, and interact. From smart homes to autonomous vehicles, AI is becoming an integral part of our daily routines...',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      author: users[0] || users[0], // Fallback to first user if index doesn't exist
      likes: 1247,
      comments: 89,
      shares: 156,
      tags: ['ai', 'technology', 'future', 'innovation'],
      category: 'Technology',
      relevanceScore: 0.95,
      aiReason: 'Based on your high engagement with tech content and recent AI discussions',
      postedAt: new Date('2024-04-20T08:30:00')
    },
    {
      id: '2',
      title: 'Hidden Gems in Barcelona: A Local\'s Guide',
      content: 'Beyond the tourist hotspots, Barcelona has countless hidden treasures waiting to be discovered. Here are my favorite local spots that most visitors miss...',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      author: users[1] || users[0],
      likes: 892,
      comments: 67,
      shares: 234,
      tags: ['barcelona', 'travel', 'local', 'hidden-gems'],
      category: 'Travel',
      relevanceScore: 0.88,
      aiReason: 'Matches your travel interests and recent searches for European destinations',
      postedAt: new Date('2024-04-19T14:15:00')
    },
    {
      id: '3',
      title: 'Perfect Homemade Sourdough Bread',
      content: 'After years of practice, I\'ve finally mastered the art of sourdough bread. Here\'s my foolproof recipe that produces bakery-quality loaves every time...',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      author: users[2] || users[0],
      likes: 1567,
      comments: 123,
      shares: 445,
      tags: ['sourdough', 'bread', 'baking', 'recipe'],
      category: 'Food',
      relevanceScore: 0.82,
      aiReason: 'Based on your cooking interests and recent recipe saves',
      postedAt: new Date('2024-04-18T11:00:00')
    },
    {
      id: '4',
      title: 'Photography Tips: Capturing Golden Hour Magic',
      content: 'Golden hour photography can transform ordinary scenes into extraordinary moments. Here are my proven techniques for making the most of this magical lighting...',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      author: users[3] || users[0],
      likes: 2341,
      comments: 178,
      shares: 567,
      tags: ['photography', 'golden-hour', 'tips', 'lighting'],
      category: 'Photography',
      relevanceScore: 0.79,
      aiReason: 'Matches your photography interests and recent camera equipment searches',
      postedAt: new Date('2024-04-17T16:45:00')
    },
    {
      id: '5',
      title: '30-Day Fitness Challenge: Transform Your Body',
      content: 'Ready to transform your fitness? This 30-day challenge combines strength training, cardio, and nutrition for maximum results. Perfect for beginners and intermediates...',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      author: users[0] || users[0], // Use first user for the 5th post
      likes: 3456,
      comments: 234,
      shares: 789,
      tags: ['fitness', 'challenge', 'workout', 'transformation'],
      category: 'Fitness',
      relevanceScore: 0.75,
      aiReason: 'Based on your fitness goals and recent workout content engagement',
      postedAt: new Date('2024-04-16T09:20:00')
    }
  ])

  const [recommendedProfiles, setRecommendedProfiles] = useState<RecommendedProfile[]>([
    {
      id: '1',
      user: users[0] || users[0],
      followers: 12500,
      posts: 342,
      bio: 'Tech enthusiast and AI researcher. Sharing insights about the future of technology and its impact on society.',
      tags: ['technology', 'ai', 'innovation', 'research'],
      relevanceScore: 0.92,
      aiReason: 'High match with your technology interests and AI discussions',
      mutualConnections: 8
    },
    {
      id: '2',
      user: users[1] || users[0],
      followers: 8900,
      posts: 156,
      bio: 'Travel photographer capturing the world\'s most beautiful moments. Always on the lookout for the next adventure.',
      tags: ['travel', 'photography', 'adventure', 'exploration'],
      relevanceScore: 0.87,
      aiReason: 'Matches your travel and photography interests',
      mutualConnections: 5
    },
    {
      id: '3',
      user: users[2] || users[0],
      followers: 15600,
      posts: 234,
      bio: 'Professional chef and food blogger. Sharing recipes, cooking tips, and culinary adventures from around the world.',
      tags: ['food', 'cooking', 'recipes', 'culinary'],
      relevanceScore: 0.83,
      aiReason: 'Based on your food and cooking interests',
      mutualConnections: 12
    },
    {
      id: '4',
      user: users[3] || users[0],
      followers: 7800,
      posts: 89,
      bio: 'Fitness trainer and wellness coach. Helping people achieve their health and fitness goals through sustainable practices.',
      tags: ['fitness', 'wellness', 'health', 'training'],
      relevanceScore: 0.78,
      aiReason: 'Matches your fitness and wellness interests',
      mutualConnections: 3
    }
  ])

  const [recommendedHashtags, setRecommendedHashtags] = useState<RecommendedHashtag[]>([
    {
      id: '1',
      name: '#ArtificialIntelligence',
      posts: 1250000,
      followers: 890000,
      description: 'Exploring the latest developments in AI and machine learning',
      relevanceScore: 0.94,
      aiReason: 'Perfect match for your technology interests and AI discussions',
      trending: true
    },
    {
      id: '2',
      name: '#TravelPhotography',
      posts: 890000,
      followers: 567000,
      description: 'Capturing the world through the lens of adventure',
      relevanceScore: 0.89,
      aiReason: 'Combines your travel and photography interests',
      trending: true
    },
    {
      id: '3',
      name: '#HomemadeCooking',
      posts: 456000,
      followers: 234000,
      description: 'Sharing homemade recipes and cooking tips',
      relevanceScore: 0.86,
      aiReason: 'Based on your cooking interests and recipe saves',
      trending: false
    },
    {
      id: '4',
      name: '#FitnessMotivation',
      posts: 2340000,
      followers: 1230000,
      description: 'Inspiring fitness journeys and workout motivation',
      relevanceScore: 0.81,
      aiReason: 'Matches your fitness goals and workout content engagement',
      trending: true
    }
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startY = 0
    let currentY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return
      
      currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)
      
      if (distance > 0 && container.scrollTop === 0) {
        setPullDistance(distance)
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 100) {
        handleRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call to refresh recommendations
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-700'
    if (score >= 0.8) return 'bg-blue-100 text-blue-700'
    if (score >= 0.7) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getRelevanceLabel = (score: number) => {
    if (score >= 0.9) return 'Perfect Match'
    if (score >= 0.8) return 'Great Match'
    if (score >= 0.7) return 'Good Match'
    return 'Relevant'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
            </div>
            <p className="text-gray-600">
              AI-powered recommendations tailored to your interests
            </p>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Based on your interests in {userInterests.slice(0, 3).map(i => i.category).join(', ')} and recent activity
                </p>
                <div className="flex flex-wrap gap-2">
                  {userInterests.slice(0, 3).map((interest) => (
                    <span key={interest.category} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {interest.category} ({Math.round(interest.weight * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'posts', label: 'Recommended Posts', count: recommendedPosts.length },
                { id: 'profiles', label: 'Profiles to Follow', count: recommendedProfiles.length },
                { id: 'hashtags', label: 'Trending Hashtags', count: recommendedHashtags.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-purple-500 border-b-2 border-purple-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Pull to Refresh Indicator */}
            {isPulling && (
              <div className="flex items-center justify-center py-4 bg-gray-50">
                <div className="flex items-center space-x-2 text-gray-500">
                  <RefreshCw className={`h-4 w-4 ${pullDistance > 100 ? 'animate-spin' : ''}`} />
                  <span className="text-sm">
                    {pullDistance > 100 ? 'Release to refresh' : 'Pull to refresh'}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div ref={containerRef} className="p-6 max-h-96 overflow-y-auto">
              {isRefreshing && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Refreshing recommendations...</span>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {recommendedPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
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
                            {post.author && (
                              <>
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{post.author.name}</p>
                                  <p className="text-xs text-gray-500">{formatDate(post.postedAt)}</p>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(post.relevanceScore)}`}>
                              {getRelevanceLabel(post.relevanceScore)}
                            </span>
                            <div className="p-1 bg-purple-100 rounded">
                              <Target className="h-3 w-3 text-purple-600" />
                            </div>
                          </div>
                        </div>

                        {/* Title and Content */}
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>

                        {/* AI Reason */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-purple-700">{post.aiReason}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{formatNumber(post.likes)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{formatNumber(post.comments)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share2 className="h-4 w-4" />
                              <span>{formatNumber(post.shares)}</span>
                            </div>
                          </div>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                            <span>View Post</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'profiles' && (
                <div className="space-y-4">
                  {recommendedProfiles.map((profile) => (
                    <div key={profile.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          {profile.user && (
                            <>
                              <img
                                src={profile.user.avatar}
                                alt={profile.user.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{profile.user.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{profile.bio}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                  <span>{formatNumber(profile.followers)} followers</span>
                                  <span>{profile.posts} posts</span>
                                  <span>{profile.mutualConnections} mutual</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {profile.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(profile.relevanceScore)}`}>
                            {getRelevanceLabel(profile.relevanceScore)}
                          </span>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                            <UserPlus className="h-4 w-4" />
                            <span>Follow</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-purple-700">{profile.aiReason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'hashtags' && (
                <div className="space-y-4">
                  {recommendedHashtags.map((hashtag) => (
                    <div key={hashtag.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Hash className="h-5 w-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">{hashtag.name}</h3>
                            {hashtag.trending && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Trending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{hashtag.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <span>{formatNumber(hashtag.posts)} posts</span>
                            <span>{formatNumber(hashtag.followers)} followers</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(hashtag.relevanceScore)}`}>
                            {getRelevanceLabel(hashtag.relevanceScore)}
                          </span>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                            <Hash className="h-4 w-4" />
                            <span>Follow</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-purple-700">{hashtag.aiReason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 