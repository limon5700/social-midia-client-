'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Globe,
  Users,
  UserPlus,
  Trash2,
  Eye,
  Flag,
  Loader2,
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import PrivacyIcon from '../common/PrivacyIcon'
import {
  STORY_REACTIONS,
  type StoryReactionType,
  type StoryReactionCounts,
} from '@/lib/storyReactions'

export interface StoryItem {
  _id: string
  media: string
  mediaType: 'image' | 'video'
  privacy?: 'public' | 'friends' | 'friends_of_friends'
  createdAt: string
  isViewed: boolean
  reactionCounts?: StoryReactionCounts
  myReaction?: StoryReactionType | null
}

export interface StoryGroup {
  user: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatar: string
  }
  stories: StoryItem[]
  hasUnviewed: boolean
  isOwn?: boolean
}

type StoryPrivacy = 'public' | 'friends' | 'friends_of_friends'

interface StoryViewerProps {
  storyGroups: StoryGroup[]
  initialGroupIndex?: number
  initialStoryIndex?: number
  onClose?: () => void
  onStoryViewed?: (storyId: string) => void
  onStoriesChange?: () => void
}

interface StoryViewerUser {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatar: string
}

const privacyOptions: {
  value: StoryPrivacy
  label: string
  icon: typeof Globe
}[] = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'friends', label: 'Friends', icon: Users },
  { value: 'friends_of_friends', label: 'Friends of friends', icon: UserPlus },
]

