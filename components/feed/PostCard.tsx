'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Play,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { Post } from '@/types'
import { formatNumber, formatTimeAgo } from '@/lib/utils'
import { getBackgroundPreviewStyle, resolveBackgroundStyle } from '@/lib/postBackgroundTemplates'
import Link from 'next/link'
import CommentModal from '../comments/CommentModal'
import PrivacyIcon from '../common/PrivacyIcon'
import { useAuth } from '@/contexts/AuthContext'

interface PostCardProps {
  post: Post
  onLike?: () => void
  onSave?: () => void
  onComment?: () => void
  onShare?: () => void
  onUpdated?: (post: Post) => void
  onDeleted?: (postId: string) => void
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

export default function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onUpdated,
  onDeleted,
}: PostCardProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showAllImages, setShowAllImages] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editContent, setEditContent] = useState(post.content || '')
  const [editPrivacy, setEditPrivacy] = useState(post.privacy || 'public')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwnPost = Boolean(
    user?.id &&
      post.author?._id &&
      String(user.id) === String(post.author._id),
  )

  useEffect(() => {
    setIsLiked(post.isLiked)
    setIsSaved(post.isSaved)
    setLikeCount(post.likeCount)
    setEditContent(post.content || '')
    setEditPrivacy(post.privacy || 'public')
  }, [post.isLiked, post.isSaved, post.likeCount, post.content, post.privacy])

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

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

  const openEdit = () => {
    setEditContent(post.content || '')
    setEditPrivacy(post.privacy || 'public')
    setActionError('')
    setMenuOpen(false)
    setShowEditModal(true)
  }

  const openDelete = () => {
    setActionError('')
    setMenuOpen(false)
    setShowDeleteConfirm(true)
  }

  const handleSaveEdit = async () => {
    if (actionLoading) return
    setActionLoading(true)
    setActionError('')

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
          privacy: editPrivacy,
        }),
      })
      const data = await response.json()

      if (data.success) {
        onUpdated?.(data.data.post)
        setShowEditModal(false)
      } else {
        setActionError(data.message || 'Failed to update post')
      }
    } catch (err) {
      console.error('Edit post error:', err)
      setActionError('Failed to update post')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (actionLoading) return
    setActionLoading(true)
    setActionError('')

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setShowDeleteConfirm(false)
        onDeleted?.(post._id)
      } else {
        setActionError(data.message || 'Failed to delete post')
      }
    } catch (err) {
      console.error('Delete post error:', err)
      setActionError('Failed to delete post')
    } finally {
      setActionLoading(false)
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
        {post.taggedUsers.map((tagged, index) => (
          <Fragment key={tagged._id}>
            {index > 0 && (index === post.taggedUsers!.length - 1 ? ' and ' : ', ')}
            <Link
              href={`/profile/${tagged._id}`}
              className="font-medium text-gray-700 hover:underline"
            >
              {tagged.firstName} {tagged.lastName}
            </Link>
          </Fragment>
        ))}
      </span>
    )
  }

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null

    const images = post.media.filter((m) => m.type === 'image' || m.type === 'gif')
    const videos = post.media.filter((m) => m.type === 'video')

    return (
      <div className="mb-3 space-y-2">
        {videos.map((video, index) => (
          <div key={`video-${index}`} className="relative rounded-lg overflow-hidden bg-black">
            <video
              src={video.url}
              poster={video.thumbnail}
              controls
              playsInline
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          </div>
        ))}

        {images.length === 1 && (
          <img
            src={images[0].url}
            alt="Post media"
            className="w-full rounded-lg object-cover max-h-[70vh]"
          />
        )}

        {images.length > 1 && (
          <div className={`grid gap-1 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {(showAllImages ? images : images.slice(0, 4)).map((image, index) => (
              <div key={`img-${index}`} className="relative aspect-square overflow-hidden rounded-lg">
                <img src={image.url} alt="" className="w-full h-full object-cover" />
                {!showAllImages && index === 3 && images.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllImages(true)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold"
                  >
                    +{images.length - 4}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="feed-card">
      {/* Post Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
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
              {post.isEdited && <span className="text-gray-400">· Edited</span>}
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

        {isOwnPost && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
              aria-label="Post options"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  type="button"
                  onClick={openEdit}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={openDelete}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
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
          post.content && (
            <p className="text-gray-900 whitespace-pre-wrap">
              {renderContentWithLinks(post.content)}
            </p>
          )
        )}

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

      {renderMedia()}

      <div className="py-2 sm:py-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span>{formatNumber(post.likeCount)} likes</span>
          <span>{formatNumber(post.commentCount)} comments</span>
          <span>{formatNumber(post.shareCount)} shares</span>
          <span>{formatNumber(post.views)} views</span>
        </div>
      </div>

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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Edit Post</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {actionError && (
                <div className="p-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {actionError}
                </div>
              )}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="What's on your mind?"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex items-center justify-between gap-3">
                <select
                  value={editPrivacy}
                  onChange={(e) =>
                    setEditPrivacy(
                      e.target.value as 'public' | 'friends' | 'friends_of_friends' | 'private',
                    )
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="friends_of_friends">Friends of friends</option>
                  <option value="private">Only me</option>
                </select>
                <span className="text-xs text-gray-400">{editContent.length}/1000</span>
              </div>
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-5">
            <h3 className="font-semibold text-lg mb-2">Delete post?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This post will be removed from your profile and feed. This cannot be undone.
            </p>
            {actionError && (
              <div className="mb-3 p-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {actionError}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
