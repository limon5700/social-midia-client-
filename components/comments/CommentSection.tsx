'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Smile, 
  Paperclip, 
  Send, 
  MoreHorizontal,
  Reply,
  Trash2,
  Flag,
  User,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react'
import { formatNumber, formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
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
  likes: string[]
  isLiked: boolean
  likeCount: number
  replyCount: number
  createdAt: string
  replies?: Comment[]
  isEdited?: boolean
  parentComment?: string
}

interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
  fullScreen?: boolean
}

export default function CommentSection({ postId, initialComments = [], fullScreen = false }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)

  // Fetch comments from database
  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/comments`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setComments(data.data.comments)
      } else {
        setError(data.message || 'Failed to fetch comments')
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }

  // Load comments when component mounts
  useEffect(() => {
    fetchComments()
  }, [postId])

  // Auto-resize textarea
  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`
  }

  useEffect(() => {
    if (commentInputRef.current) {
      autoResize(commentInputRef.current)
    }
  }, [newComment])

  useEffect(() => {
    if (replyInputRef.current) {
      autoResize(replyInputRef.current)
    }
  }, [replyContent])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting || !isAuthenticated) return

    setSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add new comment to the beginning of the list
        setComments(prevComments => [data.data.comment, ...prevComments])
        setNewComment('')
        if (commentInputRef.current) {
          commentInputRef.current.style.height = 'auto'
        }
      } else {
        setError(data.message || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || submitting || !isAuthenticated) return

    setSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: replyContent.trim(),
          parentComment: commentId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add reply to the specific comment and show replies
        setComments(prevComments => prevComments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data.data.comment],
              replyCount: (comment.replyCount || 0) + 1
            }
          }
          return comment
        }))
        
        // Automatically show replies when a new reply is added
        setShowReplies(prev => ({
          ...prev,
          [commentId]: true
        }))
        
        setReplyContent('')
        setReplyingTo(null)
        if (replyInputRef.current) {
          replyInputRef.current.style.height = 'auto'
        }
      } else {
        setError(data.message || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      setError('Failed to add reply')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string, isReply = false, parentId?: string) => {
    if (!isAuthenticated) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        if (isReply && parentId) {
          setComments(prevComments => prevComments.map(comment => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: comment.replies?.map(reply => {
                  if (reply._id === commentId) {
                    return {
                      ...reply,
                      isLiked: data.data.isLiked,
                      likeCount: data.data.likeCount
                    }
                  }
                  return reply
                })
              }
            }
            return comment
          }))
        } else {
          setComments(prevComments => prevComments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                isLiked: data.data.isLiked,
                likeCount: data.data.likeCount
              }
            }
            return comment
          }))
        }
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  const emojis = ['😊', '❤️', '🔥', '👏', '🎉', '👍', '😍', '😂', '🤔', '😮', '😢', '😡']

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? 'flex-1' : 'bg-white border-t border-gray-100 p-8'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-500">Loading comments...</span>
      </div>
    )
  }

  return (
    <div className={`bg-white ${fullScreen ? 'flex flex-col h-full min-h-0' : 'border-t border-gray-100'}`}>
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className={fullScreen ? 'flex-1 min-h-0 overflow-y-auto' : 'max-h-96 overflow-y-auto'}>
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {comments.map((comment) => {
              const replyCount = comment.replies ? comment.replies.length : 0
              const hasReplies = replyCount > 0
              
              return (
                <div key={comment._id} className="p-4">
                  {/* Main Comment */}
                  <div className="flex space-x-3">
                    <Link href={`/profile/${comment.author._id}`} className="flex-shrink-0">
                      {comment.author.avatar ? (
                        <img
                          src={comment.author.avatar}
                          alt={`${comment.author.firstName} ${comment.author.lastName}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {comment.author.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link href={`/profile/${comment.author._id}`} className="font-medium text-gray-900 text-sm hover:underline">
                            {comment.author.firstName} {comment.author.lastName}
                          </Link>
                          {comment.author.isVerified && (
                            <div className="h-3 w-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="h-1.5 w-1.5 text-white" />
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(new Date(comment.createdAt))}
                          </span>
                          {comment.isEdited && (
                            <span className="text-xs text-gray-400">(edited)</span>
                          )}
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-2 ml-2">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          disabled={!isAuthenticated}
                          className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                            comment.isLiked 
                              ? 'text-red-500' 
                              : 'text-gray-500 hover:text-gray-700'
                          } disabled:opacity-50`}
                        >
                          <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                          <span>{formatNumber(comment.likeCount)}</span>
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                          disabled={!isAuthenticated}
                          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Reply className="h-3 w-3" />
                          <span>Reply</span>
                        </button>
                        {hasReplies && (
                          <button
                            onClick={() => toggleReplies(comment._id)}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          >
                            {showReplies[comment._id] ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                            <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment._id && (
                        <div className="mt-3 ml-4 border-l-2 border-blue-200 pl-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <ArrowRight className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-medium">
                              Replying to {comment.author.firstName} {comment.author.lastName}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link href="/profile" className="flex-shrink-0">
                              {user?.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-xs">
                                    {user?.firstName?.charAt(0) || 'U'}
                                  </span>
                                </div>
                              )}
                            </Link>
                            <div className="flex-1">
                              <div className="relative">
                                <textarea
                                  ref={replyInputRef}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  onKeyPress={(e) => handleKeyPress(e, () => handleSubmitReply(comment._id))}
                                  placeholder={`Reply to ${comment.author.firstName}...`}
                                  disabled={submitting}
                                  className="w-full px-3 py-2 pr-16 border border-blue-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm disabled:opacity-50 bg-blue-50"
                                  rows={1}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                  <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    disabled={submitting}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                                  >
                                    <Smile className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleSubmitReply(comment._id)}
                                    disabled={!replyContent.trim() || submitting}
                                    className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {submitting ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                                    ) : (
                                      <Send className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {hasReplies && showReplies[comment._id] && (
                        <div className="mt-3 space-y-3">
                          <div className="border-l-2 border-gray-200 pl-4">
                            {comment.replies?.map((reply) => (
                              <div key={reply._id} className="flex space-x-3 mb-3 last:mb-0">
                                <div className="flex items-center space-x-2">
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                  <Link href={`/profile/${reply.author._id}`} className="flex-shrink-0">
                                    {reply.author.avatar ? (
                                      <img
                                        src={reply.author.avatar}
                                        alt={`${reply.author.firstName} ${reply.author.lastName}`}
                                        className="h-6 w-6 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-xs">
                                          {reply.author.firstName?.charAt(0) || 'U'}
                                        </span>
                                      </div>
                                    )}
                                  </Link>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-blue-50 rounded-2xl px-3 py-2 border border-blue-100">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Link href={`/profile/${reply.author._id}`} className="font-medium text-gray-900 text-xs hover:underline">
                                        {reply.author.firstName} {reply.author.lastName}
                                      </Link>
                                      {reply.author.isVerified && (
                                        <div className="h-2.5 w-2.5 bg-blue-500 rounded-full flex items-center justify-center">
                                          <User className="h-1 w-1 text-white" />
                                        </div>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {formatTimeAgo(new Date(reply.createdAt))}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-xs leading-relaxed">
                                      {reply.content}
                                    </p>
                                  </div>
                                  
                                  {/* Reply Actions */}
                                  <div className="flex items-center space-x-3 mt-1 ml-2">
                                    <button
                                      onClick={() => handleLikeComment(reply._id, true, comment._id)}
                                      disabled={!isAuthenticated}
                                      className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                                        reply.isLiked 
                                          ? 'text-red-500' 
                                          : 'text-gray-500 hover:text-gray-700'
                                      } disabled:opacity-50`}
                                    >
                                      <Heart className={`h-2.5 w-2.5 ${reply.isLiked ? 'fill-current' : ''}`} />
                                      <span>{formatNumber(reply.likeCount)}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
                                      <Reply className="h-2.5 w-2.5" />
                                      <span>Reply</span>
                                    </button>
                                    <button className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
                                      <MoreHorizontal className="h-2.5 w-2.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Comment Input - fixed at bottom in fullscreen */}
      <div
        className={
          fullScreen
            ? 'shrink-0 border-t border-gray-100 bg-white p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
            : 'p-4 border-t border-gray-100'
        }
      >
        <div className="flex space-x-3">
          <Link href="/profile" className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </Link>
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSubmitComment)}
                placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
                disabled={!isAuthenticated || submitting}
                className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!isAuthenticated}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  disabled={!isAuthenticated}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting || !isAuthenticated}
                  className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && isAuthenticated && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-6 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewComment(prev => prev + emoji)
                        setShowEmojiPicker(false)
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-lg transition-colors duration-200"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 