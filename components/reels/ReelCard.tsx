'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Share2,
  Music,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Post } from '@/types'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface ReelCardProps {
  post: Post
  isActive: boolean
  onLike: () => void
  onComment: () => void
  onShare?: () => void
}

function getVideoUrl(post: Post): string | undefined {
  return post.media?.find((m) => m.type === 'video')?.url
}

export default function ReelCard({
  post,
  isActive,
  onLike,
  onComment,
  onShare,
}: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [liking, setLiking] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrl = getVideoUrl(post)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      }
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [isActive, videoUrl])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (liking) return
    setLiking(true)
    try {
      await onLike()
    } finally {
      setLiking(false)
    }
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    onComment()
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare?.()
  }

  const displayName = `${post.author.firstName} ${post.author.lastName}`.trim()

  return (
    <div className="relative w-full h-full bg-black">
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          preload={isActive ? 'auto' : 'metadata'}
          src={videoUrl}
          onClick={togglePlay}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-white text-sm">No video available</p>
        </div>
      )}

      {!isPlaying && videoUrl && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10"
          aria-label="Play"
        >
          <div className="bg-black/50 rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </button>
      )}

      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1 max-w-[70%]">
            <Music className="h-4 w-4 text-white shrink-0" />
            <span className="text-white text-sm font-medium truncate">
              Original Sound
            </span>
          </div>
          <span className="text-white text-xs bg-black/30 px-2 py-1 rounded">
            {formatTimeAgo(new Date(post.createdAt))}
          </span>
        </div>

        <div className="flex justify-between items-end gap-3">
          <div className="flex-1 min-w-0 pr-2 pointer-events-auto">
            <div className="flex items-center space-x-3 mb-3">
              <Link href={`/user/${post.author.username}`}>
                <img
                  src={post.author.avatar || '/images/default-avatar.svg'}
                  alt={displayName}
                  className="h-11 w-11 rounded-full object-cover border-2 border-white"
                />
              </Link>
              <div className="min-w-0">
                <Link href={`/user/${post.author.username}`} className="flex items-center space-x-1">
                  <h3 className="font-semibold text-white truncate">{displayName}</h3>
                  {post.author.isVerified && (
                    <span className="text-blue-400 shrink-0">✓</span>
                  )}
                </Link>
                <p className="text-sm text-gray-200 truncate">@{post.author.username}</p>
              </div>
            </div>

            {post.content && (
              <p className="text-white text-sm mb-2 line-clamp-3">{post.content}</p>
            )}

            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.hashtags.slice(0, 4).map((hashtag) => (
                  <Link
                    key={hashtag}
                    href={`/hashtag/${hashtag}`}
                    className="text-white text-sm font-medium"
                  >
                    #{hashtag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center space-y-5 pointer-events-auto shrink-0">
            <button
              type="button"
              onClick={handleLike}
              disabled={liking}
              className="flex flex-col items-center space-y-1 disabled:opacity-60"
              aria-label={post.isLiked ? 'Unlike' : 'Like'}
            >
              <div
                className={`p-3 rounded-full transition-colors ${
                  post.isLiked ? 'bg-red-500' : 'bg-black/30'
                }`}
              >
                <Heart
                  className={`h-6 w-6 ${
                    post.isLiked ? 'fill-white text-white' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.likeCount)}
              </span>
            </button>

            <button
              type="button"
              onClick={handleComment}
              className="flex flex-col items-center space-y-1"
              aria-label="Comments"
            >
              <div className="p-3 bg-black/30 rounded-full">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.commentCount)}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center space-y-1"
              aria-label="Share"
            >
              <div className="p-3 bg-black/30 rounded-full">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.shareCount || 0)}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-3 bg-black/30 rounded-full"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 text-white" />
              ) : (
                <Volume2 className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
