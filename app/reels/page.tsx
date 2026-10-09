'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Video } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Post } from '@/types'
import ReelCard from '@/components/reels/ReelCard'
import CommentModal from '@/components/comments/CommentModal'

export default function ReelsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [reels, setReels] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const fetchReels = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/posts?limit=30&mediaType=video', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        const videoPosts = (data.data.posts as Post[]).filter((post) =>
          post.media?.some((m) => m.type === 'video' && m.url),
        )
        setReels(videoPosts)
        setActiveIndex(0)
      } else {
        setError(data.message || 'Failed to load reels')
      }
    } catch (err) {
      console.error('Error fetching reels:', err)
      setError('Failed to load reels')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (isAuthenticated) {
      fetchReels()
    } else {
      setLoading(false)
      setError('Please login to view reels')
    }
  }, [isAuthenticated, authLoading, fetchReels])

  // Track which reel is in view for autoplay
  useEffect(() => {
    const root = containerRef.current
    if (!root || reels.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (!Number.isNaN(index)) {
            setActiveIndex(index)
          }
        })
      },
      { root, threshold: [0.6] },
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [reels])

  // Keyboard: up/down scroll between reels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPostId) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()

      const nextIndex =
        e.key === 'ArrowDown'
          ? Math.min(activeIndex + 1, reels.length - 1)
          : Math.max(activeIndex - 1, 0)

      itemRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, reels.length, selectedPostId])

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setReels((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLiked: data.data.isLiked,
                  likeCount: data.data.likeCount,
                }
              : post,
          ),
        )
      }
    } catch (err) {
      console.error('Error liking reel:', err)
    }
  }

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/?post=${post._id}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Reel',
          text: post.content || 'Check out this reel',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch (err) {
      // User cancelled share — ignore
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  }

  const selectedPost = selectedPostId
    ? reels.find((p) => p._id === selectedPostId)
    : null

  if (authLoading || loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (error && reels.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <Video className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-lg font-medium mb-2">{error}</p>
        {isAuthenticated && (
          <button
            type="button"
            onClick={fetchReels}
            className="mt-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  if (reels.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <Video className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-lg font-medium mb-1">No reels yet</p>
        <p className="text-sm text-gray-400">
          Video posts from your feed will show up here. Create a post with a video to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full bg-black relative">
      <div ref={containerRef} className="reel-container">
        {reels.map((post, index) => (
          <div
            key={post._id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            data-index={index}
            className="reel-item"
          >
            <ReelCard
              post={post}
              isActive={index === activeIndex && !selectedPostId}
              onLike={() => handleLike(post._id)}
              onComment={() => setSelectedPostId(post._id)}
              onShare={() => handleShare(post)}
            />
          </div>
        ))}
      </div>

      {reels.length <= 12 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex space-x-1 z-30 pointer-events-none">
          {reels.map((post, index) => (
            <div
              key={post._id}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      <CommentModal
        isOpen={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId || ''}
        commentCount={selectedPost?.commentCount}
        onCommentAdded={() => {
          if (!selectedPostId) return
          setReels((prev) =>
            prev.map((post) =>
              post._id === selectedPostId
                ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                : post,
            ),
          )
        }}
      />
    </div>
  )
}
