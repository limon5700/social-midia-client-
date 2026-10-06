'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Image, Video, Send, X, MapPin, Hash, AtSign, Globe, Users, UserPlus, Upload, Trash2, Loader2 } from 'lucide-react'
import PostCard from './PostCard'
import StoryThumbnails from '../stories/StoryThumbnails'
import ClientOnly from '@/lib/utils/clientOnly'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import CommentModal from '../comments/CommentModal'
import CreatePostPeopleAndStyle, { type PostTaggedUser } from './CreatePostPeopleAndStyle'
import type { PostBackgroundStyle } from '@/lib/postBackgroundTemplates'

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
  taggedUsers?: Array<{
    _id: string
    firstName: string
    lastName: string
    username: string
    avatar: string
  }>
  backgroundStyle?: {
    id: string
    type?: 'color' | 'gradient' | 'wallpaper'
    gradient: string
    imageUrl?: string
    textColor: string
  }
  location?: {
    name: string
    coordinates: [number, number]
  }
  privacy: 'public' | 'friends' | 'friends_of_friends'
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

interface MediaFile {
  file: File
  type: 'image' | 'video'
  url: string
  thumbnail?: string
}

export default function FeedSection() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null)
  
  // Media upload states
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'friends_of_friends'>('public')
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false)
  const [location, setLocation] = useState('')
  const [locationCoords, setLocationCoords] = useState<[number, number] | null>(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [mentions, setMentions] = useState<string[]>([])
  const [taggedUsers, setTaggedUsers] = useState<PostTaggedUser[]>([])
  const [backgroundStyle, setBackgroundStyle] = useState<PostBackgroundStyle | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const headerActionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCreatingPost) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('create-post-open')

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('create-post-open')
    }
  }, [isCreatingPost])

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts?limit=20', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setPosts(data.data.posts)
        setError('')
      } else {
        setError(data.message || 'Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle file uploads
  const handleFileUpload = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return

    const newFiles: MediaFile[] = []
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (type === 'image' && !file.type.startsWith('image/')) {
        setError('Please select valid image files')
        return
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        setError('Please select valid video files')
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      const url = URL.createObjectURL(file)
      const mediaFile: MediaFile = {
        file,
        type,
        url
      }

      // Generate thumbnail for videos
      if (type === 'video') {
        const video = document.createElement('video')
        video.src = url
        video.currentTime = 1
        video.addEventListener('loadeddata', () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(video, 0, 0)
          const thumbnailUrl = canvas.toDataURL('image/jpeg')
          mediaFile.thumbnail = thumbnailUrl
        })
      }

      newFiles.push(mediaFile)
    })

    setMediaFiles(prev => [...prev, ...newFiles])
    if (newFiles.length > 0) {
      setBackgroundStyle(null)
    }
    setError('')
  }

  // Remove media file
  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].url)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleSelectLiveLocation = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported on this device')
      return
    }

    setIsFetchingLocation(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocationCoords([longitude, latitude])

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const data = await response.json()

          const placeName =
            data.locality ||
            data.city ||
            data.principalSubdivision ||
            data.countryName ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

          setLocation(placeName)
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        } finally {
          setIsFetchingLocation(false)
        }
      },
      (geoError) => {
        setIsFetchingLocation(false)
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. Please allow location access.')
        } else {
          setError('Could not get your location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  // Extract hashtags and mentions from content
  const extractHashtagsAndMentions = (content: string) => {
    const hashtagRegex = /#(\w+)/g
    const mentionRegex = /@(\w+)/g
    
    const hashtags = content.match(hashtagRegex)?.map(tag => tag.slice(1)) || []
    const mentions = content.match(mentionRegex)?.map(mention => mention.slice(1)) || []
    
    return { hashtags, mentions }
  }

  // Handle create post
  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      setError('Please login to create posts')
      return
    }
    
    if (!newPostContent.trim() && mediaFiles.length === 0) {
      setError('Please add some content or media to your post')
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    setError('')
    
    try {
      console.log('Creating post with content:', newPostContent.trim())
      console.log('Media files:', mediaFiles.length)
      console.log('Privacy:', privacy)
      
      // Extract hashtags and mentions
      const { hashtags: extractedHashtags, mentions: extractedMentions } = extractHashtagsAndMentions(newPostContent)
      
      // Prepare post data
      const postData: Record<string, unknown> = {
        content: newPostContent.trim(),
        privacy,
        hashtags: Array.from(new Set([...hashtags, ...extractedHashtags])),
        mentions: Array.from(new Set([...mentions, ...extractedMentions])),
        taggedUsers: taggedUsers.map((u) => u.id),
      }

      if (mediaFiles.length === 0 && backgroundStyle) {
        postData.backgroundStyle = backgroundStyle
      }

      // Add location if provided
      if (location.trim()) {
        postData.location = {
          name: location.trim(),
          coordinates: locationCoords ?? [0, 0],
        }
      }

      console.log('Post data to send:', postData)

      // Handle media uploads
      if (mediaFiles.length > 0) {
        console.log('Creating post with media...')
        const formData = new FormData()
        formData.append('content', newPostContent.trim())
        formData.append('privacy', privacy)
        formData.append('hashtags', JSON.stringify(postData.hashtags))
        formData.append('mentions', JSON.stringify(postData.mentions))
        formData.append('taggedUsers', JSON.stringify(postData.taggedUsers))
        if (location.trim()) {
          formData.append('location', JSON.stringify(postData.location))
        }

        mediaFiles.forEach((mediaFile, index) => {
          formData.append(`media`, mediaFile.file)
          formData.append(`mediaTypes`, mediaFile.type)
        })

        // Upload with media
        const response = await fetch('/api/posts/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        console.log('Upload response status:', response.status)
        const data = await response.json()
        console.log('Upload response data:', data)

        if (data.success) {
          setPosts(prevPosts => [data.data.post, ...prevPosts])
          resetCreatePostForm()
          console.log('Post with media created successfully!')
        } else {
          setError(data.message || 'Failed to create post')
          console.error('Post creation failed:', data.message)
        }
      } else {
        // Text-only post
        console.log('Creating text-only post...')
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(postData)
        })

        console.log('Text post response status:', response.status)
        const data = await response.json()
        console.log('Text post response data:', data)

        if (data.success) {
          setPosts(prevPosts => [data.data.post, ...prevPosts])
          resetCreatePostForm()
          console.log('Post created successfully!')
        } else {
          setError(data.message || 'Failed to create post')
          console.error('Post creation failed:', data.message)
        }
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post - Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset create post form
  const resetCreatePostForm = () => {
    setNewPostContent('')
    setMediaFiles([])
    setPrivacy('public')
    setLocation('')
    setLocationCoords(null)
    setIsFetchingLocation(false)
    setHashtags([])
    setMentions([])
    setTaggedUsers([])
    setBackgroundStyle(null)
    setIsCreatingPost(false)
    setError('')
  }

  // Privacy options
  const privacyOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this post' },
    { value: 'friends', label: 'Friends', icon: Users, description: 'Only your friends can see this post' },
    {
      value: 'friends_of_friends',
      label: 'Friends of friends',
      icon: UserPlus,
      description: 'Your friends and their friends can see this post',
    },
  ]

  const selectedPrivacy = privacyOptions.find(option => option.value === privacy)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchPosts()
    } else if (!authLoading) {
      setLoading(false)
      setError('Please login to view posts')
    }
  }, [isAuthenticated, authLoading, fetchPosts])

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        // Update post in the list
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, isLiked: data.data.isLiked, likeCount: data.data.likeCount }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleSavePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        // Update post in the list
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, isSaved: data.data.isSaved, saveCount: data.data.saveCount }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleComment = async (postId: string) => {
    setSelectedPostForComments(postId)
  }

  const handleCloseComments = () => {
    setSelectedPostForComments(null)
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

  return (
    <div className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
      <ClientOnly>
        <StoryThumbnails />
      </ClientOnly>

      <div className="space-y-2 sm:space-y-3">
        {/* Create Post Section */}
        <div className="feed-card">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Create Post</h2>
          <div className="flex items-start space-x-3">
            <Link href="/profile" className="flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </Link>
            <div className="flex-1">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsCreatingPost(true)
                  } else {
                    setError('Please login to create posts')
                  }
                }}
                className="w-full min-w-0 text-left p-2.5 sm:p-3 text-sm sm:text-base bg-gray-50 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors duration-200 truncate"
              >
                {isAuthenticated 
                  ? `What's on your mind, ${user ? `${user.firstName} ${user.lastName}` : 'User'}?`
                  : 'Please login to create posts'
                }
              </button>
            </div>
          </div>

          {/* Create Post Modal */}
          {isCreatingPost && (
            <div className="fixed inset-0 z-[110] bg-white sm:bg-black/50 sm:flex sm:items-center sm:justify-center sm:p-4">
              <div className="h-[100dvh] sm:h-auto sm:max-h-[90vh] w-full sm:max-w-2xl bg-white sm:rounded-xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-200 shrink-0 safe-top">
                  <h3 className="text-lg font-semibold">Create Post</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingPost(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 -mr-2"
                    aria-label="Close create post"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {error && (
                    <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="p-4 sm:p-6 space-y-4">
                  {/* User Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Link href="/profile" className="flex-shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                      </Link>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'User'}</div>
                        <div className="relative">
                          <button
                            onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            {selectedPrivacy && <selectedPrivacy.icon className="h-4 w-4" />}
                            <span>{selectedPrivacy?.label}</span>
                          </button>
                          
                          {showPrivacyMenu && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                              {privacyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setPrivacy(option.value as 'public' | 'friends' | 'friends_of_friends')
                                    setShowPrivacyMenu(false)
                                  }}
                                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                                >
                                  <option.icon className="h-4 w-4 text-gray-600" />
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div ref={headerActionsRef} className="flex items-center gap-1.5 shrink-0 pt-0.5" />
                  </div>

                  {/* Content, mentions, tags & background */}
                  <CreatePostPeopleAndStyle
                    content={newPostContent}
                    onContentChange={setNewPostContent}
                    textareaRef={contentTextareaRef}
                    taggedUsers={taggedUsers}
                    onTaggedUsersChange={setTaggedUsers}
                    hasMedia={mediaFiles.length > 0}
                    backgroundStyle={backgroundStyle}
                    onBackgroundChange={setBackgroundStyle}
                    headerActionsRef={headerActionsRef}
                  />

                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Media ({mediaFiles.length})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {mediaFiles.map((mediaFile, index) => (
                          <div key={index} className="relative group">
                            {mediaFile.type === 'image' ? (
                              <img
                                src={mediaFile.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <video
                                src={mediaFile.url}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                            )}
                            <button
                              onClick={() => removeMediaFile(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location Input */}
                  {location && (
                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg bg-blue-50/50">
                      <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add location"
                        className="flex-1 border-none outline-none bg-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLocation('')
                          setLocationCoords(null)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                        aria-label="Remove location"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  </div>
                </div>

                {/* Action Buttons — fixed at bottom on mobile */}
                <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white shrink-0 safe-bottom">
                  <div className="flex space-x-1 sm:space-x-2">
                      {/* Image Upload */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files, 'image')}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Add photos"
                      >
                        <Image className="h-5 w-5" />
                      </button>

                      {/* Video Upload */}
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files, 'video')}
                        className="hidden"
                      />
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Add video"
                      >
                        <Video className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleSelectLiveLocation}
                        disabled={isFetchingLocation}
                        className={`p-2 rounded-lg transition-colors ${
                          location
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            : 'text-gray-500 hover:bg-gray-100'
                        } disabled:opacity-50`}
                        title="Add live location"
                      >
                        {isFetchingLocation ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <MapPin className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleCreatePost}
                      disabled={(!newPostContent.trim() && mediaFiles.length === 0) || isSubmitting}
                      className="px-6 py-2 bg-social-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-2 sm:space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="feed-card animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {posts.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  onLike={() => handleLikePost(post._id)}
                  onSave={() => handleSavePost(post._id)}
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
            ? posts.find((p) => p._id === selectedPostForComments)?.commentCount
            : undefined
        }
      />
    </div>
  )
} 