export default function StoryViewer({
  storyGroups,
  initialGroupIndex = 0,
  initialStoryIndex = 0,
  onClose,
  onStoryViewed,
  onStoriesChange,
}: StoryViewerProps) {
  const [groups, setGroups] = useState(storyGroups)
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex)
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [activePanel, setActivePanel] = useState<'privacy' | 'viewers' | 'report' | null>(null)
  const [viewers, setViewers] = useState<StoryViewerUser[]>([])
  const [loadingViewers, setLoadingViewers] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null)
  const [reacting, setReacting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const viewedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    setGroups(storyGroups)
  }, [storyGroups])

  const currentGroup = groups[groupIndex]
  const currentStory = currentGroup?.stories[storyIndex]
  const currentUser = currentGroup?.user
  const isOwnStory = Boolean(currentGroup?.isOwn)
  const panelOpen = showMenu || activePanel !== null

  const markViewed = useCallback(
    async (storyId: string) => {
      if (viewedRef.current.has(storyId)) return
      viewedRef.current.add(storyId)
      onStoryViewed?.(storyId)

      try {
        await fetch(`/api/stories/${storyId}/view`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        // non-blocking
      }
    },
    [onStoryViewed],
  )

  const goNext = useCallback(() => {
    if (!currentGroup) return

    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex((prev) => prev + 1)
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((prev) => prev + 1)
      setStoryIndex(0)
    } else {
      onClose?.()
    }
  }, [currentGroup, storyIndex, groupIndex, groups.length, onClose])

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1)
    } else if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1]
      setGroupIndex((prev) => prev - 1)
      setStoryIndex(prevGroup.stories.length - 1)
    }
  }, [storyIndex, groupIndex, groups])

  const closePanels = () => {
    setShowMenu(false)
    setActivePanel(null)
    setActionError('')
    setReportReason('')
    setIsPlaying(true)
  }

  const updateStoryPrivacy = (storyId: string, privacy: StoryPrivacy) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        stories: group.stories.map((s) =>
          s._id === storyId ? { ...s, privacy } : s,
        ),
      })),
    )
  }

  const updateStoryReaction = (
    storyId: string,
    reactionCounts: StoryReactionCounts,
    myReaction: StoryReactionType | null,
  ) => {
    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        stories: group.stories.map((s) =>
          s._id === storyId
            ? { ...s, reactionCounts, myReaction }
            : s,
        ),
      })),
    )
  }

  const handleReact = async (type: StoryReactionType, emoji: string) => {
    if (!currentStory || isOwnStory || reacting) return

    setReacting(true)
    setFloatingEmoji(emoji)
    setTimeout(() => setFloatingEmoji(null), 900)

    try {
      const response = await fetch(`/api/stories/${currentStory._id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type }),
      })
      const data = await response.json()

      if (data.success) {
        updateStoryReaction(
          currentStory._id,
          data.data.reactionCounts,
          data.data.myReaction,
        )
      }
    } catch {
      // silent
    } finally {
      setReacting(false)
    }
  }

  const removeStory = (storyId: string) => {
    const nextGroups: StoryGroup[] = []

    for (const group of groups) {
      const remaining = group.stories.filter((s) => s._id !== storyId)
      if (remaining.length > 0) {
        nextGroups.push({
          ...group,
          stories: remaining,
          hasUnviewed: remaining.some((s) => !s.isViewed),
        })
      }
    }

    if (nextGroups.length === 0) {
      onStoriesChange?.()
      onClose?.()
      return
    }

    let nextGroupIndex = groupIndex
    let nextStoryIndex = storyIndex

    if (!nextGroups[groupIndex]) {
      nextGroupIndex = Math.max(0, groupIndex - 1)
      nextStoryIndex = 0
    } else if (storyIndex >= nextGroups[groupIndex].stories.length) {
      nextStoryIndex = Math.max(0, nextGroups[groupIndex].stories.length - 1)
    }

    setGroups(nextGroups)
    setGroupIndex(nextGroupIndex)
    setStoryIndex(nextStoryIndex)
    closePanels()
    onStoriesChange?.()
  }

  const handleDeleteStory = async () => {
    if (!currentStory) return
    setActionLoading(true)
    setActionError('')

    try {
      const response = await fetch(`/api/stories/${currentStory._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        removeStory(currentStory._id)
      } else {
        setActionError(data.message || 'Failed to delete story')
      }
    } catch {
      setActionError('Failed to delete story')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePrivacyChange = async (privacy: StoryPrivacy) => {
    if (!currentStory) return
    setActionLoading(true)
    setActionError('')

    try {
      const response = await fetch(`/api/stories/${currentStory._id}/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ privacy }),
      })
      const data = await response.json()

      if (data.success) {
        updateStoryPrivacy(currentStory._id, privacy)
        closePanels()
        onStoriesChange?.()
      } else {
        setActionError(data.message || 'Failed to update privacy')
      }
    } catch {
      setActionError('Failed to update privacy')
    } finally {
      setActionLoading(false)
    }
  }

  const loadViewers = async () => {
    if (!currentStory) return
    setLoadingViewers(true)
    setActionError('')

    try {
      const response = await fetch(`/api/stories/${currentStory._id}/viewers`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setViewers(data.data.viewers || [])
      } else {
        setActionError(data.message || 'Failed to load viewers')
      }
    } catch {
      setActionError('Failed to load viewers')
    } finally {
      setLoadingViewers(false)
    }
  }

  const handleOpenViewers = () => {
    setShowMenu(false)
    setActivePanel('viewers')
    setIsPlaying(false)
    loadViewers()
  }

  const handleReport = async () => {
    if (!currentStory) return
    setActionLoading(true)
    setActionError('')

    try {
      const response = await fetch(`/api/stories/${currentStory._id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: reportReason }),
      })
      const data = await response.json()

      if (data.success) {
        closePanels()
        onClose?.()
      } else {
        setActionError(data.message || 'Failed to report story')
      }
    } catch {
      setActionError('Failed to report story')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (currentStory) {
      markViewed(currentStory._id)
    }
  }, [currentStory, markViewed])

  useEffect(() => {
    if (!isPlaying || !currentStory || panelOpen) return

    const duration = currentStory.mediaType === 'video' ? 8000 : 5000

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goNext()
          return 0
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [groupIndex, storyIndex, isPlaying, currentStory, goNext, panelOpen])

  useEffect(() => {
    if (currentStory?.mediaType === 'video' && videoRef.current) {
      if (isPlaying && !panelOpen) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [currentStory, isPlaying, panelOpen])

  useEffect(() => {
    setProgress(0)
    closePanels()
  }, [groupIndex, storyIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (panelOpen) return
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (panelOpen) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (panelOpen) return
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > 50) goNext()
    else if (distance < -50) goPrev()
    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelOpen) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 3) goPrev()
    else goNext()
  }

  if (!currentStory || !currentUser) return null

  const userName = `${currentUser.firstName} ${currentUser.lastName}`

  return (
    <div
      className="fixed inset-0 bg-black z-[115] flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-0 left-0 right-0 z-10 p-4 safe-top">
        <div className="flex items-center gap-1 mb-4">
          {currentGroup.stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    index < storyIndex
                      ? '100%'
                      : index === storyIndex
                        ? `${progress}%`
                        : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-16 left-0 right-0 z-10 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar || '/images/default-avatar.svg'}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover border-2 border-white shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-white font-medium truncate">{userName}</h3>
              <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                <PrivacyIcon
                  privacy={currentStory.privacy || 'public'}
                  className="text-white/70"
                  size="md"
                />
                <span>{formatTimeAgo(new Date(currentStory.createdAt))}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {currentStory.mediaType === 'video' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="p-2 text-white hover:bg-white/20 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMuted((m) => !m)
                    if (videoRef.current) videoRef.current.muted = isMuted
                  }}
                  className="p-2 text-white hover:bg-white/20 rounded-full"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMenu((prev) => !prev)
                  setActivePanel(null)
                  setIsPlaying(false)
                }}
                className="p-2 text-white hover:bg-white/20 rounded-full"
                aria-label="Story options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-gray-900/95 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                  {isOwnStory ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false)
                          setActivePanel('privacy')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 text-left"
                      >
                        <Globe className="h-4 w-4" />
                        Edit privacy
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenViewers}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 text-left"
                      >
                        <Eye className="h-4 w-4" />
                        Viewers
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteStory}
                        disabled={actionLoading}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/10 text-left disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete story
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false)
                        setActivePanel('report')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 text-left"
                    >
                      <Flag className="h-4 w-4" />
                      Report
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleTap}
      >
        {currentStory.mediaType === 'image' ? (
          <img src={currentStory.media} alt="Story" className="w-full h-full object-contain" />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.media}
            className="w-full h-full object-contain"
            muted={isMuted}
            playsInline
            onEnded={goNext}
          />
        )}
      </div>

      {!isOwnStory && !panelOpen && (
        <div
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {STORY_REACTIONS.map((reaction) => {
            const isActive = currentStory.myReaction === reaction.type
            const count = currentStory.reactionCounts?.[reaction.type] ?? 0

            return (
              <button
                key={reaction.type}
                type="button"
                onClick={() => handleReact(reaction.type, reaction.emoji)}
                disabled={reacting}
                title={reaction.label}
                className={`relative flex flex-col items-center justify-center w-11 h-11 rounded-full backdrop-blur-sm transition-all ${
                  isActive
                    ? 'bg-white/30 scale-110 ring-2 ring-white/60'
                    : 'bg-black/40 hover:bg-black/55 hover:scale-105'
                }`}
                aria-label={reaction.label}
              >
                <span className="text-xl leading-none">{reaction.emoji}</span>
                {count > 0 && (
                  <span className="absolute -bottom-1 min-w-[16px] px-1 h-4 rounded-full bg-blue-600 text-[10px] text-white font-semibold flex items-center justify-center">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {floatingEmoji && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 z-30 pointer-events-none animate-bounce text-5xl">
          {floatingEmoji}
        </div>
      )}

      {actionError && !activePanel && (
        <div className="absolute top-24 left-4 right-4 z-30 p-3 bg-red-500/90 text-white text-sm rounded-lg text-center">
          {actionError}
        </div>
      )}

      {panelOpen && activePanel && (
        <div
          className="absolute inset-0 z-20 bg-black/60"
          onClick={closePanels}
        />
      )}

      {activePanel === 'privacy' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl p-4 safe-bottom max-h-[70vh] overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">Edit privacy</h3>
          {actionError && (
            <p className="text-red-400 text-sm mb-3">{actionError}</p>
          )}
          <div className="space-y-2">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePrivacyChange(option.value)}
                disabled={actionLoading}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  currentStory.privacy === option.value
                    ? 'bg-blue-600/30 border border-blue-500/50 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <option.icon className="h-5 w-5" />
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'viewers' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl p-4 safe-bottom max-h-[70vh] overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">
            Viewers {viewers.length > 0 && `(${viewers.length})`}
          </h3>
          {actionError && (
            <p className="text-red-400 text-sm mb-3">{actionError}</p>
          )}
          {loadingViewers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          ) : viewers.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No viewers yet</p>
          ) : (
            <div className="space-y-2">
              {viewers.map((viewer) => (
                <div
                  key={viewer._id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg"
                >
                  <img
                    src={viewer.avatar || '/images/default-avatar.svg'}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {viewer.firstName} {viewer.lastName}
                    </p>
                    <p className="text-gray-400 text-xs">@{viewer.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activePanel === 'report' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl p-4 safe-bottom">
          <h3 className="text-white font-semibold mb-3">Report story</h3>
          {actionError && (
            <p className="text-red-400 text-sm mb-3">{actionError}</p>
          )}
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Why are you reporting this story? (optional)"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 text-sm resize-none h-24 mb-3"
            maxLength={500}
          />
          <button
            type="button"
            onClick={handleReport}
            disabled={actionLoading}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Flag className="h-4 w-4" />
                Submit report
              </>
            )}
          </button>
        </div>
      )}

      {!panelOpen && (groupIndex > 0 || storyIndex > 0) ? (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full hidden sm:block z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : null}

      {!panelOpen && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full hidden sm:block z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
