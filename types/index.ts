export interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  followers: number
  following: number
  isVerified?: boolean
  verified?: boolean
  isOnline?: boolean
  // Professional fields
  profession?: string
  company?: string
  jobTitle?: string
  education?: string
  skills?: string[]
  experience?: string
  location?: string
  interests?: string[]
  email?: string
  lastActive?: Date
}

/** UI/mock timeline post in `data/mockData`; not the same shape as API `Post`. */
export interface MockFeedPost {
  id: string
  user: User
  content: string
  images?: string[]
  video?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isSaved: boolean
  createdAt: Date
  location?: string
  hashtags: string[]
}

export interface Post {
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
  privacy: 'public' | 'friends' | 'friends_of_friends' | 'private'
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

export interface Comment {
  id: string
  user: User
  content: string
  likes: number
  isLiked: boolean
  createdAt: Date
  replies?: Comment[]
}

export interface Reel {
  id: string
  user: User
  video: string
  caption: string
  likes: number
  comments: number
  shares: number
  views: number
  isLiked: boolean
  isSaved?: boolean
  isFollowing?: boolean
  hashtags?: string[]
  createdAt: Date
  duration: number
  music: string
}

export interface Story {
  id: string
  user: User
  media: string
  type: 'image' | 'video'
  isViewed: boolean
  createdAt: Date
  duration?: number
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message'
  user: User
  content: string
  postId?: string
  isRead: boolean
  createdAt: Date
}

export interface Message {
  id: string
  sender: User
  content: string
  type: 'text' | 'image' | 'video'
  media?: string
  isRead: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  updatedAt: Date
}

export interface Hashtag {
  id: string
  name: string
  posts: number
  isTrending: boolean
}

export interface Advertisement {
  id: string
  title: string
  description: string
  image: string
  link: string
  sponsor: string
}

export interface FriendSuggestion {
  user: User
  mutualFriends: number
  reason: string
}

export type NavigationItem = {
  id: string
  label: string
  icon: string
  href: string
  badge: number
}

export type Theme = 'light' | 'dark'

export type ViewMode = 'feed' | 'reels' | 'messages' | 'profile'

// Additional types for API responses
export interface FollowStats {
  isMutual: boolean
  isFollowing: boolean
  isFollowedBy: boolean
  followerCount: number
  followingCount: number
  mutualFollowers: string[]
}

export interface NotificationData {
  type: 'comment' | 'message' | 'like' | 'system' | 'follow' | 'mention' | 'reply' | 'share' | 'post_approved' | 'post_rejected' | 'account_verified' | 'security_alert'
  title: string
  message: string
  metadata?: any
} 