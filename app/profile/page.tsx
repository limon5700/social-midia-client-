'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play,
  Video,
  Image,
  Grid,
  List,
  Bookmark,
  User,
  Edit3,
  MapPin,
  Link,
  Calendar,
  Users,
  MoreHorizontal,
  ExternalLink,
  Music,
  Eye,
  Tag,
  X,
  LayoutDashboard
} from 'lucide-react'
import PostCard from '@/components/feed/PostCard'
import CommentModal from '@/components/comments/CommentModal'
import ProfileCover from '@/components/profile/ProfileCover'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface Post {
  _id: string
  content: string
  author: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatar: string
    isVerified: boolean
  }
  media?: Array<{
    type: 'image' | 'video' | 'gif'
    url: string
    thumbnail?: string
  }>
  hashtags: string[]
  mentions: string[]
  location?: {
    name: string
    coordinates: [number, number]
  }
  privacy: 'public' | 'friends' | 'private'
  likes: any[]
  comments: any[]
  shares: any[]
  saves: any[]
  views: number
  isLiked: boolean
  isSaved: boolean
  isShared: boolean
  likeCount: number
  commentCount: number
  shareCount: number
  saveCount: number
  totalEngagement: number
  mediaCount: number
  hasMedia: boolean
  isEdited: boolean
  editedAt?: Date
  createdAt: string
  updatedAt: string
}

interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  coverPhoto?: string
  bio: string
  location?: string
  website?: string
  joinedDate: Date
  followers: number
  following: number
  posts: number
  reels: number
  isVerified: boolean
  isPrivate: boolean
  interests: string[]
  // Professional fields
  profession?: string
  company?: string
  jobTitle?: string
  education?: string
  skills?: string[]
  experience?: string
  phone?: string
  socialLinks?: {
    linkedin: string
    twitter: string
    github: string
    instagram: string
  }
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged' | 'saved'>('posts')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [profilePosts, setProfilePosts] = useState<Post[]>([])
  const [taggedPosts, setTaggedPosts] = useState<Post[]>([])
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('Profile page useEffect - isAuthenticated:', isAuthenticated, 'user:', user, 'authLoading:', authLoading)
    
    if (isAuthenticated && user && !authLoading) {
      console.log('Fetching profile data...')
      setLoading(true) // Set loading to true when starting to fetch
      fetchUserProfile()
      fetchUserPosts()
    } else if (!isAuthenticated && !authLoading) {
      console.log('Not authenticated, redirecting to auth...')
      setLoading(false)
      router.push('/auth')
    }
  }, [isAuthenticated, user, authLoading])

  // Refresh profile data when user data changes (but don't set loading)
  useEffect(() => {
    if (user && profileUser && !loading && isAuthenticated) {
      console.log('Refreshing profile data...')
      fetchUserProfile()
    }
  }, [user, isAuthenticated])

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...')
      const response = await fetch('/api/auth/me', {
        cache: 'no-store' // Prevent caching to get fresh data
      })
      console.log('Profile response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Profile data received:', data.success)
        
        if (data.success) {
          const userData = data.data.user
          setProfileUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar || '/images/default-avatar.svg',
            coverPhoto: userData.coverPhoto || '',
            bio: userData.bio || "No bio yet",
            location: userData.location,
            website: userData.website,
            // Professional fields
            profession: userData.profession,
            company: userData.company,
            jobTitle: userData.jobTitle,
            education: userData.education,
            skills: userData.skills,
            experience: userData.experience,
            phone: userData.phone,
            socialLinks: userData.socialLinks,
            joinedDate: new Date(userData.createdAt),
            followers: userData.followerCount || 0,
            following: userData.followingCount || 0,
            posts: userData.postCount || 0,
            reels: 0, // We'll add this later when we have reels
            isVerified: userData.isVerified || false,
            isPrivate: userData.isPrivate || false,
            interests: userData.interests || []
          })
          setLoading(false) // Set loading to false after profile is loaded
          console.log('Profile loaded successfully')
        } else {
          console.error('Failed to fetch user profile:', data.message)
          setLoading(false)
        }
      } else {
        console.error('Failed to fetch user profile:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      if (!user) {
        console.error('No user found')
        return
      }

      // Fetch real posts from the API
      const response = await fetch(`/api/posts/user/${user.id}?limit=20`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Use the posts directly as they match the Post interface
          setProfilePosts(data.data.posts)
          setTaggedPosts([]) // We'll implement tagged posts later
          setSavedPosts([]) // We'll implement saved posts later
        } else {
          console.error('Failed to fetch user posts:', data.message)
          setProfilePosts([])
        }
      } else {
        console.error('Failed to fetch user posts:', response.status)
        setProfilePosts([])
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
      setProfilePosts([])
    }
  }

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select an image file')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      showNotification('error', 'Cover photo must be less than 8MB')
      return
    }

    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('cover', file)

      const response = await fetch('/api/profile/cover', {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProfileUser((prev) =>
          prev ? { ...prev, coverPhoto: data.data.coverPhoto } : prev
        )
        showNotification('success', 'Cover photo updated!')
      } else {
        showNotification('error', data.message || 'Failed to upload cover photo')
      }
    } catch {
      showNotification('error', 'Failed to upload cover photo')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Profile photo must be less than 5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const newAvatar = data.data.avatar
        setProfileUser((prev) =>
          prev ? { ...prev, avatar: newAvatar } : prev
        )
        showNotification('success', 'Profile photo updated!')
      } else {
        showNotification('error', data.message || 'Failed to upload profile photo')
      }
    } catch {
      showNotification('error', 'Failed to upload profile photo')
    } finally {
      e.target.value = ''
    }
  }

  const getTabData = () => {
    switch (activeTab) {
      case 'posts':
        return profilePosts
      case 'reels':
        return profilePosts.filter(post => post.media && post.media.some(m => m.type === 'video'))
      case 'tagged':
        return taggedPosts
      case 'saved':
        return savedPosts
      default:
        return profilePosts
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Update the post in the list
        setProfilePosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  isLiked: !post.isLiked,
                  likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
                }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleSave = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Update the post in the list
        setProfilePosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  isSaved: !post.isSaved,
                  saveCount: post.isSaved ? post.saveCount - 1 : post.saveCount + 1
                }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleShare = async (postId: string) => {
    try {
      // For now, just log the action
      console.log('Share post:', postId)
      // TODO: Implement share functionality
      alert('Share functionality coming soon!')
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  const handleComment = (postId: string) => {
    setSelectedPostForComments(postId)
  }

  const handleCloseComments = () => {
    setSelectedPostForComments(null)
  }

  const handleViewPost = (postId: string) => {
    router.push(`/post/${postId}`)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-3 w-3" />
      case 'image':
        return <Image className="h-3 w-3" />
      case 'gif':
        return <Play className="h-3 w-3" />
      default:
        return <Image className="h-3 w-3" />
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please login to view your profile</p>
          <button
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  const currentTabData = getTabData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 overflow-hidden">
        <ProfileCover
          coverPhoto={profileUser.coverPhoto}
          avatar={profileUser.avatar}
          name={`${profileUser.firstName} ${profileUser.lastName}`}
          canEdit
          uploadingCover={uploadingCover}
          onCoverChange={handleCoverUpload}
          onAvatarClick={() => avatarInputRef.current?.click()}
        />
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarUpload}
        />

        <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 md:pl-32 lg:pl-36">
            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">@{profileUser.username}</p>
                  </div>

                  {/* Stats — next to name */}
                  <div className="flex items-center gap-3 sm:gap-5 md:gap-6 shrink-0">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{formatNumber(profileUser.posts)}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{formatNumber(profileUser.followers)}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{formatNumber(profileUser.following)}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Following</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <NextLink
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NextLink>
                </div>
              </div>
              <p className="text-gray-700 mt-2 max-w-2xl">{profileUser.bio}</p>

              {/* Professional Info */}
              {(profileUser.profession || profileUser.company || profileUser.jobTitle) && (
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  {profileUser.profession && (
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{profileUser.profession}</span>
                    </span>
                  )}
                  {profileUser.company && (
                    <span className="flex items-center space-x-1">
                      <Link className="h-4 w-4" />
                      <span>{profileUser.company}</span>
                    </span>
                  )}
                  {profileUser.jobTitle && (
                    <span className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{profileUser.jobTitle}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Location & Website */}
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                {profileUser.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </span>
                )}
                {profileUser.website && (
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatTimeAgo(profileUser.joinedDate)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Grid className="h-4 w-4" />
                <span>Posts</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {profilePosts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'reels'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Reels</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {profilePosts.filter(post => post.media && post.media.some(m => m.type === 'video')).length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'tagged'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Tagged</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {taggedPosts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {savedPosts.length}
                </span>
              </div>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Posts Grid/List */}
        {currentTabData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'posts' && <Grid className="h-8 w-8 text-gray-400" />}
              {activeTab === 'reels' && <Play className="h-8 w-8 text-gray-400" />}
              {activeTab === 'tagged' && <Tag className="h-8 w-8 text-gray-400" />}
              {activeTab === 'saved' && <Bookmark className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'posts' && 'No posts yet'}
              {activeTab === 'reels' && 'No reels yet'}
              {activeTab === 'tagged' && 'No tagged posts'}
              {activeTab === 'saved' && 'No saved posts'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'posts' && 'When you share photos and videos, they\'ll appear on your profile.'}
              {activeTab === 'reels' && 'When you create reels, they\'ll appear here.'}
              {activeTab === 'tagged' && 'Photos and videos you\'re tagged in will appear here.'}
              {activeTab === 'saved' && 'Save photos and videos that you want to see again.'}
            </p>
            {activeTab === 'posts' && (
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Share your first post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {currentTabData.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  onLike={() => handleLike(post._id)}
                  onSave={() => handleSave(post._id)}
                  onComment={() => handleComment(post._id)}
                  onShare={() => handleShare(post._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <CommentModal
        isOpen={!!selectedPostForComments}
        onClose={handleCloseComments}
        postId={selectedPostForComments || ''}
        commentCount={
          selectedPostForComments
            ? currentTabData.find((p) => p._id === selectedPostForComments)?.commentCount
            : undefined
        }
      />
    </div>
  )
} 