'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  MapPin, 
  Globe, 
  Lock, 
  Shield,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  Camera,
  Music,
  Gamepad2,
  Palette,
  Utensils,
  Plane,
  Dumbbell,
  GraduationCap,
  Laugh,
  Settings,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Flag,
  Crown,
  Star,
  CheckCircle,
  Plus,
  Grid,
  List,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Link,
  Mail,
  Phone,
  Clock,
  Hash,
  Tag,
  Award,
  Trophy,
  Zap,
  Sparkles
} from 'lucide-react'
import { users } from '@/data/mockData'

interface Group {
  id: string
  name: string
  description: string
  banner: string
  avatar: string
  memberCount: number
  onlineCount: number
  privacy: 'public' | 'private' | 'secret'
  category: string
  createdAt: Date
  rules: string[]
  admins: typeof users[0][]
  moderators: typeof users[0][]
  isJoined: boolean
  isAdmin: boolean
  isModerator: boolean
  location?: string
  website?: string
  email?: string
  tags: string[]
}

interface GroupPost {
  id: string
  author: typeof users[0]
  content: string
  media?: string
  mediaType: 'image' | 'video' | 'text'
  likes: number
  comments: number
  shares: number
  createdAt: Date
  isPinned?: boolean
  isAnnouncement?: boolean
}

interface GroupMember {
  user: typeof users[0]
  role: 'admin' | 'moderator' | 'member'
  joinedAt: Date
  isOnline: boolean
  postsCount: number
}

