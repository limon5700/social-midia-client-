'use client'

import { useState, useEffect, useCallback } from 'react'
import StoryViewer, { type StoryGroup } from './StoryViewer'
import CreateStoryModal from './CreateStoryModal'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function StoryThumbnails() {
  const { user, isAuthenticated } = useAuth()
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([])
  const [ownGroup, setOwnGroup] = useState<StoryGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [showViewer, setShowViewer] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewerGroupIndex, setViewerGroupIndex] = useState(0)
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const allViewerGroups = ownGroup ? [ownGroup, ...storyGroups] : storyGroups

  const fetchStories = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/stories', { credentials: 'include' })
      const data = await response.json()

      if (data.success) {
        setStoryGroups(data.data.groups || [])
        setOwnGroup(data.data.ownGroup || null)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && isAuthenticated) {
      fetchStories()
    } else if (isClient) {
      setLoading(false)
    }
  }, [isClient, isAuthenticated, fetchStories])

  const openViewer = (groupIndex: number, storyIndex = 0) => {
    setViewerGroupIndex(groupIndex)
    setViewerStoryIndex(storyIndex)
    setShowViewer(true)
  }

  const handleCloseViewer = () => {
    setShowViewer(false)
    fetchStories()
  }

  const handleStoryViewed = (storyId: string) => {
    const markInGroup = (group: StoryGroup | null): StoryGroup | null => {
      if (!group) return null
      const stories = group.stories.map((s) =>
        s._id === storyId ? { ...s, isViewed: true } : s,
      )
      return {
        ...group,
        stories,
        hasUnviewed: stories.some((s) => !s.isViewed),
      }
    }

    setOwnGroup((prev) => markInGroup(prev))
    setStoryGroups((prev) =>
      prev.map((g) => markInGroup(g) as StoryGroup),
    )
  }

  const renderStoryRing = (
    group: StoryGroup,
    groupIndex: number,
    label?: string,
  ) => {
    const displayName = label || `${group.user.firstName} ${group.user.lastName}`
    const previewImage =
      group.stories[group.stories.length - 1]?.mediaType === 'image'
        ? group.stories[group.stories.length - 1].media
        : group.user.avatar

    return (
      <div key={group.user._id} className="flex-shrink-0">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full p-0.5 ${
                group.hasUnviewed
                  ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}
            >
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => openViewer(groupIndex)}
                  className="block w-full h-full rounded-full overflow-hidden"
                >
                  <img
                    src={previewImage || group.user.avatar || '/images/default-avatar.svg'}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>
          <Link
            href={`/profile/${group.user._id}`}
            className="text-xs text-gray-600 font-medium truncate max-w-16 hover:text-gray-900 hover:underline"
          >
            {displayName}
          </Link>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="bg-white border-b border-gray-200 py-2 sm:py-3 w-full max-w-full overflow-hidden">
        <div className="w-full max-w-full px-3 sm:px-4">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 py-2 sm:py-3 w-full max-w-full overflow-hidden">
        <div className="w-full max-w-full px-3 sm:px-4">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
            {/* Add Story */}
            {isAuthenticated && (
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Add Story</span>
                </button>
              </div>
            )}

            {/* Your Story */}
            {ownGroup && renderStoryRing(ownGroup, 0, 'Your story')}

            {/* Friends' Stories */}
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                ))
              : storyGroups.map((group, index) =>
                  renderStoryRing(group, ownGroup ? index + 1 : index),
                )}
          </div>
        </div>
      </div>

      {showViewer && allViewerGroups.length > 0 && (
        <StoryViewer
          storyGroups={allViewerGroups}
          initialGroupIndex={viewerGroupIndex}
          initialStoryIndex={viewerStoryIndex}
          onClose={handleCloseViewer}
          onStoryViewed={handleStoryViewed}
          onStoriesChange={fetchStories}
        />
      )}

      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchStories}
      />
    </>
  )
}
