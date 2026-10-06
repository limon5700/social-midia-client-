'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Reel } from '@/types'
import { formatNumber, formatTimeAgo } from '@/lib/utils'

interface ReelCardProps {
  reel: Reel
  isActive: boolean
}

export default function ReelCard({ reel, isActive }: ReelCardProps) {
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
    <div className="reel-card">
      {/* Video */}
      <div className="relative w-full h-full">
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

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black bg-opacity-30">
          <div className="h-full bg-white transition-all duration-300 ease-linear" />
        </div>

        {/* User Info */}
        <div className="absolute bottom-20 left-4 right-20">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={reel.user.avatar}
              alt={reel.user.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-white"
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
          <p className="text-white text-sm mb-3 line-clamp-2">{reel.caption}</p>

          {/* Music */}
          {reel.music && (
            <div className="flex items-center space-x-2 text-white text-sm">
              <Music className="h-4 w-4" />
              <span className="truncate">{reel.music}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4">
          <button
            onClick={handleLike}
            className="flex flex-col items-center space-y-1"
          >
            <div className={`p-3 rounded-full transition-colors duration-200 ${
              isLiked ? 'bg-red-500' : 'bg-black bg-opacity-50'
            }`}>
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(likes)}
            </span>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className="p-3 bg-black bg-opacity-50 rounded-full">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(reel.comments)}
            </span>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className="p-3 bg-black bg-opacity-50 rounded-full">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(reel.shares)}
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="p-3 bg-black bg-opacity-50 rounded-full"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Hashtags */}
        {reel.hashtags && reel.hashtags.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {reel.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}

        {/* Time */}
        <div className="absolute top-4 right-4">
          <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            {formatTimeAgo(reel.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
} 