export default function GroupPage() {
  const params = useParams()
  const groupId = params.id as string

  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'media' | 'members'>('posts')
  const [isJoined, setIsJoined] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock group data
  const [group] = useState<Group>({
    id: groupId,
    name: 'Tech Enthusiasts Community',
    description: 'A vibrant community for technology lovers, developers, and innovators. Share your projects, discuss the latest tech trends, and connect with like-minded individuals. Whether you\'re a beginner or an expert, everyone is welcome to join our discussions about programming, AI, cybersecurity, and more!',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop',
    memberCount: 15420,
    onlineCount: 847,
    privacy: 'public',
    category: 'technology',
    createdAt: new Date('2023-06-15'),
    rules: [
      'Be respectful and kind to all members',
      'No spam or self-promotion without permission',
      'Keep discussions relevant to technology',
      'No hate speech or discriminatory content',
      'Share valuable and informative content',
      'Follow community guidelines at all times'
    ],
    admins: [users[0], users[1]],
    moderators: [users[2], users[3]],
    isJoined: false,
    isAdmin: false,
    isModerator: false,
    location: 'Global',
    website: 'https://techenthusiasts.com',
    email: 'admin@techenthusiasts.com',
    tags: ['Technology', 'Programming', 'AI', 'Cybersecurity', 'Innovation', 'Development']
  })

  // Mock group posts
  const [groupPosts] = useState<GroupPost[]>([
    {
      id: '1',
      author: users[0],
      content: 'Just finished building my first AI chatbot! The possibilities with machine learning are endless. Anyone else working on AI projects? 🤖 #AI #MachineLearning #Programming',
      media: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      mediaType: 'image',
      likes: 234,
      comments: 45,
      shares: 12,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPinned: true
    },
    {
      id: '2',
      author: users[1],
      content: 'What\'s your favorite programming language and why? I\'m currently learning Python and loving it! 🐍',
      mediaType: 'text',
      likes: 156,
      comments: 89,
      shares: 8,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      author: users[2],
      content: 'Check out this amazing cybersecurity tutorial I found! Essential knowledge for every developer.',
      media: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
      mediaType: 'image',
      likes: 98,
      comments: 23,
      shares: 15,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      author: users[3],
      content: 'New announcement: We\'re hosting a virtual hackathon next month! Get ready for some exciting challenges and prizes. 🏆',
      mediaType: 'text',
      likes: 312,
      comments: 67,
      shares: 45,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isAnnouncement: true
    }
  ])

  // Mock group members
  const [groupMembers] = useState<GroupMember[]>([
    { user: users[0], role: 'admin', joinedAt: new Date('2023-06-15'), isOnline: true, postsCount: 156 },
    { user: users[1], role: 'admin', joinedAt: new Date('2023-06-20'), isOnline: false, postsCount: 89 },
    { user: users[2], role: 'moderator', joinedAt: new Date('2023-07-01'), isOnline: true, postsCount: 234 },
    { user: users[3], role: 'moderator', joinedAt: new Date('2023-07-10'), isOnline: true, postsCount: 67 },
    { user: users[4], role: 'member', joinedAt: new Date('2023-08-15'), isOnline: false, postsCount: 45 },
    { user: users[5], role: 'member', joinedAt: new Date('2023-09-01'), isOnline: true, postsCount: 23 },
    { user: users[6], role: 'member', joinedAt: new Date('2023-09-15'), isOnline: false, postsCount: 12 },
    { user: users[7], role: 'member', joinedAt: new Date('2023-10-01'), isOnline: true, postsCount: 8 }
  ])

  const categories = [
    { id: 'technology', name: 'Technology', icon: Zap },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'art', name: 'Art', icon: Palette },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'travel', name: 'Travel', icon: Plane },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'comedy', name: 'Comedy', icon: Laugh }
  ]

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData ? categoryData.icon : Zap
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Globe className="h-4 w-4" />
      case 'private':
        return <Lock className="h-4 w-4" />
      case 'secret':
        return <Shield className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
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

  const handleJoinGroup = () => {
    setIsJoined(true)
    setShowJoinModal(false)
  }

  const handleLeaveGroup = () => {
    if (confirm('Are you sure you want to leave this group? You will lose access to all group content.')) {
      setIsJoined(false)
    }
  }

  const filteredPosts = groupPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const CategoryIcon = getCategoryIcon(group.category)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        {/* Group Banner */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          <img
            src={group.banner}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
          {/* Group Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end space-x-4">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-4 border-white"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{group.name}</h1>
                    {getPrivacyIcon(group.privacy)}
                  </div>
                  <p className="text-sm md:text-base opacity-90 line-clamp-2">
                    {group.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Group Stats and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatMemberCount(group.memberCount)}</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{group.onlineCount}</div>
                  <div className="text-sm text-gray-500">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{groupPosts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CategoryIcon className="h-4 w-4" />
                  <span className="capitalize">{group.category}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isJoined ? (
                  <>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <Bell className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleLeaveGroup}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Leave Group
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Join Group
                  </button>
                )}
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'posts', label: 'Posts', count: groupPosts.length },
                { id: 'about', label: 'About', count: null },
                { id: 'media', label: 'Media', count: groupPosts.filter(p => p.media).length },
                { id: 'members', label: 'Members', count: groupMembers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'posts' && (
                <div>
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
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

                  {/* Posts */}
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">{post.author.name}</span>
                              {post.isPinned && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                                  Pinned
                                </span>
                              )}
                              {post.isAnnouncement && (
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                  Announcement
                                </span>
                              )}
                              <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                            </div>
                            <p className="text-gray-800 mb-3">{post.content}</p>
                            {post.media && (
                              <div className="mb-3">
                                <img
                                  src={post.media}
                                  alt="Post media"
                                  className="rounded-lg max-w-full h-auto"
                                />
                              </div>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-green-500 transition-colors duration-200">
                                <Share2 className="h-4 w-4" />
                                <span>{post.shares}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-yellow-500 transition-colors duration-200">
                                <Bookmark className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{group.description}</p>
                  </div>

                  {/* Group Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Created</div>
                          <div className="text-gray-900">{group.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                      {group.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="text-gray-900">{group.location}</div>
                          </div>
                        </div>
                      )}
                      {group.website && (
                        <div className="flex items-center space-x-3">
                          <Link className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Website</div>
                            <a href={group.website} className="text-blue-500 hover:underline">{group.website}</a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Privacy</div>
                          <div className="text-gray-900 capitalize">{group.privacy}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="text-gray-900 capitalize">{group.category}</div>
                        </div>
                      </div>
                      {group.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Contact</div>
                            <a href={`mailto:${group.email}`} className="text-blue-500 hover:underline">{group.email}</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Group Rules</h4>
                      <button
                        onClick={() => setShowRules(!showRules)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {showRules ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    {showRules && (
                      <div className="space-y-2">
                        {group.rules.map((rule, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 font-medium">{index + 1}.</span>
                            <span className="text-gray-700">{rule}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupPosts
                      .filter(post => post.media)
                      .map((post) => (
                        <div key={post.id} className="bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={post.media}
                            alt="Group media"
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3">
                            <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>{post.author.name}</span>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div>
                  <div className="space-y-4">
                    {groupMembers.map((member) => (
                      <div key={member.user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={member.user.avatar}
                              alt={member.user.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            {member.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{member.user.name}</span>
                              {getRoleIcon(member.role)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Joined {formatDate(member.joinedAt)}</span>
                              <span>{member.postsCount} posts</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 