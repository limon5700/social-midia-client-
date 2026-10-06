'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, Share2, Music, Play, Pause, Volume2, VolumeX, MoreHorizontal } from 'lucide-react'
import { reels } from '@/data/mockData'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

export default function ReelsPage() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1)
    }
  }

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1)
    }
  }

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe) {
      handleNextReel()
    } else if (isDownSwipe) {
      handlePrevReel()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === ' ') {
      e.preventDefault()
      handlePrevReel()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleNextReel()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentReelIndex])

  return (
    <div className="min-h-screen bg-black">
      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="relative h-screen pt-16 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Current Reel */}
        <div className="h-full flex items-center justify-center">
          <VerticalReelCard 
            reel={reels[currentReelIndex]} 
            isActive={true}
          />
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentReelIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white bg-opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  )
}

interface VerticalReelCardProps {
  reel: any
  isActive: boolean
}

function VerticalReelCard({ reel, isActive }: VerticalReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.isLiked)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState(reel.likes)
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive, isPlaying])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  return (
    <div className="relative w-full h-full max-w-sm mx-auto">
      {/* Video */}
      <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          onClick={handleVideoClick}
          onLoadedMetadata={() => {
            if (isActive) {
              setIsPlaying(true)
            }
          }}
        >
          <source src={reel.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            {/* Music Info */}
            <div className="flex items-center space-x-2 bg-black bg-opacity-30 rounded-full px-3 py-1">
              <Music className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium truncate">
                {reel.music || 'Original Sound'}
              </span>
            </div>

            {/* More Options */}
            <button className="p-2 bg-black bg-opacity-30 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            {/* Left Side - User Info & Caption */}
            <div className="flex-1 pr-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={reel.user.avatar}
                  alt={reel.user.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-white">{reel.user.name}</h3>
                    {reel.user.isVerified && (
                      <span className="text-blue-400">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-200">@{reel.user.username}</p>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isFollowing
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Caption */}
              <p className="text-white text-sm mb-3 line-clamp-3">{reel.caption}</p>

              {/* Hashtags */}
              {reel.hashtags && reel.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reel.hashtags.map((hashtag: string, index: number) => (
                    <span
                      key={index}
                      className="text-white text-sm font-medium bg-black bg-opacity-30 px-2 py-1 rounded"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-center space-y-6">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex flex-col items-center space-y-1"
              >
                <div className={`p-3 rounded-full transition-colors duration-200 ${
                  isLiked ? 'bg-red-500' : 'bg-black bg-opacity-30'
                }`}>
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(likes)}
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex flex-col items-center space-y-1">
                <div className="p-3 bg-black bg-opacity-30 rounded-full">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(reel.comments)}
                </span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center space-y-1">
                <div className="p-3 bg-black bg-opacity-30 rounded-full">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(reel.shares)}
                </span>
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="p-3 bg-black bg-opacity-30 rounded-full"
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

        {/* Time Stamp */}
        <div className="absolute top-4 right-4">
          <span className="text-white text-sm bg-black bg-opacity-30 px-2 py-1 rounded">
            {formatTimeAgo(reel.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
} 