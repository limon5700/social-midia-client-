'use client'

import { useState, Fragment } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  Play
} from 'lucide-react'
import { Post } from '@/types'
import { formatNumber, formatTimeAgo } from '@/lib/utils'
import { getBackgroundPreviewStyle, resolveBackgroundStyle } from '@/lib/postBackgroundTemplates'
import Link from 'next/link'
import CommentModal from '../comments/CommentModal'
import PrivacyIcon from '../common/PrivacyIcon'

interface PostCardProps {
  post: Post
  onLike?: () => void
  onSave?: () => void
  onComment?: () => void
  onShare?: () => void
}

function renderContentWithLinks(content: string) {
  const parts = content.split(/(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+)/g)

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const username = part.slice(1)
      return (
        <Link
          key={`${part}-${index}`}
          href={`/search?q=${encodeURIComponent(username)}`}
          className="text-blue-600 font-medium hover:underline"
        >
          {part}
        </Link>
      )
    }
    if (part.startsWith('#')) {
      return (
        <Link
          key={`${part}-${index}`}
          href={`/search?q=${encodeURIComponent(part)}`}
          className="text-blue-500 hover:underline"
        >
          {part}
        </Link>
      )
    }
    return <Fragment key={`${part}-${index}`}>{part}</Fragment>
  })
}

export default function PostCard({ post, onLike, onSave, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showAllImages, setShowAllImages] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    if (onLike) {
      onLike()
    } else {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      setIsSaved(!isSaved)
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment()
    } else {
      setShowComments(true)
    }
  }

  const hasMedia = Boolean(post.media && post.media.length > 0)
  const resolvedBackground = !hasMedia && post.backgroundStyle?.id
    ? resolveBackgroundStyle(post.backgroundStyle.id, post.backgroundStyle)
    : null
  const useStyledContent = Boolean(resolvedBackground)
  const previewStyle = getBackgroundPreviewStyle(resolvedBackground)

  const renderTaggedUsers = () => {
    if (!post.taggedUsers?.length) return null

    return (
      <span className="text-sm text-gray-500 font-normal truncate">
        {' '}
        with{' '}
        {post.taggedUsers.map((user, index) => (
          <Fragment key={user._id}>
            {index > 0 && (index === post.taggedUsers!.length - 1 ? ' and ' : ', ')}
            <Link
              href={`/profile/${user._id}`}
              className="font-medium text-gray-700 hover:underline"
            >
              {user.firstName} {user.lastName}
            </Link>
          </Fragment>
        ))}
      </span>
    )
  }

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) {
      return null
    }

    const images = post.media.filter(item => item.type === 'image')
    const videos = post.media.filter(item => item.type === 'video')

    if (videos.length > 0) {
      return (
        <div className="relative">
          <video
            src={videos[0].url}
            controls
            preload="metadata"
            className="w-full rounded-lg max-h-72 sm:max-h-96 object-cover"
            poster={videos[0].thumbnail || "https://via.placeholder.com/600x400?text=Video"}
            onError={(e) => {
              console.error('Video failed to load:', videos[0].url)
              e.currentTarget.style.display = 'none'
              // Show error message
              const errorDiv = document.createElement('div')
              errorDiv.className = 'w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500'
              errorDiv.textContent = 'Video could not be loaded'
              e.currentTarget.parentNode?.appendChild(errorDiv)
            }}
          >
            <source src={videos[0].url} type="video/mp4" />
            <source src={videos[0].url} type="video/webm" />
            <source src={videos[0].url} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          {videos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              +{videos.length - 1} more videos
            </div>
          )}
        </div>
      )
    }

    if (images.length > 0) {
      const displayImages = showAllImages ? images : images.slice(0, 4)
      
      return (
        <div className="relative">
          <div className={`grid gap-1 rounded-lg overflow-hidden ${
            images.length === 1 ? 'grid-cols-1' :
            images.length === 2 ? 'grid-cols-2' :
            images.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {displayImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`Post content ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', image.url)
                    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
                  }}
                />
                {index === 3 && images.length > 4 && !showAllImages && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {images.length > 4 && !showAllImages && (
            <button
              onClick={() => setShowAllImages(true)}
              className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm"
            >
              View all {images.length} photos
            </button>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link href={`/profile/${post.author._id}`} className="flex-shrink-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {post.author.firstName?.charAt(0) || post.author.lastName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Link href={`/profile/${post.author._id}`} className="font-semibold hover:underline truncate text-sm sm:text-base">
                {post.author.firstName} {post.author.lastName}
              </Link>
              {renderTaggedUsers()}
              {post.author.isVerified && (
                <span className="text-blue-500 shrink-0">✓</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs sm:text-sm text-gray-500">
              {post.privacy && (
                <PrivacyIcon privacy={post.privacy} className="text-gray-400" />
              )}
              <span className="shrink-0">{formatTimeAgo(new Date(post.createdAt))}</span>
              {post.location && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1 min-w-0 max-w-full">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{post.location.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button type="button" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full shrink-0">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {useStyledContent ? (
          <div
            className="rounded-xl min-h-[140px] flex items-center justify-center p-6 sm:p-8"
            style={previewStyle}
          >
            <p
              className={`whitespace-pre-wrap text-center text-xl sm:text-2xl font-semibold w-full ${
                resolvedBackground?.textColor?.startsWith('text-')
                  ? resolvedBackground.textColor
                  : 'text-white'
              }`}
            >
              {renderContentWithLinks(post.content)}
            </p>
          </div>
        ) : (
          <p className="text-gray-900 whitespace-pre-wrap">
            {renderContentWithLinks(post.content)}
          </p>
        )}
        
        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && !useStyledContent && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.hashtags.map((hashtag, index) => (
              <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                #{hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Media */}
      {renderMedia()}

      {/* Post Stats */}
      <div className="py-2 sm:py-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span>{formatNumber(post.likeCount)} likes</span>
          <span>{formatNumber(post.commentCount)} comments</span>
          <span>{formatNumber(post.shareCount)} shares</span>
          <span>{formatNumber(post.views)} views</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="grid grid-cols-4 gap-0.5 sm:gap-1 py-1 sm:py-2">
        <button
          type="button"
          onClick={handleLike}
          className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-3 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Heart className={`h-5 w-5 shrink-0 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-[10px] sm:text-sm font-medium">Like</span>
        </button>

        <button
          type="button"
          onClick={handleComment}
          className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span className="text-[10px] sm:text-sm font-medium">Comment</span>
        </button>

        <button
          type="button"
          onClick={onShare}
          className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Share2 className="h-5 w-5 shrink-0" />
          <span className="text-[10px] sm:text-sm font-medium">Share</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-3 py-2 rounded-lg transition-colors ${
            isSaved ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Bookmark className={`h-5 w-5 shrink-0 ${isSaved ? 'fill-current' : ''}`} />
          <span className="text-[10px] sm:text-sm font-medium">Save</span>
        </button>
      </div>

      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post._id}
        commentCount={post.commentCount}
      />
    </div>
  )
} 