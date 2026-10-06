'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, MapPin, Calendar, Globe, Building, GraduationCap, Briefcase, Phone, Linkedin, Twitter, Github, Instagram } from 'lucide-react'

interface UserProfile {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  bio: string
  dateOfBirth: string
  location: string
  website: string
  isVerified: boolean
  isPrivate: boolean
  followers: string[]
  following: string[]
  posts: string[]
  savedPosts: string[]
  interests: string[]
  lastActive: string
  emailVerified: boolean
  // Professional fields
  profession: string
  company: string
  jobTitle: string
  education: string
  skills: string[]
  experience: string
  phone: string
  socialLinks: {
    linkedin: string
    twitter: string
    github: string
    instagram: string
  }
  createdAt: string
}

interface UserPost {
  id: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  createdAt: string
  author: {
    id: string
    name: string
    avatar: string
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends'>('posts')
  const [followStatus, setFollowStatus] = useState({
    isFollowing: false,
    isFollowedBy: false,
    isMutualFollow: false
  })
  const [followLoading, setFollowLoading] = useState(false)

  const userId = params.userId as string

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  useEffect(() => {
    if (profileUser && currentUser) {
      const isOwnProfile = currentUser.id === profileUser._id
      if (!isOwnProfile) {
        fetchFollowStatus()
      }
    }
  }, [profileUser, currentUser, userId])

  const fetchFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFollowStatus(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching follow status:', error)
    }
  }

  const handleFollow = async () => {
    if (followLoading) return
    
    setFollowLoading(true)
    try {
      const response = await fetch('/api/friends/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFollowStatus(prev => ({
          ...prev,
          isFollowing: data.isFollowing,
          isMutualFollow: data.isFriend
        }))
        // Refresh user profile to update follower count
        fetchUserProfile()
      } else {
        console.error('Follow failed:', data.message)
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}`, {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('User not found')
      }

      const data = await response.json()
      setProfileUser(data.user)
      setUserPosts(data.posts || [])
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The user you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profileUser._id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profileUser.avatar || '/images/default-avatar.svg'}
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {profileUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileUser.firstName} {profileUser.lastName}
                </h1>
                {profileUser.isVerified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-1">@{profileUser.username}</p>
              
              {profileUser.bio && (
                <p className="text-gray-700 mb-4">{profileUser.bio}</p>
              )}

              {/* Stats */}
              <div className="flex space-x-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">{profileUser.followers?.length || 0}</span> followers
                </div>
                <div>
                  <span className="font-semibold">{profileUser.following?.length || 0}</span> following
                </div>
                <div>
                  <span className="font-semibold">{userPosts.length}</span> posts
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                {!isOwnProfile && (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        followStatus.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span>Loading...</span>
                        </div>
                      ) : followStatus.isMutualFollow ? (
                        <div className="flex items-center space-x-2">
                          <span>Friends</span>
                          <span className="text-xs">✓</span>
                        </div>
                      ) : followStatus.isFollowing ? (
                        <span>Following</span>
                      ) : (
                        <span>Follow</span>
                      )}
                    </button>
                    {followStatus.isMutualFollow && (
                      <span className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                        Mutual Follow
                      </span>
                    )}
                    <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Message
                    </button>
                  </>
                )}
                {isOwnProfile && (
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'friends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Friends
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div>
                {userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile ? "Share your first post!" : "This user hasn't posted anything yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userPosts.map((post) => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{post.author.name}</p>
                            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post image"
                            className="w-full rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>📤 {post.shares}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    {profileUser.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{profileUser.email}</span>
                      </div>
                    )}
                    {profileUser.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{profileUser.location}</span>
                      </div>
                    )}
                    {profileUser.dateOfBirth && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {formatDate(profileUser.dateOfBirth)} ({calculateAge(profileUser.dateOfBirth)} years old)
                        </span>
                      </div>
                    )}
                    {profileUser.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <a
                          href={profileUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profileUser.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                {(profileUser.profession || profileUser.company || profileUser.jobTitle || profileUser.education) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      {profileUser.profession && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{profileUser.profession}</span>
                        </div>
                      )}
                      {profileUser.company && (
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{profileUser.company}</span>
                        </div>
                      )}
                      {profileUser.jobTitle && (
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{profileUser.jobTitle}</span>
                        </div>
                      )}
                      {profileUser.education && (
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{profileUser.education}</span>
                        </div>
                      )}
                      {profileUser.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{profileUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {profileUser.skills && profileUser.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {profileUser.interests && profileUser.interests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {profileUser.socialLinks && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                    <div className="flex space-x-4">
                      {profileUser.socialLinks.linkedin && (
                        <a
                          href={profileUser.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Linkedin className="w-6 h-6" />
                        </a>
                      )}
                      {profileUser.socialLinks.twitter && (
                        <a
                          href={profileUser.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <Twitter className="w-6 h-6" />
                        </a>
                      )}
                      {profileUser.socialLinks.github && (
                        <a
                          href={profileUser.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-gray-600"
                        >
                          <Github className="w-6 h-6" />
                        </a>
                      )}
                      {profileUser.socialLinks.instagram && (
                        <a
                          href={profileUser.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Friends feature coming soon</h3>
                <p className="text-gray-600">
                  This feature is under development and will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 